import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, deleteUser } from '../../features/users/userSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Management</h1>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Admin</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">{user._id}</td>
                  <td className="py-4 px-4">{user.name}</td>
                  <td className="py-4 px-4">{user.email}</td>
                  <td className="py-4 px-4">
                    {user.isAdmin ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => deleteHandler(user._id)}
                      disabled={user.isAdmin}
                      className={`px-3 py-1 rounded text-sm ${
                        user.isAdmin 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      Delete
                    </button>
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

export default AdminUsers;