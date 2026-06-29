import { CheckCircle, Flame, Calendar } from 'lucide-react';

export default function StatsCard({ signedInToday, currentStreak, totalDays }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center">
        <CheckCircle className={`w-6 h-6 mb-2 ${signedInToday ? 'text-green-500' : 'text-gray-300'}`} />
        <div className={`text-2xl font-bold ${signedInToday ? 'text-green-600' : 'text-gray-400'}`}>
          {signedInToday ? '已签到' : '未签到'}
        </div>
        <div className="text-xs text-gray-400 mt-1">今日</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center">
        <Flame className={`w-6 h-6 mb-2 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
        <div className={`text-2xl font-bold ${currentStreak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
          {currentStreak}
        </div>
        <div className="text-xs text-gray-400 mt-1">连续天数</div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center">
        <Calendar className="w-6 h-6 mb-2 text-blue-500" />
        <div className="text-2xl font-bold text-blue-600">{totalDays}</div>
        <div className="text-xs text-gray-400 mt-1">累计天数</div>
      </div>
    </div>
  );
}
