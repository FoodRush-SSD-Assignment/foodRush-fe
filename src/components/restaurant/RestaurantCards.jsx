import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaUser, FaChevronRight } from 'react-icons/fa';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="block">
      <div className="bg-white rounded-xl border border-darkgrey shadow-sm p-0 mb-6 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group">
        
        {/* Image Section at the top */}
        <div className="relative w-full h-48">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.restaurantName}
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Content Section */}
        <div className="p-5">
          {/* Restaurant Name with stylish border */}
          <h3 className="text-2xl font-bold text-secondary mb-4 pb-2 border-b-2 border-primary border-opacity-20">
            {restaurant.restaurantName}
          </h3>
          
          {/* Restaurant Details with Icons */}
          <div className="space-y-3 mt-4">
            <p className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="text-primary mr-3 flex-shrink-0" />
              <span className="text-secondary">{restaurant.location}</span>
            </p>
            <p className="flex items-center text-gray-700">
              <FaPhone className="text-primary mr-3 flex-shrink-0" />
              <span className="text-secondary">{restaurant.contactNumber}</span>
            </p>
          </div>
          
          {/* View Button */}
      
        </div>
  
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="bg-primary opacity-10 rotate-45 transform origin-bottom-left w-16 h-16 -translate-y-8 translate-x-4"></div>
        </div>
      </div>
    </Link>
  );
};  

export default RestaurantCard;