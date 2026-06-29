const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const signin = async (note = '') => {
  const res = await fetch(`${API_BASE}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || '签到失败');
  return data;
};

export const getStatus = async () => {
  const res = await fetch(`${API_BASE}/signin/status`);
  return res.json();
};

export const getStats = async () => {
  const res = await fetch(`${API_BASE}/signin/stats`);
  return res.json();
};

export const getCalendar = async (month) => {
  const res = await fetch(`${API_BASE}/signin/calendar?month=${month}`);
  return res.json();
};
