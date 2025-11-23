import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, Loader2, CheckCircle } from 'lucide-react';
import { login } from '../../redux/slices/auth.slice';
import { showToast } from '../../redux/slices/toast.slice'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch ();
  const navigate = useNavigate ();
  
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  const resetDetails = () => {
        setEmail (""); setPassword ("");
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
            const res = await dispatch (login ({email, password}));
            if (res.payload) navigate('/', { replace: true });
            else resetDetails();
        } catch (error) {
            dispatch (showToast ({ message: error.message, type: 'error' }));
        }
  };

  // Success State - Light Version
  if (isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="rounded-3xl bg-white p-12 text-center shadow-2xl ring-1 ring-gray-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome, {user.name}!</h2>
          <p className="mt-2 text-gray-500">Redirecting you to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    // MAIN CONTAINER: Light Pastel Gradient
    <div className="relative flex min-h-screen items-center justify-center bg-[#f3f4f6] overflow-hidden">
      
      {/* DECORATIVE BACKGROUND BLOBS (Soft Colors) */}
      <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

      {/* CENTERED CARD - White Glass Effect */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="overflow-hidden rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-md ring-1 ring-gray-200 sm:p-10">
          
          {/* Header */}
          <div className="text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete='off'>
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Email Field */}
              <div className="group relative">
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
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

              {/* Password Field */}
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
                    placeholder="••••••••"
                    className="block w-full rounded-xl border-gray-200 bg-gray-50 py-3 pl-10 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Extra Links */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-500 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
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
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to={'/create-account'} className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create free account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;