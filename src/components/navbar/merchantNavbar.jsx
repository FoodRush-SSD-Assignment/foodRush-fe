import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUsers,
  FaBuilding,
  FaUserCircle,
} from "react-icons/fa";
import { showConfirmation } from "../../utils/alertService";
import Swal from "sweetalert2";

const MerchantNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    showConfirmation("Are you sure?", "Do you want to log out?").then(
      (isConfirmed) => {
        if (isConfirmed) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          showLoading("Logging out...");

          setTimeout(() => {
            Swal.close();
            navigate("/merchant-login");
          }, 1000);
        }
      }
    );
  };

  return (
    <nav className="flex justify-between items-center bg-primary text-white py-4 px-8">
      <div className="flex items-center">
        <button
          onClick={handleLogout}
          className="flex items-center text-md group transition-colors duration-200"
        >
          <span className="mr-2 group-hover:text-darkgrey">Logout</span>
          <FaSignOutAlt size={20} className="group-hover:text-darkgrey" />
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <button
          className="flex items-center text-md group transition-colors duration-200"
          onClick={() => navigate("/admin/users")}
        >
          <span className="mr-2 group-hover:text-darkgrey">Users</span>
          <FaUsers size={20} className="group-hover:text-darkgrey" />
        </button>

        <button
          className="flex items-center text-md group transition-colors duration-200"
          onClick={() => navigate("/admin/restaurants")}
        >
          <span className="mr-2 group-hover:text-darkgrey">Restaurants</span>
          <FaBuilding size={20} className="group-hover:text-darkgrey" />
        </button>

        <button
          className="flex items-center text-md group transition-colors duration-200"
          onClick={() => navigate("/merchant/account")} // Maybe link to your account page?
        >
          <span className="mr-2 group-hover:text-darkgrey">My Account</span>
          <FaUserCircle size={20} className="group-hover:text-darkgrey" />
        </button>
      </div>
    </nav>
  );
};

export default MerchantNavbar;
