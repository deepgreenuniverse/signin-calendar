import { CheckCircle, Flame, Calendar, Trophy } from 'lucide-react';

export default function StatsCard({ signedInToday, currentStreak, longestStreak, totalDays }) {
  return (
    <div className="grid grid-cols-4 gap-2 mb-6">
      <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center">
        <CheckCircle className={`w-5 h-5 mb-1 ${signedInToday ? 'text-green-500' : 'text-gray-300'}`} />
        <div className={`text-xl font-bold ${signedInToday ? 'text-green-600' : 'text-gray-400'}`}>
          {signedInToday ? '已签到' : '未签到'}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">今日</div>
      </div>

      <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center">
        <Flame className={`w-5 h-5 mb-1 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
        <div className={`text-xl font-bold ${currentStreak > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
          {currentStreak}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">连续天数</div>
      </div>

      <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center">
        <Trophy className={`w-5 h-5 mb-1 ${longestStreak > 0 ? 'text-yellow-500' : 'text-gray-300'}`} />
        <div className={`text-xl font-bold ${longestStreak > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
          {longestStreak}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">最长连续</div>
      </div>

      <div className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-center">
        <Calendar className="w-5 h-5 mb-1 text-blue-500" />
        <div className="text-xl font-bold text-blue-600">{totalDays}</div>
        <div className="text-xs text-gray-400 mt-0.5">累计天数</div>
      </div>
    </div>
  );
}
