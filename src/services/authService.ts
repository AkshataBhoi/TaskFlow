import api from './api';
import type { User } from '../types/task';

interface AuthResponse {
  success: boolean;
  message: string;
  data: User & { token: string };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  async register(fullName: string, email: string, password: string): Promise<AuthResponse> {
    const res = await api.post('/auth/register', { fullName, email, password });
    return res.data;
  },
};
