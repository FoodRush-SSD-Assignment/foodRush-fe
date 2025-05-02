import React from 'react';
import { Link } from 'react-router-dom';


const CategoryCard = ({ title, imageUrl, link }) => {
  return (
    <Link to={link} className="block w-full md:w-full lg:w-full p-4">
      <div className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h3 className="text-white text-3xl font-bold">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

const CategoryCards = ({ categories }) => {
  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <CategoryCard 
            key={index}
            title={category.title}
            imageUrl={category.imageUrl}
            link={category.link}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;