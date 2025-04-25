import React from 'react';
import heroImg from '../../assets/hero_img.jpg';
import herologo from '../../assets/logo_white.png'

const HeroSection = () => {
  return (
    <div className="relative h-72 md:h-80 lg:h-[24rem] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${heroImg})`, 
          filter: "brightness(0.7)"
        }}
      ></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        {/* Logo */}
        <img 
          src={herologo} 
          alt="FoodRush White Logo" 
          //className="h-10 md:h-24 lg:h-32 mb-4"
        />
        
        <p className="text-lg md:text-xl lg:text-2xl text-center px-4">
          Discover the best restaurants and food items in Sri Lanka
        </p>
      </div>
    </div>
  );
};

export default HeroSection;