import { useState, useEffect } from 'react';
import StatsCard from './StatsCard';
import CalendarView from './CalendarView';
import SigninButton from './SigninButton';
import Toast from './Toast';
import { signin, getStatus } from '../services/signinService';

const DEFAULT_USER = 'default_user';

export default function SigninCalendar() {
  const [status, setStatus] = useState({
    signedInToday: false,
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    records: [],
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadStatus = () => {
    const s = getStatus(DEFAULT_USER);
    setStatus(s);
  };

  useEffect(() => {
    loadStatus();
  }, [refreshKey]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignin = async () => {
    if (status.signedInToday) return;
    setLoading(true);
    try {
      // Simulate slight delay for UX
      await new Promise(r => setTimeout(r, 300));
      signin(DEFAULT_USER);
      setRefreshKey(k => k + 1);
      showToast('签到成功！');
    } catch (e) {
      showToast(e.message || '签到失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">签到日历</h1>
        <p className="text-sm text-gray-400 mt-1">坚持签到，养成好习惯</p>
      </div>

      {/* Stats */}
      <StatsCard
        signedInToday={status.signedInToday}
        currentStreak={status.currentStreak}
        totalDays={status.totalDays}
      />

      {/* Calendar */}
      <CalendarView userId={DEFAULT_USER} refreshKey={refreshKey} />

      {/* Signin Button */}
      <div className="mt-4">
        <SigninButton
          signedInToday={status.signedInToday}
          onSignin={handleSignin}
          loading={loading}
        />
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
