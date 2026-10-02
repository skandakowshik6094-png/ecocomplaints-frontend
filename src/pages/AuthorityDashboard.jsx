import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend
} from 'recharts';

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', dot: 'bg-yellow-400', label: 'Pending' },
  'in-progress': { color: 'bg-blue-100 text-blue-700 border-blue-300', dot: 'bg-blue-400', label: 'In Progress' },
  resolved: { color: 'bg-green-100 text-green-700 border-green-300', dot: 'bg-green-400', label: 'Resolved' },
};

const categoryIcons = {
  garbage: '🗑️', pollution: '🏭', water: '💧', noise: '🔊', other: '⚠️'
};

const STATUS_COLORS = ['#f59e0b', '#3b82f6', '#10b981'];
const CAT_COLORS = ['#6366f1', '#f43f5e', '#06b6d4', '#f97316', '#8b5cf6'];

const AuthorityDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selected, setSelected] = useState({});
  const [deadlines, setDeadlines] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    Promise.all([
      api.get('/authority/complaints'),
      api.get('/authority/workers')
    ]).then(([c, w]) => {
      setComplaints(c.data);
      setWorkers(w.data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (complaintId, status) => {
    const { data } = await api.put(`/authority/status/${complaintId}`, { status });
    setComplaints(prev => prev.map(c => c._id === complaintId ? data : c));
  };

  const assign = async (complaintId) => {
    const workerId = selected[complaintId] ||
      complaints.find(c => c._id === complaintId)?.assignedWorker?._id;

    if (!workerId) return alert('Please select a worker first');

    const existingDeadline = complaints.find(
      c => c._id === complaintId
    )?.deadline;

    const deadline = deadlines[complaintId] ||
      (existingDeadline
        ? new Date(existingDeadline).toISOString().split('T')[0]
        : null);

    if (!deadline) return alert('Please set a deadline first');

    try {
      const { data } = await api.put(`/authority/assign/${complaintId}`, {
        workerId,
        deadline,
      });

      setComplaints(prev =>
        prev.map(c => c._id === complaintId ? data : c)
      );

      setSelected(prev => ({
        ...prev,
        [complaintId]: workerId
      }));

      setDeadlines(prev => ({
        ...prev,
        [complaintId]: deadline
      }));

      alert('Worker assigned and notified successfully');
    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Failed to assign worker'
      );
    }
  };

  const filtered = filter === 'all' ? complaints :
    filter === 'guest' ? complaints.filter(c => c.isGuest) :
    complaints.filter(c => c.status === filter);

  const counts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    reReported: complaints.filter(c => c.reReported && c.status !== 'resolved').length,
    guest: complaints.filter(c => c.isGuest).length,
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
      const month = new Date(c.createdAt).toLocaleString(
        'default',
        { month: 'short' }
      );

      months[month] = (months[month] || 0) + 1;
    });

    return Object.entries(months).map(
      ([month, count]) => ({ month, count })
    );
  };

  const workerData = workers.map(w => ({
    name: w.name.split(' ')[0],
    assigned: complaints.filter(
      c => c.assignedWorker?._id === w._id
    ).length,
    resolved: complaints.filter(
      c =>
        c.assignedWorker?._id === w._id &&
        c.status === 'resolved'
    ).length,
  })).filter(w => w.assigned > 0);

  if (loading) return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
      <div className='text-center'>
        <div className='text-5xl mb-4'>🏛️</div>
        <p className='text-blue-600 font-semibold text-lg'>
          Loading dashboard...
        </p>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>

        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>
              🏛️ Authority Dashboard
            </h1>

            <p className='text-gray-500 mt-1'>
              Manage and resolve environment complaints
            </p>
          </div>

          <Link
            to='/manage-workers'
            className='bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-md flex items-center gap-2 text-sm'
          >
            👷 Manage Workers
          </Link>
        </div>

        {/* Re-Reported Alert */}
        {counts.reReported > 0 && (
          <div className='bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-center gap-3'>
            <span className='text-3xl'>🚨</span>

            <div className='flex-1'>
              <p className='text-red-700 font-bold'>
                {counts.reReported} complaint(s) re-reported!
              </p>

              <p className='text-red-500 text-sm'>
                Citizens flagged these as unresolved. Take immediate action!
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('complaints');
                setFilter('all');
              }}
              className='bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600'
            >
              View Now
            </button>
          </div>
        )}

        {/* Guest Banner */}
        {counts.guest > 0 && (
          <div className='bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-center gap-3'>
            <span className='text-3xl'>📸</span>

            <div className='flex-1'>
              <p className='text-orange-700 font-bold'>
                {counts.guest} guest complaint(s) submitted!
              </p>

              <p className='text-orange-500 text-sm'>
                Submitted without login. Review and take action.
              </p>
            </div>

            <button
              onClick={() => {
                setActiveTab('complaints');
                setFilter('guest');
              }}
              className='bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600'
            >
              View Guest
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className='bg-white rounded-2xl p-2 shadow-sm mb-6 flex flex-col gap-2 w-fit'>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'complaints', icon: '📋', label: 'Complaints' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-56 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}

              {tab.id === 'complaints' && counts.reReported > 0 && (
                <span className='bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                  {counts.reReported}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div>

            {/* Stats */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
              {[
                {
                  label: 'Total',
                  count: counts.all,
                  color: 'border-gray-400',
                  text: 'text-gray-600',
                  icon: '📋'
                },
                {
                  label: 'Pending',
                  count: counts.pending,
                  color: 'border-yellow-400',
                  text: 'text-yellow-600',
                  icon: '⏳'
                },
                {
                  label: 'In Progress',
                  count: counts.inProgress,
                  color: 'border-blue-400',
                  text: 'text-blue-600',
                  icon: '🔄'
                },
                {
                  label: 'Resolved',
                  count: counts.resolved,
                  color: 'border-green-400',
                  text: 'text-green-600',
                  icon: '✅'
                },
              ].map(s => (
                <div
                  key={s.label}
                  className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 ${s.color}`}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className={`text-3xl font-bold ${s.text}`}>
                        {s.count}
                      </p>

                      <p className='text-gray-500 text-sm mt-1'>
                        {s.label}
                      </p>
                    </div>

                    <span className='text-2xl'>
                      {s.icon}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Stats */}
            <div className='grid grid-cols-2 gap-4 mb-6'>
              <div className='bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3'>
                <span className='text-3xl'>📸</span>

                <div>
                  <p className='text-2xl font-bold text-orange-600'>
                    {counts.guest}
                  </p>

                  <p className='text-orange-500 text-sm'>
                    Guest Complaints
                  </p>
                </div>
              </div>

              <div className='bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3'>
                <span className='text-3xl'>🚨</span>

                <div>
                  <p className='text-2xl font-bold text-red-600'>
                    {counts.reReported}
                  </p>

                  <p className='text-red-500 text-sm'>
                    Re-Reported (Urgent)
                  </p>
                </div>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>

              <div className='bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-lg font-bold text-gray-700 mb-4'>
                  📊 Complaint Status Overview
                </h3>

                {pieData.length === 0 ? (
                  <div className='h-48 flex items-center justify-center text-gray-400'>
                    <div className='text-center'>
                      <div className='text-4xl mb-2'>📭</div>
                      <p>No complaints yet</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width='100%' height={220}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx='50%'
                          cy='50%'
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey='value'
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className='flex justify-center gap-4 mt-2'>
                      {pieData.map((entry, i) => (
                        <div
                          key={i}
                          className='flex items-center gap-1'
                        >
                          <div
                            className='w-3 h-3 rounded-full'
                            style={{
                              backgroundColor: STATUS_COLORS[i]
                            }}
                          ></div>

                          <span className='text-xs text-gray-500'>
                            {entry.name} ({entry.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className='bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-lg font-bold text-gray-700 mb-4'>
                  🗂️ Complaints by Category
                </h3>

                {categoryData.length === 0 ? (
                  <div className='h-48 flex items-center justify-center text-gray-400'>
                    <div className='text-center'>
                      <div className='text-4xl mb-2'>📭</div>
                      <p>No complaints yet</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width='100%' height={220}>
                    <BarChart
                      data={categoryData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 5
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='#f0f0f0'
                      />

                      <XAxis
                        dataKey='name'
                        tick={{ fontSize: 11 }}
                      />

                      <YAxis
                        tick={{ fontSize: 11 }}
                      />

                      <Tooltip />

                      <Bar
                        dataKey='count'
                        radius={[6, 6, 0, 0]}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={CAT_COLORS[index % CAT_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>

              <div className='bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-lg font-bold text-gray-700 mb-4'>
                  📈 Monthly Complaint Trend
                </h3>

                {monthlyData().length === 0 ? (
                  <div className='h-48 flex items-center justify-center text-gray-400'>
                    <div className='text-center'>
                      <div className='text-4xl mb-2'>📭</div>
                      <p>No data yet</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width='100%' height={200}>
                    <LineChart
                      data={monthlyData()}
                      margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 5
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='#f0f0f0'
                      />

                      <XAxis
                        dataKey='month'
                        tick={{ fontSize: 11 }}
                      />

                      <YAxis
                        tick={{ fontSize: 11 }}
                      />

                      <Tooltip />

                      <Line
                        type='monotone'
                        dataKey='count'
                        stroke='#3b82f6'
                        strokeWidth={3}
                        dot={{
                          fill: '#3b82f6',
                          r: 5
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className='bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-lg font-bold text-gray-700 mb-4'>
                  👷 Worker Performance
                </h3>

                {workerData.length === 0 ? (
                  <div className='h-48 flex items-center justify-center text-gray-400'>
                    <div className='text-center'>
                      <div className='text-4xl mb-2'>👷</div>
                      <p>No assignments yet</p>
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width='100%' height={200}>
                    <BarChart
                      data={workerData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: -20,
                        bottom: 5
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='#f0f0f0'
                      />

                      <XAxis
                        dataKey='name'
                        tick={{ fontSize: 11 }}
                      />

                      <YAxis
                        tick={{ fontSize: 11 }}
                      />

                      <Tooltip />
                      <Legend />

                      <Bar
                        dataKey='assigned'
                        fill='#3b82f6'
                        radius={[4, 4, 0, 0]}
                        name='Assigned'
                      />

                      <Bar
                        dataKey='resolved'
                        fill='#10b981'
                        radius={[4, 4, 0, 0]}
                        name='Resolved'
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Resolution Rate + Workers */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

              <div className='bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-lg font-bold text-gray-700 mb-4'>
                  🎯 Resolution Rate
                </h3>

                {[
                  {
                    label: 'Resolved',
                    pct: counts.all > 0
                      ? Math.round((counts.resolved / counts.all) * 100)
                      : 0,
                    from: 'from-green-400',
                    to: 'to-green-600',
                    text: 'text-green-600'
                  },
                  {
                    label: 'In Progress',
                    pct: counts.all > 0
                      ? Math.round((counts.inProgress / counts.all) * 100)
                      : 0,
                    from: 'from-blue-400',
                    to: 'to-blue-600',
                    text: 'text-blue-600'
                  },
                  {
                    label: 'Pending',
                    pct: counts.all > 0
                      ? Math.round((counts.pending / counts.all) * 100)
                      : 0,
                    from: 'from-yellow-400',
                    to: 'to-yellow-600',
                    text: 'text-yellow-600'
                  },
                ].map(item => (
                  <div
                    key={item.label}
                    className='mb-4'
                  >
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-gray-500'>
                        {item.label}
                      </span>

                      <span className={`font-bold ${item.text}`}>
                        {item.pct}%
                      </span>
                    </div>

                    <div className='h-3 bg-gray-100 rounded-full overflow-hidden'>
                      <div
                        className={`h-full bg-gradient-to-r ${item.from} ${item.to} rounded-full transition-all`}
                        style={{
                          width: `${item.pct}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='bg-white rounded-2xl shadow-sm p-6'>
                <h3 className='text-lg font-bold text-gray-700 mb-4'>
                  👷 Workers Summary
                </h3>

                {workers.length === 0 ? (
                  <div className='text-center py-8 text-gray-400'>
                    <div className='text-4xl mb-2'>👷</div>

                    <p>No workers added yet</p>

                    <Link
                      to='/manage-workers'
                      className='text-blue-600 text-sm hover:underline mt-2 block'
                    >
                      + Add Workers
                    </Link>
                  </div>
                ) : (
                  <div className='flex flex-col gap-3'>
                    {workers.slice(0, 4).map(w => (
                      <div
                        key={w._id}
                        className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center'>
                            👷
                          </div>

                          <div>
                            <p className='font-semibold text-gray-700 text-sm'>
                              {w.name}
                            </p>

                            <p className='text-gray-400 text-xs'>
                              {w.department}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            w.available
                              ? 'bg-green-50 text-green-600'
                              : 'bg-orange-50 text-orange-600'
                          }`}
                        >
                          {w.available ? '✅ Free' : '🔄 Busy'}
                        </span>
                      </div>
                    ))}

                    {workers.length > 4 && (
                      <Link
                        to='/manage-workers'
                        className='text-blue-600 text-sm text-center hover:underline'
                      >
                        +{workers.length - 4} more workers →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* COMPLAINTS TAB */}
        {activeTab === 'complaints' && (
          <div>

            {/* Filter Tabs */}
            <div className='bg-white rounded-2xl p-2 shadow-sm mb-6 flex gap-2 flex-wrap'>
              {[
                {
                  key: 'all',
                  label: '📋 All',
                  count: counts.all
                },
                {
                  key: 'pending',
                  label: '⏳ Pending',
                  count: counts.pending
                },
                {
                  key: 'in-progress',
                  label: '🔄 In Progress',
                  count: counts.inProgress
                },
                {
                  key: 'resolved',
                  label: '✅ Resolved',
                  count: counts.resolved
                },
                {
                  key: 'guest',
                  label: '📸 Guest',
                  count: counts.guest
                },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition-all ${
                    filter === f.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {f.label}

                  <span className='ml-1 text-xs opacity-75'>
                    ({f.count})
                  </span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className='bg-white rounded-2xl p-12 text-center shadow-sm'>
                <div className='text-5xl mb-3'>📭</div>

                <p className='text-gray-500 font-medium'>
                  No complaints in this category
                </p>
              </div>
            ) : (
              <div className='flex flex-col gap-4'>
                {filtered.map(c => {
                  const s =
                    statusConfig[c.status] ||
                    statusConfig.pending;

                  return (
                    <div
                      key={c._id}
                      className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all ${
                        c.reReported && c.status !== 'resolved'
                          ? 'border-red-200'
                          : c.isGuest
                            ? 'border-orange-200'
                            : 'border-gray-100'
                      }`}
                    >

                      {/* Guest Badge */}
                      {c.isGuest && (
                        <div className='bg-orange-50 border-b border-orange-200 px-5 py-2 flex items-center gap-2'>
                          <span className='text-orange-500'>
                            📸
                          </span>

                          <p className='text-orange-700 text-sm font-bold'>
                            Guest Complaint — Submitted without login
                          </p>

                          <span className='ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full'>
                            Guest
                          </span>
                        </div>
                      )}

                      {/* Re-Reported Badge */}
                      {c.reReported && c.status !== 'resolved' && (
                        <div className='bg-red-50 border-b border-red-200 px-5 py-2 flex items-center gap-2'>
                          <span className='text-red-500'>
                            🚨
                          </span>

                          <p className='text-red-700 text-sm font-bold'>
                            Citizen Re-Reported — Needs Immediate Action!
                          </p>

                          <span className='ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full'>
                            {c.reReportCount}x Re-Reported
                          </span>
                        </div>
                      )}

                      {/* Card Content */}
                      <div className='p-5 pb-3'>
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>

                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-xl'>
                                {categoryIcons[c.category] || '⚠️'}
                              </span>

                              <h3 className='font-bold text-gray-800 text-lg'>
                                {c.title}
                              </h3>
                            </div>

                            <p className='text-gray-500 text-sm mb-2'>
                              {c.description}
                            </p>

                            <div className='flex flex-wrap gap-3 text-xs text-gray-400'>
                              <span>
                                📍 {c.location}
                              </span>

                              <span>
                                👤 {
                                  c.isGuest
                                    ? `${c.guestName} (Guest)`
                                    : c.user?.name
                                }
                              </span>

                              <span>
                                📞 {
                                  c.isGuest
                                    ? c.guestPhone
                                    : c.user?.phone
                                }
                              </span>

                              <span>
                                📅 {new Date(
                                  c.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <span
                            className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold border ${s.color} flex items-center gap-1 whitespace-nowrap`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${s.dot}`}
                            ></span>

                            {s.label}
                          </span>
                        </div>
                      </div>

                      {/* Photo */}
                      {c.photo && (
                        <div className='px-5 pb-3'>
                          <img
                            src={c.photo}
                            alt='complaint'
                            className='w-full h-48 object-cover rounded-xl border border-gray-100'
                          />
                        </div>
                      )}

                      {/* Assigned Worker */}
                      {c.assignedWorker && (
                        <div className='mx-5 mb-3 bg-blue-50 border border-blue-100 rounded-xl p-3'>
                          <p className='text-blue-700 text-sm font-semibold'>
                            👷 Assigned: {c.assignedWorker.name}
                          </p>

                          <p className='text-blue-500 text-xs mt-1'>
                            📞 {c.assignedWorker.phone}

                            {c.assignedWorker.email &&
                              ` | 📧 ${c.assignedWorker.email}`}
                          </p>

                          {c.deadline && (
                            <p className='text-orange-600 text-xs mt-1 font-semibold'>
                              ⏰ Deadline: {
                                new Date(
                                  c.deadline
                                ).toLocaleDateString(
                                  'en-IN',
                                  {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  }
                                )
                              }
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className='px-5 pb-5 pt-3 bg-gray-50 border-t border-gray-100'>

                        {/* Worker Select + Status */}
                        <div className='flex flex-wrap gap-3 items-center mb-3'>

                          <select
                            className='border border-gray-200 p-2 rounded-xl text-sm flex-1 bg-white focus:outline-none focus:border-blue-400'
                            value={
                              selected[c._id] ||
                              c.assignedWorker?._id ||
                              ''
                            }
                            onChange={e =>
                              setSelected(p => ({
                                ...p,
                                [c._id]: e.target.value
                              }))
                            }
                          >
                            <option value=''>
                              👷 Select Worker
                            </option>

                            {workers.map(w => (
                              <option
                                key={w._id}
                                value={w._id}
                              >
                                {w.name} — {w.department}
                              </option>
                            ))}
                          </select>

                          <select
                            className='border border-gray-200 p-2 rounded-xl text-sm bg-white focus:outline-none focus:border-green-400'
                            value={c.status}
                            onChange={e =>
                              updateStatus(
                                c._id,
                                e.target.value
                              )
                            }
                          >
                            <option value='pending'>
                              ⏳ Pending
                            </option>

                            <option value='in-progress'>
                              🔄 In Progress
                            </option>

                            <option value='resolved'>
                              ✅ Resolved
                            </option>
                          </select>
                        </div>

                        {/* Deadline + Assign Button */}
                        <div className='flex gap-3 items-end'>

                          <div className='flex-1'>
                            <label className='text-xs text-gray-500 font-semibold mb-1 block'>
                              ⏰ Set Deadline *
                            </label>

                            <input
                              type='date'
                              className='w-full border border-gray-200 p-2 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-400'
                              min={
                                new Date()
                                  .toISOString()
                                  .split('T')[0]
                              }
                              value={
                                deadlines[c._id] ||
                                (
                                  c.deadline
                                    ? new Date(
                                        c.deadline
                                      )
                                        .toISOString()
                                        .split('T')[0]
                                    : ''
                                )
                              }
                              onChange={e =>
                                setDeadlines(p => ({
                                  ...p,
                                  [c._id]: e.target.value
                                }))
                              }
                            />
                          </div>

                          <button
                            onClick={() => assign(c._id)}
                            className='bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 whitespace-nowrap flex items-center gap-2 mt-4'
                          >
                            📨 Assign & Notify
                          </button>
                        </div>

                        {/* Show existing deadline */}
                        {c.deadline && (
                          <p className='text-xs text-orange-600 mt-2 font-semibold'>
                            ⏰ Current Deadline: {
                              new Date(
                                c.deadline
                              ).toLocaleDateString(
                                'en-IN',
                                {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }
                              )
                            }
                          </p>
                        )}

                        <p className='text-xs text-gray-400 mt-2'>
                          📧 Worker will receive an email with complaint details and deadline
                        </p>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorityDashboard;