import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  generateLast365Days,
  mergeActivityData,
  formatTooltipText,
  calculateStats
} from '../lib/contributionUtils';
import { getContributionActivity, getContributionStats } from '../services/api';

function ContributionGraph({ email, token, isDark = false }) {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const dataFetchedRef = useRef(false);

  // Hooks before conditional returns
  const handleCellHover = useCallback((e, day) => {
    if (day.isFuture) return;
    const tooltipText = formatTooltipText(day.date, day.activityCount);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip(tooltipText);
    setTooltipPos({ x: rect.left + 10, y: rect.top - 10 });
  }, []);

  const handleCellLeave = useCallback(() => setTooltip(null), []);

  useEffect(() => {
    if (!email || !token) {
      setLoading(false);
      return;
    }
    if (dataFetchedRef.current) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const dateWeeks = generateLast365Days();
        const activityResponse = await getContributionActivity(email, 365, token);
        if (!activityResponse.success) {
          throw new Error(activityResponse.message || 'Failed to load activity');
        }
        const enrichedWeeks = mergeActivityData(dateWeeks, activityResponse.data.activityMap);
        setWeeks(enrichedWeeks);
        dataFetchedRef.current = true;
        await getContributionStats(email, token);
      } catch (err) {
        console.error('Error fetching contribution data:', err);
        setError(err.message || 'Failed to load contribution data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email, token]);

  const memoizedStats = useMemo(() => {
    if (!weeks.length) return null;
    const activityMap = {};
    weeks.forEach(week =>
      week.forEach(day => {
        activityMap[day.date] = day.activityCount;
      })
    );
    return calculateStats(activityMap);
  }, [weeks]);

  if (loading && !weeks.length) {
    return (
      <div className={`space-y-4 p-6 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className={`grid grid-cols-4 gap-3 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`p-3 rounded-md ${isDark ? 'bg-gray-700' : 'bg-white border border-gray-300'}`}>
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-6 w-16 mt-2" />
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-lg border overflow-x-auto ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <div style={{ display: 'inline-block', minWidth: '100%' }}>
            <div style={{ display: 'flex', marginBottom: '8px', paddingLeft: '30px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: 12 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-3 w-4" />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {Array.from({ length: 7 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-3 w-6" />
                ))}
              </div>

              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {Array.from({ length: 52 * 7 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-3 w-3 rounded-[2px]" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-center gap-4 text-xs p-3 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <Skeleton className="h-3 w-8" />
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Skeleton key={idx} className="h-3 w-3 rounded-[2px]" />
            ))}
          </div>
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    );
  }

  if (error) {
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

  if (!weeks.length) {
    return (
      <div className={`p-8 rounded-lg border text-center ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <Activity className={`mx-auto mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={32} />
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No data</p>
      </div>
    );
  }

  const CELL_SIZE = 12;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
          <Activity size={20} />
          Contribution Graph
        </h3>
        {memoizedStats && (
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
              {Number.isFinite(memoizedStats.totalActivities) ? memoizedStats.totalActivities : 0}
            </span>
            {' contributions'}
          </div>
        )}
      </div>

      {memoizedStats && (
        <div className={`grid grid-cols-4 gap-3 p-4 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <StatItem label="Total" value={memoizedStats.totalActivities} isDark={isDark} />
          <StatItem label="Active Days" value={memoizedStats.activeDays} isDark={isDark} />
          <StatItem label="Max/Day" value={memoizedStats.maxDay} isDark={isDark} />
          <StatItem label="Avg/Day" value={memoizedStats.averagePerDay} isDark={isDark} />
        </div>
      )}

      <div className={`p-4 rounded-lg border overflow-x-auto ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div style={{ display: 'inline-block', minWidth: '100%' }}>
          <div style={{ display: 'flex', marginBottom: '8px', paddingLeft: '30px' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {getMonthLabels().map((month, idx) => (
                <div key={idx} style={{ width: '16px' }}>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{month}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((day, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '30px',
                    height: `${CELL_SIZE}px`,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: isDark ? '#9ca3af' : '#757575'
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {week.map((day, dayIdx) => (
                    <Cell
                      key={`${weekIdx}-${dayIdx}`}
                      day={day}
                      size={CELL_SIZE}
                      isDark={isDark}
                      onHover={handleCellHover}
                      onLeave={handleCellLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className={`fixed z-50 px-3 py-2 rounded-md text-xs whitespace-nowrap pointer-events-none font-medium shadow-lg ${isDark
              ? 'bg-gray-900 text-gray-100'
              : 'bg-white text-gray-900 border border-gray-200'
            }`}
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translateX(-50%) translateY(-100%)'
          }}
        >
          {tooltip}
        </div>
      )}

      <div className={`flex items-center justify-center gap-4 text-xs p-3 rounded-lg border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Less</span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <LegendCell count={0} size={CELL_SIZE} isDark={isDark} />
          <LegendCell count={1} size={CELL_SIZE} isDark={isDark} />
          <LegendCell count={3} size={CELL_SIZE} isDark={isDark} />
          <LegendCell count={5} size={CELL_SIZE} isDark={isDark} />
          <LegendCell count={7} size={CELL_SIZE} isDark={isDark} />
        </div>
        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>More</span>
      </div>
    </div>
  );
}

function Cell({ day, size, isDark, onHover, onLeave }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '2px',
        cursor: day.isFuture ? 'not-allowed' : 'pointer',
        opacity: day.isFuture ? 0.5 : 1,
        backgroundColor: getColorHex(day.activityCount, isDark),
        boxShadow: day.isToday
          ? (isDark ? '0 0 0 2px #60a5fa' : '0 0 0 2px #2563eb')
          : 'none',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => onHover(e, day)}
      onMouseLeave={onLeave}
      title={`${day.date}: ${day.activityCount} activities`}
    />
  );
}

function LegendCell({ count, size, isDark }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '2px',
        backgroundColor: getColorHex(count, isDark)
      }}
    />
  );
}

function StatItem({ label, value, isDark }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return (
    <div className={`p-3 rounded-md ${isDark ? 'bg-gray-700' : 'bg-white border border-gray-300'
      }`}>
      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
      <p className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{safeValue}</p>
    </div>
  );
}

function getColorHex(count, isDark) {
  if (isDark) {
    if (count === 0) return '#374151';
    if (count <= 2) return '#22c55e';
    if (count <= 4) return '#16a34a';
    if (count <= 6) return '#15803d';
    return '#166534';
  } else {
    if (count === 0) return '#ebedf0';
    if (count <= 2) return '#9be9a8';
    if (count <= 4) return '#40c463';
    if (count <= 6) return '#30a14e';
    return '#216e39';
  }
}

function getMonthLabels() {
  const months = [];
  const today = new Date();
  let currentDate = new Date(today);
  currentDate.setDate(currentDate.getDate() - 364);
  let lastMonth = -1;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 53; i++) {
    if (currentDate.getMonth() !== lastMonth || i === 0) {
      months.push(monthNames[currentDate.getMonth()]);
      lastMonth = currentDate.getMonth();
    } else {
      months.push('');
    }
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return months;
}

export default ContributionGraph;
