import { useState, useEffect, useCallback } from 'react';
import type { HistoryEvent } from '../types/task';
import { historyService } from '../services/historyService';
import toast from 'react-hot-toast';

interface UseHistoryParams {
  search?: string;
  date?: string;
  type?: string;
}

export function useHistory(initialParams: UseHistoryParams = {}) {
  const [events, setEvents]   = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [params, setParams] = useState<UseHistoryParams>(initialParams);

  const fetchHistory = useCallback(async (isLoadMore = false) => {
    const targetPage = isLoadMore ? page + 1 : 1;
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    
    setError(null);
    try {
      const res = await historyService.getAll({
        page: targetPage,
        limit: 20,
        ...params
      });
      
      if (isLoadMore) {
        setEvents(prev => {
          // Filter out duplicates just in case
          const existingIds = new Set(prev.map(e => e.id));
          return [...prev, ...res.data.filter(e => !existingIds.has(e.id))];
        });
      } else {
        setEvents(res.data);
      }
      
      setPage(targetPage);
      setHasMore(res.totalPages ? targetPage < res.totalPages : false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load history');
      toast.error('Failed to load history');
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoading(false);
    }
  }, [page, params]);

  useEffect(() => { 
    fetchHistory(); 
  }, [params]);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchHistory(true);
    }
  };

  return { 
    events, 
    loading, 
    loadingMore,
    hasMore,
    error, 
    refresh: () => fetchHistory(),
    loadMore,
    params,
    setParams
  };
}
