import React, { useState } from 'react';
import { 
  Sparkles, 
  Printer, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Activity, 
  TrendingDown, 
  Droplet,
  HeartPulse,
  Send,
  Loader2
} from 'lucide-react';
import { WoundAnalysisResult, BaselineInfo, AIClinicalAssessment } from '../types';

interface AIClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: WoundAnalysisResult | null;
  baseline: BaselineInfo | null;
  currentImageName: string;
  originalSrc: string | null;
  segmentationSrc: string | null;
  markedSrc: string | null;
}

export const AIClinicalReportModal: React.FC<AIClinicalReportModalProps> = ({
  isOpen,
  onClose,
  result,
  baseline,
  currentImageName,
  originalSrc,
  segmentationSrc,
  markedSrc,
}) => {
  const [patientNotes, setPatientNotes] = useState('');
  const [assessment, setAssessment] = useState<AIClinicalAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAI = async () => {
    if (!result) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/wound-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metrics: result,
          baseline: baseline,
          dayLabel: currentImageName,
          patientNotes: patientNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate clinical assessment from server.');
      }

      const data = await response.json();
      setAssessment(data);
    } catch (err: any) {
      setError(err?.message || 'Server assessment error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-xl overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none print:max-h-none print:max-w-none print:p-0">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">
                Clinical Wound Assessment &amp; Nanofiber Film Report
              </h3>
              <p className="text-xs text-slate-500">
                Automated tissue classification and smart dressing action plan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-colors cursor-pointer"
              title="Print Medical Report"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content / Printable Document */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800 print:text-black print:p-6 print:space-y-4">
          
          {/* Clinical Document Header for Print */}
          <div className="border-b border-slate-200 print:border-black pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs font-bold text-blue-600 print:text-blue-700 uppercase tracking-wider block">
                SMART ANTIMICROBIAL NANOFIBER FILM RESEARCH PROTOTYPE
              </span>
              <h2 className="text-xl font-bold text-slate-900 print:text-black tracking-tight">
                LONGITUDINAL WOUND MONITORING ASSESSMENT REPORT
              </h2>
            </div>
            <div className="text-xs text-slate-500 print:text-black sm:text-right font-mono">
              <div>Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
              <div>Subject File: {currentImageName || 'Unnamed Sample'}</div>
            </div>
          </div>

          {/* Quantitative Computer Vision Summary */}
          {result ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 print:bg-slate-100 p-4 rounded-xl border border-slate-200 print:border-slate-300">
              <div>
                <span className="text-[11px] text-slate-500 print:text-slate-600 block uppercase font-semibold">Wound Surface Area</span>
                <strong className="text-xl font-mono text-blue-700 print:text-black block">{result.wound_area}%</strong>
                <span className="text-[10px] text-slate-500">{result.wound_pixels.toLocaleString()} px</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 print:text-slate-600 block uppercase font-semibold">Granulation Redness</span>
                <strong className="text-xl font-mono text-rose-600 print:text-black block">{result.redness}%</strong>
                <span className="text-[10px] text-slate-500">Excess-red ratio</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 print:text-slate-600 block uppercase font-semibold">Slough Tissue</span>
                <strong className="text-xl font-mono text-amber-700 print:text-black block">{result.yellow}%</strong>
                <span className="text-[10px] text-slate-500">CIELAB yellow channel</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 print:text-slate-600 block uppercase font-semibold">Confidence Score</span>
                <strong className="text-xl font-mono text-emerald-700 print:text-black block">{result.confidence}%</strong>
                <span className="text-[10px] text-slate-500">{result.condition}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500 text-xs border border-slate-200">
              No image analyzed yet. Click "Analyze Image" before generating report.
            </div>
          )}

          {/* Photographic Evidence Triad (Print and Preview) */}
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-slate-200 print:border-slate-300 rounded-lg p-2 bg-slate-50 print:bg-white text-center">
              <span className="text-[10px] font-bold text-slate-700 block mb-1">Original Photo</span>
              {originalSrc && <img src={originalSrc} alt="Original" className="w-full h-28 object-contain rounded" />}
            </div>
            <div className="border border-slate-200 print:border-slate-300 rounded-lg p-2 bg-slate-50 print:bg-white text-center">
              <span className="text-[10px] font-bold text-slate-700 block mb-1">Tissue Segmentation</span>
              {segmentationSrc && <img src={segmentationSrc} alt="Segmentation" className="w-full h-28 object-contain rounded bg-slate-900" />}
            </div>
            <div className="border border-slate-200 print:border-slate-300 rounded-lg p-2 bg-slate-50 print:bg-white text-center">
              <span className="text-[10px] font-bold text-slate-700 block mb-1">Contour &amp; Bounding Box</span>
              {markedSrc && <img src={markedSrc} alt="Marked Region" className="w-full h-28 object-contain rounded" />}
            </div>
          </div>

          {/* Optional Clinical Notes Input (hidden in print unless filled) */}
          <div className="space-y-2 print:hidden">
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Patient &amp; Clinical Observation Notes (Optional):</span>
              <span className="text-[10px] text-slate-500">Included in AI prompt</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="e.g. Diabetic ulcer, 54yo patient, mild serous exudate, Day 4 on silk nanofiber..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-xs"
              />
              <button
                onClick={handleGenerateAI}
                disabled={isLoading || !result}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isLoading ? 'Consulting AI...' : 'Run Clinical AI Analysis'}</span>
              </button>
            </div>
          </div>

          {/* AI Assessment Results */}
          {assessment && (
            <div className="space-y-4 bg-slate-50 print:bg-white border border-slate-200 print:border-slate-400 p-5 rounded-xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Clinical Diagnosis &amp; Biomaterial Prescriptions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 print:text-slate-600">Infection Risk:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    assessment.infectionRiskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    assessment.infectionRiskLevel === 'Moderate' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {assessment.infectionRiskLevel} Risk
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">Wound Stage &amp; Etiology:</span>
                  <p className="text-slate-800">{assessment.woundStage}</p>
                  <p className="text-slate-500 mt-1">{assessment.tissueEtiology}</p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                  <span className="font-bold text-slate-900 block mb-1">Smart Nanofiber Film Formulation:</span>
                  <p className="text-slate-800 font-medium">{assessment.nanofiberRecommendation}</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                <span className="font-bold text-slate-900 block mb-2 text-xs">Recommended Clinical Protocol &amp; Action Items:</span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {assessment.clinicalActionItems?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {!assessment && !isLoading && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center text-xs text-slate-500 print:hidden">
              Click <b className="text-blue-700">"Run Clinical AI Analysis"</b> above to generate automated tissue etiology, infection risk scoring, and tailored antimicrobial nanofiber dressing schedules.
            </div>
          )}

          {/* Sign-off for Print */}
          <div className="hidden print:flex justify-between items-end pt-12 border-t border-slate-300 text-xs">
            <div>
              <p className="font-semibold">Reviewing Physician / Clinician:</p>
              <div className="w-48 h-0.5 bg-black mt-8 mb-1" />
              <p className="text-slate-600">Signature / Date</p>
            </div>
            <div className="text-right text-slate-500">
              <p>Smart Antimicrobial Nanofiber Film Platform</p>
              <p>Automated Optical Segmentation Algorithm v2.4</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
