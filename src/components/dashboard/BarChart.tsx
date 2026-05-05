import type { BarPoint, ChartView } from './buildBars';

interface BarChartProps {
  bars: BarPoint[];
  view: ChartView;
}

export function BarChart({ bars, view }: BarChartProps) {
  const max = Math.max(...bars.map((b) => b.count), 1);
  const yTicks = [0, Math.round(max / 2), max];

  return (
    <div className="relative">
      {/* Y-axis ticks */}
      <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between pr-2 pointer-events-none">
        {[...yTicks].reverse().map((t) => (
          <span key={t} className="text-[10px] text-slate-400 leading-none">{t}</span>
        ))}
      </div>

      {/* Bars */}
      <div className="ml-6 flex items-end gap-1.5 h-32">
        {bars.map((b, i) => {
          const isLast = i === bars.length - 1;
          const heightPct = max > 0 ? (b.count / max) * 100 : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group">
              {b.count > 0 && (
                <span className="text-[9px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {b.count}
                </span>
              )}
              <div className="relative w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${Math.max(heightPct, b.count > 0 ? 6 : 1)}%`,
                    background: isLast ? '#6366F1' : '#C7D2FE',
                    minHeight: 2,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div className="ml-6 flex gap-1.5 mt-1.5">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 text-center">
            <span className={`text-[9px] ${i === bars.length - 1 ? 'text-indigo-600 font-medium' : 'text-slate-400'}`}>
              {view === 'weekly' ? b.label.split(' ')[1] ?? b.label : b.label.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
      {/* Month row for weekly view */}
      {view === 'weekly' && (
        <div className="ml-6 flex gap-1.5">
          {bars.map((b, i) => (
            <div key={i} className="flex-1 text-center">
              <span className="text-[9px] text-slate-300">{b.label.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
