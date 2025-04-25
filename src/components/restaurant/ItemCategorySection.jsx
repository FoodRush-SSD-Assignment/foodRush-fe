// src/components/ItemCategoryTabs.jsx
import React, { useEffect, useState } from 'react';
import restaurantApi from '../../api/restaurantApi';
import ItemCard from './ItemCard';

const categories = ['mains', 'sides', 'desserts', 'beverages'];

const ItemCategorySection = ({ restaurantId }) => {
  const [activeCategory, setActiveCategory] = useState('mains');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await restaurantApi.get(`/items/restaurant/${restaurantId}/category/${activeCategory}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setItems(res.data);
      } catch (error) {
        console.error(`Failed to fetch items for ${activeCategory}:`, error);
      }
    };

    fetchItems();
  }, [restaurantId, activeCategory]);

  return (
<div className="flex flex-col flex-1">      {/* Sidebar Tabs */}
      {/* Category Tabs */}
      <div className="border-b border-darkgrey">
        <div className="flex">
        {categories.map((category) => (
          <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-6 py-3 text-lg ${
            activeCategory === category 
            ? 'border-b-2 border-primary font-medium text-secondary' 
            : 'text-gray-500'
          }`}
        >
          {category}
        </button>
        ))}
      </div>
      </div>

      {/* Search Bar */}
      <div className="p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a food item"
            className="w-full pl-10 pr-4 py-3 bg-lightgray rounded-md focus:outline-none"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
      </div>
      
      {/* Item List */}
      <div style={{ flex: 1 }}>
        <div className="px-6 space-y-4">
          {items.length > 0 ? (
            items.map((item) => <ItemCard key={item._id} item={item} />)
          ) : (
            <p>No items available in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemCategorySection;
