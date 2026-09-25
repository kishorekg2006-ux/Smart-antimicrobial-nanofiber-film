import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  Eye, 
  Send, 
  ChevronRight, 
  ShieldCheck, 
  ArrowLeft, 
  X, 
  Sparkles, 
  Printer, 
  Trash2, 
  Sliders, 
  RotateCcw,
  Activity,
  Layers
} from 'lucide-react';
import { WoundUpdateSubmission, DoctorReview } from '../types';
import { telemedicineService, DEFAULT_DOCTOR } from '../services/telemedicineService';
import { ConfirmModal } from './ConfirmModal';

interface DoctorDashboardProps {
  onBackToPatientPortal: () => void;
  onLogoutDoctor: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onBackToPatientPortal,
  onLogoutDoctor,
}) => {
  const [submissions, setSubmissions] = useState<WoundUpdateSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'urgent'>('all');
  
  // Selected submission for review modal
  const [selectedSubmission, setSelectedSubmission] = useState<WoundUpdateSubmission | null>(null);

  // Review Form States
  const [healingStatus, setHealingStatus] = useState<DoctorReview['healingStatus']>('Improving');
  const [infectionRisk, setInfectionRisk] = useState<DoctorReview['infectionRisk']>('Low');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [dressingPrescription, setDressingPrescription] = useState('Silk-Fibroin-Silver Nanofiber Film (Antimicrobial AgNP Matrix)');
  const [dressingChangeInterval, setDressingChangeInterval] = useState('Every 3 Days');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [toastNotice, setToastNotice] = useState('');
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

  const loadSubmissions = () => {
    setSubmissions(telemedicineService.getSubmissions());
  };

  useEffect(() => {
    loadSubmissions();

    const handleUpdate = () => {
      loadSubmissions();
    };

    window.addEventListener('skm_telemed_update', handleUpdate);
    return () => {
      window.removeEventListener('skm_telemed_update', handleUpdate);
    };
  }, []);

  // Sync review form when selected submission changes
  useEffect(() => {
    if (selectedSubmission) {
      if (selectedSubmission.doctorReview) {
        setHealingStatus(selectedSubmission.doctorReview.healingStatus);
        setInfectionRisk(selectedSubmission.doctorReview.infectionRisk);
        setClinicalNotes(selectedSubmission.doctorReview.clinicalNotes);
        setDressingPrescription(selectedSubmission.doctorReview.dressingPrescription);
        setDressingChangeInterval(selectedSubmission.doctorReview.dressingChangeInterval);
        setAdditionalInstructions(selectedSubmission.doctorReview.additionalInstructions);
      } else {
        // Defaults based on CV assessment
        const isUrgent = selectedSubmission.yellowPercent > 25 || selectedSubmission.woundAreaPercent > 4.0;
        setHealingStatus(isUrgent ? 'Critical / Deteriorating' : 'Improving');
        setInfectionRisk(isUrgent ? 'High' : (selectedSubmission.yellowPercent > 10 ? 'Moderate' : 'Low'));
        setClinicalNotes(
          `Computer vision analysis shows wound surface area of ${selectedSubmission.woundAreaPercent}%, granulation redness at ${selectedSubmission.rednessPercent}%, and slough exudate at ${selectedSubmission.yellowPercent}%. Condition: ${selectedSubmission.condition}.`
        );
        setDressingPrescription(
          selectedSubmission.yellowPercent > 20
            ? 'Chitosan-PCL Electrospun Membrane (High Exudate Absorption)'
            : 'Silk-Fibroin-Silver Nanofiber Film (Antimicrobial AgNP Matrix)'
        );
        setDressingChangeInterval('Every 3 Days');
        setAdditionalInstructions('Keep dressing sealed. Re-scan wound and upload follow-up photograph before next dressing change.');
      }
      setReviewSuccessMsg('');
    }
  }, [selectedSubmission]);

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setIsSubmittingReview(true);
    setTimeout(() => {
      const updated = telemedicineService.saveDoctorReview(selectedSubmission.id, {
        doctorName: DEFAULT_DOCTOR.name,
        doctorLicense: DEFAULT_DOCTOR.licenseNumber,
        healingStatus,
        infectionRisk,
        clinicalNotes,
        dressingPrescription,
        dressingChangeInterval,
        additionalInstructions,
      });

      setIsSubmittingReview(false);
      setReviewSuccessMsg('Review & Nanofiber Prescription successfully sent to patient portal!');
      if (updated) {
        setSelectedSubmission(updated);
      }
      loadSubmissions();
    }, 400);
  };

  const handleDeleteSubmission = (id: string, isReviewed = false) => {
    setConfirmDialog({
      isOpen: true,
      title: isReviewed ? 'Delete Completed Review & Case?' : 'Delete Patient Case Record?',
      message: isReviewed
        ? 'Permanently delete this completed doctor review, clinical notes, and patient wound case from the clinical registry?'
        : 'Permanently remove this patient wound submission from the telemedicine queue?',
      confirmText: 'Delete Record',
      variant: 'danger',
      onConfirm: () => {
        setSubmissions(prev => prev.filter(s => s.id !== id));
        telemedicineService.deleteSubmission(id);
        setSelectedSubmission(null);
        loadSubmissions();
        setToastNotice('Patient record and consultation successfully deleted from registry.');
        setTimeout(() => setToastNotice(''), 3000);
      },
    });
  };

  const handleResetDemoData = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Clinical Benchmark Cases?',
      message: 'Restore all clinical records to the initial benchmark dataset (Robert Jenkins, Anita Sharma, Carlos Mendoza)? Any custom patient submissions will be reset.',
      confirmText: 'Reset Cases',
      variant: 'warning',
      onConfirm: () => {
        telemedicineService.resetDemoData();
        setSelectedSubmission(null);
        loadSubmissions();
        setToastNotice('Clinical registry restored to benchmark records.');
        setTimeout(() => setToastNotice(''), 3000);
      },
    });
  };

  // Filter calculations
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = 
      sub.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.patientMobile.includes(searchQuery) ||
      sub.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.imageName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'pending') return sub.status === 'Pending Review';
    if (statusFilter === 'reviewed') return sub.status === 'Reviewed';
    if (statusFilter === 'urgent') return sub.status === 'Urgent Attention';
    return true;
  });

  const pendingCount = submissions.filter(s => s.status === 'Pending Review').length;
  const reviewedCount = submissions.filter(s => s.status === 'Reviewed').length;
  const urgentCount = submissions.filter(s => s.status === 'Urgent Attention').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      
      {/* Doctor Portal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Doctor Clinical Telemedicine Portal
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5">
                Image-Based Wound Monitoring &amp; Color-Contrast Tissue Segmentation Platform by SKM
              </h1>
            </div>
          </div>

          {/* Doctor Profile & Action Controls */}
          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-end">
            <div className="hidden md:flex flex-col text-right pr-2 border-r border-slate-200">
              <span className="text-xs font-bold text-slate-900">{DEFAULT_DOCTOR.name}</span>
              <span className="text-[11px] text-slate-500 font-mono">Lic: {DEFAULT_DOCTOR.licenseNumber}</span>
            </div>

            <button
              onClick={onBackToPatientPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Patient Portal View</span>
            </button>

            <button
              onClick={onLogoutDoctor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Doctor Dashboard */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Total Submissions</span>
              <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">
                {submissions.length}
              </span>
              <span className="text-[10px] text-slate-400">All registered patients</span>
            </div>
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-amber-700 font-medium block">Pending Reviews</span>
              <span className="text-2xl font-bold text-amber-600 font-mono mt-0.5 block">
                {pendingCount}
              </span>
              <span className="text-[10px] text-amber-600">Requires clinical evaluation</span>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-rose-700 font-medium block">Urgent Cases</span>
              <span className="text-2xl font-bold text-rose-600 font-mono mt-0.5 block">
                {urgentCount}
              </span>
              <span className="text-[10px] text-rose-600">High slough or infection risk</span>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-700 font-medium block">Reviewed &amp; Prescribed</span>
              <span className="text-2xl font-bold text-emerald-600 font-mono mt-0.5 block">
                {reviewedCount}
              </span>
              <span className="text-[10px] text-emerald-600">Action plan sent to patient</span>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Toast Notice */}
        {toastNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastNotice}</span>
          </div>
        )}

        {/* Directory & Submissions Header Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Patient Wound Updates &amp; Image Tele-Consultation Stream
              </h2>
              <p className="text-xs text-slate-500">
                Patients submit wound photographs with local color contrast metrics for physician review
              </p>
            </div>

            <button
              onClick={handleResetDemoData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer self-start sm:self-auto"
              title="Reset records to default clinical benchmark patients"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Benchmark Cases</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
            
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name, mobile, ID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'pending'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setStatusFilter('urgent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'urgent'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                Urgent ({urgentCount})
              </button>
              <button
                onClick={() => setStatusFilter('reviewed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'reviewed'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                Reviewed ({reviewedCount})
              </button>
            </div>

          </div>

        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Patient Updates Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No records match your search criteria. Patients can submit wound assessments from their portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubmissions.map((sub) => {
              const isUrgent = sub.status === 'Urgent Attention';
              const isPending = sub.status === 'Pending Review';

              return (
                <div
                  key={sub.id}
                  className={`bg-white rounded-xl border transition-all duration-200 shadow-xs hover:shadow-sm overflow-hidden flex flex-col justify-between ${
                    isUrgent
                      ? 'border-rose-300 ring-1 ring-rose-200'
                      : isPending
                      ? 'border-amber-300'
                      : 'border-slate-200'
                  }`}
                >
                  
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500 block">
                          {sub.patientId} • {sub.dayLabel || 'Follow-up'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <span>{sub.patientName}</span>
                          <span className="text-xs font-normal text-slate-500 font-mono">({sub.patientAge}y)</span>
                        </h3>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isUrgent
                            ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                            : isPending
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{sub.patientMobile}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Previews Triad */}
                  <div className="p-4 space-y-3 flex-1">
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-1.5 rounded-lg">
                      <div className="relative aspect-square rounded overflow-hidden bg-slate-800">
                        <img
                          src={sub.originalImage}
                          alt="Original"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white text-center font-mono py-0.5">
                          Photo
                        </span>
                      </div>
                      <div className="relative aspect-square rounded overflow-hidden bg-slate-800">
                        <img
                          src={sub.segmentationImage}
                          alt="Mask"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-emerald-300 text-center font-mono py-0.5">
                          Mask
                        </span>
                      </div>
                      <div className="relative aspect-square rounded overflow-hidden bg-slate-800">
                        <img
                          src={sub.markedImage}
                          alt="Contour"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-cyan-300 text-center font-mono py-0.5">
                          Contour
                        </span>
                      </div>
                    </div>

                    {/* Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-medium">Area</span>
                        <strong className="text-blue-700 font-mono text-sm block">{sub.woundAreaPercent}%</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-medium">Redness</span>
                        <strong className="text-rose-600 font-mono text-sm block">{sub.rednessPercent}%</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-medium">Slough</span>
                        <strong className={`font-mono text-sm block ${sub.yellowPercent > 20 ? 'text-amber-700' : 'text-slate-700'}`}>
                          {sub.yellowPercent}%
                        </strong>
                      </div>
                    </div>

                    {/* Patient Symptom Snippet */}
                    {sub.patientSymptoms && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800 block text-[11px] mb-0.5">
                          Patient Notes (Pain: {sub.painScale ?? 'N/A'}/10):
                        </span>
                        <p className="line-clamp-2 italic">"{sub.patientSymptoms}"</p>
                      </div>
                    )}

                    {/* If Reviewed, show doctor summary snippet */}
                    {sub.doctorReview && (
                      <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-800 text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Doctor Reviewed
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700">
                            Status: {sub.doctorReview.healingStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800 font-medium line-clamp-1">
                          Rx: {sub.doctorReview.dressingPrescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Action */}
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedSubmission(sub)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>{sub.doctorReview ? 'Edit Clinical Review' : 'Review Patient Case'}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                    </button>

                    <button
                      onClick={() => handleDeleteSubmission(sub.id, !!sub.doctorReview)}
                      className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                      title={sub.doctorReview ? "Delete completed review & case record" : "Delete patient case record"}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Clinical Review & Prescription Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Physician Telemedicine Clinical Review
                    </h3>
                    <span className="text-xs font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                      {selectedSubmission.patientId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Patient: <b>{selectedSubmission.patientName}</b> (Age: {selectedSubmission.patientAge}y, Mobile: {selectedSubmission.patientMobile})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
              
              {/* Success Notification Banner */}
              {reviewSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{reviewSuccessMsg}</span>
                </div>
              )}

              {/* High-Res Image Triad */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                  Computer Vision Segmentation &amp; Diagnostic Imagery:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 text-center">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">1. Patient Original Photograph</span>
                    <div className="aspect-4/3 w-full bg-slate-900 rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={selectedSubmission.originalImage}
                        alt="Original"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 text-center">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">2. Local Contrast Segmentation Mask</span>
                    <div className="aspect-4/3 w-full bg-slate-950 rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={selectedSubmission.segmentationImage}
                        alt="Mask"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 text-center">
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">3. Contour &amp; Bounding Box</span>
                    <div className="aspect-4/3 w-full bg-slate-900 rounded overflow-hidden flex items-center justify-center">
                      <img
                        src={selectedSubmission.markedImage}
                        alt="Marked"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantitative Metrics & Patient Symptoms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Metrics Breakdown */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    Algorithmic Tissue Classification:
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-slate-400 block text-[10px]">Wound Area Coverage</span>
                      <strong className="text-blue-700 text-lg font-mono">{selectedSubmission.woundAreaPercent}%</strong>
                      <span className="text-[10px] text-slate-500 block">{selectedSubmission.woundPixels.toLocaleString()} pixels</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-slate-400 block text-[10px]">Granulation Redness</span>
                      <strong className="text-rose-600 text-lg font-mono">{selectedSubmission.rednessPercent}%</strong>
                      <span className="text-[10px] text-slate-500 block">Hyper-vascular tissue</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-slate-400 block text-[10px]">Slough / Exudate</span>
                      <strong className="text-amber-700 text-lg font-mono">{selectedSubmission.yellowPercent}%</strong>
                      <span className="text-[10px] text-slate-500 block">CIELAB yellow channel</span>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-slate-400 block text-[10px]">Model Confidence</span>
                      <strong className="text-emerald-700 text-lg font-mono">{selectedSubmission.confidencePercent}%</strong>
                      <span className="text-[10px] text-slate-500 block">{selectedSubmission.condition}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Self-Reported Symptoms */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-2">
                      Patient Self-Reported Symptoms:
                    </span>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-700 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Reported Pain Score:</span>
                        <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded">
                          {selectedSubmission.painScale ?? 2} / 10
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px] mb-0.5">Patient Observation Note:</span>
                        <p className="italic text-slate-800 font-medium">"{selectedSubmission.patientSymptoms}"</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 flex justify-between">
                    <span>Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}</span>
                    <span>File: {selectedSubmission.imageName}</span>
                  </div>
                </div>

              </div>

              {/* Doctor Review & Prescription Form */}
              <form onSubmit={handleSaveReview} className="bg-blue-50/50 p-5 rounded-xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-700" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Doctor Clinical Assessment &amp; Smart Nanofiber Prescription
                    </h4>
                  </div>
                  <span className="text-xs text-blue-800 font-medium">
                    Attending: {DEFAULT_DOCTOR.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Healing Status */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Clinical Healing Trajectory
                    </label>
                    <select
                      value={healingStatus}
                      onChange={(e) => setHealingStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                    >
                      <option value="Improving">🟢 Improving (Area contracting, healthy granulation)</option>
                      <option value="Stable / Stagnant">🟡 Stable / Stagnant (No significant progression)</option>
                      <option value="Critical / Deteriorating">🔴 Critical / Deteriorating (Increased slough/exudate)</option>
                      <option value="Healed">✅ Healed (Epithelial bridging complete)</option>
                    </select>
                  </div>

                  {/* Infection Risk */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Infection Risk Assessment
                    </label>
                    <select
                      value={infectionRisk}
                      onChange={(e) => setInfectionRisk(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                    >
                      <option value="Low">Low Risk (Clean wound bed, minimal exudate)</option>
                      <option value="Moderate">Moderate Risk (Mild erythema, watch for signs)</option>
                      <option value="High">High Risk (Dense slough, antimicrobial dressing required)</option>
                      <option value="Critical">Critical (Immediate in-clinic evaluation needed)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nanofiber Dressing Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Prescribed Smart Nanofiber Dressing
                    </label>
                    <select
                      value={dressingPrescription}
                      onChange={(e) => setDressingPrescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                    >
                      <option value="Silk-Fibroin-Silver Nanofiber Film (Antimicrobial AgNP Matrix)">
                        Silk-AgNP Matrix (Broad spectrum antimicrobial protection)
                      </option>
                      <option value="Chitosan-PCL Electrospun Membrane (High Exudate Absorption)">
                        Chitosan-PCL Film (High moisture absorption &amp; slough control)
                      </option>
                      <option value="PVA-Alginate-Curcumin Film (Anti-inflammatory & Antioxidant)">
                        PVA-Curcumin Film (Anti-inflammatory &amp; tissue remodeling)
                      </option>
                      <option value="Electrospun Collagen-Zinc Matrix (Granulation Stimulator)">
                        Collagen-Zinc Matrix (Granulation bed enhancement)
                      </option>
                      <option value="Standard Hydrocolloid Occlusive Dressing">
                        Standard Hydrocolloid Barrier Dressing
                      </option>
                    </select>
                  </div>

                  {/* Dressing Change Interval */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Recommended Dressing Change Frequency
                    </label>
                    <select
                      value={dressingChangeInterval}
                      onChange={(e) => setDressingChangeInterval(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 shadow-2xs"
                    >
                      <option value="Daily">Daily (24 Hours - For heavy exudate)</option>
                      <option value="Every 2 Days">Every 2 Days (48 Hours)</option>
                      <option value="Every 3 Days">Every 3 Days (72 Hours - Standard nanofiber)</option>
                      <option value="Every 5 Days">Every 5 Days (Remodeling stage)</option>
                      <option value="Weekly">Weekly (7 Days)</option>
                    </select>
                  </div>
                </div>

                {/* Doctor Clinical Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Physician Clinical Notes &amp; Bed Analysis:
                  </label>
                  <textarea
                    rows={2}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Enter diagnostic notes regarding tissue viability, margins, and vascularity..."
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                {/* Wound Care Instructions for Patient */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wound Care &amp; Hygiene Instructions for Patient:
                  </label>
                  <input
                    type="text"
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="e.g. Irrigate gently with sterile saline before applying new nanofiber film. Keep limb elevated."
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-2xs"
                  />
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {selectedSubmission.doctorReview ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteSubmission(selectedSubmission.id, true)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
                      title="Permanently remove this completed review and patient record"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      <span>Delete Completed Review &amp; Case</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDeleteSubmission(selectedSubmission.id, false)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Record</span>
                    </button>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(null)}
                      className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
                    >
                      Close
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? 'Dispatching Review...' : 'Send Review & Prescription to Patient'}</span>
                    </button>
                  </div>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

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
};
