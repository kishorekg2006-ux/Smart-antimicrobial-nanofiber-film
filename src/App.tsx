/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlsBar } from './components/ControlsBar';
import { ImageGrid } from './components/ImageGrid';
import { MetricsCards } from './components/MetricsCards';
import { ThresholdStudio } from './components/ThresholdStudio';
import { HealingTimelineChart } from './components/HealingTimelineChart';
import { NanofiberAnalytics } from './components/NanofiberAnalytics';
import { RoiModal } from './components/RoiModal';
import { SampleCasesModal } from './components/SampleCasesModal';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { AIClinicalReportModal } from './components/AIClinicalReportModal';
import { ClinicalHelpModal } from './components/ClinicalHelpModal';

import { 
  WoundImageItem, 
  WoundAnalysisResult, 
  BaselineInfo, 
  WoundThresholds, 
  DEFAULT_THRESHOLDS, 
  ROI 
} from './types';
import { analyzeWoundImage } from './utils/woundAnalysis';
import { SAMPLE_WOUND_SERIES, SampleWoundPreset } from './data/sampleWounds';

export default function App() {
  // Image Collection State
  const [images, setImages] = useState<WoundImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [baseline, setBaseline] = useState<BaselineInfo | null>(null);
  
  // App Controls & Modals
  const [statusText, setStatusText] = useState<string>('Initializing wound analysis engine...');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showThresholds, setShowThresholds] = useState<boolean>(false);
  const [thresholds, setThresholds] = useState<WoundThresholds>(DEFAULT_THRESHOLDS);
  
  const [isRoiModalOpen, setIsRoiModalOpen] = useState<boolean>(false);
  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState<boolean>(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Initialize with Benchmark Longitudinal Series
  useEffect(() => {
    const initialItems: WoundImageItem[] = SAMPLE_WOUND_SERIES.slice(0, 3).map((preset, idx) => ({
      id: preset.id,
      name: `${preset.id}.jpg`,
      src: preset.generateImage(),
      dayLabel: preset.dayLabel,
      isBaseline: idx === 0,
    }));

    setImages(initialItems);
    setCurrentIndex(0);

    // Restore baseline from session storage if present
    try {
      const savedBaseline = sessionStorage.getItem('nanofiber_baseline');
      if (savedBaseline) {
        setBaseline(JSON.parse(savedBaseline));
      }
    } catch {
      // ignore
    }

    // Auto-analyze first image
    if (initialItems.length > 0) {
      setTimeout(() => {
        runAnalysisOnItem(initialItems[0], 0, initialItems, null, false);
      }, 100);
    }
  }, []);

  // Helper to run analysis
  const runAnalysisOnItem = async (
    item: WoundImageItem,
    idx: number,
    currentImagesList = images,
    roi: ROI | null = null,
    manual: boolean = false
  ) => {
    if (!item) return;
    setIsLoading(true);
    setStatusText('Analyzing color contrast and tissue distribution...');

    try {
      const result = await analyzeWoundImage(item.src, roi || item.roi, manual, thresholds);

      // Update item in list
      const updatedList = [...currentImagesList];
      updatedList[idx] = {
        ...updatedList[idx],
        result,
        roi: roi || item.roi,
      };
      setImages(updatedList);

      if (result.condition === 'No confident wound detected') {
        setStatusText('No confident wound detected. Use "Mark Wound" for difficult images.');
      } else {
        setStatusText(`Analysis complete: ${result.condition} (${result.wound_area}% area)`);
      }
    } catch (err: any) {
      console.error('Wound analysis error:', err);
      setStatusText(`Analysis failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currentItem = images[currentIndex] || null;
  const currentResult = currentItem?.result || null;

  // Navigation Handlers
  const handlePrev = useCallback(() => {
    if (images.length <= 1) {
      setStatusText('Previous needs at least two images.');
      return;
    }
    const newIdx = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIdx);
    setStatusText(`Image ${newIdx + 1} of ${images.length} selected.`);
    
    // If not analyzed, analyze now
    if (!images[newIdx]?.result) {
      runAnalysisOnItem(images[newIdx], newIdx, images);
    }
  }, [currentIndex, images]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) {
      setStatusText('Next needs at least two images.');
      return;
    }
    const newIdx = (currentIndex + 1) % images.length;
    setCurrentIndex(newIdx);
    setStatusText(`Image ${newIdx + 1} of ${images.length} selected.`);

    if (!images[newIdx]?.result) {
      runAnalysisOnItem(images[newIdx], newIdx, images);
    }
  }, [currentIndex, images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRoiModalOpen || isReportModalOpen || isCameraModalOpen || isPresetsModalOpen || isHelpModalOpen) return;
      if (e.key === 'ArrowLeft' && images.length > 1) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, images.length, isRoiModalOpen, isReportModalOpen, isCameraModalOpen, isPresetsModalOpen, isHelpModalOpen]);

  // Analyze Current Button
  const handleAnalyzeCurrent = () => {
    if (!currentItem) {
      setStatusText('Upload or select an image first.');
      return;
    }
    runAnalysisOnItem(currentItem, currentIndex, images, currentItem.roi, Boolean(currentItem.roi));
  };

  // Baseline Handlers
  const handleSetBaseline = async () => {
    if (!currentItem) {
      setStatusText('Upload an image first.');
      return;
    }

    let result = currentItem.result;
    if (!result) {
      await runAnalysisOnItem(currentItem, currentIndex, images);
      // Wait for state update
      result = images[currentIndex]?.result;
      if (!result) return;
    }

    const newBaseline: BaselineInfo = {
      name: currentItem.name,
      area: result.wound_area,
      imageId: currentItem.id,
      analyzedAt: new Date().toISOString(),
    };

    setBaseline(newBaseline);
    sessionStorage.setItem('nanofiber_baseline', JSON.stringify(newBaseline));

    // Mark current item
    const updated = images.map((img, i) => ({
      ...img,
      isBaseline: i === currentIndex,
    }));
    setImages(updated);

    setStatusText(`Baseline set successfully: ${newBaseline.name} (${newBaseline.area}% area)`);
  };

  const handleClearBaseline = () => {
    setBaseline(null);
    sessionStorage.removeItem('nanofiber_baseline');
    const updated = images.map((img) => ({ ...img, isBaseline: false }));
    setImages(updated);
    setStatusText('Baseline cleared.');
  };

  // Upload Handlers
  const handleUpload = async (files: File[]) => {
    if (!files.length) return;

    setStatusText(`Loading ${files.length} image(s)...`);
    const loadedItems: WoundImageItem[] = await Promise.all(
      files.map((file, i) => {
        return new Promise<WoundImageItem>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              id: `upload_${Date.now()}_${i}`,
              name: file.name,
              src: reader.result as string,
              dayLabel: file.name.replace(/\.[^/.]+$/, ''),
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setImages(loadedItems);
    setCurrentIndex(0);
    setBaseline(null);
    sessionStorage.removeItem('nanofiber_baseline');

    setStatusText(`${loadedItems.length} image(s) loaded. Analyzing Day 0 image...`);
    await runAnalysisOnItem(loadedItems[0], 0, loadedItems);
  };

  // Camera Capture
  const handleCameraCapture = async (dataUrl: string, fileName: string) => {
    const newItem: WoundImageItem = {
      id: `cam_${Date.now()}`,
      name: fileName,
      src: dataUrl,
      dayLabel: 'Camera Live Snap',
    };

    const updated = [...images, newItem];
    setImages(updated);
    const newIdx = updated.length - 1;
    setCurrentIndex(newIdx);

    setStatusText(`Camera photo captured: ${fileName}. Analyzing...`);
    await runAnalysisOnItem(newItem, newIdx, updated);
  };

  // Load Presets
  const handleLoadSeries = async (series: WoundImageItem[]) => {
    setImages(series);
    setCurrentIndex(0);
    setBaseline(null);
    sessionStorage.removeItem('nanofiber_baseline');

    setStatusText(`Longitudinal series loaded. Analyzing Day 0 baseline...`);
    await runAnalysisOnItem(series[0], 0, series);

    // Auto-set Day 0 as baseline for the benchmark dataset
    setTimeout(() => {
      const res = series[0]?.result;
      if (res) {
        const b: BaselineInfo = {
          name: series[0].name,
          area: res.wound_area,
          imageId: series[0].id,
        };
        setBaseline(b);
        sessionStorage.setItem('nanofiber_baseline', JSON.stringify(b));
      }
    }, 400);
  };

  const handleLoadSinglePreset = async (preset: SampleWoundPreset) => {
    const newItem: WoundImageItem = {
      id: preset.id,
      name: `${preset.id}.jpg`,
      src: preset.generateImage(),
      dayLabel: preset.dayLabel,
    };
    const updated = [newItem, ...images.filter(img => img.id !== preset.id)];
    setImages(updated);
    setCurrentIndex(0);
    setStatusText(`Loaded ${preset.name}. Analyzing...`);
    await runAnalysisOnItem(newItem, 0, updated);
  };

  // ROI confirmation
  const handleConfirmRoi = async (roi: ROI) => {
    if (!currentItem) return;
    setStatusText('Running restricted ROI wound segmentation...');
    await runAnalysisOnItem(currentItem, currentIndex, images, roi, true);
  };

  // Re-run with custom thresholds
  const handleReAnalyzeThresholds = () => {
    if (!currentItem) return;
    runAnalysisOnItem(currentItem, currentIndex, images, currentItem.roi, Boolean(currentItem.roi));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation Header */}
      <Header
        onOpenPresets={() => setIsPresetsModalOpen(true)}
        onToggleThresholds={() => setShowThresholds(!showThresholds)}
        showThresholds={showThresholds}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        activeImageCount={images.length}
      />

      {/* Main Analysis Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Controls and Navigation Bar */}
        <ControlsBar
          totalImages={images.length}
          currentIndex={currentIndex}
          currentName={currentItem?.name || ''}
          hasBaseline={Boolean(baseline)}
          baselineName={baseline?.name || null}
          statusText={statusText}
          isLoading={isLoading}
          onPrev={handlePrev}
          onNext={handleNext}
          onAnalyze={handleAnalyzeCurrent}
          onSetBaseline={handleSetBaseline}
          onClearBaseline={handleClearBaseline}
          onUpload={handleUpload}
          onOpenRoiModal={() => setIsRoiModalOpen(true)}
          onOpenCamera={() => setIsCameraModalOpen(true)}
        />

        {/* Expandable Threshold Studio */}
        {showThresholds && (
          <ThresholdStudio
            thresholds={thresholds}
            onChangeThresholds={setThresholds}
            onResetDefaults={() => setThresholds(DEFAULT_THRESHOLDS)}
            onReAnalyze={handleReAnalyzeThresholds}
          />
        )}

        {/* 3-Card Core Visual Grid */}
        <ImageGrid
          originalSrc={currentResult ? currentResult.original : (currentItem?.src || null)}
          segmentationSrc={currentResult?.segmentation || null}
          markedSrc={currentResult?.marked || null}
          result={currentResult}
          fileName={currentItem?.name}
        />

        {/* Quantitative Metrics, Classification & Baseline Engine */}
        <MetricsCards
          result={currentResult}
          baseline={baseline}
        />

        {/* Longitudinal Healing Progress Chart */}
        <HealingTimelineChart
          images={images}
          baseline={baseline}
        />

        {/* Smart Antimicrobial Nanofiber Film Bio-analytics */}
        <NanofiberAnalytics
          result={currentResult}
        />

        {/* Recommended Clinical Protocol Callout */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-600 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span>💡 Recommended Clinical Workflow:</span>
            </p>
            <p className="leading-relaxed">
              Select Initial Wounded (Day 0) image → Click <b>"Analyze Image"</b> → Click <b>"Set as Baseline"</b> → Click <b>"Next"</b> or upload follow-up wound photo → Quantitative healing progress velocity is computed automatically.
            </p>
          </div>
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-blue-700 hover:text-blue-800 border border-slate-200 font-semibold transition-all shrink-0 whitespace-nowrap active:scale-95 cursor-pointer shadow-xs"
          >
            View Algorithmic Guide
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600">SMART ANTIMICROBIAL NANOFIBER FILM • Clinical Wound Monitoring Platform</span>
          <span className="font-mono text-slate-400">Local Color Contrast &amp; CIELAB Engine v2.4</span>
        </div>
      </footer>

      {/* Modals */}
      <RoiModal
        isOpen={isRoiModalOpen}
        imageSrc={currentItem?.src || null}
        onClose={() => setIsRoiModalOpen(false)}
        onConfirmRoi={handleConfirmRoi}
      />

      <SampleCasesModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
        onLoadSeries={handleLoadSeries}
        onLoadSingle={handleLoadSinglePreset}
      />

      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />

      <AIClinicalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={currentResult}
        baseline={baseline}
        currentImageName={currentItem?.name || 'Sample Wound'}
        originalSrc={currentResult?.original || currentItem?.src || null}
        segmentationSrc={currentResult?.segmentation || null}
        markedSrc={currentResult?.marked || null}
      />

      <ClinicalHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

    </div>
  );
}
