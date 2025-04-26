import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import deliveryApi from "../../api/deliveryApi"; // your axios instance

const DeliveryTasks = () => {
  const { user, token } = useContext(AuthContext);  // Get token also!
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Updated API call to pass token in header
  const getDriverByUserId = async (userId) => {
    try {
      const response = await deliveryApi.get(`/delivery-drivers/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Pass the token here
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (user && token) {
      getDriverByUserId(user.id)
        .then((data) => {
          setDriver(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError(err.response?.data?.error || "Failed to load driver data");
          setLoading(false);
        });
    }
  }, [user, token]);

  if (loading) return <div className="p-4">Loading delivery tasks...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
      <h2 className="text-lg font-semibold text-blue-700">
        Delivery Dashboard
      </h2>
      <p className="text-sm text-blue-600">
        View assigned deliveries and update delivery status.
      </p>

      {/* Display driver details */}
      <div className="mt-4 p-4 bg-white rounded shadow">
        <h3 className="text-md font-semibold mb-2 text-gray-800">Driver Details</h3>
        <p><span className="font-medium">Name:</span> {driver.name}</p>
        <p><span className="font-medium">Email:</span> {driver.email}</p>
        <p><span className="font-medium">Phone:</span> {driver.phone}</p>
      </div>
    </div>
  );
};

export default DeliveryTasks;
