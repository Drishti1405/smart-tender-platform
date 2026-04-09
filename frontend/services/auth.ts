import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/auth`
  : 'https://smart-tender-platform.vercel.app/api/auth';

export const authService = {
  async register(data: Omit<User, 'id'>) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');
      return result;
    } catch (err: any) {
      throw new Error(err.message === 'Failed to fetch' || err.message.includes('Load failed')
        ? `Cannot connect to ${API_URL}. Check Netlify env vars.`
        : err.message);
    }
  },

  async login(email: string, password?: string) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Login failed');
      return result; // contains { token, user }
    } catch (err: any) {
      throw new Error(err.message === 'Failed to fetch' || err.message.includes('Load failed')
        ? `Connection failed to ${API_URL}. Verify your backend URL.`
        : err.message);
    }
  }
};
