import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

export default function WpmChart({ results, showChart, setShowChart }) {
  if (!results?.wpmHistory?.length) {
    return null;
  }

  // Custom tool tip component for a more premium look
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-4 rounded-2xl shadow-2xl">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Progress at {label}s</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-8">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                WPM
              </span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {Math.round(payload[0].value)}
              </span>
            </div>
            {payload[1] && (
              <div className="flex items-center justify-between gap-8">
                <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  Raw
                </span>
                <span className="text-sm font-bold text-gray-500">
                  {Math.round(payload[1].value)}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-inner">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">Speed Curve</h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your typing momentum visualized</p>
          </div>
        </div>
        <Button
          onClick={() => setShowChart(!showChart)}
          variant="outline"
          className="rounded-xl border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 font-bold text-xs uppercase tracking-wider"
        >
          {showChart ? (
            <span className="flex items-center gap-2">Hide Trend <ChevronUp className="w-4 h-4" /></span>
          ) : (
            <span className="flex items-center gap-2">Show Trend <ChevronDown className="w-4 h-4" /></span>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showChart && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-white/50 dark:bg-gray-900/40 backdrop-blur-sm rounded-4xl p-6 md:p-10 border border-gray-200 dark:border-gray-800 shadow-2xl">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={results.wpmHistory}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRaw" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e2e8f0"
                      className="dark:stroke-gray-800"
                    />
                    <XAxis
                      dataKey="time"
                      type="number"
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `${value}s`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis
                      domain={[0, (dataMax) => Math.ceil(dataMax + 10)]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    
                    {/* Error markers */}
                    <Area 
                      type="step"
                      dataKey="hasError"
                      stroke="none"
                      fill="none"
                      dot={(props) => {
                        const { cx, payload } = props;
                        if (payload?.hasError) {
                          return (
                            <motion.circle
                              initial={{ r: 0 }}
                              animate={{ r: 4 }}
                              cx={cx}
                              cy={20}
                              fill="#f43f5e"
                              className="drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                            />
                          );
                        }
                        return null;
                      }}
                      isAnimationActive={true}
                    />

                    {/* Raw WPM - subtle dashed line */}
                    <Area
                      type="monotone"
                      dataKey="raw"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fillOpacity={1}
                      fill="url(#colorRaw)"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />

                    {/* Main WPM Line */}
                    <Area
                      type="monotone"
                      dataKey="wpm"
                      stroke="#6366f1"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorWpm)"
                      isAnimationActive={true}
                      animationDuration={1000}
                      className="drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Enhanced Legend */}
              <div className="flex justify-center gap-10 mt-10 pt-8 border-t border-gray-100 dark:border-gray-800/60 flex-wrap">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Net WPM</span>
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-10 h-1.5 rounded-full border border-dashed border-slate-500 bg-transparent" />
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Raw Speed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Errors</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
