import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-green-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Cricket Turf Booking
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-green-200">Home</Link>
          <Link to="/turfs" className="hover:text-green-200">Turfs</Link>
          
          {userInfo && (
            <>
              <Link to="/my-bookings" className="hover:text-green-200">My Bookings</Link>
              {userInfo.isAdmin && (
                <div className="relative group">
                  <button className="hover:text-green-200">Admin</button>
                  <div className="absolute hidden group-hover:block bg-white text-green-800 p-2 rounded shadow-lg z-10 w-48">
                    <Link to="/admin/dashboard" className="block px-2 py-1 hover:bg-green-100 rounded">Dashboard</Link>
                    <Link to="/admin/turfs" className="block px-2 py-1 hover:bg-green-100 rounded">Turfs</Link>
                    <Link to="/admin/users" className="block px-2 py-1 hover:bg-green-100 rounded">Users</Link>
                    <Link to="/admin/bookings" className="block px-2 py-1 hover:bg-green-100 rounded">Bookings</Link>
                  </div>
                </div>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">Welcome, {userInfo.name}</span>
              <button 
                onClick={logoutHandler}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-200">Login</Link>
              <Link 
                to="/register" 
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;