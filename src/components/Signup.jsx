import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup as signupApi } from '../api/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const result = await signupApi({ email, password, confirmpassword: confirmPassword });
      if (result.userId) {
        alert('Signup successful!');
        // Optionally, redirect to login or home page here
      } else {
        alert(result.message || 'Signup failed');
      }
    } catch (err) {
      alert('Signup error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 rounded-2xl shadow-2xl border border-blue-100">
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center mb-2 shadow-lg">
            <span className="text-white text-3xl font-bold">SR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Sign up to get started</p>
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
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition shadow-sm bg-blue-50 placeholder-gray-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-600 transition text-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup; 