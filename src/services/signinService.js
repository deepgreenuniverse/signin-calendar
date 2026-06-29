import * as api from './api.js';
import { getStreakInfo, getToday } from '../utils/dateUtils';

const DEFAULT_USER = 'default_user';

export const signin = async (userId = DEFAULT_USER, note = '') => {
  return api.signin(note);
};

export const getStatus = async (userId = DEFAULT_USER, monthStr = null) => {
  const [status, stats] = await Promise.all([api.getStatus(), api.getStats()]);

  const today = getToday();
  let records = [];

  if (monthStr) {
    const cal = await api.getCalendar(monthStr);
    records = cal.records || [];
  }

  return {
    signedInToday: status.signed,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    totalDays: stats.total,
    records,
  };
};

export const getCalendarDays = async (userId = DEFAULT_USER, year, month) => {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const cal = await api.getCalendar(monthStr);

  const recordMap = new Map((cal.records || []).map(r => [r.date, r]));
  const today = getToday();

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const days = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      signed: recordMap.has(dateStr),
      isToday: dateStr === today,
      isFuture: dateStr > today,
      record: recordMap.get(dateStr) || null,
    });
  }

  // Mark streak boundaries
  const signedDates = (cal.records || []).map(r => r.date).sort();
  const signedSet = new Set(signedDates);

  const result = days.map(cell => {
    if (!cell.signed) return cell;

    const prev = new Date(cell.date);
    prev.setDate(prev.getDate() - 1);
    const prevStr = prev.toISOString().split('T')[0];

    const next = new Date(cell.date);
    next.setDate(next.getDate() + 1);
    const nextStr = next.toISOString().split('T')[0];

    return {
      ...cell,
      streakInfo: {
        isStreakStart: !signedSet.has(prevStr),
        isStreakEnd: !signedSet.has(nextStr),
      },
    };
  });

  return { month: monthStr, days: result };
};

export const getPrevMonth = (year, month) => {
  const d = new Date(year, month - 1);
  d.setMonth(d.getMonth() - 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
};

export const getNextMonth = (year, month) => {
  const d = new Date(year, month - 1);
  d.setMonth(d.getMonth() + 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
};
