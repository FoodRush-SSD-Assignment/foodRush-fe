// src/components/Footer.jsx
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">FoodRush</h3>
            <p className="text-lightgray">
              Discover the best food experiences from restaurants across Sri Lanka. 
              Our platform connects food lovers with quality dining options.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white hover:text-primary">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Partner With Us</a></li>
              <li><a href="#" className="hover:text-primary">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Help & Support</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FaPhoneAlt className="mr-3 text-primary" />
                <span>+94 112 345 678</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3 text-primary" />
                <span>support@foodrush.lk</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-3 mt-1 text-primary" />
                <span>123 Main Street, Colombo 03, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} FoodRush. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;