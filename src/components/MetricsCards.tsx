import React from 'react';
import { 
  Percent, 
  Flame, 
  SunMedium, 
  ShieldAlert, 
  Activity,
  Layers,
  HeartPulse,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import { WoundAnalysisResult, BaselineInfo } from '../types';

interface MetricsCardsProps {
  result: WoundAnalysisResult | null;
  baseline: BaselineInfo | null;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ result, baseline }) => {
  const woundArea = result ? `${result.wound_area} %` : '--';
  const redness = result ? `${result.redness} %` : '--';
  const yellow = result ? `${result.yellow} %` : '--';
  const confidence = result ? `${result.confidence} %` : '--';
  const condition = result ? result.condition : '--';

  // Calculate healing progress vs baseline
  let healingText = '--';
  let healingValue = 0;
  if (baseline && result) {
    if (baseline.area <= 0) {
      healingText = 'N/A';
    } else {
      healingValue = Math.max(0, Math.min(100, ((baseline.area - result.wound_area) / baseline.area) * 100));
      healingText = `${healingValue.toFixed(1)} %`;
    }
  }

  // Determine condition color badge
  const getConditionColor = (cond: string) => {
    if (cond.includes('No Wound Detected')) return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
    if (cond.includes('Very Small')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (cond.includes('Small')) return 'bg-teal-50 text-teal-700 border-teal-200';
    if (cond.includes('Moderate')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (cond.includes('Large')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-4">
      
      {/* 4 Core Primary Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Wound Area */}
        <div className="result bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Wound Area</span>
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <strong id="area" className="text-2xl md:text-3xl font-bold text-slate-900 font-mono tracking-tight block">
              {woundArea}
            </strong>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              {result ? `${result.wound_pixels.toLocaleString()} / ${result.total_pixels.toLocaleString()} px` : 'Total surface coverage'}
            </p>
          </div>
        </div>

        {/* Metric 2: Redness (Granulation / Erythema) */}
        <div className="result bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Redness (Granulation)</span>
            <div className="p-1.5 rounded-md bg-rose-50 text-rose-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <strong id="redness" className="text-2xl md:text-3xl font-bold text-rose-600 font-mono tracking-tight block">
              {redness}
            </strong>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Excess-red ratio &gt; 0.022
            </p>
          </div>
        </div>

        {/* Metric 3: Yellow Region (Slough / Exudate) */}
        <div className="result bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Yellow Region (Slough)</span>
            <div className="p-1.5 rounded-md bg-amber-50 text-amber-600">
              <SunMedium className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <strong id="yellow" className="text-2xl md:text-3xl font-bold text-amber-600 font-mono tracking-tight block">
              {yellow}
            </strong>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              CIELAB (A &gt; 122 &amp; B &gt; 128)
            </p>
          </div>
        </div>

        {/* Metric 4: Detection Confidence */}
        <div className="result bg-white border border-slate-200 rounded-xl p-4 md:p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Detection Confidence</span>
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <strong id="confidence" className="text-2xl md:text-3xl font-bold text-emerald-600 font-mono tracking-tight block">
              {confidence}
            </strong>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Circularity &amp; aspect evaluation
            </p>
          </div>
        </div>

      </div>

      {/* Wound Classification & Baseline Tracking Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Wound Condition Classification */}
        <div className="panel bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              Wound Classification Indicator
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Clinical Size Scale</span>
          </div>

          <div className="my-3 flex items-center gap-3">
            <div className={`px-3.5 py-1.5 rounded-lg border font-bold text-base md:text-lg ${getConditionColor(condition)}`}>
              <b id="condition">{condition}</b>
            </div>
          </div>

          {/* Detailed Tissue Composition Spectrum or Intact Skin Confirmation */}
          {result && result.wound_pixels > 0 ? (
            <div className="mt-2 pt-3 border-t border-slate-100">
              <div className="text-[11px] font-medium text-slate-500 mb-1.5 flex justify-between">
                <span>Tissue Composition Breakdown</span>
                <span className="text-slate-500 font-mono">100% Total Wound Bed</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                <div 
                  className="bg-rose-500 h-full transition-all duration-500" 
                  style={{ width: `${result.redness}%` }}
                  title={`Granulation / Erythema: ${result.redness}%`}
                />
                <div 
                  className="bg-amber-400 h-full transition-all duration-500" 
                  style={{ width: `${result.yellow}%` }}
                  title={`Yellow Slough / Exudate: ${result.yellow}%`}
                />
                <div 
                  className="bg-pink-400 h-full transition-all duration-500" 
                  style={{ width: `${result.pink_tissue || 0}%` }}
                  title={`Pink Epithelium: ${result.pink_tissue || 0}%`}
                />
                <div 
                  className="bg-stone-500 h-full transition-all duration-500" 
                  style={{ width: `${result.dark_tissue || 0}%` }}
                  title={`Necrotic / Scab: ${result.dark_tissue || 0}%`}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-slate-600">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Granulation ({result.redness}%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Slough ({result.yellow}%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-400" /> Epithelium ({result.pink_tissue || 0}%)</span>
              </div>
            </div>
          ) : result && (
            <div className="mt-2 pt-3 border-t border-slate-100 text-xs text-emerald-800 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
              <span className="font-semibold block">Intact Healthy Skin Dermis</span>
              <span className="text-[11px] text-emerald-700">Computer vision segmentation confirms 0.00% active wound lesion.</span>
            </div>
          )}
        </div>

        {/* Baseline & Healing Progress Velocity */}
        <div className="panel baseline bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Baseline Healing Progress Engine
            </span>
            {baseline && (
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                Active Reference
              </span>
            )}
          </div>

          <div className="my-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Reference Baseline Image:</span>
              <div id="baselineName" className="baseline-name text-base md:text-lg font-bold text-slate-900 font-mono truncate max-w-[240px]">
                {baseline ? baseline.name : 'Not Set'}
              </div>
              {baseline && (
                <span className="text-[11px] text-slate-500">
                  Initial Area: <b className="text-slate-800 font-mono">{baseline.area}%</b>
                </span>
              )}
            </div>

            <div className="text-left sm:text-right sm:border-l sm:border-slate-100 sm:pl-4">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Estimated Healing Velocity:</span>
              <strong id="healing" className="text-2xl md:text-3xl font-bold text-emerald-600 font-mono tracking-tight block">
                {healingText}
              </strong>
            </div>
          </div>

          {/* Visual Progress Bar */}
          {baseline && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-700 rounded-full"
                  style={{ width: `${healingValue}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>0% (Day 0 Baseline)</span>
                <span>Formula: ((A₀ - Aₜ) / A₀) × 100</span>
                <span>100% (Complete Closure)</span>
              </div>
            </div>
          )}

          {!baseline && (
            <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              Upload or select Day 0 image → click <b>"Set as Baseline"</b> → navigate to subsequent day images to measure quantitative tissue contraction.
            </p>
          )}

        </div>

      </div>

    </div>
  );
};
