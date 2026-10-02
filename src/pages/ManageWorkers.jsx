import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const DEPARTMENTS = [
  'Garbage & Waste',
  'Water & Drainage',
  'Pollution Control',
  'Noise Complaint',
  'General Maintenance',
  'Other',
];

const ManageWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', department: '' });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchWorkers(); }, []);

  const fetchWorkers = async () => {
    try {
      const { data } = await api.get('/authority/workers');
      setWorkers(data);
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await api.post('/authority/workers', form);
      setWorkers(prev => [data, ...prev]);
      setForm({ name: '', phone: '', email: '', department: '' });
      setShowForm(false);
      setSuccess(`Worker "${data.name}" added successfully!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add worker');
    }
    setAdding(false);
  };

  const handleDelete = async (workerId, workerName) => {
    if (!window.confirm(`Are you sure you want to remove ${workerName}?`)) return;
    try {
      await api.delete(`/authority/workers/${workerId}`);
      setWorkers(prev => prev.filter(w => w._id !== workerId));
      setSuccess(`Worker "${workerName}" removed!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Failed to delete worker.'); }
  };

  if (loading) return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-5xl mb-4'>👷</div>
        <p className='text-blue-600 font-semibold'>Loading workers...</p>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50'>
      <div className='max-w-4xl mx-auto px-4 py-8'>

        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <Link to='/authority' className='text-blue-600 text-sm hover:underline'>
              ← Back to Dashboard
            </Link>
            <h1 className='text-3xl font-bold text-gray-800 mt-1'>👷 Manage Workers</h1>
            <p className='text-gray-500 mt-1'>Add, view and manage field workers</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(''); }}
            className={`px-5 py-2.5 rounded-xl font-semibold shadow-md flex items-center gap-2 transition-all ${
              showForm
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {showForm ? '✕ Cancel' : '+ Add Worker'}
          </button>
        </div>

        {/* Success/Error */}
        {success && (
          <div className='bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 flex items-center gap-2'>
            <span>✅</span> {success}
          </div>
        )}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 flex items-center gap-2'>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Add Worker Form */}
        {showForm && (
          <div className='bg-white rounded-2xl shadow-md p-6 mb-6 border border-blue-100'>
            <h2 className='text-lg font-bold text-gray-700 mb-5 flex items-center gap-2'>
              <span className='w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold'>+</span>
              Add New Worker
            </h2>
            <form onSubmit={handleAdd} className='flex flex-col gap-4'>

              {/* Name */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-1.5'>
                  Worker Name *
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>👤</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50'
                    placeholder='e.g. Raju Kumar'
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-1.5'>
                  Phone Number *
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>📞</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50'
                    placeholder='e.g. 9876543210'
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-1.5'>
                  Email Address
                  <span className='text-gray-400 font-normal ml-1'>(for work assignment notifications)</span>
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>📧</span>
                  <input
                    className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50'
                    placeholder='e.g. raju@gmail.com'
                    type='email'
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className='block text-sm font-semibold text-gray-600 mb-1.5'>
                  Department *
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>🏢</span>
                  <select
                    className='w-full border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-gray-50 appearance-none'
                    value={form.department}
                    onChange={e => setForm({...form, department: e.target.value})}
                    required
                  >
                    <option value=''>Select Department</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Info Box */}
              <div className='bg-blue-50 border border-blue-100 rounded-xl p-3'>
                <p className='text-blue-700 text-xs'>
                  📧 Worker will receive an email notification with complaint details and deadline when assigned work.
                </p>
              </div>

              {/* Buttons */}
              <div className='flex gap-3 mt-2'>
                <button
                  type='submit'
                  disabled={adding}
                  className='flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md'
                >
                  {adding ? '⏳ Adding...' : '👷 Add Worker'}
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                    setForm({ name: '', phone: '', email: '', department: '' });
                  }}
                  className='px-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-200'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div className='bg-white rounded-2xl p-4 shadow-sm border-l-4 border-blue-400'>
            <p className='text-2xl font-bold text-blue-600'>{workers.length}</p>
            <p className='text-gray-500 text-sm'>Total Workers</p>
          </div>
          <div className='bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-400'>
            <p className='text-2xl font-bold text-green-600'>
              {workers.filter(w => w.available).length}
            </p>
            <p className='text-gray-500 text-sm'>Available</p>
          </div>
          <div className='bg-white rounded-2xl p-4 shadow-sm border-l-4 border-orange-400'>
            <p className='text-2xl font-bold text-orange-600'>
              {workers.filter(w => !w.available).length}
            </p>
            <p className='text-gray-500 text-sm'>Busy</p>
          </div>
        </div>

        {/* Workers List */}
        {workers.length === 0 ? (
          <div className='bg-white rounded-2xl p-12 text-center shadow-sm'>
            <div className='text-6xl mb-4'>👷</div>
            <h3 className='text-xl font-bold text-gray-700 mb-2'>No workers yet</h3>
            <p className='text-gray-400 mb-6'>Add your first worker to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className='bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700'
            >
              + Add First Worker
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {workers.map(w => (
              <div key={w._id} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all'>
                <div className='flex justify-between items-start'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl'>
                      👷
                    </div>
                    <div>
                      <h3 className='font-bold text-gray-800'>{w.name}</h3>
                      <p className='text-gray-500 text-sm'>📞 {w.phone}</p>
                      {w.email && (
                        <p className='text-gray-400 text-xs'>📧 {w.email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(w._id, w.name)}
                    className='text-red-400 hover:text-red-600 hover:bg-red-50 w-8 h-8 rounded-lg flex items-center justify-center transition-all'
                    title='Remove worker'
                  >
                    🗑️
                  </button>
                </div>
                <div className='mt-3 flex items-center justify-between'>
                  <span className='bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full'>
                    🏢 {w.department}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    w.available
                      ? 'bg-green-50 text-green-600'
                      : 'bg-orange-50 text-orange-600'
                  }`}>
                    {w.available ? '✅ Available' : '🔄 Busy'}
                  </span>
                </div>
                {w.email && (
                  <div className='mt-2 bg-blue-50 rounded-xl px-3 py-1.5'>
                    <p className='text-blue-600 text-xs'>
                      📧 Email notifications enabled
                    </p>
                  </div>
                )}
                <p className='text-xs text-gray-400 mt-3'>
                  Added: {new Date(w.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageWorkers;