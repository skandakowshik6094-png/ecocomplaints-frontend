import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import AuthorityLogin from './pages/AuthorityLogin';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import AuthorityDashboard from './pages/AuthorityDashboard';
import ManageWorkers from './pages/ManageWorkers';
import GuestComplaint from './pages/GuestComplaint';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className='bg-gray-50 min-h-screen pb-10'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/authority-login' element={<AuthorityLogin />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/guest-complaint' element={<GuestComplaint />} />
            <Route path='/dashboard' element={
              <ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path='/submit' element={
              <ProtectedRoute><SubmitComplaint /></ProtectedRoute>} />
            <Route path='/authority' element={
              <ProtectedRoute role='authority'><AuthorityDashboard /></ProtectedRoute>} />
            <Route path='/manage-workers' element={
              <ProtectedRoute role='authority'><ManageWorkers /></ProtectedRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;