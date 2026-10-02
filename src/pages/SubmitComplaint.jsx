import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CATEGORIES = [
  { value: 'garbage', label: 'Garbage & Waste', icon: '🗑️' },
  { value: 'pollution', label: 'Air Pollution', icon: '🏭' },
  { value: 'water', label: 'Water Issue', icon: '💧' },
  { value: 'noise', label: 'Noise Pollution', icon: '🔊' },
  { value: 'other', label: 'Other Issue', icon: '⚠️' },
];

const SubmitComplaint = () => {
  const [form, setForm] = useState({ title: '', description: '', category: 'garbage', location: '' });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting complaint');
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4'>
      <div className='max-w-2xl mx-auto'>

        {/* Header */}
        <div className='mb-6'>
          <Link to='/dashboard' className='text-green-600 text-sm hover:underline'>
            ← Back to Dashboard
          </Link>
          <h1 className='text-3xl font-bold text-gray-800 mt-2'>Submit Complaint</h1>
          <p className='text-gray-500 mt-1'>Report an environmental issue in your area</p>
        </div>

        {/* Progress Steps */}
        <div className='bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center gap-2'>
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Category' },
            { num: 3, label: 'Photo' },
          ].map((s, i) => (
            <div key={s.num} className='flex items-center flex-1'>
              <div className='flex items-center gap-2'>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.num ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-sm font-medium ${step >= s.num ? 'text-green-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div className={`flex-1 h-1 mx-2 rounded-full ${step > s.num ? 'bg-green-400' : 'bg-gray-100'}`}></div>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>

            {/* STEP 1: Basic Details */}
            <div className='p-6 border-b border-gray-50'>
              <h2 className='text-lg font-bold text-gray-700 mb-4 flex items-center gap-2'>
                <span className='w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold'>1</span>
                Complaint Details
              </h2>
              <div className='flex flex-col gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 mb-1'>Complaint Title *</label>
                  <input
                    className='w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50'
                    placeholder='e.g. Garbage not collected for 3 days'
                    value={form.title}
                    onChange={e => { setForm({...form, title: e.target.value}); setStep(Math.max(step, 1)); }}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 mb-1'>Description *</label>
                  <textarea
                    className='w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50'
                    placeholder='Describe the issue in detail...'
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-600 mb-1'>📍 Location / Address *</label>
                  <input
                    className='w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-gray-50'
                    placeholder='e.g. MG Road, Near Bus Stop, Bangalore'
                    value={form.location}
                    onChange={e => setForm({...form, location: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* STEP 2: Category */}
            <div className='p-6 border-b border-gray-50'>
              <h2 className='text-lg font-bold text-gray-700 mb-4 flex items-center gap-2'>
                <span className='w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold'>2</span>
                Select Category
              </h2>
              <div className='grid grid-cols-3 gap-3 sm:grid-cols-5'>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type='button'
                    onClick={() => { setForm({...form, category: cat.value}); setStep(Math.max(step, 2)); }}
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

            {/* STEP 3: Photo */}
            <div className='p-6'>
              <h2 className='text-lg font-bold text-gray-700 mb-4 flex items-center gap-2'>
                <span className='w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold'>3</span>
                Upload Photo
                <span className='text-xs font-normal text-gray-400'>(Optional)</span>
              </h2>

              {!preview ? (
                <label className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:border-green-400 hover:bg-green-50 transition-all'>
                  <div className='text-center'>
                    <div className='text-4xl mb-2'>📸</div>
                    <p className='text-sm font-semibold text-gray-600'>Click to upload or take photo</p>
                    <p className='text-xs text-gray-400 mt-1'>On mobile: opens camera directly</p>
                  </div>
                  <input
                    type='file'
                    accept='image/*'
                    capture='environment'
                    onChange={e => { handlePhoto(e); setStep(Math.max(step, 3)); }}
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
                    className='absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-red-600'>
                    ✕
                  </button>
                  <p className='text-xs text-green-600 mt-2 font-medium'>✅ Photo added successfully</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className='px-6 pb-6'>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl'
              >
                {loading ? (
                  <span className='flex items-center justify-center gap-2'>
                    <span className='animate-spin'>⏳</span> Submitting...
                  </span>
                ) : '🌿 Submit Complaint'}
              </button>
              <p className='text-center text-xs text-gray-400 mt-3'>
                Your complaint will be reviewed by the authority team
              </p>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;