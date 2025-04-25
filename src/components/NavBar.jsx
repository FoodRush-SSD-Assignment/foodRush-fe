import React from 'react';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCompass } from 'react-icons/fa';

const NavBar = () => {
  return (
    <nav className="bg-primary py-4 px-6 flex justify-between items-center text-white">
      <div className="flex items-center">
        <button className="flex items-center space-x-2 text-white hover:text-lightgray">
          <FaSignOutAlt className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-2 hover:text-lightgray">
          <FaCompass className="h-5 w-5" />
          <span>Browse</span>
        </button>
        
        <button className="flex items-center space-x-2 hover:text-lightgray">
          <FaShoppingCart className="h-5 w-5" />
          <span>My Cart</span>
        </button>
        
        <button className="flex items-center space-x-2 hover:text-lightgray">
          <FaUser className="h-5 w-5" />
          <span>My Account</span>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;