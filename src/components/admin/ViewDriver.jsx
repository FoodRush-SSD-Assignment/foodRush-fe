import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import deliveryApi from "../../api/deliveryAPI";
import { FaCar, FaMotorcycle, FaPhone, FaEnvelope } from "react-icons/fa";
import { showSuccess, showError } from "../../utils/alertService";
const ViewDriver = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await deliveryApi.get(
          `/delivery-drivers/${driverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDriver(response.data.driver || response.data);
        setNewStatus(response.data.driver?.approvalStatus || "approved");
      } catch (error) {
        console.error("Failed to fetch driver", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, [driverId]);

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await deliveryApi.put(
        `/delivery-drivers/admin/driver/${driverId}/update-status`,
        { approvalStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSuccess("Status updated successfully!");
      navigate(-1); // Go back after update
    } catch (error) {
      console.error("Failed to update status", error);
      showError("Failed to update status");
    }
  };

  const getVehicleIcon = (vehicle) => {
    if (!vehicle) return null;
    switch (vehicle.toLowerCase()) {
      case "car":
        return <FaCar />;
      case "bike":
        return <FaMotorcycle />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Driver not found.
      </div>
    );
  }

  return (
    <div className="px-8 py-6 min-h-screen bg-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-primary hover:text-secondary transition-all"
      >
        &larr; Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Driver Info */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Driver Details
          </h2>
          <div className="space-y-2 text-secondary">
            <div>
              <strong>Driver Name:</strong> {driver.driverName}
            </div>
            <div>
              <strong>Email:</strong> {driver.email}
            </div>
            <div>
              <strong>Phone:</strong> {driver.phone || "N/A"}
            </div>
            <div>
              <strong>User ID:</strong> {driver.userId}
            </div>
            <div>
              <strong>Status:</strong> {driver.status}
            </div>
            <div>
              <strong>Approval Status:</strong> {driver.approvalStatus}
            </div>
            <div>
              <strong>Active:</strong> {driver.isActive ? "Yes" : "No"}
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Vehicle Details
          </h2>
          <div className="flex items-center mb-4">
            {getVehicleIcon(driver.vehicle)}
            <span className="ml-2 text-lg capitalize">
              {driver.vehicle || "N/A"}
            </span>
          </div>
          <div className="text-secondary">
            <strong>Vehicle Number:</strong> {driver.vehicleNumber || "N/A"}
          </div>

          {/* Update Status */}
          <div className="mt-8">
            <label
              htmlFor="status"
              className="block mb-2 text-secondary font-medium"
            >
              Update Approval Status
            </label>
            <select
              id="status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-all"
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDriver;
