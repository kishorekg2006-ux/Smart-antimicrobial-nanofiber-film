export interface WoundThresholds {
  redRatioMin: number;      // Default: 0.018
  localRedMin: number;      // Default: 0.004
  minSaturationRed: number; // Default: 20
  minValueRed: number;       // Default: 35
  
  pinkAMin: number;         // Default: 132
  pinkLocalAMin: number;    // Default: 2.0
  pinkSatMin: number;       // Default: 18
  
  sloughAMin: number;       // Default: 118
  sloughBMin: number;       // Default: 125
  sloughLocalBMin: number;  // Default: 1.5
  sloughLocalLMax: number;  // Default: 18
  sloughSatMin: number;     // Default: 20
  
  darkLocalLMax: number;    // Default: -14
  darkValueMax: number;     // Default: 215
  darkSatMax: number;       // Default: 150

  maxAreaRatio: number;     // Default: 0.06 (6%)
  minAreaPixels: number;    // Default: 18
  gaussianSigmaRed: number; // Default: 9
  gaussianSigmaLab: number; // Default: 11
}

export const DEFAULT_THRESHOLDS: WoundThresholds = {
  redRatioMin: 0.018,
  localRedMin: 0.004,
  minSaturationRed: 20,
  minValueRed: 35,
  pinkAMin: 132,
  pinkLocalAMin: 2.0,
  pinkSatMin: 18,
  sloughAMin: 118,
  sloughBMin: 125,
  sloughLocalBMin: 1.5,
  sloughLocalLMax: 18,
  sloughSatMin: 20,
  darkLocalLMax: -14,
  darkValueMax: 215,
  darkSatMax: 150,
  maxAreaRatio: 0.06,
  minAreaPixels: 18,
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
