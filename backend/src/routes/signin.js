import { Router } from 'express';
import db from '../db/database.js';

const router = Router();
const DEFAULT_USER_ID = 1;

// Get user profile
router.get('/user/profile', (req, res) => {
  const user = db.prepare('SELECT id, username, avatar, created_at FROM user WHERE id = ?').get(DEFAULT_USER_ID);
  res.json(user);
});

// POST /api/signin - 执行签到
router.post('/signin', (req, res) => {
  const { note = '' } = req.body;
  const today = new Date().toISOString().split('T')[0]; // 北京时间 YYYY-MM-DD

  // Check if already signed today
  const existing = db.prepare(
    'SELECT id FROM signin_record WHERE user_id = ? AND signin_date = ?'
  ).get(DEFAULT_USER_ID, today);

  if (existing) {
    return res.status(400).json({ success: false, msg: '今日已签到' });
  }

  // Insert record
  const result = db.prepare(
    'INSERT INTO signin_record (user_id, signin_date, note) VALUES (?, ?, ?)'
  ).run(DEFAULT_USER_ID, today, note);

  // Calculate streak
  const { currentStreak } = calcStreak();

  res.json({ success: true, streak: currentStreak, msg: '签到成功' });
});

// GET /api/signin/status - 今日签到状态
router.get('/signin/status', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const existing = db.prepare(
    'SELECT id FROM signin_record WHERE user_id = ? AND signin_date = ?'
  ).get(DEFAULT_USER_ID, today);

  const { currentStreak } = calcStreak();

  res.json({ signed: !!existing, streak: currentStreak });
});

// GET /api/signin/stats - 统计信息
router.get('/signin/stats', (req, res) => {
  const records = db.prepare(
    'SELECT signin_date FROM signin_record WHERE user_id = ? ORDER BY signin_date DESC'
  ).all(DEFAULT_USER_ID);

  const total = records.length;
  const { currentStreak, longestStreak } = calcStreak();
  const lastSigninDate = records.length > 0 ? records[0].signin_date : null;

  res.json({ total, currentStreak, longestStreak, lastSigninDate });
});

// GET /api/signin/calendar?month=2026-07
router.get('/signin/calendar', (req, res) => {
  const { month } = req.query;
  if (!month) return res.status(400).json({ msg: '缺少 month 参数' });

  const records = db.prepare(
    'SELECT signin_date, signin_time FROM signin_record WHERE user_id = ? AND signin_date LIKE ?'
  ).all(DEFAULT_USER_ID, `${month}%`);

  const recordMap = {};
  records.forEach(r => { recordMap[r.signin_date] = r.signin_time; });

  res.json({ records: records.map(r => ({ date: r.signin_date, signed: true })) });
});

// Calculate streak info
function calcStreak() {
  const records = db.prepare(
    'SELECT signin_date FROM signin_record WHERE user_id = ? ORDER BY signin_date DESC'
  ).all(DEFAULT_USER_ID);

  if (records.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const dates = records.map(r => r.signin_date).sort().reverse();
  const today = new Date().toISOString().split('T')[0];

  // Current streak
  let currentStreak = 0;
  const latest = dates[0];

  // If latest is today or yesterday, count ongoing streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (latest === today || latest === yesterdayStr) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Longest streak
  let longestStreak = 1;
  let streak = 1;
  const sortedAsc = [...dates].sort();
  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1]);
    const curr = new Date(sortedAsc[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 1;
    }
  }

  return { currentStreak, longestStreak };
}

export default router;
