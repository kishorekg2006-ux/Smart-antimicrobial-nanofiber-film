import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { TrendingDown, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { WoundImageItem, BaselineInfo } from '../types';

interface HealingTimelineChartProps {
  images: WoundImageItem[];
  baseline: BaselineInfo | null;
}

export const HealingTimelineChart: React.FC<HealingTimelineChartProps> = ({ images, baseline }) => {
  // Extract analyzed points
  const data = images
    .map((img, idx) => {
      if (!img.result) return null;
      const area = img.result.wound_area;
      const redness = img.result.redness;
      const yellow = img.result.yellow;
      const healing = baseline && baseline.area > 0
        ? Math.max(0, Math.min(100, ((baseline.area - area) / baseline.area) * 100))
        : 0;

      return {
        name: img.dayLabel || `Img ${idx + 1}`,
        fileName: img.name,
        woundArea: area,
        redness: redness,
        yellow: yellow,
        healingProgress: Number(healing.toFixed(1)),
        isBaseline: img.isBaseline,
      };
    })
    .filter(Boolean);

  if (data.length < 2) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Wound Area Contraction &amp; Healing Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Quantitative surface area regression and tissue dynamics across longitudinal images
            </p>
          </div>
        </div>

        {baseline && (
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg self-start sm:self-auto">
            Baseline Day 0: {baseline.area}% Area
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorHealing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '0.5rem',
                color: '#0f172a',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Area
              type="monotone"
              dataKey="woundArea"
              name="Wound Area Coverage (%)"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorArea)"
            />
            <Area
              type="monotone"
              dataKey="healingProgress"
              name="Healing Progress vs Baseline (%)"
              stroke="#059669"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHealing)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
