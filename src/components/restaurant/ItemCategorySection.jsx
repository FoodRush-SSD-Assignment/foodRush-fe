import React, { useEffect, useState } from 'react';
import restaurantApi from '../../api/restaurantAPI';
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
    <div className="container mx-auto">
    {/* Category Tabs */}
    <div className="flex justify-start items-center mb-6 border-b border-darkgrey overflow-x-auto scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-6 py-3 text-lg font-medium transition-all duration-300 capitalize ${
            activeCategory === category
              ? 'border-b-2 border-primary text-primary relative'
              : 'text-gray-500 hover:text-secondary'
          }`}
        >
          {activeCategory === category && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
          )}
          {category}
        </button>
      ))}
    </div>

    {/* Grid Layout for Items with proper spacing */}
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="flex justify-center">
              <ItemCard item={item} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center h-40 bg-lightgray rounded-lg border border-darkgrey">
            <p className="text-secondary text-lg">No items available in this category.</p>
          </div>
        )}
      </div>
    </div>
  </div> 
  );
};

export default ItemCategorySection;