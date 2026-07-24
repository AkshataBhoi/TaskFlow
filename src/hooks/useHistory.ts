import { useState, useEffect, useCallback } from 'react';
import type { HistoryEvent } from '../types/task';
import { historyService } from '../services/historyService';

export function useHistory() {
  const [events, setEvents]   = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await historyService.getAll();
      setEvents(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return { events, loading, error, refresh: fetchHistory };
}
