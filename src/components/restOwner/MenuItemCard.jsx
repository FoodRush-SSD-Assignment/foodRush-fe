import React, { useEffect, useState } from 'react';
import restaurantApi from '../../api/restaurantAPI';
import { useNavigate } from 'react-router-dom';

const MenuItemCard = ({ id }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await restaurantApi.get(`/items/restaurant/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenuItems(response.data); // Assuming the response data is the menu items array
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [id]); // Trigger fetch when restaurantId changes

  const handleEdit = (e, itemId) => {
    e.stopPropagation(); // Prevent card click event from firing
    navigate(`/merchant/restaurants/${id}/edit-item/${itemId}`);
  };

  const handleDelete = async (e, itemId) => {
    e.stopPropagation(); // Prevent card click event from firing
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        await restaurantApi.delete(`/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Update state to remove the deleted item
        setMenuItems(menuItems.filter(item => item._id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-secondary">Loading menu items...</p>
      </div>
    );
  }

  if (!menuItems.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-darkgrey mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p className="text-secondary text-lg">No menu items available.</p>
        <p className="text-gray-500 mt-2">Add your first menu item using the button above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {menuItems.map((item) => (
        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
          {/* Action buttons (positioned absolutely) */}
          <div className="absolute top-2 right-2 flex space-x-2 z-10">
            {/* Edit button */}
            <button
              onClick={(e) => handleEdit(e, item._id)}
              className="bg-secondary bg-opacity-80 hover:bg-opacity-100 text-white p-2 rounded-full transition-all"
              title="Edit item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
            
            {/* Delete button */}
            <button
              onClick={(e) => handleDelete(e, item._id)}
              className="bg-primary bg-opacity-80 hover:bg-opacity-100 text-white p-2 rounded-full transition-all"
              title="Delete item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
          
          {/* Show image if available */}
          {item.imageUrl ? (
            <div className="h-48 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.itemName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-32 bg-lightgray flex items-center justify-center">
              <svg className="w-12 h-12 text-darkgrey" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          )}
          
          <div className="p-5">
            {/* Item details */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-secondary">{item.itemName}</h3>
              <span className="font-bold text-primary">Rs. {item.itemPrice}</span>
            </div>
            
            <p className="text-gray-700 mb-4">{item.itemDescription}</p>
            
            <div className="flex items-center justify-between mt-auto">
              {/* Category badge */}
              <span className="bg-lightgray text-secondary px-3 py-1 rounded-full text-sm capitalize">
                {item.itemCategory}
              </span>
              
              {/* Availability status */}
              <span 
                className={`px-3 py-1 rounded-full text-sm ${
                  item.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {item.isAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemCard;