import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookings, updateBookingStatus } from '../../features/bookings/bookingSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { format } from 'date-fns';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  const statusUpdateHandler = (id, status) => {
    dispatch(updateBookingStatus({ id, status }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Booking Management</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Turf</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium">{booking.user.name}</div>
                      <div className="text-sm text-gray-500">{booking.user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">{booking.turf.name}</td>
                  <td className="py-4 px-4">
                    {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-4">
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td className="py-4 px-4">₹{booking.totalAmount.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.paymentStatus === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    {booking.paymentStatus === 'Pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => statusUpdateHandler(booking._id, 'Paid')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark as Paid
                        </button>
                        <button
                          onClick={() => statusUpdateHandler(booking._id, 'Cancelled')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;