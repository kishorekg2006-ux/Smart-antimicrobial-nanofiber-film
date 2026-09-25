import React, { useState } from 'react';
import { 
  Stethoscope, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  FileText,
  UserCheck,
  Trash2
} from 'lucide-react';
import { WoundUpdateSubmission } from '../types';
import { telemedicineService } from '../services/telemedicineService';
import { ConfirmModal } from './ConfirmModal';

interface PatientDoctorFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: WoundUpdateSubmission[];
  patientName: string;
  onDeleteSubmission?: (id: string) => void;
}

export const PatientDoctorFeedbackModal: React.FC<PatientDoctorFeedbackModalProps> = ({
  isOpen,
  onClose,
  submissions,
  patientName,
  onDeleteSubmission,
}) => {
  const [localSubmissions, setLocalSubmissions] = useState<WoundUpdateSubmission[]>(submissions);
  const [deleteNotice, setDeleteNotice] = useState<string>('');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  React.useEffect(() => {
    setLocalSubmissions(submissions);
  }, [submissions]);

  if (!isOpen) return null;

  const handleDelete = (id: string, isReviewed: boolean) => {
    setConfirmDialog({
      isOpen: true,
      title: isReviewed ? 'Delete Completed Doctor Review?' : 'Delete Wound Submission?',
      message: isReviewed
        ? 'Permanently delete this doctor consultation, clinical notes, and nanofiber prescription from your patient records?'
        : 'Delete this pending wound update submission?',
      confirmText: 'Delete Record',
      onConfirm: () => {
        // Immediate local UI update
        setLocalSubmissions(prev => prev.filter(s => s.id !== id));
        telemedicineService.deleteSubmission(id);
        if (onDeleteSubmission) {
          onDeleteSubmission(id);
        }
        setDeleteNotice('Record permanently removed from your medical history.');
        setTimeout(() => setDeleteNotice(''), 2500);
      },
    });
  };

  const handleClearAllReviewed = () => {
    const reviewedSubs = localSubmissions.filter(s => !!s.doctorReview);
    if (reviewedSubs.length === 0) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Clear All Completed Reviews?',
      message: `Permanently delete all ${reviewedSubs.length} completed doctor reviews and prescriptions from your portal?`,
      confirmText: `Clear All (${reviewedSubs.length})`,
      onConfirm: () => {
        const ids = reviewedSubs.map(s => s.id);
        setLocalSubmissions(prev => prev.filter(s => !ids.includes(s.id)));
        telemedicineService.deleteMultipleSubmissions(ids);
        if (onDeleteSubmission) {
          ids.forEach(id => onDeleteSubmission(id));
        }
        setDeleteNotice('All completed reviews cleared.');
        setTimeout(() => setDeleteNotice(''), 2500);
      },
    });
  };

  const reviewedCount = localSubmissions.filter(s => !!s.doctorReview).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Doctor's Reviews &amp; Nanofiber Prescriptions
              </h3>
              <p className="text-xs text-slate-500">
                Direct clinical feedback for <span className="font-semibold text-slate-800">{patientName}</span>
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

        {deleteNotice && (
          <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{deleteNotice}</span>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {localSubmissions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">No wound updates have been submitted to your doctor yet.</p>
              <p className="text-[11px] text-slate-500">
                Click <b>"Analyze Image"</b> and then <b>"Send Update to Doctor"</b> to receive clinical feedback.
              </p>
            </div>
          ) : (
            localSubmissions.map((sub) => {
              const isReviewed = !!sub.doctorReview;

              return (
                <div
                  key={sub.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isReviewed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {/* Submission Header */}
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 font-mono">
                        {sub.dayLabel || 'Update'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(sub.submittedAt).toLocaleDateString()} at {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isReviewed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 flex items-center gap-1'
                            : 'bg-amber-100 text-amber-800 border-amber-300 flex items-center gap-1'
                        }`}
                      >
                        {isReviewed ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>Doctor Evaluated</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-700" />
                            <span>Awaiting Doctor Review</span>
                          </>
                        )}
                      </span>

                      {/* Delete option for patient */}
                      <button
                        onClick={() => handleDelete(sub.id, isReviewed)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-rose-700 hover:bg-rose-100 text-[11px] font-medium border border-rose-200 transition-colors cursor-pointer"
                        title={isReviewed ? "Delete completed doctor review" : "Delete submission"}
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Image & Metric snapshot */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                      <img src={sub.markedImage || sub.originalImage} alt="Wound" className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 flex-1 text-center text-xs">
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Area</span>
                        <strong className="text-blue-700 font-mono">{sub.woundAreaPercent}%</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Redness</span>
                        <strong className="text-rose-600 font-mono">{sub.rednessPercent}%</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Slough</span>
                        <strong className="text-amber-700 font-mono">{sub.yellowPercent}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Review Box */}
                  {sub.doctorReview ? (
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-2xs space-y-2.5 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>{sub.doctorReview.doctorName}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(sub.doctorReview.reviewedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-slate-50 p-2 rounded">
                          <span className="text-slate-400 block">Healing Status:</span>
                          <span className="font-bold text-emerald-800">{sub.doctorReview.healingStatus}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <span className="text-slate-400 block">Infection Risk:</span>
                          <span className="font-bold text-slate-800">{sub.doctorReview.infectionRisk}</span>
                        </div>
                      </div>

                      <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                          Prescribed Smart Nanofiber Dressing:
                        </span>
                        <p className="font-bold text-blue-950 mt-0.5">{sub.doctorReview.dressingPrescription}</p>
                        <span className="text-[11px] text-blue-800 block mt-1">
                          Change Interval: <b>{sub.doctorReview.dressingChangeInterval}</b>
                        </span>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block text-[11px]">Physician Clinical Assessment:</span>
                        <p className="text-slate-700 leading-relaxed mt-0.5">{sub.doctorReview.clinicalNotes}</p>
                      </div>

                      {sub.doctorReview.additionalInstructions && (
                        <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                          <b>Care Instructions:</b> {sub.doctorReview.additionalInstructions}
                        </div>
                      )}

                      {/* Explicit completed review delete footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Consultation Completed</span>
                        <button
                          onClick={() => handleDelete(sub.id, true)}
                          className="flex items-center gap-1 text-rose-600 hover:text-rose-800 hover:underline font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 text-rose-500" />
                          <span>Delete Completed Review</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-500 italic">
                      Transmitted to Dr. Murugan. Assessment and dressing recommendation will be posted here once reviewed.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {reviewedCount > 1 ? (
            <button
              onClick={handleClearAllReviewed}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-medium cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear All Completed Reviews ({reviewedCount})</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">Records stored in secure session</span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>

      </div>

      {/* In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText || 'Delete'}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
