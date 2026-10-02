import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpassword, 4=success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/password/forgot-password', { email });
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/password/verify-otp', { email, otp });
      setMessage(data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    }
    setLoading(false);
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/password/reset-password', { email, otp, newPassword });
      setMessage(data.message);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>

        {/* Header */}
        <div className='text-center mb-8'>
          <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-4xl'>🔐</span>
          </div>
          <h2 className='text-3xl font-bold text-gray-800'>Forgot Password</h2>
          <p className='text-gray-400 mt-1 text-sm'>Reset your EcoComplaints password</p>
        </div>

        {/* Progress Steps */}
        <div className='flex items-center justify-center mb-8'>
          {[1, 2, 3].map((s, i) => (
            <div key={s} className='flex items-center'>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > s ? 'bg-green-500 text-white' :
                step === s ? 'bg-green-600 text-white shadow-lg scale-110' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step > s ? '✓' : s}
              </div>
              {i < 2 && (
                <div className={`w-16 h-1 mx-1 rounded transition-all ${step > s ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className='flex justify-between text-xs text-gray-400 mb-6 px-2'>
          <span>Enter Email</span>
          <span>Verify OTP</span>
          <span>New Password</span>
        </div>

        <div className='bg-white rounded-3xl shadow-xl p-8'>

          {/* Error */}
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2'>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className='flex flex-col gap-4'>
              <div>
                <label className='text-sm font-semibold text-gray-600 mb-1 block'>📧 Registered Email</label>
                <input
                  className='w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all'
                  type='email' placeholder='Enter your registered email'
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <p className='text-xs text-gray-400'>We will send a 6-digit OTP to this email address.</p>
              <button className='bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold transition-all shadow-md disabled:opacity-60'
                disabled={loading}>
                {loading ? '⏳ Sending OTP...' : '📨 Send OTP →'}
              </button>
            </form>
          )}

          {/* Step 2: Enter OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className='flex flex-col gap-4'>
              <div className='bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm'>
                ✅ OTP sent to <strong>{email}</strong>
              </div>
              <div>
                <label className='text-sm font-semibold text-gray-600 mb-1 block'>🔢 Enter 6-Digit OTP</label>
                <input
                  className='w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all text-center text-2xl font-bold tracking-widest'
                  type='text' placeholder='_ _ _ _ _ _' maxLength={6}
                  value={otp} onChange={e => setOtp(e.target.value)} required />
              </div>
              <p className='text-xs text-gray-400'>OTP is valid for 10 minutes only.</p>
              <button className='bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold transition-all shadow-md disabled:opacity-60'
                disabled={loading}>
                {loading ? '⏳ Verifying...' : '✅ Verify OTP →'}
              </button>
              <button type='button' onClick={() => { setStep(1); setError(''); setOtp(''); }}
                className='text-sm text-gray-400 hover:text-gray-600 underline'>
                ← Change email
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
              <div className='bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm'>
                ✅ OTP verified! Set your new password.
              </div>
              <div>
                <label className='text-sm font-semibold text-gray-600 mb-1 block'>🔒 New Password</label>
                <input
                  className='w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all'
                  type='password' placeholder='Enter new password (min 6 characters)'
                  value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div>
                <label className='text-sm font-semibold text-gray-600 mb-1 block'>🔒 Confirm New Password</label>
                <input
                  className='w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all'
                  type='password' placeholder='Re-enter new password'
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              <button className='bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold transition-all shadow-md disabled:opacity-60'
                disabled={loading}>
                {loading ? '⏳ Resetting...' : '🔐 Reset Password →'}
              </button>
            </form>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className='text-center py-4'>
              <div className='text-6xl mb-4'>🎉</div>
              <h3 className='text-xl font-bold text-green-700 mb-2'>Password Reset!</h3>
              <p className='text-gray-500 text-sm mb-6'>Your password has been successfully changed. You can now login with your new password.</p>
              <Link to='/login'
                className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md inline-block'>
                Go to Login →
              </Link>
            </div>
          )}

          {/* Back to login */}
          {step !== 4 && (
            <p className='text-center mt-4 text-sm'>
              <Link to='/login' className='text-gray-400 hover:text-gray-600'>← Back to Login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;