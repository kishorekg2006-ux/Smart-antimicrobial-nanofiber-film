import React from 'react';
import { Sliders, RotateCcw, Check, Sparkles, AlertCircle, Info } from 'lucide-react';
import { WoundThresholds, DEFAULT_THRESHOLDS } from '../types';

interface ThresholdStudioProps {
  thresholds: WoundThresholds;
  onChangeThresholds: (updated: WoundThresholds) => void;
  onResetDefaults: () => void;
  onReAnalyze: () => void;
}

export const ThresholdStudio: React.FC<ThresholdStudioProps> = ({
  thresholds,
  onChangeThresholds,
  onResetDefaults,
  onReAnalyze,
}) => {
  const updateField = (key: keyof WoundThresholds, value: number) => {
    onChangeThresholds({
      ...thresholds,
      [key]: value,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Python Algorithm Filter &amp; Threshold Tuning Studio
            </h3>
            <p className="text-xs text-slate-500">
              Directly calibrate RGB excess-red ratios, CIELAB color planes, and morphological parameters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={onReAnalyze}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply &amp; Re-Analyze</span>
          </button>
        </div>
      </div>

      {/* Threshold Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Group 1: Red Granulation & Local Contrast */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Red / Granulation Filters
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Excess-Red Ratio</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">Red Ratio Min (red_ratio)</span>
              <span className="font-mono text-blue-600 font-bold">{thresholds.redRatioMin.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.005"
              max="0.08"
              step="0.001"
              value={thresholds.redRatioMin}
              onChange={(e) => updateField('redRatioMin', parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Formula: (r - (g+b)*0.5) / total_rgb &gt; {thresholds.redRatioMin}</p>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">Local Red Delta (local_red)</span>
              <span className="font-mono text-blue-600 font-bold">{thresholds.localRedMin.toFixed(4)}</span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.02"
              step="0.0005"
              value={thresholds.localRedMin}
              onChange={(e) => updateField('localRedMin', parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Subtracts Gaussian blurred skin background</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">Min Sat (S)</span>
                <span className="font-mono text-blue-600 font-bold">{thresholds.minSaturationRed}</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={thresholds.minSaturationRed}
                onChange={(e) => updateField('minSaturationRed', parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-700">Min Val (V)</span>
                <span className="font-mono text-blue-600 font-bold">{thresholds.minValueRed}</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="1"
                value={thresholds.minValueRed}
                onChange={(e) => updateField('minValueRed', parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Group 2: Yellow / Slough Tissue */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Yellow / Slough Tissue
            </span>
            <span className="text-[10px] text-slate-500 font-mono">CIELAB A/B/L</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">Slough A* Min (sloughAMin)</span>
              <span className="font-mono text-amber-700 font-bold">{thresholds.sloughAMin}</span>
            </div>
            <input
              type="range"
              min="100"
              max="150"
              step="1"
              value={thresholds.sloughAMin}
              onChange={(e) => updateField('sloughAMin', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">Slough B* Min (sloughBMin)</span>
              <span className="font-mono text-amber-700 font-bold">{thresholds.sloughBMin}</span>
            </div>
            <input
              type="range"
              min="110"
              max="160"
              step="1"
              value={thresholds.sloughBMin}
              onChange={(e) => updateField('sloughBMin', parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">Local B* Delta Min</span>
              <span className="font-mono text-amber-700 font-bold">{thresholds.sloughLocalBMin.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={thresholds.sloughLocalBMin}
              onChange={(e) => updateField('sloughLocalBMin', parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Group 3: Pink Epithelium, Dark Scabs, & Area limits */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <span className="text-xs font-semibold text-pink-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              Pink Epithelial &amp; Dark Scabs
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Morphology &amp; Limits</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">Pink A* Min (pinkAMin)</span>
              <span className="font-mono text-pink-700 font-bold">{thresholds.pinkAMin}</span>
            </div>
            <input
              type="range"
              min="120"
              max="160"
              step="1"
              value={thresholds.pinkAMin}
              onChange={(e) => updateField('pinkAMin', parseInt(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">Dark Scab Local L* Delta</span>
              <span className="font-mono text-slate-800 font-bold">{thresholds.darkLocalLMax}</span>
            </div>
            <input
              type="range"
              min="-30"
              max="-5"
              step="1"
              value={thresholds.darkLocalLMax}
              onChange={(e) => updateField('darkLocalLMax', parseInt(e.target.value))}
              className="w-full accent-slate-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-medium">
              <span className="text-slate-700">Max Component Area Ratio</span>
              <span className="font-mono text-blue-600 font-bold">{(thresholds.maxAreaRatio * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.30"
              step="0.01"
              value={thresholds.maxAreaRatio}
              onChange={(e) => updateField('maxAreaRatio', parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 mt-0.5">Rejects large false-positive body background</p>
          </div>
        </div>

      </div>

    </div>
  );
};
