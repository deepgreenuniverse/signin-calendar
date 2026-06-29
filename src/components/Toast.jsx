import { CheckCircle, XCircle } from 'lucide-react';

export default function Toast({ message, type = 'success' }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}>
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-white" />
        ) : (
          <XCircle className="w-5 h-5 text-white" />
        )}
        <span className="text-white font-medium">{message}</span>
      </div>
    </div>
  );
}
