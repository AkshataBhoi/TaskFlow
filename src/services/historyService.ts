import type { HistoryEvent, ApiResponse } from '../types/task';
import { MOCK_HISTORY } from '../data/mockData';

const delay = (ms = 400) => new Promise<void>((res) => setTimeout(res, ms));

let events: HistoryEvent[] = [...MOCK_HISTORY];

export const historyService = {
  async getAll(): Promise<ApiResponse<HistoryEvent[]>> {
    await delay();
    const sorted = [...events].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return { data: sorted, message: 'Success', success: true };
  },

  /** Push a new event (called internally when tasks/categories change) */
  push(event: Omit<HistoryEvent, 'id'>): void {
    events = [{ ...event, id: `h${Date.now()}` }, ...events];
  },
};
