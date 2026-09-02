import React, { useState } from 'react';
import { 
  Eye, 
  Download, 
  Maximize2, 
  Sparkles, 
  Layers, 
  Crosshair,
  Info,
  ZoomIn
} from 'lucide-react';
import { WoundAnalysisResult } from '../types';

interface ImageGridProps {
  originalSrc: string | null;
  segmentationSrc: string | null;
  markedSrc: string | null;
  result: WoundAnalysisResult | null;
  fileName?: string;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  originalSrc,
  segmentationSrc,
  markedSrc,
  result,
  fileName,
}) => {
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null);

  const handleDownload = (src: string, suffix: string) => {
    if (!src) return;
    const a = document.createElement('a');
    a.href = src;
    a.download = `${fileName ? fileName.replace(/\.[^/.]+$/, "") : 'wound'}_${suffix}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        
        {/* Card 1: Original Image */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <h2 className="text-sm md:text-base font-semibold text-slate-900 tracking-tight">
                Original Image
              </h2>
            </div>
            {originalSrc && (
              <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setModalImage({ src: originalSrc, title: 'Original Wound Photograph' })}
                  className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Expand view"
                  aria-label="Expand Original Photograph"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDownload(originalSrc, 'original')}
                  className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Download image"
                  aria-label="Download Original Photograph"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="relative aspect-[4/3] rounded-lg bg-slate-950 border border-slate-200 overflow-hidden flex items-center justify-center">
            {originalSrc ? (
              <img
                id="original"
                src={originalSrc}
                alt="Original clinical wound"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                <Eye className="w-8 h-8 mb-2 opacity-50 text-slate-500" />
                <span>Upload an image or select a sample case to display the original photo</span>
              </div>
            )}
          </div>

          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="font-medium">Raw RGB Input</span>
            <span className="font-mono text-slate-500">Unfiltered</span>
          </div>
        </div>

        {/* Card 2: Wound Segmentation */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <h2 className="text-sm md:text-base font-semibold text-slate-900 tracking-tight">
                Wound Segmentation
              </h2>
            </div>
            {segmentationSrc && (
              <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setModalImage({ src: segmentationSrc, title: 'Wound Tissue Segmentation (Isolated Pixels)' })}
                  className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Expand view"
                  aria-label="Expand Segmentation"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDownload(segmentationSrc, 'segmentation')}
                  className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Download segmentation"
                  aria-label="Download Segmentation"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="relative aspect-[4/3] rounded-lg bg-slate-950 border border-slate-200 overflow-hidden flex items-center justify-center">
            {segmentationSrc ? (
              <img
                id="segmentation"
                src={segmentationSrc}
                alt="Segmented wound tissue"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                <Layers className="w-8 h-8 mb-2 opacity-50 text-blue-400" />
                <span>Click "Analyze Image" to isolate wound tissue from peri-wound skin</span>
              </div>
            )}
          </div>

          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="font-medium">Isolated Wound Tissue</span>
            <span className="font-mono text-blue-600 font-semibold">
              {result ? `${result.wound_pixels.toLocaleString()} px` : '0 px'}
            </span>
          </div>
        </div>

        {/* Card 3: Detected Wound Region */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between group">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm md:text-base font-semibold text-slate-900 tracking-tight">
                Detected Wound Region
              </h2>
            </div>
            {markedSrc && (
              <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setModalImage({ src: markedSrc, title: 'Detected Wound Contour & Bounding Box' })}
                  className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Expand view"
                  aria-label="Expand Detected Region"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDownload(markedSrc, 'marked')}
                  className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Download marked region"
                  aria-label="Download Detected Region"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="relative aspect-[4/3] rounded-lg bg-slate-950 border border-slate-200 overflow-hidden flex items-center justify-center">
            {markedSrc ? (
              <img
                id="marked"
                src={markedSrc}
                alt="Detected wound contour and bounding box"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                <Crosshair className="w-8 h-8 mb-2 opacity-50 text-emerald-500" />
                <span>Contour boundary (green) and lesion bounding box (blue)</span>
              </div>
            )}
          </div>

          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Contour /
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Box
            </span>
            <span className="font-mono text-emerald-700 font-semibold">
              {result ? `${result.wound_area}% Area` : '--'}
            </span>
          </div>
        </div>

      </div>

      {/* Expanded Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-5 shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-blue-600" />
                <span>{modalImage.title}</span>
              </h3>
              <button
                onClick={() => setModalImage(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950 rounded-xl p-2 min-h-[300px]">
              <img
                src={modalImage.src}
                alt={modalImage.title}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
