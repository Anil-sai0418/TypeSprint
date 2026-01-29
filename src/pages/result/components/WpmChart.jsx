import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '../../../components/ui/button';
import { BarChart3 } from 'lucide-react';

export default function WpmChart({ results, showChart, setShowChart }) {
  if (!results?.wpmHistory?.length) {
    return null;
  }

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-950">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Speed Over Time</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time WPM progression during test</p>
          </div>
        </div>
        <Button
          onClick={() => setShowChart(!showChart)}
          variant={showChart ? "default" : "outline"}
          className="font-semibold"
        >
          {showChart ? 'Hide Graph' : 'Show Graph'}
        </Button>
      </div>

      {showChart && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={results.wpmHistory}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <defs>
                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorRaw" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb"
                dark="#374151"
              />
              <XAxis 
                dataKey="time"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `${value}s`}
                stroke="#9ca3af"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                label={{ value: 'Time (seconds)', position: 'insideBottomRight', offset: -10, fill: '#6b7280' }}
              />
              <YAxis 
                domain={[0, 'dataMax + 10']}
                allowDecimals={false}
                stroke="#9ca3af"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                label={{ value: 'WPM', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '2px solid #4f46e5',
                  borderRadius: '12px',
                  padding: '12px 16px'
                }}
                itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}
                formatter={(value) => [`${Math.round(value)} wpm`, '']}
                labelFormatter={(label) => `${label}s`}
                cursor={{ stroke: '#4f46e5', strokeWidth: 2 }}
              />
              {/* Raw WPM Line (dashed) */}
              <Line 
                type="monotone"
                dataKey="raw"
                stroke="#9ca3af"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                strokeDasharray="5 5"
                name="Raw WPM"
                opacity={0.6}
              />
              {/* Net WPM Line (main) */}
              <Line 
                type="monotone"
                dataKey="wpm"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
                name="Net WPM"
                fill="url(#colorWpm)"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-6 h-1 bg-indigo-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net WPM (Adjusted)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-1 bg-gray-400 rounded-full" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #9ca3af 0px, #9ca3af 5px, transparent 5px, transparent 10px)' }}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Raw WPM (Unfiltered)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
