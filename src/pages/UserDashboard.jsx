import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', dot: 'bg-yellow-400', label: 'Pending' },
  'in-progress': { color: 'bg-blue-100 text-blue-700 border-blue-300', dot: 'bg-blue-400', label: 'In Progress' },
  resolved: { color: 'bg-green-100 text-green-700 border-green-300', dot: 'bg-green-400', label: 'Resolved' },
};

const categoryIcons = {
  garbage: '🗑️', pollution: '🏭', water: '💧', noise: '🔊', other: '⚠️'
};

const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];
const CAT_COLORS = ['#6366f1', '#f43f5e', '#06b6d4', '#f97316', '#8b5cf6'];

// ✅ ReReport Button
const ReReportButton = ({ complaint, onReReport }) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(complaint.reReported || false);
  const [count, setCount] = useState(complaint.reReportCount || 0);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReReport = async () => {
    setLoading(true);
    try {
      const { data } = await api.put(`/complaints/re-report/${complaint._id}`);
      setDone(true);
      setCount(data.complaint.reReportCount);
      onReReport(data.complaint);
      setShowConfirm(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to re-report');
    }
    setLoading(false);
  };

  if (complaint.status === 'resolved') return null;

  return (
    <div className='mx-5 mb-3'>
      {!showConfirm ? (
        <div className='flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl p-3'>
          <div>
            <p className='text-orange-700 text-sm font-semibold'>⚠️ Issue still not resolved?</p>
            <p className='text-orange-500 text-xs mt-0.5'>
              Alert the authority to take immediate action
              {count > 0 && ` • Re-reported ${count} time(s)`}
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={done}
            className={`ml-3 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              done
                ? 'bg-orange-100 text-orange-400 cursor-default'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {done ? '✅ Alerted' : '🔔 Re-Report'}
          </button>
        </div>
      ) : (
        <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
          <p className='text-red-700 font-semibold text-sm mb-1'>🚨 Confirm Re-Report</p>
          <p className='text-red-500 text-xs mb-3'>
            This will send an urgent alert email to the authority.
          </p>
          <div className='flex gap-2'>
            <button
              onClick={handleReReport}
              disabled={loading}
              className='flex-1 bg-red-500 text-white py-2 rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50'
            >
              {loading ? '⏳ Sending...' : '🔔 Yes, Send Alert'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className='flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/complaints/my').then(r => {
      setComplaints(r.data);
      setLoading(false);
    });
  }, []);

  const counts = {
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  const pieData = [
    { name: 'Pending', value: counts.pending },
    { name: 'In Progress', value: counts.inProgress },
    { name: 'Resolved', value: counts.resolved },
  ].filter(d => d.value > 0);

  const categories = ['garbage', 'pollution', 'water', 'noise', 'other'];
  const categoryData = categories.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: complaints.filter(c => c.category === cat).length,
  })).filter(d => d.count > 0);

  const monthlyData = () => {
    const months = {};
    complaints.forEach(c => {
      const month = new Date(c.createdAt).toLocaleString('default', { month: 'short' });
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count }));
  };

  if (loading) return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-5xl mb-4'>🌿</div>
        <p className='text-green-600 font-semibold text-lg'>Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>

        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-800'>👋 Hello, {user?.name}!</h1>
          <p className='text-gray-500 mt-1'>Welcome to your environment complaint dashboard</p>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-2xl p-2 shadow-sm mb-6 flex gap-2'>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'complaints', icon: '📋', label: 'My Complaints' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Stats */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
              {[
                { label: 'Total', count: complaints.length, color: 'border-gray-400', text: 'text-gray-600', icon: '📋' },
                { label: 'Pending', count: counts.pending, color: 'border-yellow-400', text: 'text-yellow-600', icon: '⏳' },
                { label: 'In Progress', count: counts.inProgress, color: 'border-blue-400', text: 'text-blue-600', icon: '🔄' },
                { label: 'Resolved', count: counts.resolved, color: 'border-green-400', text: 'text-green-600', icon: '✅' },
              ].map(s => (
                <div key={s.label} className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${s.color}`}>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className={`text-3xl font-bold ${s.text}`}>{s.count}</p>
                      <p className='text-gray-500 text-sm mt-1'>{s.label}</p>
                    </div>
                    <span className='text-2xl'>{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
              <div className='bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-lg font-bold text-gray-700 mb-4'>📊 Complaint Status</h3>
                {pieData.length === 0 ? (
                  <div className='h-48 flex items-center justify-center text-gray-400'>
                    <div className='text-center'><div className='text-4xl mb-2'>📭</div><p>No complaints yet</p></div>
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width='100%' height={220}>
                      <PieChart>
                        <Pie data={pieData} cx='50%' cy='50%' innerRadius={60} outerRadius={90} paddingAngle={5} dataKey='value'>
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className='flex justify-center gap-4 mt-2'>
                      {pieData.map((entry, i) => (
                        <div key={i} className='flex items-center gap-1'>
                          <div className='w-3 h-3 rounded-full' style={{ backgroundColor: COLORS[i] }}></div>
                          <span className='text-xs text-gray-500'>{entry.name} ({entry.value})</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className='bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-lg font-bold text-gray-700 mb-4'>🗂️ Complaints by Category</h3>
                {categoryData.length === 0 ? (
                  <div className='h-48 flex items-center justify-center text-gray-400'>
                    <div className='text-center'><div className='text-4xl mb-2'>📭</div><p>No complaints yet</p></div>
                  </div>
                ) : (
                  <ResponsiveContainer width='100%' height={220}>
                    <BarChart data={categoryData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                      <XAxis dataKey='name' tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey='count' radius={[6, 6, 0, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={index} fill={CAT_COLORS[index % CAT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Line Chart */}
            <div className='bg-white rounded-2xl shadow-sm p-6 mb-6'>
              <h3 className='text-lg font-bold text-gray-700 mb-4'>📈 Monthly Complaint Trend</h3>
              {monthlyData().length === 0 ? (
                <div className='h-48 flex items-center justify-center text-gray-400'>
                  <div className='text-center'><div className='text-4xl mb-2'>📭</div><p>No data yet</p></div>
                </div>
              ) : (
                <ResponsiveContainer width='100%' height={200}>
                  <LineChart data={monthlyData()} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                    <XAxis dataKey='month' tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type='monotone' dataKey='count' stroke='#10b981' strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Resolution Rate */}
            <div className='bg-white rounded-2xl shadow-sm p-6'>
              <h3 className='text-lg font-bold text-gray-700 mb-4'>🎯 Resolution Rate</h3>
              <div className='flex items-center gap-4'>
                <div className='flex-1'>
                  <div className='flex justify-between text-sm mb-2'>
                    <span className='text-gray-500'>Resolved</span>
                    <span className='font-bold text-green-600'>
                      {complaints.length > 0 ? Math.round((counts.resolved / complaints.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className='h-4 bg-gray-100 rounded-full overflow-hidden'>
                    <div className='h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all'
                      style={{ width: `${complaints.length > 0 ? Math.round((counts.resolved / complaints.length) * 100) : 0}%` }}>
                    </div>
                  </div>
                </div>
                <div className='text-3xl font-bold text-green-600'>
                  {complaints.length > 0 ? Math.round((counts.resolved / complaints.length) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold text-gray-700'>My Complaints ({complaints.length})</h2>
              <Link to='/submit' className='bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 font-semibold text-sm shadow-md'>
                + New Complaint
              </Link>
            </div>

            {complaints.length === 0 && (
              <div className='bg-white rounded-2xl p-12 text-center shadow-sm'>
                <div className='text-6xl mb-4'>📋</div>
                <h3 className='text-xl font-bold text-gray-700 mb-2'>No complaints yet</h3>
                <p className='text-gray-400 mb-6'>Submit your first environment complaint</p>
                <Link to='/submit' className='bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-semibold'>
                  Submit Complaint
                </Link>
              </div>
            )}

            <div className='flex flex-col gap-4'>
              {complaints.map(c => {
                const s = statusConfig[c.status] || statusConfig.pending;
                return (
                  <div key={c._id} className='bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all'>

                    {/* Header */}
                    <div className='flex justify-between items-start p-5 pb-3'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='text-xl'>{categoryIcons[c.category] || '⚠️'}</span>
                          <h3 className='font-bold text-gray-800 text-lg'>{c.title}</h3>
                        </div>
                        <p className='text-gray-500 text-sm'>{c.description}</p>
                      </div>
                      <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold border ${s.color} flex items-center gap-1`}>
                        <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>
                        {s.label}
                      </span>
                    </div>

                    {/* Photo */}
                    {c.photo && (
                      <div className='px-5 pb-3'>
                        <img src={c.photo} alt='complaint' className='w-full h-48 object-cover rounded-xl border border-gray-100' />
                      </div>
                    )}

                    {/* Info */}
                    <div className='px-5 pb-3 flex flex-wrap gap-3 text-xs text-gray-400'>
                      <span>📍 {c.location}</span>
                      <span>🗂 {c.category}</span>
                      <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* ✅ RE-REPORT BUTTON */}
                    {c.status !== 'resolved' && (
                      <ReReportButton
                        complaint={c}
                        onReReport={(updated) => {
                          setComplaints(prev => prev.map(comp =>
                            comp._id === updated._id ? { ...comp, ...updated } : comp
                          ));
                        }}
                      />
                    )}

                    {/* Worker Info */}
                    {c.assignedWorker && (
                      <div className='mx-5 mb-4 bg-blue-50 border border-blue-100 rounded-xl p-3'>
                        <p className='text-blue-700 text-sm font-semibold'>👷 Worker: {c.assignedWorker.name}</p>
                        <p className='text-blue-500 text-xs mt-1'>📞 {c.assignedWorker.phone} | 🏢 {c.assignedWorker.department}</p>
                      </div>
                    )}

                    {/* Worker Note */}
                    {c.workerNote && (
                      <div className='mx-5 mb-4 bg-gray-50 border border-gray-100 rounded-xl p-3'>
                        <p className='text-gray-600 text-sm'>📝 Note: {c.workerNote}</p>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className='px-5 pb-4'>
                      <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 rounded-full bg-yellow-400'></div>
                        <div className='flex-1 h-1 rounded-full bg-gray-100'>
                          <div className={`h-1 rounded-full transition-all ${
                            c.status === 'pending' ? 'w-1/3 bg-yellow-400' :
                            c.status === 'in-progress' ? 'w-2/3 bg-blue-400' : 'w-full bg-green-400'
                          }`}></div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${c.status !== 'pending' ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                        <div className='flex-1 h-1 rounded-full bg-gray-100'>
                          <div className={`h-1 rounded-full transition-all ${c.status === 'resolved' ? 'w-full bg-green-400' : 'w-0'}`}></div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${c.status === 'resolved' ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                      </div>
                      <div className='flex justify-between text-xs text-gray-400 mt-1'>
                        <span>Submitted</span>
                        <span>In Progress</span>
                        <span>Resolved</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;