import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { getRecordsByUser, createRecord as storeCreateRecord } from '../store/signinStore';
import { getStreakInfo, getToday } from '../utils/dateUtils';

const DEFAULT_USER = 'default_user';

export const signin = (userId = DEFAULT_USER, note = '') => {
  return storeCreateRecord(userId, note);
};

export const getStatus = (userId = DEFAULT_USER, monthStr = null) => {
  // monthStr format: YYYY-MM
  const records = getRecordsByUser(userId);
  const { currentStreak, longestStreak, totalDays } = getStreakInfo(records);
  const today = getToday();
  const signedInToday = records.some(r => r.date === today);

  // Filter records for the given month
  let monthRecords = records;
  if (monthStr) {
    monthRecords = records.filter(r => r.date.startsWith(monthStr));
  }

  return {
    signedInToday,
    currentStreak,
    longestStreak,
    totalDays,
    records: monthRecords,
  };
};

export const getCalendarDays = (userId = DEFAULT_USER, year, month) => {
  // month: 1-12
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  const records = getRecordsByUser(userId);
  const recordMap = new Map(records.map(r => [r.date, r]));

  const today = getToday();

  const firstDay = startOfMonth(new Date(year, month - 1));
  const lastDay = endOfMonth(new Date(year, month - 1));

  // Get all days in month
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  // Build day cells
  const dayCells = days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = dateStr === today;
    const isFuture = dateStr > today;
    const signed = recordMap.has(dateStr);

    return {
      date: dateStr,
      signed,
      isToday,
      isFuture,
      record: signed ? recordMap.get(dateStr) : null,
    };
  });

  // Add streak info: mark consecutive runs
  const signedDates = records.map(r => r.date).sort();
  const signedSet = new Set(signedDates);

  // Mark streak starts and ends in day cells
  const result = dayCells.map(cell => {
    if (!cell.signed) return cell;

    const dateObj = typeof cell.date === 'string' ? parseISO(cell.date) : cell.date;
    const prev = format(new Date(dateObj.getTime() - 86400000), 'yyyy-MM-dd');
    const next = format(new Date(dateObj.getTime() + 86400000), 'yyyy-MM-dd');

    const prevSigned = signedSet.has(prev);
    const nextSigned = signedSet.has(next);

    return {
      ...cell,
      streakInfo: {
        isStreakStart: !prevSigned,
        isStreakEnd: !nextSigned,
      },
    };
  });

  return {
    month: monthStr,
    days: result,
  };
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
