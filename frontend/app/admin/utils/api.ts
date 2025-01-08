import { getAuthToken } from './auth';

// Use environment variable with fallback
const API_URL = 'https://pizzapopote.com/api';
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };
  
    const configuredOptions: RequestInit = {
      ...options,
      credentials: 'include',
      headers,
    };
  
    try {
      const response = await fetch(`${API_URL}${endpoint}`, configuredOptions);
    
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin';
      }
      throw new Error('Unauthorized');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Request failed with status ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}