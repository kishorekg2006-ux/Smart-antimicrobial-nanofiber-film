import React from 'react';
import { HelpCircle, X, CheckCircle2, Sliders, ShieldCheck, Activity, Layers } from 'lucide-react';

interface ClinicalHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicalHelpModal: React.FC<ClinicalHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">
                Wound Analysis Protocol &amp; Algorithmic Guide
              </h3>
              <p className="text-xs text-slate-500">
                Understanding the Python computer vision filters and clinical baseline workflow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-700 pr-1">
          
          {/* Section 1: Workflow */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="text-sm font-bold text-blue-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              Standard Longitudinal Workflow
            </h4>
            <ol className="space-y-1.5 text-slate-700 list-decimal list-inside leading-relaxed">
              <li><b>Upload or Select Day 0:</b> Load your initial untreated or Day 0 wound image.</li>
              <li><b>Run Image Analysis:</b> Click <b className="text-blue-600">"Analyze Image"</b> to run local-contrast segmentation.</li>
              <li><b>Establish Reference Baseline:</b> Click <b className="text-emerald-700">"Set as Baseline"</b> to lock Day 0 surface area.</li>
              <li><b>Track Follow-up Progress:</b> Navigate with <b className="text-slate-800">"Next"</b> or upload Day 3 / Day 7 photos and analyze.</li>
              <li><b>Healing Progress Velocity:</b> The platform automatically computes contraction percentage: <code>((A₀ - Aₜ) / A₀) × 100</code>.</li>
            </ol>
          </div>

          {/* Section 2: Mathematical Algorithms */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Python Computer Vision Color-Contrast Engine
            </h4>
            <p className="leading-relaxed">
              Unlike simplistic global skin thresholding (which mistakenly classifies all reddish or tanned skin as wounds), this engine computes <b>differential local contrast</b>:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-rose-600 font-bold block mb-1">Excess-Red Ratio &amp; Local Red:</span>
                <code>red_ratio = (r - 0.5*(g+b)) / (r+g+b+1)</code><br/>
                <code>local_red = red_ratio - Blur(red_ratio, σ=9)</code><br/>
                <span className="text-slate-500 text-[10px]">Detects hyper-vascular granulation beds.</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="text-amber-700 font-bold block mb-1">CIELAB Slough &amp; Scab Discrimination:</span>
                <code>A &gt; 118 &amp; B &gt; 125 (Yellow Slough)</code><br/>
                <code>local_L &lt; -14 &amp; V &lt; 215 (Dark Eschar Scab)</code><br/>
                <span className="text-slate-500 text-[10px]">Identifies fibrinous exudate and necrosis.</span>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] shadow-xs">
              <span className="text-emerald-700 font-bold block mb-1">Shape Scoring &amp; Noise Rejection:</span>
              <code>Circularity = 4π × Area / (Perimeter)²</code> | <code>Aspect Ratio = max(W/H, H/W)</code><br/>
              <span className="text-slate-500 text-[10px]">Filters tiny camera noise artifacts (&lt;18px) and whole-hand/background regions (&gt;6% area).</span>
            </div>
          </div>

          {/* Section 3: ROI Mark Wound */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-600" />
              Semi-Automatic "Mark Wound" Tool
            </h4>
            <p className="leading-relaxed">
              If an image exhibits challenging lighting, shadows, or tattoo pigmentation, click <b>"✚ Mark Wound"</b> and draw a bounding box around the lesion. The box only constrains the search space — it is <b>never</b> counted as wound area itself.
            </p>
          </div>

          {/* Section 4: Smart Nanofiber Film */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Smart Antimicrobial Nanofiber Film Integration
            </h4>
            <p className="leading-relaxed">
              Electrospun nanofiber films provide high surface area-to-volume ratio, biomimetic extracellular matrix (ECM) architecture, regulated moisture vapor transmission, and sustained release of antimicrobial agents (Silver AgNP, Chitosan, Curcumin) to prevent bacterial biofilms without cytotoxic surges.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer shadow-xs"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
