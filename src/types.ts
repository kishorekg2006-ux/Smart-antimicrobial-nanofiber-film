export interface WoundThresholds {
  redRatioMin: number;      // Default: 0.025
  localRedMin: number;      // Default: 0.010
  minSaturationRed: number; // Default: 20
  minValueRed: number;       // Default: 35
  
  pinkAMin: number;         // Default: 134
  pinkLocalAMin: number;    // Default: 3.5
  pinkSatMin: number;       // Default: 20
  
  sloughAMin: number;       // Default: 124
  sloughBMin: number;       // Default: 132
  sloughLocalBMin: number;  // Default: 3.0
  sloughLocalLMax: number;  // Default: 14
  sloughSatMin: number;     // Default: 22
  
  darkLocalLMax: number;    // Default: -16
  darkValueMax: number;     // Default: 140
  darkSatMax: number;       // Default: 140

  maxAreaRatio: number;     // Default: 0.65
  minAreaPixels: number;    // Default: 35
  gaussianSigmaRed: number; // Default: 9
  gaussianSigmaLab: number; // Default: 11
}

export const DEFAULT_THRESHOLDS: WoundThresholds = {
  redRatioMin: 0.025,
  localRedMin: 0.010,
  minSaturationRed: 20,
  minValueRed: 35,
  pinkAMin: 134,
  pinkLocalAMin: 3.5,
  pinkSatMin: 20,
  sloughAMin: 124,
  sloughBMin: 132,
  sloughLocalBMin: 3.0,
  sloughLocalLMax: 14,
  sloughSatMin: 22,
  darkLocalLMax: -16,
  darkValueMax: 140,
  darkSatMax: 140,
  maxAreaRatio: 0.65,
  minAreaPixels: 35,
  gaussianSigmaRed: 9,
  gaussianSigmaLab: 11,
};

export interface ROI {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WoundAnalysisResult {
  wound_area: number;        // Percentage of total image (e.g. 2.45%)
  wound_pixels: number;      // Count of wound pixels
  total_pixels: number;      // Total pixels analyzed
  redness: number;           // % of wound that is red granulation/erythema
  yellow: number;            // % of wound that is slough/exudate
  pink_tissue?: number;      // % of epithelialization/pink tissue
  dark_tissue?: number;      // % of necrotic/scab tissue
  confidence: number;        // Confidence score 0 - 100%
  condition: string;         // E.g. "Small Wound Region"
  original: string;          // Base64 Data URL
  segmentation: string;      // Base64 Data URL (black background + wound pixels)
  marked: string;            // Base64 Data URL (image with green contour + blue box)
  boundingBox?: BoundingBox | null;
  contourPoints?: Array<{x: number; y: number}>;
  analyzedAt: string;
}

export interface WoundImageItem {
  id: string;
  name: string;
  src: string;
  timestamp?: number;
  dayLabel?: string;
  result?: WoundAnalysisResult | null;
  roi?: ROI | null;
  isBaseline?: boolean;
}

export interface BaselineInfo {
  name: string;
  area: number;
  imageId?: string;
  analyzedAt?: string;
}

export interface NanofiberFilmProfile {
  filmType: 'Chitosan-PCL' | 'Silk-Fibroin-Silver' | 'PVA-Alginate-Curcumin' | 'Electrospun-Collagen-Zinc';
  antimicrobialAgent: string;
  releaseDurationHours: number;
  exudateAbsorptionCapacity: string;
  recommendedChangeFrequencyDays: number;
  barrierIntegrity: string;
}

export interface AIClinicalAssessment {
  woundStage: string;
  tissueEtiology: string;
  infectionRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  biofilmProbability: string;
  nanofiberRecommendation: string;
  healingTrajectory: string;
  clinicalActionItems: string[];
}

// Telemedicine Data Models
export interface PatientUser {
  id: string;
  name: string;
  age: number;
  mobileNumber: string;
  registeredAt: string;
  gender?: string;
  medicalNotes?: string;
}

export interface DoctorUser {
  id: string;
  name: string;
  licenseNumber: string;
  specialty: string;
  hospitalAffiliation?: string;
  email?: string;
}

export interface DoctorReview {
  id: string;
  doctorName: string;
  doctorLicense: string;
  reviewedAt: string;
  healingStatus: 'Improving' | 'Stable / Stagnant' | 'Critical / Deteriorating' | 'Healed';
  infectionRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  clinicalNotes: string;
  dressingPrescription: string;
  dressingChangeInterval: string;
  additionalInstructions: string;
}

export interface WoundUpdateSubmission {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientMobile: string;
  submittedAt: string;
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
  painScale?: number; // 0 - 10
  status: 'Pending Review' | 'Reviewed' | 'Urgent Attention';
  doctorReview?: DoctorReview;
}

