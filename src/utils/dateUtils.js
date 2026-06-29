import { format, parseISO, differenceInCalendarDays, startOfDay } from 'date-fns';

export const formatDate = (date) => format(date, 'yyyy-MM-dd');
export const parseDate = (str) => parseISO(str);

export const getToday = () => formatDate(new Date());

export const getDateLabel = (dateStr) => format(parseISO(dateStr), 'M月D日');

export const isSameDay = (a, b) => {
  if (!a || !b) return false;
  return formatDate(a) === formatDate(b);
};

export const isConsecutive = (prev, next) => {
  const prevDate = typeof prev === 'string' ? parseISO(prev) : prev;
  const nextDate = typeof next === 'string' ? parseISO(next) : next;
  return differenceInCalendarDays(nextDate, prevDate) === 1;
};

export const getStreakInfo = (records) => {
  if (!records || records.length === 0) return { currentStreak: 0, longestStreak: 0, totalDays: 0 };

  const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
  const today = getToday();

  // total days
  const totalDays = sorted.length;

  // longest streak
  let longestStreak = 0;
  let currentStreak = 0;

  // Calculate streaks from sorted records
  const dates = sorted.map(r => r.date);
  if (dates.length > 0) {
    let streak = 1;
    longestStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      // dates is sorted desc (newest first), so dates[i] is older than dates[i-1]
      // isConsecutive(prev, next) expects prev=older, next=newer (diff=1)
      if (isConsecutive(dates[i], dates[i - 1])) {
        streak++;
        longestStreak = Math.max(longestStreak, streak);
      } else {
        streak = 1;
      }
    }
  }

  // Current streak: start from today or yesterday and go backwards
  if (dates.length === 0) {
    currentStreak = 0;
  } else {
    const latest = dates[0];
    if (latest === today || isConsecutive(latest, today) || isConsecutive(today, latest)) {
      // streak includes today or is ongoing
      let streakCount = 1;
      for (let i = 1; i < dates.length; i++) {
        if (isConsecutive(dates[i], dates[i - 1])) {
          streakCount++;
        } else {
          break;
        }
      }
      currentStreak = streakCount;
    } else {
      currentStreak = 0;
    }
  }

  return { currentStreak, longestStreak, totalDays };
};
