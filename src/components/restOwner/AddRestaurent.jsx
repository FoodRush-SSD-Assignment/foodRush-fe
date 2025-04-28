import React, { useState, useEffect } from 'react';
import restaurantApi from '../../api/restaurantAPI';
import { useParams, useNavigate } from 'react-router-dom';

const AddRestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerId: id,
    location: '',
    contactNumber: '',
    category: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // 'success' or 'error'
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

    if (user && user.id) {
      setFormData((prev) => ({
        ...prev,
        ownerId: user.id, // Set ownerId from the user data in localStorage
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
      setMessageType('success');

      // Clear form
      setFormData({
        restaurantName: '',
        ownerId: formData.ownerId, // Keep ownerId, it will stay as the logged-in user's ID
        location: '',
        contactNumber: '',
        category: '',
      });

    } catch (error) {
      console.error('Error adding restaurant:', error);
      setMessageType('error');

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
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-md my-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="mr-3 text-secondary hover:text-primary transition-all"
        >
          &larr;
        </button>
        <h2 className="text-2xl font-bold text-secondary">Add New Restaurant</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Owner ID field is hidden from the user but still in the form data */}
        <input
          type="hidden"
          name="ownerId"
          value={formData.ownerId}
        />

        <div>
          <label className="block mb-2 font-medium text-secondary">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            placeholder="Enter your restaurant name"
            required
            className="w-full border border-darkgrey px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-lightgray"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-secondary">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter restaurant address"
            required
            className="w-full border border-darkgrey px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-lightgray"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-secondary">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter contact phone number"
            required
            className="w-full border border-darkgrey px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-lightgray"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-secondary">Restaurant Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border border-darkgrey px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-lightgray appearance-none"
            style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\" fill=\"%23331C1C\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.replace('_', ' ').slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-opacity-90 transition-all font-medium text-lg shadow-sm"
          >
            Add Restaurant
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRestaurantForm;