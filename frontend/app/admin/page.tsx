'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/app/admin/utils/auth';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function validateExistingToken() {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://pizzapopote.com/api/auth/validate', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          router.push('/admin/dashboard');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error validating token:', error);
      }
    }

    validateExistingToken();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://pizzapopote.com/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        router.push('/admin/dashboard');
      } else {
        setError('Invalid password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error logging in:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}