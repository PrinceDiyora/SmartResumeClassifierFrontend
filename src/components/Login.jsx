import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginApi({ email, password });
      if (result.token) {
        alert('Login successful!');
        // Optionally, save token to localStorage or context here
        navigate('/resume');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (err) {
      alert('Login error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 rounded-2xl shadow-2xl border border-blue-100">
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center mb-2 shadow-lg">
            <span className="text-white text-3xl font-bold">SR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your account</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-blue-50 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-blue-50 placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition text-lg"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 