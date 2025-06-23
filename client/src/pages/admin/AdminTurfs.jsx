import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  getTurfs, 
  createTurf, 
  updateTurf, 
  deleteTurf 
} from '../../features/turfs/turfSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Modal from '../../components/Modal';

const AdminTurfs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { turfs, loading, error } = useSelector((state) => state.turfs);


   const [modalKey, setModalKey] = useState(0); // Add this line
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTurf, setCurrentTurf] = useState({
    _id: '',
    name: '',
    location: '',
    pricePerHour: '',
    size: '',
    image: '',
    description: '',
    facilities: [],
  });
  const [newFacility, setNewFacility] = useState('');

  useEffect(() => {
    if (!userInfo?.isAdmin) {
      navigate('/');
    } else {
      dispatch(getTurfs());
    }
  }, [dispatch, userInfo, navigate]);

  const openAddModal = () => {
    setEditMode(false);
    setCurrentTurf({
      _id: '',
      name: '',
      location: '',
      pricePerHour: '',
      size: '',
      image: '',
      description: '',
      facilities: [],
    });
        setModalKey(prev => prev + 1); // Force remount

    setIsModalOpen(true);
  };

  const openEditModal = (turf) => {
    setEditMode(true);
    setCurrentTurf({
      _id: turf._id,
      name: turf.name,
      location: turf.location,
      pricePerHour: turf.pricePerHour,
      size: turf.size,
      image: turf.image,
      description: turf.description,
      facilities: [...turf.facilities],
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTurf({
      ...currentTurf,
      [name]: value,
    });
  };

  const addFacility = () => {
    if (newFacility.trim() && !currentTurf.facilities.includes(newFacility)) {
      setCurrentTurf({
        ...currentTurf,
        facilities: [...currentTurf.facilities, newFacility],
      });
      setNewFacility('');
    }
  };

  const removeFacility = (facilityToRemove) => {
    setCurrentTurf({
      ...currentTurf,
      facilities: currentTurf.facilities.filter(facility => facility !== facilityToRemove),
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await dispatch(updateTurf(currentTurf)).unwrap();
      } else {
        await dispatch(createTurf(currentTurf)).unwrap();
      }
      setIsModalOpen(false);
      dispatch(getTurfs()); // Refresh the list
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this turf?')) {
      dispatch(deleteTurf(id))
        .then(() => dispatch(getTurfs())); // Refresh after deletion
    }
  };

  if (!userInfo?.isAdmin) {
    return <Message variant="danger">Unauthorized access</Message>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Turf Management</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Add New Turf'}
        </button>
      </div>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : turfs.length === 0 ? (
        <Message>No turfs found</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Price/Hour</th>
                <th className="py-3 px-4 text-left">Size</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {turfs.map((turf) => (
                <tr key={turf._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <img 
                        src={turf.image} 
                        alt={turf.name} 
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      {turf.name}
                    </div>
                  </td>
                  <td className="py-4 px-4">{turf.location}</td>
                  <td className="py-4 px-4">₹{turf.pricePerHour}</td>
                  <td className="py-4 px-4">{turf.size}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(turf)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHandler(turf._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
 <Modal 
    isOpen={isModalOpen} 
    onClose={() => {
      
      setIsModalOpen(false);
      setCurrentTurf({  // Reset form on close
        _id: '',
        name: '',
        location: '',
        pricePerHour: 0,
        size: 'Medium',
        image: '',
        description: '',
        facilities: [],
      });
    }}
  >        
  <h2 className="text-xl font-bold mb-4">
          {editMode ? 'Edit Turf' : 'Add New Turf'}
        </h2>
        <form onSubmit={submitHandler}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
              <input
                type="text"
                name="name"
                value={currentTurf.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
              <input
                type="text"
                name="location"
                value={currentTurf.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={loading}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price/Hour*</label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={currentTurf.pricePerHour}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size*</label>
                <input
                  type="text"
                  name="size"
                  value={currentTurf.size}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL*</label>
              <input
                type="url"
                name="image"
                value={currentTurf.image}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                name="description"
                value={currentTurf.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Add facility"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addFacility}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-md"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {currentTurf.facilities.map((facility) => (
                  <div key={facility} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span className="mr-1">{facility}</span>
                    <button
                      type="button"
                      onClick={() => removeFacility(facility)}
                      className="text-red-500 hover:text-red-700"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? 'Processing...' : editMode ? 'Update Turf' : 'Add Turf'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTurfs;