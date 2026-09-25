import React, { useState } from 'react';
import { 
  Send, 
  X, 
  CheckCircle2, 
  Stethoscope, 
  AlertCircle, 
  ShieldCheck, 
  Camera, 
  Activity, 
  Clock,
  Sparkles
} from 'lucide-react';
import { PatientUser, WoundAnalysisResult } from '../types';
import { telemedicineService } from '../services/telemedicineService';

interface SubmitToDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientUser;
  currentImageName: string;
  dayLabel?: string;
  analysisResult: WoundAnalysisResult | null;
  onSubmittedSuccess: () => void;
}

export const SubmitToDoctorModal: React.FC<SubmitToDoctorModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentImageName,
  dayLabel,
  analysisResult,
  onSubmittedSuccess,
}) => {
  const [symptoms, setSymptoms] = useState('');
  const [painScore, setPainScore] = useState<number>(2);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisResult) return;

    setIsSending(true);

    setTimeout(() => {
      telemedicineService.submitWoundUpdate({
        patient,
        imageName: currentImageName || 'Patient_Wound_Scan.jpg',
        dayLabel: dayLabel || 'Follow-up Update',
        originalImage: analysisResult.original,
        segmentationImage: analysisResult.segmentation,
        markedImage: analysisResult.marked,
        woundAreaPercent: analysisResult.wound_area,
        woundPixels: analysisResult.wound_pixels,
        totalPixels: analysisResult.total_pixels,
        rednessPercent: analysisResult.redness,
        yellowPercent: analysisResult.yellow,
        pinkPercent: analysisResult.pink_tissue,
        darkPercent: analysisResult.dark_tissue,
        confidencePercent: analysisResult.confidence,
        condition: analysisResult.condition,
        patientSymptoms: symptoms.trim() || 'Patient uploaded routine follow-up wound photograph for review.',
        painScale: painScore,
      });

      setIsSending(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onSubmittedSuccess();
        onClose();
      }, 1400);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Send Wound Update to Doctor Dashboard
              </h3>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-800">{patient.name}</span> ({patient.age}y, {patient.mobileNumber})
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

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Dispatched to Doctor Dashboard!
            </h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your wound photograph, color-contrast tissue segmentation, and symptoms have been sent to Dr. Murugan for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
            
            {!analysisResult ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Please click <b>"Analyze Image"</b> on the main screen first so that computer vision segmentation metrics are computed before transmitting to your doctor.
                </span>
              </div>
            ) : (
              <>
                {/* CV Metrics Summary Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ready for Tele-Transmission</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {currentImageName}
                    </span>
                  </div>

                  {/* Thumbnail and metrics row */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      <img
                        src={analysisResult.marked || analysisResult.original}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 flex-1 text-center text-xs">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Wound Area</span>
                        <span className="font-bold text-blue-700 font-mono text-sm">{analysisResult.wound_area}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Granulation</span>
                        <span className="font-bold text-rose-600 font-mono text-sm">{analysisResult.redness}%</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Slough</span>
                        <span className="font-bold text-amber-700 font-mono text-sm">{analysisResult.yellow}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pain Scale Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Current Wound Pain Level (0 to 10):
                    </label>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {painScore} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={painScore}
                    onChange={(e) => setPainScore(parseInt(e.target.value, 10))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                    <span>0: No Pain</span>
                    <span>5: Moderate</span>
                    <span>10: Severe Pain</span>
                  </div>
                </div>

                {/* Patient Symptoms & Observations Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Symptoms &amp; Observations for Doctor (Optional):
                  </label>
                  <textarea
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Changed dressing this morning; no yellow discharge; slight itchiness around perimeter..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>

                {/* Destination info */}
                <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    Your submission will appear instantly on Dr. Murugan's review queue. Prescribed nanofiber dressings and instructions will be sent back to this portal.
                  </span>
                </div>
              </>
            )}

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!analysisResult || isSending}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Transmitting...' : 'Send Update to Doctor Dashboard'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
