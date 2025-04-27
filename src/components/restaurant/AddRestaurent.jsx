import React, { useState, useEffect } from 'react';
import restaurantApi from '../../api/restaurantApi'; // Your custom axios instance
import { useParams, useNavigate } from 'react-router-dom';

const AddRestaurantForm = () => {
  const { id } = useParams(); // Fetch the 'id' from the URL
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerId: '', // Initially empty, will be set from the route or localStorage
    location: '',
    contactNumber: '',
    category: '',
  });

  const [message, setMessage] = useState('');
  const categories = [
    'fast_food',
    'traditional',
    'asian',
    'western',
    'Healthy',
    'bakery',
  ];

  // Fetch userId from localStorage when the component mounts
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Parse the user object

    if (user && user._id) {
      setFormData((prev) => ({
        ...prev,
        ownerId: user._id, // Set ownerId from the user data in localStorage
      }));
    }

    // If 'id' is provided via the route (useParams), it can be used as ownerId
    if (id) {
      setFormData((prev) => ({
        ...prev,
        ownerId: id, // Set ownerId from the URL parameter
      }));
    }
  }, [id]); // The effect runs again if the 'id' in the URL changes

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log formData to check if ownerId is correctly set
    console.log('Form Data:', formData);

    try {
      const res = await restaurantApi.post(
        '/restaurants',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log('Response:', res.data);
      setMessage('Restaurant added successfully!');

      // Clear form
      setFormData({
        restaurantName: '',
        ownerId: '', // Don't clear ownerId, it will stay as the logged-in user's ID
        location: '',
        contactNumber: '',
        category: '',
      });

    } catch (error) {
      console.error('Error adding restaurant:', error);

      if (error.response) {
        console.error('Error response data:', error.response.data);
        setMessage(`Error adding restaurant: ${error.response.data.message || error.response.data.error}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setMessage('No response from server. Please try again later.');
      } else {
        console.error('Error message:', error.message);
        setMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Restaurant</h2>

      {message && <p className="mb-4 text-center text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Owner ID</label>
          <input
            type="text"
            name="ownerId"
            value={formData.ownerId}
            readOnly  // Making the field read-only
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Restaurant
        </button>
      </form>
    </div>
  );
};

export default AddRestaurantForm;
