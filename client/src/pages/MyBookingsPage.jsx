import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyBookings } from '../features/bookings/bookingSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { format } from 'date-fns';

const MyBookingsPage = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(getMyBookings());
    }
  }, [dispatch, userInfo]);

  // Debugging: Check the bookings data structure
  console.log('Bookings data:', bookings);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      
      {!userInfo ? (
        <Message variant="info">Please login to view your bookings</Message>
      ) : loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !Array.isArray(bookings) || bookings.length === 0 ? (
        <Message>You have no bookings yet.</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Turf</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Time</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img 
                        src={booking.turf?.image} 
                        alt={booking.turf?.name} 
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{booking.turf?.name}</h3>
                        <p className="text-gray-600 text-sm">{booking.turf?.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-4 px-4">
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    ₹{booking.totalAmount?.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.paymentStatus === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.paymentStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.paymentStatus}
                    </span>
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

export default MyBookingsPage;