import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="block">
      <div className="bg-lightgray rounded-lg border border-darkgrey p-5 mb-4 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg relative overflow-hidden group">
        <h3 className="text-xl font-bold text-secondary mb-3">{restaurant.restaurantName}</h3>
        
        <div className="space-y-2">
          <p className="flex">
            <span className="text-primary font-medium w-20">Owner:</span> 
            <span className="text-secondary">{restaurant.ownerName}</span>
          </p>
          <p className="flex">
            <span className="text-primary font-medium w-20">Location:</span> 
            <span className="text-secondary">{restaurant.location}</span>
          </p>
          <p className="flex">
            <span className="text-primary font-medium w-20">Contact:</span> 
            <span className="text-secondary">{restaurant.contactNumber}</span>
          </p>
        </div>
        
        {/* View button that shows on hover */}
        <div className="mt-4 text-right">
          <span className="inline-block px-4 py-2 bg-white border border-primary text-primary rounded-md group-hover:bg-primary group-hover:text-white transition-colors">
            View Menu
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;