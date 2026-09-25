import React, { useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Flag, 
  XCircle, 
  UploadCloud, 
  Crop, 
  Camera, 
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Send,
  Stethoscope,
  Trash2
} from 'lucide-react';

interface ControlsBarProps {
  totalImages: number;
  currentIndex: number;
  currentName: string;
  hasBaseline: boolean;
  baselineName: string | null;
  statusText: string;
  isLoading: boolean;
  hasAnalysisResult?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onAnalyze: () => void;
  onSetBaseline: () => void;
  onClearBaseline: () => void;
  onUpload: (files: File[]) => void;
  onOpenRoiModal: () => void;
  onOpenCamera: () => void;
  onSendToDoctor?: () => void;
  onDeleteImage?: () => void;
  onClearAllImages?: () => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  totalImages,
  currentIndex,
  currentName,
  hasBaseline,
  baselineName,
  statusText,
  isLoading,
  hasAnalysisResult,
  onPrev,
  onNext,
  onAnalyze,
  onSetBaseline,
  onClearBaseline,
  onUpload,
  onOpenRoiModal,
  onOpenCamera,
  onSendToDoctor,
  onDeleteImage,
  onClearAllImages,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs">
      
      {/* Primary Action Button Cluster */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        
        {/* Previous Image */}
        <button
          id="prev"
          onClick={onPrev}
          disabled={totalImages <= 1 || isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium text-xs md:text-sm transition-all border border-slate-200 hover:border-slate-300 active:scale-95 shadow-2xs cursor-pointer"
          title="Previous wound image in series (Left Arrow key)"
        >
          <ChevronLeft className="w-4 h-4 text-slate-500" />
          <span>Previous</span>
        </button>

        {/* Next Image */}
        <button
          id="next"
          onClick={onNext}
          disabled={totalImages === 0 || isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-medium text-xs md:text-sm transition-all border border-slate-200 hover:border-slate-300 active:scale-95 shadow-2xs cursor-pointer"
          title={totalImages === 1 ? 'View or add next follow-up photo to track contraction vs baseline' : 'Next wound image in series (Right Arrow key)'}
        >
          <span>{totalImages === 1 ? 'Next Follow-up' : 'Next'}</span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        {/* Analyze Image Button */}
        <button
          id="analyze"
          onClick={onAnalyze}
          disabled={totalImages === 0 || isLoading}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs md:text-sm transition-all shadow-xs hover:shadow border border-blue-700 active:scale-95 cursor-pointer"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 text-white fill-white" />
          )}
          <span>{isLoading ? 'Analyzing...' : 'Analyze Image'}</span>
        </button>

        {/* Send to Doctor Telemedicine Portal Button */}
        {onSendToDoctor && (
          <button
            id="btn-send-doctor"
            onClick={onSendToDoctor}
            disabled={totalImages === 0 || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-xs md:text-sm transition-all shadow-xs hover:shadow border border-blue-800 active:scale-95 cursor-pointer"
            title="Dispatch wound image, segmentation metrics, and symptoms to Doctor Dashboard"
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-200" />
            <span>Send to Doctor</span>
          </button>
        )}

        {/* Set Baseline */}
        <button
          id="setBaseline"
          onClick={onSetBaseline}
          disabled={totalImages === 0 || isLoading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs md:text-sm transition-all border border-emerald-700 active:scale-95 shadow-xs cursor-pointer"
          title="Set current wound image as the Day 0 baseline for healing computation"
        >
          <Flag className="w-3.5 h-3.5 text-emerald-100" />
          <span>Set as Baseline</span>
        </button>

        {/* Clear Baseline */}
        {hasBaseline && (
          <button
            id="clearBaseline"
            onClick={onClearBaseline}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-xs md:text-sm transition-all active:scale-95 cursor-pointer"
            title="Clear active reference baseline"
          >
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Clear Baseline</span>
          </button>
        )}

        {/* Upload Button */}
        <button
          id="btn-upload-trigger"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs md:text-sm transition-all shadow-xs border border-slate-900 active:scale-95 cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 text-slate-200" />
          <span>Upload Wound Images</span>
        </button>
        <input
          ref={fileInputRef}
          id="files"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Mark Wound / ROI Tool */}
        <button
          id="mark"
          onClick={onOpenRoiModal}
          disabled={totalImages === 0 || isLoading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs md:text-sm transition-all border border-amber-600 active:scale-95 shadow-xs cursor-pointer"
          title="Draw a bounding rectangle around difficult wounds to restrict search"
        >
          <Crop className="w-3.5 h-3.5 text-amber-100" />
          <span>✚ Mark Wound</span>
        </button>

        {/* Live Camera Snapshot */}
        <button
          id="btn-camera-capture"
          onClick={onOpenCamera}
          className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs md:text-sm transition-all active:scale-95 shadow-2xs cursor-pointer"
          title="Snap photo with device camera"
          aria-label="Capture wound using device camera"
        >
          <Camera className="w-4 h-4 text-slate-500" />
        </button>

        {/* Delete Current Image */}
        {onDeleteImage && totalImages > 0 && (
          <button
            id="btn-delete-current-image"
            onClick={onDeleteImage}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs md:text-sm transition-all active:scale-95 shadow-2xs cursor-pointer"
            title="Remove current image from queue"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden md:inline text-rose-600">Delete Photo</span>
          </button>
        )}

        {/* Clear All Images (when multiple) */}
        {onClearAllImages && totalImages > 1 && (
          <button
            id="btn-clear-all-images"
            onClick={onClearAllImages}
            disabled={isLoading}
            className="hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 text-xs transition-all active:scale-95 cursor-pointer"
            title="Clear all photos from active queue"
          >
            <span>Clear Queue ({totalImages})</span>
          </button>
        )}

      </div>

      {/* Info & Status Strip */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Status Message */}
        <div 
          id="status" 
          className="flex items-center gap-2 text-slate-700 font-medium px-3 py-1 rounded-md bg-slate-50 border border-slate-200 w-full sm:w-auto text-center sm:text-left justify-center sm:justify-start"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
          <span className="truncate">{statusText}</span>
        </div>

        {/* Navigation & Active File Meta */}
        <div className="flex items-center flex-wrap gap-3 text-slate-600">
          <div id="nav" className="flex items-center gap-1.5 font-medium text-slate-700">
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {totalImages > 0 ? `Image ${currentIndex + 1} of ${totalImages}` : 'No images loaded'}
            </span>
          </div>

          {currentName && (
            <div id="filename" className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px] max-w-[220px] truncate" title={currentName}>
              {currentName}
            </div>
          )}

          {hasBaseline && baselineName && (
            <div className="flex items-center gap-1 text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Baseline: {baselineName}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
