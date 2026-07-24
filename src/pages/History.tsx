import { useState } from 'react';
import { History as HistoryIcon, Filter } from 'lucide-react';
import { TimelineEvent } from '../components/history/TimelineEvent';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { Select } from '../components/ui/Select';
import { useHistory } from '../hooks/useHistory';
import type { HistoryEventType } from '../types/task';

const TYPE_OPTIONS = [
  { value: '',          label: 'All Events' },
  { value: 'created',   label: 'Created' },
  { value: 'updated',   label: 'Updated' },
  { value: 'deleted',   label: 'Deleted' },
  { value: 'completed', label: 'Completed' },
  { value: 'login',     label: 'Login' },
  { value: 'logout',    label: 'Logout' },
];

/** Groups events by relative date label */
function groupByDate(events: ReturnType<typeof useHistory>['events']) {
  const today     = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const lastWeek  = new Date(today); lastWeek.setDate(today.getDate() - 7);

  const groups: Record<string, typeof events> = {};

  events.forEach((e) => {
    const d = new Date(e.timestamp); d.setHours(0,0,0,0);
    let label: string;
    if (d.getTime() === today.getTime())     label = 'Today';
    else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';
    else if (d >= lastWeek)                  label = 'Last 7 Days';
    else                                     label = 'Older';

    if (!groups[label]) groups[label] = [];
    groups[label].push(e);
  });

  // Preserve order
  const ORDER = ['Today', 'Yesterday', 'Last 7 Days', 'Older'];
  const result: { label: string; events: typeof events }[] = [];
  ORDER.forEach((label) => {
    if (groups[label]?.length) result.push({ label, events: groups[label] });
  });
  return result;
}

export default function History() {
  const { events, loading } = useHistory();
  const [typeFilter, setTypeFilter] = useState<HistoryEventType | ''>('');

  const filtered = typeFilter ? events.filter((e) => e.type === typeFilter) : events;
  const grouped  = groupByDate(filtered);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activity History</h1>
          <p className="text-slate-500 text-sm mt-1">Track all changes and updates in your workspace</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <Select
            options={TYPE_OPTIONS}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as HistoryEventType | '')}
            className="w-44"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-7 h-7 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon size={28} />}
            title="No activity found"
            description="No events match the selected filter."
          />
        ) : (
          <div className="p-6 lg:p-8">
            {grouped.map(({ label, events: groupEvents }) => (
              <div key={label} className="mb-8 last:mb-0">
                {/* Date group label */}
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                    {groupEvents.length} event{groupEvents.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Events */}
                <div>
                  {groupEvents.map((event, i) => (
                    <TimelineEvent
                      key={event.id}
                      event={event}
                      index={i}
                      isLast={i === groupEvents.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
