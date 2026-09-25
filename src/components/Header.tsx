import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  FileText, 
  Layers, 
  HelpCircle,
  FlaskConical,
  Activity,
  Stethoscope,
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { PatientUser } from '../types';

interface HeaderProps {
  onOpenPresets: () => void;
  onToggleThresholds: () => void;
  showThresholds: boolean;
  onOpenReport: () => void;
  onOpenHelp: () => void;
  activeImageCount: number;
  currentPatient?: PatientUser | null;
  onOpenDoctorPortal: () => void;
  onOpenFeedback: () => void;
  feedbackCount?: number;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPresets,
  onToggleThresholds,
  showThresholds,
  onOpenReport,
  onOpenHelp,
  activeImageCount,
  currentPatient,
  onOpenDoctorPortal,
  onOpenFeedback,
  feedbackCount = 0,
  onLogout,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 md:px-6 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Brand and Title */}
        <div className="flex items-center gap-3 text-left w-full lg:w-auto">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900">
                Image-Based Wound Monitoring &amp; Color-Contrast Tissue Segmentation Platform by SKM
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                <Activity className="w-3 h-3 text-emerald-600" />
                Telemed Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Computer Vision Tissue Classification &amp; Smart Antimicrobial Nanofiber Film Monitor
            </p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto justify-end">
          
          {/* Patient Profile Info Pill */}
          {currentPatient && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium">
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>
                <b>{currentPatient.name}</b> ({currentPatient.age}y)
              </span>
            </div>
          )}

          {/* Doctor Feedback / Prescriptions Button */}
          <button
            onClick={onOpenFeedback}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="View Doctor Prescriptions & Assessment Notes"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" />
            <span>Doctor Feedback</span>
            {feedbackCount > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {feedbackCount}
              </span>
            )}
          </button>

          {/* Doctor Dashboard Link */}
          <button
            onClick={onOpenDoctorPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
            title="Access Doctor Clinical Review Dashboard"
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-300" />
            <span>Doctor Dashboard</span>
          </button>

          <button
            id="btn-sample-cases"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-medium transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Load standard clinical wound progression cases"
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
            <span>Sample Cases</span>
          </button>

          <button
            id="btn-toggle-thresholds"
            onClick={onToggleThresholds}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border shadow-2xs active:scale-95 cursor-pointer ${
              showThresholds 
                ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
            title="Adjust Python color ratio & local contrast thresholds"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          <button
            id="btn-clinical-report"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs hover:shadow border border-blue-700 active:scale-95 cursor-pointer"
            title="Generate AI Clinical Wound Report & Print"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>AI Report</span>
          </button>

          <button
            id="btn-help-guide"
            onClick={onOpenHelp}
            className="p-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 text-xs transition-colors cursor-pointer"
            title="Clinical protocol and wound workflow guide"
            aria-label="Clinical workflow help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sign Out */}
          <button
            onClick={onLogout}
            className="p-1.5 rounded-md bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 text-xs transition-colors cursor-pointer"
            title="Sign Out to Login Page"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};

