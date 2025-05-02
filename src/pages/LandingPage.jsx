import React, { useState } from "react"; // ✅ FIXED HERE
import HeroSection from "../components/restaurant/HeroSection";
import Search from "../components/restaurant/Search";
import CategoryCards from "../components/restaurant/CategoryCards";
import Footer from "../components/restaurant/Footer";

import fastFoodImg from '../assets/restaurant_assets/fast_food.jpg';
import traditionalImg from '../assets/restaurant_assets/traditional.jpg';
import asianImg from '../assets/restaurant_assets/asian.jpg';
import westernImg from '../assets/restaurant_assets/western.jpg';
import healthyImg from '../assets/restaurant_assets/healthy.jpg';
import bakeryImg from '../assets/restaurant_assets/bakery.jpg';

const allCategories = [
  { title: 'Fast Food', imageUrl: fastFoodImg, link: '/category/fast_food' },
  { title: 'Traditional', imageUrl: traditionalImg, link: '/category/traditional' },
  { title: 'Asian', imageUrl: asianImg, link: '/category/asian' },
  { title: 'Western', imageUrl: westernImg, link: '/category/western' },
  { title: 'Healthy', imageUrl: healthyImg, link: '/category/healthy' },
  { title: 'Bakeries', imageUrl: bakeryImg, link: '/category/bakery' },
];

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = allCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryCards categories={filteredCategories} />
      <Footer />
    </div>
  );
};

export default LandingPage;
