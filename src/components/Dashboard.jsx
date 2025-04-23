import { useEffect, useState } from "react";

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

  const AdminPanel = () => {
    return (
      <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
        <h2 className="text-lg font-semibold text-red-700">Admin Panel</h2>
        <p className="text-sm text-red-600">
          Manage users, view reports, and control platform settings.
        </p>
      </div>
    );
  };

  const DeliveryTasks = () => {
    return (
      <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700">
          Delivery Dashboard
        </h2>
        <p className="text-sm text-blue-600">
          View assigned deliveries and update delivery status.
        </p>
      </div>
    );
  };

  const CustomerComp = () => {
    return (
      <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700">
          Customer Dashboard
        </h2>
      </div>
    );
  };

  const RestaurantManagement = () => {
    return (
      <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
        <h2 className="text-lg font-semibold text-green-700">
          Restaurant Owner Dashboard
        </h2>
        <p className="text-sm text-green-600">
          Add menus, manage orders, and view revenue stats.
        </p>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.firstname}</h1>

      {user.role === "admin" && <AdminPanel />}
      {user.role === "restaurantOwner" && <RestaurantManagement />}
      {user.role === "deliveryPerson" && <DeliveryTasks />}
      {user.role === "customer" && <CustomerComp />}
    </div>
  );
};

export default Dashboard;
