import React, { useContext } from "react";
import { LogOut, Users, Home, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext"; // Import your AuthContext
import { useNavigate } from "react-router-dom"; // If you want to navigate after logout

const MerchantNavbar = () => {
  const { logout } = useContext(AuthContext); // Get logout function
  const navigate = useNavigate(); // To redirect after logout

  const handleLogout = () => {
    logout(); // Call the logout function
    navigate("/login"); // Redirect to login page (you can change the route if needed)
  };

  return (
    <nav className="flex justify-between items-center bg-primary text-white py-4 px-8">
      <div className="flex items-center">
        <button 
          onClick={handleLogout} // Attach logout handler
          className="flex items-center text-md group transition-colors duration-200"
        >
          <span className="mr-2 group-hover:text-darkgrey">Logout</span>
          <LogOut size={20} className="group-hover:text-[#D4D4D4]" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <button className="flex items-center text-md group transition-colors duration-200">
          <span className="mr-2 group-hover:text-darkgrey">Users</span>
          <Users size={20} className="group-hover:text-darkgrey" />
        </button>

        <button className="flex items-center text-md group transition-colors duration-200">
          <span className="mr-2 group-hover:text-darkgrey">Restaurants</span>
          <Home size={20} className="group-hover:text-darkgrey" />
        </button>

        <button className="flex items-center text-md group transition-colors duration-200">
          <span className="mr-2 group-hover:text-darkgrey">My Account</span>
          <User size={20} className="group-hover:text-darkgrey" />
        </button>
      </div>
    </nav>
  );
};

export default MerchantNavbar;
