import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTurfs } from '../features/turfs/turfSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomePage = () => {
  const dispatch = useDispatch();
  const { turfs, loading, error } = useSelector((state) => state.turfs);

  useEffect(() => {
    dispatch(getTurfs());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Welcome to Cricket Turf Booking</h1>
        <p className="text-xl text-gray-600">
          Book your favorite cricket turf and enjoy the game with your friends
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-6">Featured Turfs</h2>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !Array.isArray(turfs) || turfs.length === 0 ? (
        <Message>No turfs available at the moment.</Message>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {turfs.slice(0, 3).map((turf) => (
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
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link 
          to="/turfs" 
          className="bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition-colors text-lg"
        >
          View All Turfs
        </Link>
      </div>
    </div>
  );
};

export default HomePage;