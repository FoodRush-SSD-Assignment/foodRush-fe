// src/components/Search.jsx
import React from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const Search = () => {
  return (
    <div className="relative -mt-8 px-4 max-w-4xl mx-auto">
      <div className="flex rounded-lg overflow-hidden shadow-lg">
        <div className="flex items-center bg-primary text-white py-3 px-4">
          <FaMapMarkerAlt className="mr-2" />
          <span>Colombo</span>
        </div>
        
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search for a restaurant or a food item"
            className="w-full py-3 px-4 pl-10 outline-none"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Search;