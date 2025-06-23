import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTurfs } from '../features/turfs/turfSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const TurfPage = () => {
  const dispatch = useDispatch();
  const { turfs, loading, error } = useSelector((state) => state.turfs);

  useEffect(() => {
    dispatch(getTurfs());
  }, [dispatch]);

  // Debugging: Log the turfs data to console
  console.log('Turfs data:', turfs);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Cricket Turfs</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : !Array.isArray(turfs) || turfs.length === 0 ? (
        <Message>No turfs available at the moment. Please check back later.</Message>
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
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  View Details & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TurfPage;