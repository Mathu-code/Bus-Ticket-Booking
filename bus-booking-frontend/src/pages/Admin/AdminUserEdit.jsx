import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux"; // Assuming you use Redux for user state

export default function AdminUserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    isAdmin: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null); // This state will be used for general errors, including email validation

  // Get logged-in user's ID and isAdmin status from Redux (or localStorage)
  // Assuming your Redux store has an 'auth' slice with a 'user' object.
  // If not using Redux, you would parse from localStorage.getItem('user')
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const loggedInUserId = loggedInUser?._id;
  // eslint-disable-next-line no-unused-vars
  const loggedInUserIsAdmin = loggedInUser?.isAdmin; // This reflects the logged-in user's current admin status

  // State to store the *initial* isAdmin status of the user being edited
  // This is crucial to know if a demotion attempt is being made by the user themselves
  const [initialIsAdminStatus, setInitialIsAdminStatus] = useState(false);


  useEffect(() => {
    const fetchUserDetails = async () => {
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
        };
        const response = await axios.get(`http://localhost:5000/api/auth/admin/users/${id}`, config);
        setUserData(response.data);
        setInitialIsAdminStatus(response.data.isAdmin); // Store initial status
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err.response?.data?.msg || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Allow the state to update freely, validation happens on submit
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null); // Clear any general error on input change
  };

  // Basic email validation function using a regex
  const validateEmail = (email) => {
    // This regex matches common email formats, allowing for various characters
    // in the local part and domain, and requiring a top-level domain.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null); // Clear any previous general error

    // --- Start: Email Validation ---
    if (!validateEmail(userData.email)) {
      setError("Please enter a valid email address (e.g., user@example.com).");
      setSubmitting(false);
      return;
    }
    // --- End: Email Validation ---

    const isSelfEdit = id === loggedInUserId;

    // Check if the logged-in admin is trying to demote themselves
    // This condition means:
    // 1. It's the logged-in admin's own profile being edited (`isSelfEdit`).
    // 2. The logged-in user *was* an admin initially (`initialIsAdminStatus` is true).
    // 3. The user is *attempting to change* their status to non-admin (`!userData.isAdmin`).
    if (isSelfEdit && initialIsAdminStatus && !userData.isAdmin) {
      // 1. Revert the isAdmin state locally to true (its actual value from backend)
      setUserData((prevData) => ({
        ...prevData,
        isAdmin: true, // Revert isAdmin back to true
      }));
      setSubmitting(false); // Stop submitting state
      
      // 2. Show the alert message as requested
      alert("An admin cannot demote themselves. Another admin must change your status.");
      
      // 3. Navigate after the alert is dismissed
      navigate("/admin/users");
      return; // Prevent API call and further execution
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in.");
        setSubmitting(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`http://localhost:5000/api/auth/admin/users/${id}`, userData, config);
      alert("User updated successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error("Error updating user:", err);
      // Backend errors for validation could also be handled here
      setError(err.response?.data?.msg || "Failed to update user. Check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-600">Loading user details...</div>;
  // This 'error' display is for *other* errors, not the self-demotion message
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  if (!userData.name && !loading && !error) return <div className="text-center py-8 text-gray-600">User not found.</div>;

  const isSelfEdit = id === loggedInUserId;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit User (ID: {id})</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            checked={userData.isAdmin} // This reflects the current state (can be unticked by user)
            onChange={handleChange}
            // The checkbox is NOT disabled for self-demotion attempts here.
            // We want the user to be able to untick it and then get the message on save.
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">Is Admin</label>
          {isSelfEdit && initialIsAdminStatus && (
            // This message indicates they are currently an admin, before any change attempt
            <span className="ml-2 text-sm text-gray-500">
              (You are currently an administrator)
            </span>
          )}
        </div>

        {/* The error display for general errors will remain */}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting} // Only disable based on submitting state
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}