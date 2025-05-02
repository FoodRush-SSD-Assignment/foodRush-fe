import React from 'react';
import { FaSearch } from 'react-icons/fa';

const Search = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative -mt-24 px-4 max-w-4xl mx-auto">
      <div className="flex rounded-lg overflow-hidden shadow-lg">
        <div className="flex items-center bg-primary text-white py-3 px-4">
          <FaSearch className="mr-2" />
        </div>
        
        <div className="flex-1 relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for a category"
            className="w-full py-3 px-20 pl-5 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
