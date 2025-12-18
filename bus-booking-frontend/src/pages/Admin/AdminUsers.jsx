import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to get logged-in user info

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const navigate = useNavigate();

  // Get logged-in user's ID and isAdmin status from Redux (or localStorage)
  // Assuming your Redux store has an 'auth' slice with a 'user' object.
  // If not using Redux, you would parse from localStorage.getItem('user')
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const loggedInUserId = loggedInUser?._id;
  // eslint-disable-next-line no-unused-vars
  const loggedInUserIsAdmin = loggedInUser?.isAdmin;


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { // Add params for query parameters
          search: searchQuery, // Send the search query
        }
      };
      const response = await axios.get('http://localhost:5000/api/auth/admin/users', config);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      // More detailed error handling for better user feedback
      setError(err.response?.data?.msg || err.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce the search input to avoid excessive API calls
    const handler = setTimeout(() => {
      fetchUsers();
    }, 500); // Wait 500ms after the user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]); // Rerun fetchUsers when searchQuery changes

  const handleDeleteUser = async (userId) => {
    // Optional: Add a check here if an admin tries to delete themselves, though usually this is handled server-side.
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:5000/api/auth/admin/users/${userId}`, config);
        // Filter out the deleted user from the current state
        setUsers(users.filter((user) => user._id !== userId));
        alert("User deleted successfully!");
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user: " + (err.response?.data?.msg || err.message));
      }
    }
  };

  const handleToggleAdminStatus = async (userId, currentStatus) => {
    // Prevent an admin from demoting themselves
    if (userId === loggedInUserId && currentStatus === true) { // If it's the logged-in user AND they are currently an admin
      alert("An admin cannot demote themselves. Another admin must change your status.");
      return; // Stop the function execution
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      // Send PATCH request to toggle admin status
      await axios.patch(`http://localhost:5000/api/auth/admin/users/${userId}/toggle-admin`, { isAdmin: !currentStatus }, config);
      // Update the user's admin status in the local state
      setUsers(users.map(user => user._id === userId ? { ...user, isAdmin: !currentStatus } : user));
      alert("User admin status updated!");
    } catch (err) {
      console.error("Error toggling admin status:", err);
      alert("Failed to update admin status: " + (err.response?.data?.msg || err.message));
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading users...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b border-gray-200">ID</th>
              <th className="py-3 px-6 border-b border-gray-200">Name</th>
              <th className="py-3 px-6 border-b border-gray-200">Email</th>
              <th className="py-3 px-6 border-b border-gray-200">Admin</th>
              <th className="py-3 px-6 border-b border-gray-200 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-base font-normal">
            {users.length === 0 && !loading && !error ? (
              <tr>
                <td colSpan="5" className="py-4 px-6 text-center text-gray-600">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 whitespace-nowrap">{user._id}</td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">
                    {user.isAdmin ? <span className="text-green-600 font-semibold">Yes</span> : "No"}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleAdminStatus(user._id, user.isAdmin)}
                        className={`text-white px-3 py-1 rounded-md text-xs ${
                          user.isAdmin ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        // Optionally disable button if it's the logged-in admin trying to demote themselves
                        disabled={user._id === loggedInUserId && user.isAdmin}
                      >
                        {user.isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}