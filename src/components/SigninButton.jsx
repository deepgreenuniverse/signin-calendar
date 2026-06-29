import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

export default function SigninButton({ signedInToday, onSignin, loading }) {
  if (signedInToday) {
    return (
      <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center gap-2">
        <Check className="w-5 h-5 text-gray-400" />
        <span className="text-gray-400 font-medium">今日已签到</span>
      </div>
    );
  }

  return (
    <button
      onClick={onSignin}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300 rounded-2xl p-4 flex items-center justify-center gap-2 transition-colors w-full"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 text-white animate-spin" />
      ) : (
        <>
          <Check className="w-5 h-5 text-white" />
          <span className="text-white font-semibold text-lg">立即签到</span>
        </>
      )}
    </button>
  );
}
