import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen relative flex flex-col items-center justify-center px-4'
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

      {/* Title */}
      <div className='text-center mb-10'>
        <div className='text-6xl mb-4'>🌿</div>
        <h1 className='text-5xl font-bold text-white mb-3'>EcoComplaints</h1>
        <p className='text-green-300 text-xl mb-2'>Environment Complaint Registration Portal</p>
        <p className='text-gray-300 text-sm'>Report environmental issues in your area easily</p>
      </div>

      {/* Cards */}
      <div className='flex flex-col sm:flex-row gap-5 w-full max-w-3xl'>

        {/* Citizen Card */}
        <div className='flex-1 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer'
          onClick={() => navigate('/login')}>
          <div className='w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl'>
            👤
          </div>
          <h2 className='text-xl font-bold text-white mb-2'>Citizen</h2>
          <p className='text-gray-300 text-sm mb-4'>Register and track your environment complaints</p>
          <div className='flex flex-col gap-1 text-left mb-5'>
            {['Submit complaints with photo', 'Track complaint status', 'See assigned worker details'].map((f, i) => (
              <p key={i} className='text-green-300 text-xs flex items-center gap-2'>
                <span>✓</span> {f}
              </p>
            ))}
          </div>
          <button className='w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all'>
            Login as Citizen →
          </button>
        </div>

        {/* Guest Card */}
        <div className='flex-1 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer'
          onClick={() => navigate('/guest-complaint')}>
          <div className='w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl'>
            📸
          </div>
          <h2 className='text-xl font-bold text-white mb-2'>Quick Report</h2>
          <p className='text-gray-300 text-sm mb-4'>No account needed — submit instantly!</p>
          <div className='flex flex-col gap-1 text-left mb-5'>
            {['No registration needed', 'Just name & phone number', 'Take photo & submit'].map((f, i) => (
              <p key={i} className='text-orange-300 text-xs flex items-center gap-2'>
                <span>✓</span> {f}
              </p>
            ))}
          </div>
          <button className='w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition-all'>
            Quick Report →
          </button>
        </div>

        {/* Authority Card */}
        <div className='flex-1 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 text-center hover:bg-opacity-20 transition-all cursor-pointer'
          onClick={() => navigate('/authority-login')}>
          <div className='w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl'>
            🏛️
          </div>
          <h2 className='text-xl font-bold text-white mb-2'>Authority</h2>
          <p className='text-gray-300 text-sm mb-4'>Manage and resolve environment complaints</p>
          <div className='flex flex-col gap-1 text-left mb-5'>
            {['View all complaints', 'Assign workers', 'Update complaint status'].map((f, i) => (
              <p key={i} className='text-blue-300 text-xs flex items-center gap-2'>
                <span>✓</span> {f}
              </p>
            ))}
          </div>
          <button className='w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all'>
            Login as Authority →
          </button>
        </div>

      </div>

      {/* Register Link */}
      <p className='text-gray-400 text-sm mt-8'>
        New citizen?{' '}
        <span
          className='text-green-400 cursor-pointer font-semibold hover:underline'
          onClick={() => navigate('/register')}
        >
          Create a free account →
        </span>
      </p>

    </div>
  );
};

export default Home;