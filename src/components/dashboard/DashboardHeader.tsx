import { getGreeting } from '../../utils/formatDate';
import { CURRENT_USER } from '../../data/mockData';

export function DashboardHeader() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          {getGreeting()}, {CURRENT_USER.name.split(' ')[0]} 👋
        </h2>
        <p className="text-slate-500 text-sm mt-1">{today}</p>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-600">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        All systems operational
      </div>
    </div>
  );
}