import React from 'react';
import { FlaskConical, X, ArrowRight, Sparkles, Check } from 'lucide-react';
import { SAMPLE_WOUND_SERIES, SampleWoundPreset } from '../data/sampleWounds';
import { WoundImageItem } from '../types';

interface SampleCasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSeries: (items: WoundImageItem[]) => void;
  onLoadSingle: (preset: SampleWoundPreset) => void;
}

export const SampleCasesModal: React.FC<SampleCasesModalProps> = ({
  isOpen,
  onClose,
  onLoadSeries,
  onLoadSingle,
}) => {
  if (!isOpen) return null;

  const handleLoadFullSeries = () => {
    const items: WoundImageItem[] = SAMPLE_WOUND_SERIES.map((preset, index) => ({
      id: preset.id,
      name: `${preset.id}.jpg`,
      src: preset.generateImage(),
      dayLabel: preset.dayLabel,
      isBaseline: index === 0,
    }));
    onLoadSeries(items);
    onClose();
  };

  const handleSelectOne = (preset: SampleWoundPreset) => {
    onLoadSingle(preset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900">
                Pre-Loaded Clinical Wound Datasets
              </h3>
              <p className="text-xs text-slate-500">
                Test the computer vision color contrast filters on standardized lesion cases
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

        {/* Load Complete Longitudinal Series Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide block">
              ⭐ Recommended Benchmark Dataset
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">
              Load Complete Longitudinal Series (Case A: Day 0 → Day 3 → Day 7)
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Loads multi-day images with auto-configured baseline for instant healing velocity graphing.
            </p>
          </div>
          <button
            onClick={handleLoadFullSeries}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-95 whitespace-nowrap self-stretch sm:self-auto text-center cursor-pointer"
          >
            Load Full 5-Image Dataset
          </button>
        </div>

        {/* Individual Presets Grid */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {SAMPLE_WOUND_SERIES.map((preset) => (
            <div
              key={preset.id}
              className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[10px] font-mono bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded">
                    {preset.dayLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <button
                onClick={() => handleSelectOne(preset)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 text-slate-700 text-xs font-semibold transition-all shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
              >
                <span>Select Case</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
