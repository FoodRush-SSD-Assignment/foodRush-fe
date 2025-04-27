import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUsers,
  FaBuilding,
  FaUserCircle,
  FaTruck,
} from "react-icons/fa";
import { showConfirmation, showLoading } from "../../utils/alertService";
import Swal from "sweetalert2";

const MerchantNavbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from token or localStorage (simplified)
    const tokenData = localStorage.getItem("user");
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      setUser(parsed);
    }
  }, []);

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

  if (!user) return <div className="p-8">Loading...</div>; // Display loading if no user data is available.

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
        {/* Admin view */}
        {user.role === "admin" && (
          <>
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
              <span className="mr-2 group-hover:text-darkgrey">
                Restaurants
              </span>
              <FaBuilding size={20} className="group-hover:text-darkgrey" />
            </button>
          </>
        )}

        {/* Restaurant Owner view */}
        {user.role === "restaurantOwner" && (
          <>
            <button
              className="flex items-center text-md group transition-colors duration-200"
              onClick={() => navigate("/merchant/myrestaurant")}
            >
              <span className="mr-2 group-hover:text-darkgrey">
                My Restaurant
              </span>
              <FaBuilding size={20} className="group-hover:text-darkgrey" />
            </button>
          </>
        )}

        {/* Delivery Person view */}
        {user.role === "deliveryPerson" && (
          <>
            <button
              className="flex items-center text-md group transition-colors duration-200"
              onClick={() => navigate("/merchant/mydeliveries")}
            >
              <span className="mr-2 group-hover:text-darkgrey">
                My Deliveries
              </span>
              <FaTruck size={20} className="group-hover:text-darkgrey" />
            </button>
          </>
        )}

        {/* Common button for all roles */}
        <button
          className="flex items-center text-md group transition-colors duration-200"
          onClick={() => navigate("/merchant/account")}
        >
          <span className="mr-2 group-hover:text-darkgrey">My Account</span>
          <FaUserCircle size={20} className="group-hover:text-darkgrey" />
        </button>
      </div>
    </nav>
  );
};

export default MerchantNavbar;
