import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AuthorityLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      if (data.user.role !== 'authority') {
        setError('Access denied! You are not an authority user.');
        setLoading(false);
        return;
      }
      login(data.user, data.token);
      navigate('/authority');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex'>

      {/* LEFT SIDE - Decorative Panel */}
      <div className='hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 flex-col items-center justify-center p-12 relative overflow-hidden'>
        {/* Background circles */}
        <div className='absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2'></div>
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2'></div>
        <div className='absolute top-1/3 right-1/4 w-32 h-32 bg-white opacity-5 rounded-full'></div>

        {/* Content */}
        <div className='relative z-10 text-center text-white'>
          <div className='text-7xl mb-6'>🏛️</div>
          <h1 className='text-4xl font-bold mb-4'>Authority Portal</h1>
          <p className='text-blue-100 text-lg mb-8 leading-relaxed'>
            Manage complaints efficiently<br/>and serve your community
          </p>

          {/* Feature list */}
          <div className='flex flex-col gap-4 text-left'>
            {[
              { icon: '📋', text: 'View all citizen complaints' },
              { icon: '👷', text: 'Assign workers to complaints' },
              { icon: '🔄', text: 'Update complaint resolution status' },
              { icon: '📊', text: 'Track complaint statistics' },
            ].map((f, i) => (
              <div key={i} className='flex items-center gap-3 bg-white bg-opacity-10 rounded-xl px-4 py-3'>
                <span className='text-2xl'>{f.icon}</span>
                <span className='text-blue-50 text-sm font-medium'>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-white'>
        <div className='w-full max-w-md'>

          {/* Mobile Logo */}
          <div className='lg:hidden text-center mb-8'>
            <div className='text-5xl mb-2'>🏛️</div>
            <h1 className='text-2xl font-bold text-blue-700'>Authority Portal</h1>
          </div>

          {/* Form Card */}
          <div className='bg-white rounded-3xl shadow-xl p-8 border border-gray-100'>

            {/* Header */}
            <div className='text-center mb-8'>
              <div className='w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <span className='text-3xl'>🏛️</span>
              </div>
              <h2 className='text-2xl font-bold text-gray-800'>Authority Login</h2>
              <p className='text-gray-400 text-sm mt-1'>Login to manage and resolve complaints</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm flex items-center gap-2'>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

              {/* Email */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-1.5'>
                  Authority Email
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>📧</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 text-gray-800'
                    type='email'
                    placeholder='authority@example.com'
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-1.5'>
                  Password
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>🔒</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-12 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 text-gray-800'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-base hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl mt-2'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <span className='animate-spin'>⏳</span> Logging in...
                  </span>
                ) : 'Login as Authority →'}
              </button>

            </form>

            {/* Warning Box */}
            <div className='mt-5 bg-blue-50 border border-blue-100 rounded-xl p-3'>
              <p className='text-blue-600 text-xs text-center'>
                🔐 This portal is restricted to authorized personnel only
              </p>
            </div>

            {/* Back to Home */}
            <p className='text-center mt-4'>
              <Link to='/' className='text-gray-400 text-xs hover:text-gray-600'>
                ← Back to Home
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityLogin;