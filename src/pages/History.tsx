import { motion } from 'framer-motion';
import { History as HistoryIcon, Filter, Clock } from 'lucide-react';
import { TimelineEvent } from '../components/history/TimelineEvent';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/LoadingSkeleton';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useHistory } from '../hooks/useHistory';
import type { HistoryEventType } from '../types/task';

const TYPE_OPTIONS = [
  { value: '',          label: 'All Activity' },
  { value: 'created',   label: 'Created' },
  { value: 'updated',   label: 'Updated' },
  { value: 'completed', label: 'Completed' },
  { value: 'deleted',   label: 'Deleted' },
  { value: 'login',     label: 'Login' },
  { value: 'logout',    label: 'Logout' },
];

/** Groups history events into Today, Yesterday, and Earlier */
function groupByDate(events: ReturnType<typeof useHistory>['events']) {
  if (!events || events.length === 0) return [];

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const now = new Date();
  const latestDate = new Date(sorted[0].timestamp);
  
  // Use latest event date as reference anchor if mock data is older than 2 weeks
  const anchor = (now.getTime() - latestDate.getTime() > 14 * 24 * 60 * 60 * 1000) 
    ? latestDate 
    : now;

  const refToday = new Date(anchor); refToday.setHours(0, 0, 0, 0);
  const refYesterday = new Date(refToday); refYesterday.setDate(refToday.getDate() - 1);

  const groups: Record<'Today' | 'Yesterday' | 'Earlier', typeof events> = {
    Today: [],
    Yesterday: [],
    Earlier: [],
  };

  sorted.forEach((e) => {
    const d = new Date(e.timestamp);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === refToday.getTime()) {
      groups.Today.push(e);
    } else if (d.getTime() === refYesterday.getTime()) {
      groups.Yesterday.push(e);
    } else {
      groups.Earlier.push(e);
    }
  });

  const ORDER: ('Today' | 'Yesterday' | 'Earlier')[] = ['Today', 'Yesterday', 'Earlier'];
  return ORDER.filter((label) => groups[label].length > 0).map((label) => ({
    label,
    events: groups[label],
  }));
}

export default function History() {
  const { events, loading, loadingMore, hasMore, loadMore, params, setParams } = useHistory();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(p => ({ ...p, search: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams(p => ({ ...p, date: e.target.value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams(p => ({ ...p, type: e.target.value as HistoryEventType | '' }));
  };

  const grouped = groupByDate(events);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Activity History</h1>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Audit log of workspace updates, task completions, and user sessions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 mt-3 sm:mt-0">
          <input
            type="text"
            placeholder="Search activity..."
            value={params.search || ''}
            onChange={handleSearch}
            className="w-40 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <Select
            options={[
              { value: '', label: 'All Dates' },
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
            ]}
            value={params.date || ''}
            onChange={handleDateChange}
            className="w-32 text-xs"
          />
          <Filter size={15} className="text-slate-400 shrink-0 hidden sm:block" />
          <Select
            options={TYPE_OPTIONS}
            value={params.type || ''}
            onChange={handleTypeChange}
            className="w-36 text-xs"
          />
        </div>
      </div>

      {/* Main List Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2 px-3">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
                  <Skeleton className="h-4 w-20 rounded-md shrink-0" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>
                <Skeleton className="h-3 w-16 rounded-md shrink-0" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={<HistoryIcon size={26} />}
            title="No activity found"
            description="No history events match the selected activity filter."
          />
        ) : (
          <div className="p-3 sm:p-4 space-y-4">
            {grouped.map(({ label, events: groupEvents }) => (
              <div key={label} className="space-y-1">
                {/* Compact Date Group Label Header */}
                <div className="flex items-center gap-2.5 py-1 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {label}
                  </span>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                    {groupEvents.length}
                  </span>
                </div>

                {/* Event Items List */}
                <div className="divide-y divide-slate-100/70 max-h-[32rem] overflow-y-auto pr-2">
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
            
            {hasMore && (
              <div className="pt-4 flex justify-center border-t border-slate-100">
                <Button 
                  variant="secondary" 
                  onClick={loadMore} 
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
