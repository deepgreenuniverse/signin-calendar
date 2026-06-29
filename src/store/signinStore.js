import { getToday } from '../utils/dateUtils';

const STORAGE_KEY = 'signin_records';

export const getAllRecords = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRecords = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const addRecord = (record) => {
  const records = getAllRecords();
  records.push(record);
  saveRecords(records);
  return record;
};

export const getRecordsByUser = (userId) => {
  return getAllRecords().filter(r => r.userId === userId);
};

export const getRecordsByMonth = (userId, year, month) => {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;
  return getAllRecords().filter(r => {
    return r.userId === userId && r.date.startsWith(monthStr);
  });
};

export const checkSignedIn = (userId, date) => {
  const records = getAllRecords();
  return records.some(r => r.userId === userId && r.date === date);
};

export const createRecord = (userId, note = '') => {
  const today = getToday();
  if (checkSignedIn(userId, today)) {
    throw new Error('今日已签到');
  }
  const record = {
    id: crypto.randomUUID(),
    userId,
    date: today,
    createdAt: Date.now(),
    note,
  };
  return addRecord(record);
};
