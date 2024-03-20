'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

function LoginPage() {
  const route = useRouter();
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const form = { email, password };
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        setError('Failed to authenticate user');
        return;
      }
      const data = await response.json();
      if (data?.token) {
        route.push('/');
      } else {
        setError('Failed to authenticate user');
      }
    } catch (err) {
      setError('Failed to authenticate user');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-900 to-white">
      <div className="flex flex-col items-center justify-center bg-white bg-opacity-90 p-10 rounded-md shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 my-5">Welcome Back!</h1>
        <form onSubmit={onSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
