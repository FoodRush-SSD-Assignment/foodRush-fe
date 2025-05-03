import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuItemCard from '../../components/restOwner/MenuItemCard';

function ViewMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleAddItemClick = () => {
    if (id) { // Ensure restaurantId is not undefined or null
      navigate(`/merchant/restaurants/${id}/additem`);
    } else {
      console.error("Restaurant ID is undefined");
    }
  };
  
  return (
    <div className="min-h-screen bg-lightgray py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-primary hover:text-secondary transition-all mb-4 md:mb-0"
            >
              <span className="mr-2">&larr;</span> Back
            </button>
            <h1 className="text-3xl font-bold text-secondary">Restaurant Menu</h1>
          </div>
          
          {/* Add Menu Item Button */}
          <button
            onClick={handleAddItemClick}
            className="bg-primary hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-md transition-all flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Menu Item
          </button>
        </div>
        
        {/* Divider */}
        <div className="h-px bg-darkgrey mb-8"></div>
        
        {/* Menu Items */}
        <MenuItemCard id={id} />
      </div>
    </div>
  );
}

export default ViewMenu;