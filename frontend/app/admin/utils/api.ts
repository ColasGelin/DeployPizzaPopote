import { getAuthToken } from './auth';

const API_URL = 'https://64.226.114.142:3443/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token is invalid or expired
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }

  return response;
}