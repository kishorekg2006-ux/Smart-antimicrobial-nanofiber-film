import React, { useRef, useEffect, useState } from 'react';
import { Crop, X, Check, RotateCcw, Info } from 'lucide-react';
import { ROI } from '../types';

interface RoiModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onConfirmRoi: (roi: ROI) => void;
}

export const RoiModal: React.FC<RoiModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onConfirmRoi,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<ROI | null>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  // Load image onto canvas on open
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageObj(img);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const maxW = Math.min(window.innerWidth * 0.85, 950);
      const maxH = Math.min(window.innerHeight * 0.65, 650);

      const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
      setScaleFactor(scale);

      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      setStartPos(null);
      setCurrentRect(null);
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Redraw canvas with rectangle
  const redraw = (rect: ROI | null) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

    if (rect) {
      const x1 = Math.min(rect.x1, rect.x2);
      const y1 = Math.min(rect.y1, rect.y2);
      const w = Math.abs(rect.x2 - rect.x1);
      const h = Math.abs(rect.y2 - rect.y1);

      // Semi-transparent shroud outside ROI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, canvas.width, y1);
      ctx.fillRect(0, y1 + h, canvas.width, canvas.height - (y1 + h));
      ctx.fillRect(0, y1, x1, h);
      ctx.fillRect(x1 + w, y1, canvas.width - (x1 + w), h);

      // Bright lime-green border
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(x1, y1, w, h);

      // Corner handles
      ctx.fillStyle = '#00ff66';
      ctx.setLineDash([]);
      const handleSize = 6;
      ctx.fillRect(x1 - handleSize / 2, y1 - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(x1 + w - handleSize / 2, y1 - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(x1 - handleSize / 2, y1 + h - handleSize / 2, handleSize, handleSize);
      ctx.fillRect(x1 + w - handleSize / 2, y1 + h - handleSize / 2, handleSize, handleSize);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentRect({ x1: x, y1: y, x2: x, y2: y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(canvas.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(canvas.height, e.clientY - rect.top));

    const newRect: ROI = {
      x1: Math.min(startPos.x, x),
      y1: Math.min(startPos.y, y),
      x2: Math.max(startPos.x, x),
      y2: Math.max(startPos.y, y),
    };

    setCurrentRect(newRect);
    redraw(newRect);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleReset = () => {
    setCurrentRect(null);
    setStartPos(null);
    redraw(null);
  };

  const handleRunRoi = () => {
    if (!currentRect || Math.abs(currentRect.x2 - currentRect.x1) < 8 || Math.abs(currentRect.y2 - currentRect.y1) < 8) {
      alert('Please draw a bounding box around the wound region first.');
      return;
    }

    // Convert canvas coordinates back to original image scale
    const originalRoi: ROI = {
      x1: currentRect.x1 / scaleFactor,
      y1: currentRect.y1 / scaleFactor,
      x2: currentRect.x2 / scaleFactor,
      y2: currentRect.y2 / scaleFactor,
    };

    onConfirmRoi(originalRoi);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="roiModal" className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="roiBox bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-5 shadow-xl flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Crop className="w-5 h-5" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-900">
              Draw a box around ONLY the wound (ROI Restriction)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-xs text-amber-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Click and drag your mouse across the wound area. The bounding box only restricts the automatic color-contrast search space; the box itself is <b>not</b> counted as wound area.
          </span>
        </div>

        {/* Interactive Canvas */}
        <div className="bg-slate-900 rounded-xl p-2 border border-slate-200 shadow-inner flex items-center justify-center overflow-auto max-w-full">
          <canvas
            ref={canvasRef}
            id="roiCanvas"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="cursor-crosshair rounded-lg shadow-md max-h-[60vh] max-w-full"
          />
        </div>

        {/* Action Controls */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mt-5 pt-3 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Box</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              id="roiCancel"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="roiRun"
              onClick={handleRunRoi}
              disabled={!currentRect}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Analyze Selected Area</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
