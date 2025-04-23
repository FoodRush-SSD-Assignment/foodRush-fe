import React, { useEffect, useState } from "react";
import authApi from "../../api/authAPI";

const AdminPanel = () => {
  const [userCounts, setUserCounts] = useState({
    customer: 0,
    restaurantOwner: 0,
    deliveryPerson: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await authApi.get(`/auth/getusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = res.data.users || res.data;
        const counts = {
          customer: 0,
          restaurantOwner: 0,
          deliveryPerson: 0,
        };

        users.forEach((user) => {
          if (counts[user.role] !== undefined) {
            counts[user.role]++;
          }
        });

        setUserCounts(counts);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mt-6 p-4">
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div>
          <h3 className="text-md font-semibold text-secondary mb-2">
            Active Users
          </h3>
          <div className="flex gap-4 mb-6">
            <div className="bg-primary text-white px-6 py-4 rounded text-center w-40">
              <p className="text-sm">Customers</p>
              <p className="text-2xl font-bold">{userCounts.customer}</p>
            </div>
            <div className="bg-primary text-white px-6 py-4 rounded text-center w-40">
              <p className="text-sm">Restaurant Owners</p>
              <p className="text-2xl font-bold">{userCounts.restaurantOwner}</p>
            </div>
            <div className="bg-primary text-white px-6 py-4 rounded text-center w-40">
              <p className="text-sm">Drivers</p>
              <p className="text-2xl font-bold">{userCounts.deliveryPerson}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
