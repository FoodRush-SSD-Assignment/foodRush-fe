import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import deliveryApi from "../../api/deliveryApi";

const DeliveryTasks = () => {
  const { user, token } = useContext(AuthContext);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch driver details
  const fetchDriverDetails = async (userId) => {
    try {
      const { data } = await deliveryApi.get(`/delivery-drivers/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDriver(data);
    } catch (err) {
      console.error("Error fetching driver:", err);
      setError(err.response?.data?.error || "Failed to load driver data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchDriverDetails(user.id);
    }
  }, [user, token]);

  if (loading) return <div className="p-4">Loading delivery tasks...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
      <h2 className="text-lg font-semibold text-blue-700">
        Delivery Dashboard
      </h2>
      <p className="text-sm text-blue-600 mb-4">
        View assigned deliveries and update delivery status.
      </p>

      {/* Driver Details */}
      {driver && (
        <div className="p-4 bg-white rounded shadow">
          <h3 className="text-md font-semibold mb-2 text-gray-800">Driver Details</h3>
          <p><span className="font-medium">Name:</span> {driver.driverName}</p>
          <p><span className="font-medium">Email:</span> {driver.email}</p>
          <p><span className="font-medium">Phone:</span> {driver.phone}</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTasks;
