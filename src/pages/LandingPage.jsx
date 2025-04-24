import React from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/restaurant/HeroSection';
import Search from '../components/restaurant/Search';
import CategoryCards from '../components/restaurant/CategoryCards';
import Footer from '../components/restaurant/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar/>
      <HeroSection />
      <Search />
      <CategoryCards />
      <Footer/>
    </div>
  );
};

export default LandingPage;