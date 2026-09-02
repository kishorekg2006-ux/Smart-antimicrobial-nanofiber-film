import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  FileText, 
  Layers, 
  HelpCircle,
  FlaskConical,
  Activity
} from 'lucide-react';

interface HeaderProps {
  onOpenPresets: () => void;
  onToggleThresholds: () => void;
  showThresholds: boolean;
  onOpenReport: () => void;
  onOpenHelp: () => void;
  activeImageCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPresets,
  onToggleThresholds,
  showThresholds,
  onOpenReport,
  onOpenHelp,
  activeImageCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3.5 md:px-8 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand and Title */}
        <div className="flex items-center gap-3 text-left w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                SMART ANTIMICROBIAL NANOFIBER FILM
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                <Activity className="w-3 h-3 text-emerald-600" />
                Live CV Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Image-Based Wound Monitoring &amp; Color-Contrast Tissue Segmentation Platform
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          
          <button
            id="btn-sample-cases"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-medium transition-all shadow-2xs active:scale-95"
            title="Load standard clinical wound progression cases"
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
            <span>Sample Cases</span>
          </button>

          <button
            id="btn-toggle-thresholds"
            onClick={onToggleThresholds}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border shadow-2xs active:scale-95 ${
              showThresholds 
                ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
            title="Adjust Python color ratio & local contrast thresholds"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Threshold Filters</span>
          </button>

          <button
            id="btn-clinical-report"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs hover:shadow border border-blue-700 active:scale-95"
            title="Generate AI Clinical Wound Report & Print"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Clinical AI Assessment</span>
          </button>

          <button
            id="btn-help-guide"
            onClick={onOpenHelp}
            className="p-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 text-xs transition-colors"
            title="Clinical protocol and wound workflow guide"
            aria-label="Clinical workflow help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
