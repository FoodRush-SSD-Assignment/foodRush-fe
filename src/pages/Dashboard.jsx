import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; 
import AdminPanel from "../components/merchantDashboard/AdminPanel";
import RestaurantManagement from "../components/merchantDashboard/RestaurantManagement";
import DeliveryTasks from "../components/merchantDashboard/DeliveryTasks";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext); // 👉 get user and loading from AuthContext

  if (loading) return <div className="p-8">Loading...</div>; // Show loading state

  if (!user) return <div className="p-8">Not authorized</div>; // Handle unauthorized access

  return (
    <>
      {" "}
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