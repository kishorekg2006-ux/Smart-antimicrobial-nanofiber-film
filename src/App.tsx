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
import { LoginPage } from './components/LoginPage';
import { DoctorDashboard } from './components/DoctorDashboard';
import { SubmitToDoctorModal } from './components/SubmitToDoctorModal';
import { PatientDoctorFeedbackModal } from './components/PatientDoctorFeedbackModal';
import { DoctorAuthModal } from './components/DoctorAuthModal';
import { ConfirmModal } from './components/ConfirmModal';

import { 
  WoundImageItem, 
  WoundAnalysisResult, 
  BaselineInfo, 
  WoundThresholds, 
  DEFAULT_THRESHOLDS, 
  ROI,
  PatientUser,
  DoctorUser,
  WoundUpdateSubmission
} from './types';
import { analyzeWoundImage } from './utils/woundAnalysis';
import { SAMPLE_WOUND_SERIES, SampleWoundPreset } from './data/sampleWounds';
import { telemedicineService } from './services/telemedicineService';

export default function App() {
  // Navigation View: 'login' | 'patient-portal' | 'doctor-dashboard'
  const [currentView, setCurrentView] = useState<'login' | 'patient-portal' | 'doctor-dashboard'>('login');
  
  // Telemedicine Active Accounts
  const [currentPatient, setCurrentPatient] = useState<PatientUser | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<DoctorUser | null>(null);
  const [patientSubmissions, setPatientSubmissions] = useState<WoundUpdateSubmission[]>([]);

  // Telemedicine Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState<boolean>(false);
  const [isDoctorAuthModalOpen, setIsDoctorAuthModalOpen] = useState<boolean>(false);

  // In-app confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

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

  // Initialize Telemedicine Service & Restore session
  useEffect(() => {
    const activePat = telemedicineService.getCurrentPatient();
    const activeDoc = telemedicineService.getCurrentDoctor();

    if (activeDoc) {
      setCurrentDoctor(activeDoc);
      // If doctor was active, leave at login or allow switching
    }

    if (activePat) {
      setCurrentPatient(activePat);
      setCurrentView('patient-portal');
      setPatientSubmissions(telemedicineService.getSubmissionsForPatient(activePat.id));
    } else {
      // Default to login page on start
      setCurrentView('login');
    }

    const handleTelemedUpdate = () => {
      if (activePat || telemedicineService.getCurrentPatient()) {
        const pat = telemedicineService.getCurrentPatient() || activePat;
        if (pat) {
          setPatientSubmissions(telemedicineService.getSubmissionsForPatient(pat.id));
        }
      }
    };

    window.addEventListener('skm_telemed_update', handleTelemedUpdate);
    return () => {
      window.removeEventListener('skm_telemed_update', handleTelemedUpdate);
    };
  }, []);

  // Initialize with Benchmark Longitudinal Series for the patient session
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
    providedImagesList?: WoundImageItem[],
    roi: ROI | null = null,
    manual: boolean = false
  ) => {
    if (!item) return;
    setIsLoading(true);
    setStatusText('Analyzing color contrast and tissue distribution...');

    try {
      const result = await analyzeWoundImage(item.src, roi || item.roi, manual, thresholds);

      // Update item in list using functional updater
      setImages(prev => {
        const listToUpdate = providedImagesList ? [...providedImagesList] : [...prev];
        if (listToUpdate[idx]) {
          listToUpdate[idx] = {
            ...listToUpdate[idx],
            result,
            roi: roi || item.roi,
          };
        }
        return listToUpdate;
      });

      if (result.wound_area === 0) {
        setStatusText(
          `Analysis complete: 0.00% wound surface area (0 px) • Normal Healthy Skin Confirmed`
        );
      } else {
        setStatusText(
          `Analysis complete: ${result.wound_area}% surface area (${result.wound_pixels.toLocaleString()} px) • Granulation: ${result.redness}%`
        );
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setStatusText(`Analysis failed: ${err?.message || 'Unknown computer vision error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const currentItem = images[currentIndex] || null;
  const currentResult = currentItem?.result || null;

  // Navigation handlers
  const handlePrev = () => {
    if (images.length === 0) return;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIdx);
    const prevItem = images[prevIdx];
    if (prevItem) {
      if (!prevItem.result) {
        runAnalysisOnItem(prevItem, prevIdx);
      } else {
        setStatusText(`Showing image ${prevIdx + 1} of ${images.length}: ${prevItem.dayLabel || prevItem.name}`);
      }
    }
  };

  const handleNext = () => {
    if (images.length === 0) return;

    if (images.length === 1) {
      // If there is only 1 image (e.g. baseline), load next follow-up from sample series to evaluate healing!
      const nextPreset = SAMPLE_WOUND_SERIES.find(p => p.id !== images[0].id) || SAMPLE_WOUND_SERIES[1];
      if (nextPreset) {
        const newItem: WoundImageItem = {
          id: `${nextPreset.id}-${Date.now()}`,
          name: `${nextPreset.id}.jpg`,
          src: nextPreset.generateImage(),
          dayLabel: nextPreset.dayLabel,
          isBaseline: false,
        };
        const updated = [...images, newItem];
        setImages(updated);
        setCurrentIndex(1);
        setStatusText(`Loaded follow-up photograph "${newItem.name}" (${nextPreset.dayLabel}). Evaluating healing vs baseline...`);
        runAnalysisOnItem(newItem, 1, updated);
      }
      return;
    }

    // Circular next traversal: smoothly cycles and NEVER gets stuck at the end!
    const nextIdx = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIdx);
    const nextItem = images[nextIdx];
    if (nextItem) {
      if (!nextItem.result) {
        runAnalysisOnItem(nextItem, nextIdx);
      } else {
        setStatusText(`Showing image ${nextIdx + 1} of ${images.length}: ${nextItem.dayLabel || nextItem.name}`);
      }
    }
  };

  // Analyze current manually
  const handleAnalyzeCurrent = () => {
    if (currentItem) {
      runAnalysisOnItem(currentItem, currentIndex, undefined, currentItem.roi, Boolean(currentItem.roi));
    }
  };

  // Baseline Controls
  const handleSetBaseline = () => {
    if (!currentResult || !currentItem) {
      setStatusText('Please analyze the image first before setting as baseline.');
      return;
    }

    const baselineData: BaselineInfo = {
      name: currentItem.name,
      area: currentResult.wound_area,
      imageId: currentItem.id,
      analyzedAt: new Date().toISOString(),
    };

    setBaseline(baselineData);
    sessionStorage.setItem('nanofiber_baseline', JSON.stringify(baselineData));

    // Mark current item
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isBaseline: i === currentIndex,
    })));

    setStatusText(`Locked "${currentItem.name}" (${currentResult.wound_area}%) as clinical baseline. Click "Next" to compare healing progress on follow-up photos.`);
  };

  const handleClearBaseline = () => {
    setBaseline(null);
    sessionStorage.removeItem('nanofiber_baseline');
    setImages(prev => prev.map((img) => ({
      ...img,
      isBaseline: false,
    })));
    setStatusText('Baseline cleared. Contraction computation reset.');
  };

  // Keyboard arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (currentView !== 'patient-portal') return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images, currentView]);

  // Image Upload handler
  const handleUpload = (files: File[]) => {
    if (files.length === 0) return;

    setStatusText(`Loading ${files.length} image(s)...`);
    const newItems: WoundImageItem[] = [];

    let processedCount = 0;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        newItems.push({
          id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          src,
          dayLabel: 'Uploaded Follow-up',
          isBaseline: false,
        });

        processedCount++;
        if (processedCount === files.length) {
          const combined = [...images, ...newItems];
          setImages(combined);
          const newIndex = images.length;
          setCurrentIndex(newIndex);
          setStatusText(`Uploaded ${files.length} image(s). Analyzing first new image...`);
          runAnalysisOnItem(newItems[0], newIndex, combined);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Camera Capture handler
  const handleCameraCapture = (dataUrl: string) => {
    const newItem: WoundImageItem = {
      id: `cam-${Date.now()}`,
      name: `Camera_Capture_${new Date().toLocaleTimeString().replace(/:/g, '-')}.jpg`,
      src: dataUrl,
      dayLabel: 'Live Camera Capture',
      isBaseline: false,
    };

    const combined = [...images, newItem];
    setImages(combined);
    const newIndex = combined.length - 1;
    setCurrentIndex(newIndex);
    setStatusText('Live photograph captured! Running segmentation analysis...');
    runAnalysisOnItem(newItem, newIndex, combined);
  };

  // Sample Cases handler
  const handleLoadSeries = () => {
    const seriesItems: WoundImageItem[] = SAMPLE_WOUND_SERIES.map((preset, idx) => ({
      id: preset.id,
      name: `${preset.id}.jpg`,
      src: preset.generateImage(),
      dayLabel: preset.dayLabel,
      isBaseline: idx === 0,
    }));

    setImages(seriesItems);
    setCurrentIndex(0);
    setStatusText('Loaded longitudinal clinical series. Analyzing Day 0 Baseline...');
    runAnalysisOnItem(seriesItems[0], 0, seriesItems);
  };

  const handleLoadSinglePreset = async (preset: SampleWoundPreset) => {
    const newItem: WoundImageItem = {
      id: `sample-${preset.id}-${Date.now()}`,
      name: `${preset.id}.jpg`,
      src: preset.generateImage(),
      dayLabel: preset.dayLabel,
      isBaseline: false,
    };

    const updated = [newItem, ...images];
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

  // Delete current image from queue
  const handleDeleteCurrentImage = () => {
    if (images.length === 0) return;
    const itemToDelete = images[currentIndex];
    if (!itemToDelete) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Remove Image from Active Series?',
      message: `Remove "${itemToDelete.name}" from your active wound monitoring series? Past physician consultations remain saved.`,
      confirmText: 'Remove Image',
      variant: 'danger',
      onConfirm: () => {
        const remaining = images.filter((_, idx) => idx !== currentIndex);
        setImages(remaining);
        const nextIdx = Math.max(0, Math.min(currentIndex, remaining.length - 1));
        setCurrentIndex(nextIdx);
        setStatusText(remaining.length > 0 ? `Removed "${itemToDelete.name}". Active queue: ${remaining.length} image(s).` : 'All images removed. Upload an image or select a sample case.');

        if (remaining.length > 0 && remaining[nextIdx]) {
          if (!remaining[nextIdx].result) {
            runAnalysisOnItem(remaining[nextIdx], nextIdx, remaining);
          }
        }
      },
    });
  };

  // Clear all images from queue
  const handleClearAllImages = () => {
    if (images.length === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Clear Active Queue?',
      message: `Remove all ${images.length} images from your active series? (Doctor reviews and clinical consultations remain safely stored in your history).`,
      confirmText: `Clear All (${images.length})`,
      variant: 'danger',
      onConfirm: () => {
        setImages([]);
        setCurrentIndex(0);
        setStatusText('Queue cleared. Upload a wound photograph or pick a sample clinical case.');
      },
    });
  };

  // Telemedicine Role Routing Handlers
  const handlePatientLogin = (patient: PatientUser) => {
    setCurrentPatient(patient);
    setPatientSubmissions(telemedicineService.getSubmissionsForPatient(patient.id));
    setCurrentView('patient-portal');
    setStatusText(`Logged in as ${patient.name}. Ready for wound monitoring.`);
  };

  const handleDoctorLogin = () => {
    const doc = telemedicineService.getCurrentDoctor();
    setCurrentDoctor(doc);
    setCurrentView('doctor-dashboard');
  };

  const handleLogout = () => {
    telemedicineService.logoutPatient();
    telemedicineService.logoutDoctor();
    setCurrentPatient(null);
    setCurrentDoctor(null);
    setCurrentView('login');
  };

  const handleOpenDoctorDashboard = () => {
    const doc = telemedicineService.getCurrentDoctor();
    if (doc) {
      setCurrentView('doctor-dashboard');
    } else {
      // Doctor dashboard should be accessed by only doctor
      setIsDoctorAuthModalOpen(true);
    }
  };

  const handleDoctorAuthSuccess = () => {
    setIsDoctorAuthModalOpen(false);
    setCurrentDoctor(telemedicineService.getCurrentDoctor());
    setCurrentView('doctor-dashboard');
  };

  // Count doctor reviews for active patient
  const reviewsCount = patientSubmissions.filter(s => !!s.doctorReview).length;

  // View 1: Login Page
  if (currentView === 'login') {
    return (
      <LoginPage
        onPatientLogin={handlePatientLogin}
        onDoctorLogin={handleDoctorLogin}
      />
    );
  }

  // View 2: Doctor Dashboard (Doctor Only)
  if (currentView === 'doctor-dashboard') {
    return (
      <DoctorDashboard
        onBackToPatientPortal={() => setCurrentView('patient-portal')}
        onLogoutDoctor={handleLogout}
      />
    );
  }

  // View 3: Patient Portal ("the page you gave before" with telemedicine send update feature)
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
        currentPatient={currentPatient}
        onOpenDoctorPortal={handleOpenDoctorDashboard}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        feedbackCount={reviewsCount}
        onLogout={handleLogout}
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
          hasAnalysisResult={Boolean(currentResult)}
          onPrev={handlePrev}
          onNext={handleNext}
          onAnalyze={handleAnalyzeCurrent}
          onSetBaseline={handleSetBaseline}
          onClearBaseline={handleClearBaseline}
          onUpload={handleUpload}
          onOpenRoiModal={() => setIsRoiModalOpen(true)}
          onOpenCamera={() => setIsCameraModalOpen(true)}
          onSendToDoctor={() => setIsSubmitModalOpen(true)}
          onDeleteImage={handleDeleteCurrentImage}
          onClearAllImages={handleClearAllImages}
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

        {/* Recommended Clinical Protocol & Telemedicine Callout */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 text-xs text-slate-600 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span>🩺 Connected Telemedicine Protocol:</span>
            </p>
            <p className="leading-relaxed">
              Analyze your wound image → Click <b>"Send to Doctor"</b> to transmit the segmentation metrics, photograph, and symptoms directly to your physician. Click <b>"Doctor Feedback"</b> in the top bar to view prescribed nanofiber dressings and medical notes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold transition-all shrink-0 whitespace-nowrap active:scale-95 cursor-pointer shadow-xs"
            >
              Doctor's Reviews ({reviewsCount})
            </button>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-semibold transition-all shrink-0 whitespace-nowrap active:scale-95 cursor-pointer shadow-xs"
            >
              Algorithmic Guide
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-700">
            Image-Based Wound Monitoring &amp; Color-Contrast Tissue Segmentation Platform by SKM
          </span>
          <span className="font-mono text-slate-400">Connected Telehealth &amp; CIELAB Engine v2.4</span>
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

      {/* Telemedicine Modals */}
      {currentPatient && (
        <SubmitToDoctorModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          patient={currentPatient}
          currentImageName={currentItem?.name || 'Wound_Scan.jpg'}
          dayLabel={currentItem?.dayLabel}
          analysisResult={currentResult}
          onSubmittedSuccess={() => {
            if (currentPatient) {
              setPatientSubmissions(telemedicineService.getSubmissionsForPatient(currentPatient.id));
            }
            setStatusText('Wound update dispatched to Doctor Dashboard for physician review.');
          }}
        />
      )}

      <PatientDoctorFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        submissions={patientSubmissions}
        patientName={currentPatient?.name || 'Patient'}
        onDeleteSubmission={(id) => {
          telemedicineService.deleteSubmission(id);
          if (currentPatient) {
            setPatientSubmissions(telemedicineService.getSubmissionsForPatient(currentPatient.id));
          }
        }}
      />

      <DoctorAuthModal
        isOpen={isDoctorAuthModalOpen}
        onClose={() => setIsDoctorAuthModalOpen(false)}
        onSuccess={handleDoctorAuthSuccess}
      />

      {/* In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText || 'Delete'}
        variant={confirmDialog.variant || 'danger'}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
