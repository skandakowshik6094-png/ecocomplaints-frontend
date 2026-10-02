import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CATEGORIES = [
  { value: 'garbage', label: 'Garbage & Waste', icon: '🗑️' },
  { value: 'pollution', label: 'Air Pollution', icon: '🏭' },
  { value: 'water', label: 'Water Issue', icon: '💧' },
  { value: 'noise', label: 'Noise Pollution', icon: '🔊' },
  { value: 'other', label: 'Other Issue', icon: '⚠️' },
];

const GuestComplaint = () => {
  const [form, setForm] = useState({
    guestName: '',
    guestPhone: '',
    title: '',
    description: '',
    category: 'garbage',
    location: '',
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (photo) formData.append('photo', photo);
    try {
      await api.post('/complaints/guest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting complaint');
    }
    setLoading(false);
  };

  // ✅ SUCCESS PAGE
  if (submitted) return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4'>
      <div className='bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center'>
        <div className='text-7xl mb-4'>✅</div>
        <h2 className='text-2xl font-bold text-gray-800 mb-2'>Complaint Submitted!</h2>
        <p className='text-gray-500 mb-2'>
          Your complaint has been successfully registered.
        </p>
        <p className='text-gray-400 text-sm mb-6'>
          The authority has been notified and will take action soon.
        </p>
        <div className='bg-green-50 border border-green-100 rounded-xl p-4 mb-6 text-left'>
          <p className='text-green-700 text-sm font-semibold mb-1'>📋 What happens next?</p>
          <p className='text-green-600 text-xs'>1. Authority reviews your complaint</p>
          <p className='text-green-600 text-xs'>2. A worker gets assigned</p>
          <p className='text-green-600 text-xs'>3. Issue gets resolved</p>
        </div>
        <div className='flex flex-col gap-3'>
          <button
            onClick={() => { setSubmitted(false); setForm({ guestName: '', guestPhone: '', title: '', description: '', category: 'garbage', location: '' }); setPhoto(null); setPreview(''); }}
            className='w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700'
          >
            Submit Another Complaint
          </button>
          <Link to='/'
            className='w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200 text-center block'>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>

        {/* Header */}
        <div className='mb-6'>
          <Link to='/' className='text-green-600 text-sm hover:underline'>← Back to Home</Link>
          <h1 className='text-3xl font-bold text-gray-800 mt-2'>📸 Quick Complaint</h1>
          <p className='text-gray-500 mt-1'>No account needed — submit directly!</p>
        </div>

        {/* Info Banner */}
        <div className='bg-green-600 text-white rounded-2xl p-4 mb-6 flex items-center gap-3'>
          <span className='text-3xl'>⚡</span>
          <div>
            <p className='font-bold'>Fast & Easy Reporting</p>
            <p className='text-green-100 text-sm'>Just fill your details and submit — no registration required!</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>

            {/* Personal Details */}
            <div className='p-6 border-b border-gray-50'>
              <h2 className='text-lg font-bold text-gray-700 mb-4 flex items-center gap-2'>
                <span className='w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                Your Details
              </h2>
              <div className='flex flex-col gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 mb-1.5'>Your Name *</label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>👤</span>
                    <input
                      className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50'
                      placeholder='e.g. Raju Kumar'
                      value={form.guestName}
                      onChange={e => setForm({...form, guestName: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 mb-1.5'>Phone Number *</label>
                  <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>📞</span>
                    <input
                      className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50'
                      placeholder='e.g. 9876543210'
                      value={form.guestPhone}
                      onChange={e => setForm({...form, guestPhone: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Complaint Details */}
            <div className='p-6 border-b border-gray-50'>
              <h2 className='text-lg font-bold text-gray-700 mb-4 flex items-center gap-2'>
                <span className='w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                Complaint Details
              </h2>
              <div className='flex flex-col gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 mb-1.5'>Title *</label>
                  <input
                    className='w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50'
                    placeholder='e.g. Garbage not collected'
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 mb-1.5'>Description *</label>
                  <textarea
                    className='w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50'
                    placeholder='Describe the problem...'
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 mb-1.5'>📍 Location *</label>
                  <input
                    className='w-full border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50'
                    placeholder='e.g. MG Road, Near Bus Stop'
                    value={form.location}
                    onChange={e => setForm({...form, location: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className='p-6 border-b border-gray-50'>
              <h2 className='text-lg font-bold text-gray-700 mb-4 flex items-center gap-2'>
                <span className='w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold'>3</span>
                Select Category
              </h2>
              <div className='grid grid-cols-3 gap-3 sm:grid-cols-5'>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type='button'
                    onClick={() => setForm({...form, category: cat.value})}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      form.category === cat.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-green-200'
                    }`}
                  >
                    <span className='text-2xl'>{cat.icon}</span>
                    <span className='text-xs font-medium text-center leading-tight'>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div className='p-6'>
              <h2 className='text-lg font-bold text-gray-700 mb-4 flex items-center gap-2'>
                <span className='w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold'>4</span>
                Take / Upload Photo
                <span className='text-xs font-normal text-gray-400'>(Optional but helpful)</span>
              </h2>
              {!preview ? (
                <label className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:border-green-400 hover:bg-green-50 transition-all'>
                  <div className='text-center'>
                    <div className='text-5xl mb-2'>📸</div>
                    <p className='text-sm font-semibold text-gray-600'>Tap to take photo or upload</p>
                    <p className='text-xs text-gray-400 mt-1'>On mobile: opens camera directly</p>
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    capture='environment'
                    onChange={handlePhoto}
                    className='hidden'
                  />
                </label>
              ) : (
                <div className='relative'>
                  <img src={preview} alt='preview'
                    className='w-full h-48 object-cover rounded-xl border border-gray-100' />
                  <button
                    type='button'
                    onClick={() => { setPhoto(null); setPreview(''); }}
                    className='absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-red-600'
                  >
                    ✕
                  </button>
                  <p className='text-xs text-green-600 mt-2 font-medium'>✅ Photo added</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='px-6 pb-6'>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <span className='animate-spin'>⏳</span> Submitting...
                  </span>
                ) : '🌿 Submit Complaint'}
              </button>
              <p className='text-center text-xs text-gray-400 mt-3'>
                Want to track your complaint?{' '}
                <Link to='/register' className='text-green-600 font-semibold hover:underline'>
                  Create a free account →
                </Link>
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestComplaint;