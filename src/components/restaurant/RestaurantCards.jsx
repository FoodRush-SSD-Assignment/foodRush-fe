import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant._id}`}>
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <h3 className="text-xl font-semibold mb-2">{restaurant.restaurantName}</h3>
        <p><span className="font-medium">Owner:</span> {restaurant.ownerName}</p>
        <p><span className="font-medium">Location:</span> {restaurant.location}</p>
        <p><span className="font-medium">Contact:</span> {restaurant.contactNumber}</p>
      </div>
    </Link>
  );
};

export default RestaurantCard;

