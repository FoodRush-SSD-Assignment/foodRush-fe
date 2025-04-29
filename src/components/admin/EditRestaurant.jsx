import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import restaurantApi from "../../api/restaurantAPI";
import { showSuccess, showError } from "../../utils/alertService";
import authApi from "../../api/authAPI";

const CATEGORY_OPTIONS = [
  { value: "fast_food", label: "Fast Food" },
  { value: "traditional", label: "Traditional (Sri Lankan)" },
  { value: "asian", label: "Asian (Chinese, Japanese, Thai...)" },
  { value: "western", label: "Western (American, Grilled...)" },
  { value: "Healthy", label: "Healthy (Salads, Vegan...)" },
  { value: "bakery", label: "Bakery (Pastries, Buns...)" },
];

const EditRestaurant = () => {
  const { id } = useParams(); // Get restaurant ID from URL
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");

  const [restaurantData, setRestaurantData] = useState({
    restaurantName: "",
    ownerName: "",
    location: "",
    contactNumber: "",
    category: "",
    status: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch current restaurant data
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await restaurantApi.get(`/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const {
          restaurantName,
          ownerName,
          location,
          contactNumber,
          category,
          status,
        } = response.data;
        setRestaurantData({
          restaurantName,
          ownerName,
          location,
          contactNumber,
          category,
          status,
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch restaurant data.");
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  const handleChange = (e) => {
    setRestaurantData({
      ...restaurantData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await restaurantApi.put(`/restaurants/${id}`, restaurantData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showSuccess("Restaurant updated successfully!");
      navigate(`/admin/restaurant/${id}`);
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Failed to update restaurant.");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      // Validate password with the server (create a /verify-password endpoint or use your login API for validation)
      const verifyResponse = await authApi.post(
        "/auth/verify-password",
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (verifyResponse.data.valid) {
        // If password matches, proceed to delete
        await restaurantApi.delete(`/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        showSuccess("Restaurant deleted successfully!");
        navigate("/admin/restaurants"); // Redirect after deletion
      } else {
        showError("Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Failed to delete restaurant.");
    } finally {
      setShowDeleteModal(false); // Close the modal
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-2xl">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-2xl">{error}</div>
      </div>
    );

  return (
    <div className="bg-white p-6 mx-2 m-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">
            <span>{restaurantData.restaurantName || "N/A"}</span>
          </h1>
          <p className="text-sm text-gray-600">
            Restaurant ID: {id.substring(0, 7)}
          </p>
        </div>
        <a href="/restaurants" className="text-red-600 text-sm font-medium">
          ← Back to Restaurants
        </a>
      </div>
      <hr className="mb-6 rounded-md" />

      <h2 className="text-lg font-semibold mb-3">Edit Restaurant Details</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 border border-gray-200 rounded p-4 mb-3 relative"
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                name="restaurantName"
                value={restaurantData.restaurantName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Owner Name
              </label>
              <input
                type="text"
                name="ownerName"
                value={restaurantData.ownerName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={restaurantData.location}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                value={restaurantData.contactNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Category
              </label>
              <select
                name="category"
                value={restaurantData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Status
              </label>
              <select
                name="status"
                value={restaurantData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="Pending">
                  Pending
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                </option>
                <option value="Approved">
                  Approved
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                </option>
                <option value="suspended">
                  Suspended
                  <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-primary hover:bg-red-800 text-white font-semibold py-2 px-4 rounded transition-all"
          >
            Update Restaurant
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-all"
          >
            Delete Restaurant
          </button>
        </div>
      </form>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>

            <p className="text-sm mb-4 text-gray-600">
              Please enter your password to confirm deleting the restaurant.
            </p>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRestaurant;
