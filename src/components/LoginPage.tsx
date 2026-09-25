import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Phone, 
  Calendar, 
  Stethoscope, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  HeartPulse,
  FileCheck
} from 'lucide-react';
import { DOCTOR_PASSCODE, telemedicineService } from '../services/telemedicineService';
import { PatientUser } from '../types';

interface LoginPageProps {
  onPatientLogin: (patient: PatientUser) => void;
  onDoctorLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onPatientLogin, onDoctorLogin }) => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');

  // Patient form states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [mobile, setMobile] = useState('');
  const [patientError, setPatientError] = useState('');

  // Doctor form states
  const [passcode, setPasscode] = useState('');
  const [doctorError, setDoctorError] = useState('');

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setPatientError('Please enter your full name');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
      setPatientError('Please enter a valid age between 1 and 125');
      return;
    }
    const cleanMobile = mobile.replace(/[^0-9+]/g, '');
    if (!cleanMobile || cleanMobile.length < 7) {
      setPatientError('Please enter a valid mobile number (min 7 digits)');
      return;
    }

    setPatientError('');
    const patient = telemedicineService.loginOrRegisterPatient(name.trim(), ageNum, mobile.trim());
    onPatientLogin(patient);
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DOCTOR_PASSCODE) {
      setDoctorError('');
      telemedicineService.loginDoctor(passcode);
      onDoctorLogin();
    } else {
      setDoctorError(`Invalid Doctor Passcode. (Clinical Demo Passcode is: ${DOCTOR_PASSCODE})`);
    }
  };

  const fillDemoPatient = (pName: string, pAge: number, pMobile: string) => {
    setName(pName);
    setAge(pAge.toString());
    setMobile(pMobile);
    setPatientError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between antialiased">
      
      {/* Top Banner */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                Telemedicine Clinical Portal
              </span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Image-Based Wound Monitoring &amp; Color-Contrast Tissue Segmentation Platform by SKM
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Secure Telehealth Gateway</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          
          {/* Header Title Section */}
          <div className="p-6 pb-5 border-b border-slate-100 text-center bg-gradient-to-b from-blue-50/50 to-transparent">
            <div className="inline-flex p-3 rounded-xl bg-blue-100 text-blue-700 mb-3 shadow-2xs">
              {activeTab === 'patient' ? (
                <HeartPulse className="w-6 h-6 text-blue-600" />
              ) : (
                <Stethoscope className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {activeTab === 'patient' ? 'Patient Telemedicine Portal' : 'Licensed Doctor Portal'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === 'patient'
                ? 'Sign in with your patient details to scan and submit wound updates to your physician'
                : 'Restricted to authorized physicians & wound care specialists'}
            </p>
          </div>

          {/* Role Navigation Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('patient')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'patient'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Login</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('doctor')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'doctor'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Portal</span>
            </button>
          </div>

          {/* Patient Form */}
          {activeTab === 'patient' ? (
            <div className="p-6 space-y-4">
              {patientError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{patientError}</span>
                </div>
              )}

              <form onSubmit={handlePatientSubmit} className="space-y-4">
                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Patient Full Name</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Robert Jenkins"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Age */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Age (Years)</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="125"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 58"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Mobile Number</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="e.g. +1 555-234-8901"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-all cursor-pointer active:scale-98 mt-2"
                >
                  <span>Enter Patient Wound Monitoring Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Fast Demo Autofill Helper */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wide">
                  Quick Demo Pre-Fill:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoPatient('Robert Jenkins', 58, '+1 555-234-8901')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
                  >
                    👤 Robert Jenkins (58y)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoPatient('Anita Sharma', 46, '+91 98401 23456')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors cursor-pointer"
                  >
                    👤 Anita Sharma (46y)
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Doctor Form */
            <div className="p-6 space-y-4">
              
              {/* Doctor Security Callout */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Clinical Access Protection</span>
                </div>
                <p className="text-amber-800">
                  Doctor dashboard is strictly restricted to licensed clinical staff. Patient wound scans and longitudinal updates are synchronized here.
                </p>
                <p className="text-[11px] text-amber-900 font-mono font-bold pt-1">
                  Default Demo Clinical PIN: <span className="underline">{DOCTOR_PASSCODE}</span>
                </p>
              </div>

              {doctorError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{doctorError}</span>
                </div>
              )}

              <form onSubmit={handleDoctorSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Attending Physician Profile
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-0.5">
                    <span className="font-bold text-slate-900 block text-sm">Dr. K. S. Murugan, MS, DNB</span>
                    <span className="text-slate-500 block">Lic: TN-MED-49201 • Wound Care &amp; Biomaterials</span>
                    <span className="text-blue-700 font-medium block">SKM Advanced Telemedicine Center</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Doctor Security Passcode / PIN</span>
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Doctor PIN (e.g. DOC2026)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Open Doctor Telemedicine Dashboard</span>
                </button>
              </form>

              <button
                type="button"
                onClick={() => setPasscode(DOCTOR_PASSCODE)}
                className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium py-1 transition-colors cursor-pointer"
              >
                Autofill Demo PIN ({DOCTOR_PASSCODE})
              </button>

            </div>
          )}

          {/* Footer Info */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>CIELAB &amp; Red-Ratio CV Engine</span>
            </span>
            <span className="font-mono text-slate-400">v2.4 Telemed</span>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-700">
            Image-Based Wound Monitoring &amp; Color-Contrast Tissue Segmentation Platform by SKM
          </span>
          <span className="text-slate-400">
            Connected Telemedicine Wound Care &amp; Smart Nanofiber Dressing System
          </span>
        </div>
      </footer>

    </div>
  );
};
