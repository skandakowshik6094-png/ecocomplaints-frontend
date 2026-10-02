import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex'>

      {/* Left Side - Image/Info Panel */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className='absolute inset-0' style={{ background: 'rgba(0,0,0,0.55)' }} />
        <div className='relative z-10 flex flex-col justify-center px-12 text-white'>
          <div className='mb-8'>
            <span className='text-6xl'>🌿</span>
            <h1 className='text-4xl font-extrabold mt-4'>
              Join Eco<span className='text-green-400'>Complaints</span>
            </h1>
            <p className='text-green-200 mt-3 text-lg'>
              Be the voice for your environment
            </p>
          </div>
          <div className='space-y-5'>
            {[
              { icon: '📸', title: 'Upload Photos', desc: 'Capture and report issues with photo evidence' },
              { icon: '📍', title: 'Location Tracking', desc: 'Pin exact locations for faster resolution' },
              { icon: '📊', title: 'Track Progress', desc: 'Monitor your complaint status in real time' },
              { icon: '👷', title: 'Worker Assignment', desc: 'Authority assigns workers to resolve your issue' },
            ].map(item => (
              <div key={item.title} className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-green-500 bg-opacity-30 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <span className='text-xl'>{item.icon}</span>
                </div>
                <div>
                  <p className='font-semibold text-white'>{item.title}</p>
                  <p className='text-gray-300 text-sm'>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center px-6 py-10 bg-gradient-to-br from-green-50 via-white to-green-50'>
        <div className='w-full max-w-md'>

          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md'>
              <span className='text-3xl'>📝</span>
            </div>
            <h2 className='text-3xl font-bold text-gray-800'>Create Account</h2>
            <p className='text-gray-400 mt-1 text-sm'>Join us to report environment issues</p>
          </div>

          {/* Card */}
          <div className='bg-white rounded-3xl shadow-xl p-8'>

            {/* Error */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm flex items-center gap-2'>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

              {/* Full Name */}
              <div className='relative'>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block'>
                  Full Name
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-lg'>👤</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white'
                    type='text' placeholder='Enter your full name'
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block'>
                  Email Address
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-lg'>📧</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white'
                    type='email' placeholder='Enter your email'
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block'>
                  Phone Number
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-lg'>📱</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white'
                    type='tel' placeholder='Enter your phone number'
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})} required />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block'>
                  Password
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-lg'>🔒</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-12 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all bg-gray-50 focus:bg-white'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Min 8 characters'
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})} required />
                  <button type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm'>
                    {showPassword ? '🙈 Hide' : '👁️ Show'}
                  </button>
                </div>
                {/* Password strength bar */}
                {form.password && (() => {
                  const score = (() => {
                    let s = 0;
                    if (form.password.length >= 8) s++;
                    if (/[A-Z]/.test(form.password)) s++;
                    if (/\d/.test(form.password)) s++;
                    if (/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) s++;
                    return s;
                  })();
                  return (
                    <div className='mt-2'>
                      <div className='flex gap-1'>
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                            score >= i
                              ? i <= 1 ? 'bg-red-400'
                              : i <= 2 ? 'bg-yellow-400'
                              : i <= 3 ? 'bg-blue-400'
                              : 'bg-green-500'
                              : 'bg-gray-200'
                          }`} />
                        ))}
                      </div>
                      <p className='text-xs text-gray-400 mt-1'>
                        {score <= 1 ? '🔴 Too weak' :
                         score === 2 ? '🟡 Moderate' :
                         score === 3 ? '🔵 Good' : '🟢 Strong'}
                      </p>
                    </div>
                  );
                })()}
              </div>

              {/* Terms note */}
              <p className='text-xs text-gray-400 text-center'>
                By registering, you agree to help keep our environment clean 🌍
              </p>

              {/* Submit Button */}
              <button
                className='w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-60 text-sm tracking-wide'
                disabled={loading}>
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <span className='animate-spin'>⏳</span> Creating Account...
                  </span>
                ) : '🌿 Create My Account →'}
              </button>
            </form>

            {/* Divider */}
            <div className='flex items-center gap-3 my-5'>
              <div className='flex-1 h-px bg-gray-200' />
              <span className='text-xs text-gray-400'>or</span>
              <div className='flex-1 h-px bg-gray-200' />
            </div>

            {/* Links */}
            <div className='text-center space-y-2'>
              <p className='text-sm text-gray-500'>
                Already have an account?{' '}
                <Link to='/login' className='text-green-600 font-bold hover:underline'>Login here</Link>
              </p>
              <Link to='/' className='text-gray-400 hover:text-gray-600 text-sm block'>← Back to Home</Link>
            </div>
          </div>

          {/* Bottom note */}
          <p className='text-center text-xs text-gray-400 mt-6'>
            🔒 Your data is safe and secure with us
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;