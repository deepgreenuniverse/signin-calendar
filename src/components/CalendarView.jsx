import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getCalendarDays, getPrevMonth, getNextMonth } from '../services/signinService';

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarView({ userId, refreshKey }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState({ month: '', days: [] });
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    getCalendarDays(userId, year, month).then(result => setData(result));
  }, [year, month, userId, refreshKey]);

  const handlePrev = () => {
    const { year: y, month: m } = getPrevMonth(year, month);
    setYear(y);
    setMonth(m);
  };

  const handleNext = () => {
    const { year: y, month: m } = getNextMonth(year, month);
    setYear(y);
    setMonth(m);
  };

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const leadingCells = Array(firstDayOfMonth).fill(null);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-lg font-semibold text-gray-800">
          {year}年{month}月
        </div>
        <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEK_DAYS.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {leadingCells.map((_, i) => (
          <div key={`lead-${i}`} className="aspect-square" />
        ))}

        {data.days.map(cell => {
          // Break day = past day that was not signed
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const isPast = cell.date < todayStr && !cell.isFuture;
          const isBreakDay = isPast && !cell.signed;

          return (
            <div
              key={cell.date}
              className="relative aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all"
              onMouseEnter={(e) => {
                if (cell.signed && cell.record) {
                  const time = format(new Date(cell.record.createdAt), 'HH:mm');
                  setTooltip({ date: cell.date, time, x: e.clientX, y: e.clientY });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Streak background: only signed days get colored background */}
              {cell.signed && (
                <div
                  className={`absolute inset-0 bg-blue-500 ${
                    !cell.streakInfo?.isStreakStart && !cell.streakInfo?.isStreakEnd
                      ? 'rounded-none'
                      : cell.streakInfo?.isStreakStart && cell.streakInfo?.isStreakEnd
                      ? 'rounded-lg'
                      : cell.streakInfo?.isStreakStart
                      ? 'rounded-r-none rounded-l-lg'
                      : 'rounded-l-none rounded-r-lg'
                  }`}
                />
              )}

              {/* Today ring */}
              {cell.isToday && (
                <div className="absolute inset-0 border-2 border-blue-400 rounded-lg" />
              )}

              {/* Day number */}
              <span className={`relative z-10 text-sm font-medium ${
                cell.signed ? 'text-white' : cell.isFuture ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {parseInt(cell.date.split('-')[2])}
              </span>

              {/* Break day indicator */}
              {isBreakDay && (
                <AlertTriangle className="absolute bottom-0.5 right-0.5 w-3 h-3 text-red-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          {tooltip.date} {tooltip.time}
        </div>
      )}
    </div>
  );
}
