import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className='bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50'>
      <Link to='/' className='flex items-center gap-2'>
        <span className='text-3xl'>🌿</span>
        <div>
          <span className='text-xl font-bold text-green-700'>Eco</span>
          <span className='text-xl font-bold text-gray-700'>Complaints</span>
        </div>
      </Link>

      <div className='flex gap-4 items-center'>
        {user ? (
          <>
            <button
              onClick={handleLogout}
              className='bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-all'
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to='/login'
              className='text-green-700 font-semibold hover:text-green-900 text-sm'
            >
              Citizen Login
            </Link>

            <Link
              to='/authority-login'
              className='text-blue-700 font-semibold hover:text-blue-900 text-sm'
            >
              Authority Login
            </Link>

            <Link
              to='/register'
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-all'
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;