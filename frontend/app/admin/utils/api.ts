import { getAuthToken } from './auth';

const API_URL = 'https://64.226.114.142:3443/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
 const token = getAuthToken();
 
 const headers = {
   'Content-Type': 'application/json',
   'Authorization': `Bearer ${token}`,
   'Origin': window.location.origin, // Add origin header
   ...options.headers,
 };

 const configuredOptions: RequestInit = {
   ...options,
   credentials: 'include', // Enable CORS with credentials
   headers,
 };

 const response = await fetch(`${API_URL}${endpoint}`, configuredOptions);

 // Error handling
 if (response.status === 401) {
   window.location.href = '/admin';
   throw new Error('Unauthorized');
 }

 if (!response.ok) {
   const errorData = await response.json().catch(() => null);
   throw new Error(errorData?.message || `Request failed with status ${response.status}`);
 }

 return response;
}