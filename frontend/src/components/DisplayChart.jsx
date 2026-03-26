import React, { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceDot 
} from 'recharts';
import { useTheme } from '../context/useTheme';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl min-w-35">
        <p className="text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-1">
          Progress at {label}s
        </p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => {
            if (entry.dataKey === 'errors' && entry.value === 0) return null;
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-1.5 h-1.5 rounded-full ring-2 ring-opacity-20 ring-current" 
                    style={{ backgroundColor: entry.color, color: entry.color }}
                  />
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    {entry.name}
                  </span>
                </div>
                <span className="text-xs font-bold font-mono" style={{ color: entry.color }}>
                  {entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const DisplayChart = ({ data }) => {
  const { theme } = useTheme();
  
  // Create gradient ID
  const gradientId = "wpmGradient";

  // Calculate max WPM for dynamic Y-axis
  const maxVal = useMemo(() => {
    if (!data || data.length === 0) return 100;
    return Math.max(...data.map(d => Math.max(d.wpm || 0, d.raw || 0))) + 10;
  }, [data]);

  // Round up to nearest 10
  const yDomainMax = Math.ceil(maxVal / 10) * 10;

  return (
    <div className="w-full bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-zinc-800/60 p-6 sm:p-8 shadow-sm">
      <div className="h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke={theme === 'dark' ? '#27272a' : '#f4f4f5'} 
            />
            
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
              tickMargin={15}
              tickFormatter={(value) => `${value}s`}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
              domain={[0, yDomainMax]}
              tickCount={6}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }}
              animationDuration={200}
            />
            
            {/* Raw Speed (Dashed Line) */}
            <Area
              type="monotone"
              dataKey="raw"
              name="Raw"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeDasharray="6 6"
              fill="none"
              isAnimationActive={true}
              activeDot={{ r: 4, strokeWidth: 0, fill: '#9ca3af' }}
            />

            {/* Net WPM (Solid Line with Gradient) */}
            <Area
              type="monotone"
              dataKey="wpm"
              name="WPM"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              isAnimationActive={true}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#8b5cf6' }}
            />
            
            {/* Error Markers */}
             {data.map((entry, index) => (
                entry.errors > 0 ? (
                   <ReferenceDot 
                      key={`error-${index}`}
                      x={entry.time} 
                      y={entry.wpm} 
                      r={3} 
                      fill="#ef4444" 
                      stroke="none"
                      isFront={true}
                   />
                ) : null
             ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom Legend */}
      <div className="flex justify-center items-center gap-8 mt-6 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 group cursor-default">
            <div className="w-8 h-1 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.7)] transition-shadow"></div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider group-hover:text-violet-500 transition-colors">Net WPM</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
            {/* CSS dashed border/line effect */}
            <div className="w-8 h-1 relative overflow-hidden">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-gray-400"></div>
            </div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider group-hover:text-gray-400 transition-colors">Raw Speed</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider group-hover:text-red-500 transition-colors">Errors</span>
        </div>
      </div>
    </div>
  );
};

export default DisplayChart;