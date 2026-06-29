import * as store from '../store/signinStore';
import { getStreakInfo, getToday } from '../utils/dateUtils';

const DEFAULT_USER = 'default_user';

export const signin = async (userId = DEFAULT_USER, note = '') => {
  // localStorage already throws on duplicate, re-throw as promise-friendly error
  try {
    return store.createRecord(userId, note);
  } catch (e) {
    throw new Error(e.message || '签到失败');
  }
};

export const getStatus = async (userId = DEFAULT_USER, monthStr = null) => {
  const today = getToday();
  const allRecords = store.getRecordsByUser(userId);

  // Today's status
  const signedInToday = store.checkSignedIn(userId, today);

  // Stats from all records
  const stats = getStreakInfo(allRecords);

  // Month records if requested
  let records = [];
  if (monthStr) {
    records = store.getRecordsByMonth(userId, null, null)
      .filter(r => r.date.startsWith(monthStr));
  }

  return {
    signedInToday,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    totalDays: stats.totalDays,
    records,
  };
};

export const getCalendarDays = async (userId = DEFAULT_USER, year, month) => {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const allRecords = store.getRecordsByUser(userId);

  // Filter to this month
  const monthRecords = allRecords.filter(r => r.date.startsWith(monthStr));
  const recordMap = new Map(monthRecords.map(r => [r.date, r]));
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

  // Build signed-set across ALL months for streak boundary detection
  const signedSet = new Set(allRecords.map(r => r.date));

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
