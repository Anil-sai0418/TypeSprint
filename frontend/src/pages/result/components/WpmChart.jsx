import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../../../context/useTheme';

export default function WpmChart({ results, showChart, setShowChart }) {
  const { theme } = useTheme();
  
  const data = useMemo(() => results?.wpmHistory || [], [results]);

  // Calculate max WPM for dynamic Y-axis with breathing room
  const maxVal = useMemo(() => {
    if (!data || data.length === 0) return 100;
    return Math.max(...data.map(d => Math.max(d.wpm || 0, d.raw || 0))) + 10;
  }, [data]);

  const yDomainMax = Math.ceil(maxVal / 10) * 10;
  const gradientId = "wpmGradientResult";

  if (!data.length) {
    return null;
  }

  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.errors > 0 || payload.hasError) {
      return (
        <g>
          <circle cx={cx} cy={cy} r={8} fill="#ef4444" fillOpacity={0.3} />
          <circle cx={cx} cy={cy} r={4} fill="#ef4444" stroke="#fff" strokeWidth={2} />
        </g>
      );
    }
    return null;
  };


  // Custom tool tip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl min-w-[140px]">
          <p className="text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-1">
            Progress at {label}s
          </p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => {
              if (
                (entry.dataKey === 'errors' || entry.dataKey === 'hasError') && 
                !entry.value
              ) return null;
              
              const name = entry.name === 'wpm' ? 'Net WPM' : 
                           entry.name === 'raw' ? 'Raw Speed' : 'Errors';
              
              const color = entry.dataKey === 'wpm' ? '#8b5cf6' : 
                            entry.dataKey === 'raw' ? '#9ca3af' : '#ef4444';

              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-1.5 h-1.5 rounded-full ring-2 ring-opacity-20 ring-current" 
                      style={{ backgroundColor: color, color: color }}
                    />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                      {name}
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono" style={{ color: color }}>
                    {Math.round(entry.value)}
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

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 shadow-sm">
            <BarChart3 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Speed Curve</h2>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Your typing momentum visualized</p>
          </div>
        </div>
        <Button
          onClick={() => setShowChart(!showChart)}
          variant="outline"
          size="sm"
          className="rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-semibold text-[10px] uppercase tracking-wider h-8"
        >
          {showChart ? (
            <span className="flex items-center gap-1.5">Hide <ChevronUp className="w-3 h-3" /></span>
          ) : (
            <span className="flex items-center gap-1.5">Show <ChevronDown className="w-3 h-3" /></span>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showChart && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800/60 shadow-sm">
              <div className="h-[350px] w-full">
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
                      name="raw"
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
                      name="wpm"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill={`url(#${gradientId})`}
                      isAnimationActive={true}
                      activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#8b5cf6' }}
                      dot={<CustomizedDot />}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced Legend */}
              <div className="flex justify-center items-center gap-8 mt-6 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-8 h-1 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-shadow"></div>
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider group-hover:text-violet-500 transition-colors">Net WPM</span>
                </div>
                <div className="flex items-center gap-2 group cursor-default">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
