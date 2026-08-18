import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

export default function SentimentCharts({ stats }) {
  const data = [
    { name: 'Positive Posts', value: stats.positiveCount, percentage: stats.positivePercentage, color: '#10b981' },
    { name: 'Neutral Posts', value: stats.neutralCount, percentage: stats.neutralPercentage, color: '#64748b' },
    { name: 'Negative Posts', value: stats.negativeCount, percentage: stats.negativePercentage, color: '#ef4444' }
  ].filter(item => item.value > 0); // Only show segments with > 0 items to avoid Recharts render errors

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md border border-slate-150 p-3.5 rounded-2xl shadow-lg text-xs space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <p className="font-bold text-slate-900">{data.name}</p>
          </div>
          <p className="text-slate-550 mt-1 pl-4">
            Count: <span className="font-semibold text-slate-800">{data.value}</span>
          </p>
          <p className="text-slate-550 pl-4">
            Share: <span className="font-semibold text-slate-800">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const RenderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap items-center justify-center gap-6 mt-4">
        {payload.map((entry, index) => {
          const item = data.find(d => d.name === entry.value);
          if (!item) return null;
          return (
            <li key={`legend-${index}`} className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-650">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{entry.value}</span>
              <span className="text-slate-400 font-normal">({item.value})</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center w-full min-h-[350px] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl rounded-full" />
      
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Sentiment Distribution Visualizer
        </h3>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-sm text-slate-400 font-medium">
          No sentiment data to visualize.
        </div>
      ) : (
        <div className="w-full h-72 relative flex flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="48%"
                innerRadius={68}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    className="focus:outline-none transition-all duration-300 hover:opacity-90"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Legend content={<RenderLegend />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Absolute Center Circle Label */}
          <div className="absolute top-[48%] -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-slate-850 font-display">
              {stats.totalCount}
            </span>
            <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
              Posts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
