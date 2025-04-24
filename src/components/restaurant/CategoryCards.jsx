import React from 'react';
import { Link } from 'react-router-dom';

//images
import fastFoodImg from '../../assets/restaurant_assets/fast_food.jpg'
import traditionalImg from '../../assets/restaurant_assets/traditional.jpg';
import asianImg from '../../assets/restaurant_assets/asian.jpg';
import westernImg from '../../assets/restaurant_assets/western.jpg';
import healthyImg from '../../assets/restaurant_assets/healthy.jpg';
import bakeryImg from '../../assets/restaurant_assets/bakery.jpg';

const CategoryCard = ({ title, imageUrl, link }) => {
  return (
    <Link to={link} className="block w-full md:w-1/2 lg:w-1/3 p-4">
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

const CategoryCards = () => {
  const categories = [
    {
      title: 'Fast Food',
      imageUrl: fastFoodImg,
      link: '/category/fast_food',
    },
    {
      title: 'Traditional',
      imageUrl: traditionalImg,
      link: '/category/traditional',
    },
    {
      title: 'Asian',
      imageUrl: asianImg,
      link: '/category/asian',
    },
    {
      title: 'Western',
      imageUrl: westernImg,
      link: '/category/western',
    },
    {
      title: 'Healthy',
      imageUrl: healthyImg,
      link: '/category/healthy',
    },
    {
      title: 'Bakeries',
      imageUrl: bakeryImg,
      link: '/category/bakery',
    },
  ];

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-wrap -mx-4">
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