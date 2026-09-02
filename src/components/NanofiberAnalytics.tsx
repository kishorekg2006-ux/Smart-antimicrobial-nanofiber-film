import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FlaskConical, 
  Sparkles, 
  Droplets, 
  Layers, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { WoundAnalysisResult } from '../types';

interface NanofiberAnalyticsProps {
  result: WoundAnalysisResult | null;
}

export const NanofiberAnalytics: React.FC<NanofiberAnalyticsProps> = ({ result }) => {
  const [selectedFilm, setSelectedFilm] = useState<'silk_silver' | 'chitosan_pcl' | 'pva_curcumin'>('silk_silver');

  const woundArea = result ? result.wound_area : 2.5;
  const yellowSlough = result ? result.yellow : 10;
  const redness = result ? result.redness : 45;

  // Compute smart nanofiber dressing metrics
  const isHighExudate = yellowSlough > 25 || woundArea > 5.0;
  const isHighInflammation = redness > 50;

  // Film profiles
  const filmProfiles = {
    silk_silver: {
      name: 'Silk-Fibroin / Silver Nanoparticle (AgNP) Nanofiber Film',
      description: 'Electrospun biomimetic matrix embedded with stabilized ionic silver. Delivers broad-spectrum antibacterial efficacy against S. aureus and P. aeruginosa with 72-hr sustained release.',
      antimicrobialScore: 96,
      moistureRegulation: 'High Breathability (WVTR: 2100 g/m²/24h)',
      changeFrequency: isHighExudate ? 'Every 48 Hours' : 'Every 72-96 Hours',
      suitableFor: 'Partial to full-thickness wounds, surgical incisions, and infected lesions.',
      drugReleaseDuration: '72 - 96 Hours (Zero-order kinetics)',
    },
    chitosan_pcl: {
      name: 'Chitosan-Polycaprolactone (PCL) Hemostatic Nanofiber',
      description: 'Polycationic nanofiber mesh accelerating platelet aggregation while intrinsic polyglucosamine chains disrupt bacterial cell membrane potentials.',
      antimicrobialScore: 88,
      moistureRegulation: 'Optimal Hydrophilic Absorption',
      changeFrequency: 'Every 48 Hours',
      suitableFor: 'High exudate ulcers, slough-covered wound beds, and bleeding lacerations.',
      drugReleaseDuration: '48 - 72 Hours',
    },
    pva_curcumin: {
      name: 'Curcumin / PVA-Alginate Anti-inflammatory Nanofiber Film',
      description: 'Nanostructured antioxidant bioactive film suppressing localized ROS (reactive oxygen species) and downregulating inflammatory cytokines.',
      antimicrobialScore: 84,
      moistureRegulation: 'Hydrogel forming upon exudate contact',
      changeFrequency: 'Every 72 Hours',
      suitableFor: 'Chronic inflammatory ulcers, diabetic lesions, and erythematous burns.',
      drugReleaseDuration: '72 Hours',
    }
  };

  const activeProfile = filmProfiles[selectedFilm];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Smart Antimicrobial Nanofiber Film Bio-analytics
            </h3>
            <p className="text-xs text-slate-500">
              Electrospun matrix degradation, drug release kinetics, and microenvironment moisture control
            </p>
          </div>
        </div>

        {/* Film Type Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setSelectedFilm('silk_silver')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              selectedFilm === 'silk_silver'
                ? 'bg-white text-blue-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Silk-AgNP
          </button>
          <button
            onClick={() => setSelectedFilm('chitosan_pcl')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              selectedFilm === 'chitosan_pcl'
                ? 'bg-white text-blue-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chitosan-PCL
          </button>
          <button
            onClick={() => setSelectedFilm('pva_curcumin')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
              selectedFilm === 'pva_curcumin'
                ? 'bg-white text-blue-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PVA-Curcumin
          </button>
        </div>
      </div>

      {/* Selected Nanofiber Film Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">
              {activeProfile.name}
            </h4>
            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
              Electrospun Matrix
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {activeProfile.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block font-medium">Target Clinical Indication:</span>
              <span className="text-xs text-slate-800 font-semibold mt-0.5 block">{activeProfile.suitableFor}</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-500 block font-medium">Recommended Film Change Interval:</span>
              <span className="text-xs text-emerald-700 font-semibold mt-0.5 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {activeProfile.changeFrequency}
              </span>
            </div>
          </div>
        </div>

        {/* Efficacy & Kinetic Badges */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">Bacterial Biofilm Inhibition</span>
              <span className="text-emerald-700 font-mono font-bold">{activeProfile.antimicrobialScore}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${activeProfile.antimicrobialScore}%` }}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 block font-medium">Moisture Vapor Transmission:</span>
            <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
              {activeProfile.moistureRegulation}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 block font-medium">Drug Release Mechanism:</span>
            <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
              {activeProfile.drugReleaseDuration}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
