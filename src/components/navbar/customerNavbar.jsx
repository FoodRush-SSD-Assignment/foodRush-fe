import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaCompass,
} from "react-icons/fa";
import { showConfirmation, showLoading } from "../../utils/alertService";
import Swal from "sweetalert2";

const CustomerNavbar = () => {
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
            navigate("/login");
          }, 1000);
        }
      }
    );
  };

  return (
    <nav className="bg-primary py-4 px-6 flex justify-between items-center text-white">
      <div className="flex items-center">
        <button
          className="flex items-center space-x-2 text-white hover:text-lightgray"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-2 hover:text-lightgray">
          <FaCompass className="h-5 w-5" />
          <span>Browse</span>
        </button>

        <button className="flex items-center space-x-2 hover:text-lightgray">
          <FaShoppingCart className="h-5 w-5" />
          <span>My Cart</span>
        </button>

        <button className="flex items-center space-x-2 hover:text-lightgray">
          <FaUser className="h-5 w-5" />
          <span>My Account</span>
        </button>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
