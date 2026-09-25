import { PatientUser, DoctorUser, DoctorReview, WoundUpdateSubmission } from '../types';
import { SAMPLE_WOUND_SERIES } from '../data/sampleWounds';

const STORAGE_KEY_PATIENTS = 'skm_telemed_patients_v1';
const STORAGE_KEY_SUBMISSIONS = 'skm_telemed_submissions_v1';
const STORAGE_KEY_ACTIVE_PATIENT = 'skm_telemed_active_patient_v1';
const STORAGE_KEY_ACTIVE_DOCTOR = 'skm_telemed_active_doctor_v1';
export const DOCTOR_PASSCODE = 'DOC2026';

export const DEFAULT_DOCTOR: DoctorUser = {
  id: 'DOC-SKM-01',
  name: 'Dr. K. S. Murugan, MS, DNB',
  licenseNumber: 'TN-MED-49201',
  specialty: 'Clinical Wound Healing & Regenerative Biomaterials',
  hospitalAffiliation: 'SKM Advanced Telemedicine Wound Care Institute',
  email: 'dr.murugan@skm-telemed.org',
};

// Procedural seed generator
function generateInitialSeeds(): { patients: PatientUser[]; submissions: WoundUpdateSubmission[] } {
  const patient1: PatientUser = {
    id: 'PT-1001',
    name: 'Robert Jenkins',
    age: 58,
    mobileNumber: '+1 555-234-8901',
    registeredAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    gender: 'Male',
    medicalNotes: 'Type 2 Diabetic with lower extremity neuropathetic lesion',
  };

  const patient2: PatientUser = {
    id: 'PT-1002',
    name: 'Anita Sharma',
    age: 46,
    mobileNumber: '+91 98401 23456',
    registeredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    gender: 'Female',
    medicalNotes: 'Venous stasis ulcer with fibrinous exudate',
  };

  const patient3: PatientUser = {
    id: 'PT-1003',
    name: 'Carlos Mendoza',
    age: 63,
    mobileNumber: '+1 555-782-4190',
    registeredAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    gender: 'Male',
    medicalNotes: 'Post-operative incision healing under nanofiber matrix',
  };

  // Generate sample images safely
  const imgDay0 = SAMPLE_WOUND_SERIES[0]?.generateImage() || '';
  const imgDay3 = SAMPLE_WOUND_SERIES[1]?.generateImage() || '';
  const imgDay7 = SAMPLE_WOUND_SERIES[2]?.generateImage() || '';
  const imgSlough = SAMPLE_WOUND_SERIES[3]?.generateImage() || '';

  const submissions: WoundUpdateSubmission[] = [
    {
      id: 'sub-pt1-d0',
      patientId: patient1.id,
      patientName: patient1.name,
      patientAge: patient1.age,
      patientMobile: patient1.mobileNumber,
      submittedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      imageName: 'Robert_Day0_Baseline.jpg',
      dayLabel: 'Day 0 (Baseline)',
      originalImage: imgDay0,
      segmentationImage: imgDay0,
      markedImage: imgDay0,
      woundAreaPercent: 3.45,
      woundPixels: 10600,
      totalPixels: 307200,
      rednessPercent: 48.2,
      yellowPercent: 8.5,
      pinkPercent: 12.0,
      darkPercent: 2.1,
      confidencePercent: 91,
      condition: 'Moderate Wound Region',
      patientSymptoms: 'Mild stinging sensation at wound edges upon cleaning. Dressing applied.',
      painScale: 5,
      status: 'Reviewed',
      doctorReview: {
        id: 'rev-pt1-d0',
        doctorName: DEFAULT_DOCTOR.name,
        doctorLicense: DEFAULT_DOCTOR.licenseNumber,
        reviewedAt: new Date(Date.now() - 7 * 86400000 + 7200000).toISOString(),
        healingStatus: 'Stable / Stagnant',
        infectionRisk: 'Moderate',
        clinicalNotes: 'Day 0 baseline confirmed. Hyper-vascular redness and peri-wound erythema noted. Wound bed shows viable granulation tissue.',
        dressingPrescription: 'Silk-Fibroin-Silver Nanofiber Film (Antimicrobial AgNP Matrix)',
        dressingChangeInterval: 'Every 3 Days',
        additionalInstructions: 'Keep dry during shower. Do not mechanically peel film; allow moisture-regulated autolytic debridement.',
      },
    },
    {
      id: 'sub-pt1-d3',
      patientId: patient1.id,
      patientName: patient1.name,
      patientAge: patient1.age,
      patientMobile: patient1.mobileNumber,
      submittedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      imageName: 'Robert_Day3_Progress.jpg',
      dayLabel: 'Day 3',
      originalImage: imgDay3,
      segmentationImage: imgDay3,
      markedImage: imgDay3,
      woundAreaPercent: 2.15,
      woundPixels: 6605,
      totalPixels: 307200,
      rednessPercent: 54.0,
      yellowPercent: 4.2,
      pinkPercent: 26.5,
      darkPercent: 1.0,
      confidencePercent: 93,
      condition: 'Small Wound Region',
      patientSymptoms: 'Much less painful today. Wound edges appear to be shrinking inward.',
      painScale: 2,
      status: 'Reviewed',
      doctorReview: {
        id: 'rev-pt1-d3',
        doctorName: DEFAULT_DOCTOR.name,
        doctorLicense: DEFAULT_DOCTOR.licenseNumber,
        reviewedAt: new Date(Date.now() - 4 * 86400000 + 5400000).toISOString(),
        healingStatus: 'Improving',
        infectionRisk: 'Low',
        clinicalNotes: 'Significant 37.6% area reduction observed over 72 hours. Slough has decreased from 8.5% to 4.2%. Nanofiber film demonstrating effective exudate control.',
        dressingPrescription: 'Silk-Fibroin-Silver Nanofiber Film',
        dressingChangeInterval: 'Every 3 Days',
        additionalInstructions: 'Reapply second layer of Silk-AgNP film as scheduled. Great progress on glycemic management.',
      },
    },
    {
      id: 'sub-pt1-d7',
      patientId: patient1.id,
      patientName: patient1.name,
      patientAge: patient1.age,
      patientMobile: patient1.mobileNumber,
      submittedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      imageName: 'Robert_Day7_Latest.jpg',
      dayLabel: 'Day 7',
      originalImage: imgDay7,
      segmentationImage: imgDay7,
      markedImage: imgDay7,
      woundAreaPercent: 1.12,
      woundPixels: 3440,
      totalPixels: 307200,
      rednessPercent: 62.4,
      yellowPercent: 1.8,
      pinkPercent: 34.0,
      darkPercent: 0.8,
      confidencePercent: 95,
      condition: 'Very Small Wound Region',
      patientSymptoms: 'No pain at all. Edge is light pink and smooth. Sent today’s photo for weekly review.',
      painScale: 0,
      status: 'Pending Review',
    },
    {
      id: 'sub-pt2-d0',
      patientId: patient2.id,
      patientName: patient2.name,
      patientAge: patient2.age,
      patientMobile: patient2.mobileNumber,
      submittedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
      imageName: 'Anita_Ulcer_Day1.jpg',
      dayLabel: 'Day 0 (Initial)',
      originalImage: imgSlough,
      segmentationImage: imgSlough,
      markedImage: imgSlough,
      woundAreaPercent: 4.18,
      woundPixels: 12840,
      totalPixels: 307200,
      rednessPercent: 22.1,
      yellowPercent: 38.5,
      pinkPercent: 8.2,
      darkPercent: 4.0,
      confidencePercent: 89,
      condition: 'Moderate Wound Region (Slough Heavy)',
      patientSymptoms: 'Dull aching pain around ankle, especially in evenings. Yellow fluid soaking bandage.',
      painScale: 6,
      status: 'Urgent Attention',
    },
  ];

  return {
    patients: [patient1, patient2, patient3],
    submissions,
  };
}

class TelemedicineService {
  private notifyListeners() {
    window.dispatchEvent(new CustomEvent('skm_telemed_update'));
  }

  // Patients Management
  getPatients(): PatientUser[] {
    const raw = localStorage.getItem(STORAGE_KEY_PATIENTS);
    if (!raw) {
      const { patients, submissions } = generateInitialSeeds();
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
      return patients;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  getPatientById(id: string): PatientUser | undefined {
    return this.getPatients().find(p => p.id === id);
  }

  loginOrRegisterPatient(name: string, age: number, mobileNumber: string): PatientUser {
    const trimmedName = name.trim();
    const trimmedMobile = mobileNumber.trim();
    const patients = this.getPatients();

    // Check if matching patient exists
    let patient = patients.find(
      p => p.mobileNumber.replace(/\D/g, '') === trimmedMobile.replace(/\D/g, '') ||
           p.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (!patient) {
      const nextId = `PT-${1000 + patients.length + 1}`;
      patient = {
        id: nextId,
        name: trimmedName,
        age: Number(age) || 30,
        mobileNumber: trimmedMobile,
        registeredAt: new Date().toISOString(),
      };
      patients.push(patient);
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    } else {
      // Update age/mobile if provided
      patient.age = Number(age) || patient.age;
      patient.mobileNumber = trimmedMobile || patient.mobileNumber;
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    }

    this.setCurrentPatient(patient);
    this.notifyListeners();
    return patient;
  }

  getCurrentPatient(): PatientUser | null {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_PATIENT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentPatient(patient: PatientUser | null) {
    if (patient) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PATIENT, JSON.stringify(patient));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_PATIENT);
    }
    this.notifyListeners();
  }

  // Doctor Management
  loginDoctor(passcode: string): boolean {
    if (passcode.trim() === DOCTOR_PASSCODE) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_DOCTOR, JSON.stringify(DEFAULT_DOCTOR));
      this.notifyListeners();
      return true;
    }
    return false;
  }

  getCurrentDoctor(): DoctorUser | null {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_DOCTOR);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  setCurrentDoctor(doctor: DoctorUser | null) {
    if (doctor) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_DOCTOR, JSON.stringify(doctor));
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_DOCTOR);
    }
    this.notifyListeners();
  }

  logoutDoctor() {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_DOCTOR);
    this.notifyListeners();
  }

  logoutPatient() {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_PATIENT);
    this.notifyListeners();
  }

  // Submissions Management
  getSubmissions(): WoundUpdateSubmission[] {
    const raw = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
    if (!raw) {
      const { submissions } = generateInitialSeeds();
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
      return submissions;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  getSubmissionsForPatient(patientId: string): WoundUpdateSubmission[] {
    return this.getSubmissions()
      .filter(s => s.patientId === patientId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  submitWoundUpdate(data: {
    patient: PatientUser;
    imageName: string;
    dayLabel?: string;
    originalImage: string;
    segmentationImage: string;
    markedImage: string;
    woundAreaPercent: number;
    woundPixels: number;
    totalPixels: number;
    rednessPercent: number;
    yellowPercent: number;
    pinkPercent?: number;
    darkPercent?: number;
    confidencePercent: number;
    condition: string;
    patientSymptoms?: string;
    painScale?: number;
  }): WoundUpdateSubmission {
    const submissions = this.getSubmissions();
    const newSubmission: WoundUpdateSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      patientId: data.patient.id,
      patientName: data.patient.name,
      patientAge: data.patient.age,
      patientMobile: data.patient.mobileNumber,
      submittedAt: new Date().toISOString(),
      imageName: data.imageName || `Wound_Scan_${new Date().toLocaleDateString().replace(/\//g, '-')}.jpg`,
      dayLabel: data.dayLabel || 'Follow-up Update',
      originalImage: data.originalImage,
      segmentationImage: data.segmentationImage,
      markedImage: data.markedImage,
      woundAreaPercent: data.woundAreaPercent,
      woundPixels: data.woundPixels,
      totalPixels: data.totalPixels,
      rednessPercent: data.rednessPercent,
      yellowPercent: data.yellowPercent,
      pinkPercent: data.pinkPercent,
      darkPercent: data.darkPercent,
      confidencePercent: data.confidencePercent,
      condition: data.condition,
      patientSymptoms: data.patientSymptoms || 'Wound status update submitted for physician evaluation.',
      painScale: data.painScale ?? 2,
      status: (data.yellowPercent > 25 || data.woundAreaPercent > 4.0) ? 'Urgent Attention' : 'Pending Review',
    };

    submissions.unshift(newSubmission);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    this.notifyListeners();
    return newSubmission;
  }

  saveDoctorReview(
    submissionId: string,
    reviewData: {
      doctorName: string;
      doctorLicense: string;
      healingStatus: 'Improving' | 'Stable / Stagnant' | 'Critical / Deteriorating' | 'Healed';
      infectionRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
      clinicalNotes: string;
      dressingPrescription: string;
      dressingChangeInterval: string;
      additionalInstructions: string;
    }
  ): WoundUpdateSubmission | null {
    const submissions = this.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1) return null;

    const review: DoctorReview = {
      id: `rev-${Date.now()}`,
      doctorName: reviewData.doctorName,
      doctorLicense: reviewData.doctorLicense,
      reviewedAt: new Date().toISOString(),
      healingStatus: reviewData.healingStatus,
      infectionRisk: reviewData.infectionRisk,
      clinicalNotes: reviewData.clinicalNotes,
      dressingPrescription: reviewData.dressingPrescription,
      dressingChangeInterval: reviewData.dressingChangeInterval,
      additionalInstructions: reviewData.additionalInstructions,
    };

    submissions[index] = {
      ...submissions[index],
      status: 'Reviewed',
      doctorReview: review,
    };

    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    this.notifyListeners();
    return submissions[index];
  }

  deleteSubmission(submissionId: string) {
    let submissions = this.getSubmissions();
    submissions = submissions.filter(s => s.id !== submissionId);
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    this.notifyListeners();
  }

  deleteMultipleSubmissions(submissionIds: string[]) {
    const idSet = new Set(submissionIds);
    let submissions = this.getSubmissions();
    submissions = submissions.filter(s => !idSet.has(s.id));
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    this.notifyListeners();
  }

  resetDemoData() {
    localStorage.removeItem(STORAGE_KEY_PATIENTS);
    localStorage.removeItem(STORAGE_KEY_SUBMISSIONS);
    const { patients, submissions } = generateInitialSeeds();
    localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    this.notifyListeners();
  }
}

export const telemedicineService = new TelemedicineService();
