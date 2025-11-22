import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, Loader2, CheckCircle, UserPlus, AlertCircle, User, AtSign } from 'lucide-react';
import { signup } from '../../redux/slices/auth.slice';
import { Link } from 'react-router-dom'

const SignUp = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    // 1. Client-side Validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // 2. Dispatch Signup Action with new fields
    dispatch(signup ({ name, username, email, password }));
  };

  // Success State
  if (isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="rounded-3xl bg-white p-12 text-center shadow-2xl ring-1 ring-gray-100 animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Account Created!</h2>
          <p className="mt-2 text-lg text-gray-600">Welcome aboard, {user.name}.</p>
          <p className="mt-1 text-sm text-gray-400">@{user.username}</p>
          <p className="mt-4 text-sm text-gray-400">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f3f4f6] overflow-hidden font-sans">
      
      {/* DECORATIVE BLOBS */}
      <div className="absolute top-[-5%] right-[-5%] h-96 w-96 rounded-full bg-purple-300/20 blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />

      {/* GLASS CARD */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-md ring-1 ring-gray-200 sm:p-10">
          
          {/* Header */}
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-indigo-50 p-3 text-indigo-600 shadow-sm">
              <UserPlus className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create Account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Join us today! It takes less than a minute.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit} autoComplete="off">
            
            {/* Global Error (API) */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 animate-shake">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            {/* Local Error (Password Mismatch) */}
            {passwordError && (
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 border border-amber-100 animate-shake">
                <AlertCircle className="h-4 w-4" />
                <p>{passwordError}</p>
              </div>
            )}

            <div className="space-y-4">
              
              {/* Full Name Field */}
              <div className="group relative">
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="group relative">
                <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">Username</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <AtSign className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    placeholder="johndoe123"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="group relative">
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group relative">
                <label htmlFor="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Create a password"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="group relative">
                <label htmlFor="confirmPassword" class="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className={`h-5 w-5 transition-colors ${password && confirmPassword && password === confirmPassword ? 'text-green-500' : 'text-gray-400 group-focus-within:text-indigo-500'}`} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Repeat password"
                    className={`block w-full rounded-xl border bg-gray-50 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium
                      ${passwordError ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-indigo-500'}
                    `}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError(''); // Clear error on typing
                    }}
                  />
                  
                  {/* Visual Match Indicator */}
                  {password && confirmPassword && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {password === confirmPassword ? (
                        <CheckCircle className="h-5 w-5 text-green-500 animate-bounce-short" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                ${isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 transform hover:-translate-y-0.5'
                }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to={'/login'} 
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;