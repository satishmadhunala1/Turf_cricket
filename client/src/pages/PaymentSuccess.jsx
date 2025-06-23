import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createBooking } from '../features/bookings/bookingSlice';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const turf = searchParams.get('turfId');
    const user = searchParams.get('userId');
    const date = new Date(searchParams.get('date'));
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const bookingData = {
      turf,
      user,
      bookingDate: date,
      startTime: start,
      endTime: end,
      totalAmount: 300, // You may adjust this if needed
      isPaid: true,
    };

    dispatch(createBooking(bookingData));
    navigate('/my-bookings');
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
      <p className="mt-2 text-gray-600">Redirecting to your bookings...</p>
    </div>
  );
};

export default PaymentSuccess;
