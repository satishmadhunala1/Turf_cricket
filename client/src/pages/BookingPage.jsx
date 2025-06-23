import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTurfs } from '../features/turfs/turfSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const BookingPage = () => {
  const dispatch = useDispatch();
  const { turfs, loading, error } = useSelector((state) => state.turfs);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTurfs());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book a Cricket Turf</h1>
      
      {!userInfo ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Please login to book a turf</h2>
          <Link 
            to="/login" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-block"
          >
            Login Now
          </Link>
        </div>
      ) : loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {turfs.map((turf) => (
            <div key={turf._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src={turf.image} 
                alt={turf.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{turf.name}</h3>
                <p className="text-gray-600 mb-2">{turf.location}</p>
                <p className="text-green-700 font-bold mb-4">₹{turf.pricePerHour} / hour</p>
                <Link 
                  to={`/turfs/${turf._id}`} 
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors block text-center"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingPage;