import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTurfs } from '../../features/turfs/turfSlice';
import { getUsers } from '../../features/users/userSlice';
import { getBookings } from '../../features/bookings/bookingSlice';
import StatCard from '../../components/admin/StatCard';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  
  const { turfs, loading: turfsLoading } = useSelector((state) => state.turfs);
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getTurfs());
    dispatch(getUsers());
    dispatch(getBookings());
  }, [dispatch]);

  if (turfsLoading || usersLoading || bookingsLoading) return <Loader />;

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Turfs" 
          value={turfs.length} 
          icon="🏏" 
          color="bg-green-100 text-green-800"
        />
        <StatCard 
          title="Total Users" 
          value={users.length} 
          icon="👥" 
          color="bg-blue-100 text-blue-800"
        />
        <StatCard 
          title="Total Bookings" 
          value={bookings.length} 
          icon="📅" 
          color="bg-purple-100 text-purple-800"
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${totalRevenue.toFixed(2)}`} 
          icon="💰" 
          color="bg-yellow-100 text-yellow-800"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between">
                  <span className="font-medium">{booking.turf.name}</span>
                  <span className="text-gray-600">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{booking.startTime} - {booking.endTime}</span>
                  <span className="font-medium">₹{booking.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Joined on {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;