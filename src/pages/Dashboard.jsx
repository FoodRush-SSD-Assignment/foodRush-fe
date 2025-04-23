import { useEffect, useState } from "react";
import AdminPanel from "../components/merchantDashboard/AdminPanel";
import RestaurantManagement from "../components/merchantDashboard/RestaurantManagement";
import DeliveryTasks from "../components/merchantDashboard/DeliveryTasks";
import MerchantNavbar from "../components/navbar/merchantNavbar";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from token or localStorage (simplified)
    const tokenData = localStorage.getItem("user");
    if (tokenData) {
      const parsed = JSON.parse(tokenData);
      setUser(parsed);
    }
  }, []);

  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <>
      {" "}
      <MerchantNavbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold text-secondary">
          Welcome, {user.firstname}
        </h1>

        {user.role === "admin" && <AdminPanel />}
        {user.role === "restaurantOwner" && <RestaurantManagement />}
        {user.role === "deliveryPerson" && <DeliveryTasks />}
        {/* {user.role === "customer" && <CustomerComp />} */}
      </div>
    </>
  );
};

export default Dashboard;
