import React, { useState, useMemo } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useContributionActivityQuery } from '../hooks/useQueries';

function ContributionGraph({ email, token, isDark = false }) {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);

  const { data: activityRes, isLoading: loading, error: queryError } = useContributionActivityQuery(email, 365, token);

  const heatmapData = useMemo(() => {
    return activityRes?.success ? (activityRes.data?.activityMap || {}) : {};
  }, [activityRes]);

  const error = queryError?.message || (activityRes && !activityRes.success ? activityRes.message : null);

  // Calculate statistics
  const stats = useMemo(() => {
    const entries = Object.entries(heatmapData);
    if (entries.length === 0) return null;

    const counts = entries.map(([, count]) => count || 0);
    const totalTests = counts.reduce((a, b) => a + b, 0); // Total tests completed
    const activeDays = counts.filter(c => c > 0).length; // Days with at least 1 test
    const maxDay = Math.max(...counts); // Most tests in a single day
    const avgPerDay = activeDays > 0 ? Math.round(totalTests / activeDays * 10) / 10 : 0; // Avg tests per active day

    return { total: totalTests, activeDays, maxDay, avgPerDay };
  }, [heatmapData]);

  if (loading) {
    return <LoadingState isDark={isDark} />;
  }

  if (error) {
    return <ErrorState error={error} isDark={isDark} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          <Activity size={20} />
          Contribution Activity
        </h3>
        {/* {stats && (
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
              {stats.total}
            </span>
            {' tests in the last year'}
          </div>
        )} */}
      </div>

      {stats && (
        <div className={`grid grid-cols-4 gap-3 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <StatCard label="Completed Tests" value={stats.total} isDark={isDark} />
          <StatCard label="Active Days" value={stats.activeDays} isDark={isDark} />
          <StatCard label="Most/Day" value={stats.maxDay} isDark={isDark} />
          <StatCard label="Avg/Day" value={stats.avgPerDay} isDark={isDark} />
        </div>
      )}

      <div className={`p-6 rounded-lg border overflow-x-auto ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <Heatmap data={heatmapData} isDark={isDark} onCellHover={setTooltip} onCellPosition={setTooltipPos} />
      </div>

      {tooltip && tooltipPos && (
        <Tooltip text={tooltip} pos={tooltipPos} isDark={isDark} />
      )}

      <div className={`flex items-center justify-center gap-4 text-xs p-3 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Less</span>
        <div className="flex gap-1">
          {[0, 1, 3, 5, 7].map(count => (
            <div
              key={count}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(count, isDark) }}
              title={`${count}+ activities`}
            />
          ))}
        </div>
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>More</span>
      </div>
    </div>
  );
}

function Heatmap({ data, isDark, onCellHover, onCellPosition }) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  const weeks = [];
  const monthLabels = [];
  let currentMonth = -1;

  for (let w = 0; w < 53; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + w * 7 + d);
      const dateStr = formatDate(cellDate);
      const count = data[dateStr] || 0;
      const isFuture = cellDate > today;

      week.push({
        date: dateStr,
        displayDate: new Date(cellDate),
        count: isFuture ? 0 : count,
        isFuture
      });

      // Add month label on first day of month
      if (d === 0 && cellDate.getMonth() !== currentMonth) {
        monthLabels.push({ week: w, month: cellDate.getMonth() });
        currentMonth = cellDate.getMonth();
      }
    }
    weeks.push(week);
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="inline-block">
      {/* Month Labels Row */}
      <div className="mb-2" style={{ marginLeft: '32px', display: 'flex', gap: '4px' }}>
        {monthLabels.map((label, idx) => {
          const nextLabelWeek = idx < monthLabels.length - 1 ? monthLabels[idx + 1].week : 53;
          const weeksInMonth = nextLabelWeek - label.week;
          const width = weeksInMonth * 18 - 4;
          return (
            <div key={idx} style={{ width: `${width}px` }}>
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {monthNames[label.month]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid Container */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {/* Day labels on left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
            <div
              key={idx}
              className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              style={{ 
                width: '24px', 
                height: '14px', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {idx % 2 === 1 ? day.substring(0, 3) : ''}
            </div>
          ))}
        </div>

        {/* Cells grid */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {week.map((cell, dayIdx) => (
                <HeatmapCell
                  key={`${weekIdx}-${dayIdx}`}
                  cell={cell}
                  isDark={isDark}
                  onHover={onCellHover}
                  onPosition={onCellPosition}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeatmapCell({ cell, isDark, onHover, onPosition }) {
  const handleMouseEnter = (e) => {
    if (cell.isFuture) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 5
    });
    const tooltipText = `${cell.date}: ${cell.count} ${cell.count === 1 ? 'test' : 'tests'}`;
    onHover(tooltipText);
  };

  const handleMouseLeave = () => {
    onHover(null);
  };

  return (
    <div
      className={`cursor-pointer rounded-sm transition-all duration-200 hover:opacity-80 ${cell.isFuture ? 'opacity-40' : 'hover:ring-2'}`}
      style={{
        width: '14px',
        height: '14px',
        backgroundColor: getColor(cell.count, isDark),
        outlineColor: isDark ? '#60a5fa' : '#2563eb'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={`${cell.date}: ${cell.count} activities`}
    />
  );
}

function Tooltip({ text, pos, isDark }) {
  return (
    <div
      className={`fixed z-50 px-2 py-1 rounded text-xs font-medium whitespace-nowrap pointer-events-none shadow-lg ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-900 text-white'}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -100%)'
      }}
    >
      {text}
    </div>
  );
}

function StatCard({ label, value, isDark }) {
  return (
    <div className={`p-3 rounded-md ${isDark ? 'bg-gray-700' : 'bg-white border border-gray-300'}`}>
      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <p className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
        {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}
      </p>
    </div>
  );
}

function LoadingState({ isDark }) {
  return (
    <div className={`space-y-4 p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

function ErrorState({ error, isDark }) {
  return (
    <div className={`p-6 rounded-lg border border-red-300 ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`shrink-0 ${isDark ? 'text-red-400' : 'text-red-500'}`} size={20} />
        <div>
          <p className={`font-semibold ${isDark ? 'text-red-100' : 'text-red-900'}`}>Failed to load</p>
          <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ isDark }) {
  return (
    <div className={`p-8 rounded-lg border text-center ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <Activity className={`mx-auto mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={32} />
      <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No activity data available</p>
    </div>
  );
}

function getColor(count, isDark) {
  if (isDark) {
    if (count === 0) return '#374151';
    if (count <= 2) return '#22c55e';
    if (count <= 4) return '#16a34a';
    if (count <= 6) return '#15803d';
    return '#166534';
  }
  if (count === 0) return '#ebedf0';
  if (count <= 2) return '#9be9a8';
  if (count <= 4) return '#40c463';
  if (count <= 6) return '#30a14e';
  return '#216e39';
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default ContributionGraph;
