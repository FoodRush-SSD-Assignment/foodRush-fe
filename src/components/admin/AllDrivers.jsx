import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deliveryApi from "../../api/deliveryApi.js";
import { FaCar, FaMotorcycle, FaEnvelope, FaPhone } from "react-icons/fa";

const AllDrivers = () => {
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await deliveryApi.get(
          `/delivery-drivers/admin/drivers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const allDrivers = response.data.drivers || response.data;
        setDrivers(allDrivers);
        setFilteredDrivers(allDrivers); // <-- Initially, show all
      } catch (error) {
        console.error("Failed to fetch drivers", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []); // <-- Only once when component mounts

  useEffect(() => {
    let filtered = drivers;

    if (searchName.trim() !== "") {
      filtered = filtered.filter((driver) =>
        `${driver.driverName}`.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchEmail.trim() !== "") {
      filtered = filtered.filter((driver) =>
        driver.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    setFilteredDrivers(filtered);
  }, [searchName, searchEmail, drivers]);

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

  const getStatusBadge = (status) => {
    if (!status) return null;
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
        );
      case "approved":
        return (
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        );
      case "suspended":
        return (
          <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
        );
      default:
        return null;
    }
  };

  const handleDriverClick = (driverId) => {
    navigate(`/view-driver/${driverId}`);
  };

  return (
    <div className="px-8 pt-2 pb-12 min-h-screen bg-white">
      <div className="flex justify-between items-center mt-2 mb-2">
        <h3 className="text-secondary font-medium text-lg">Filter Drivers</h3>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-primary hover:text-secondary transition-all"
        >
          &larr; Back
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 w-full md:w-1/2"
        />
        <input
          type="text"
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 w-full md:w-1/2"
        />
      </div>

      <hr className="border-t border-gray-200 mb-8" />

      {/* User List */}
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-secondary font-semibold text-xl">All Drivers</h3>
          <span className=" text-red-800 py-1 px-3 rounded-sm text-sm font-medium">
            {filteredDrivers.length} drivers found
          </span>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No drivers match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <div
                key={driver._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleDriverClick(driver._id)}
              >
                <div className="h-32 bg-lightgray relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-secondary">
                      {driver.driverName}
                    </span>
                    <div className="text-sm text-white bg-black bg-opacity-20 px-3 py-1 rounded-full mt-2 capitalize">
                      {driver.userId}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
                    {/* Email */}
                    <div className="flex items-center">
                      <FaEnvelope className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-secondary">
                        {driver.email}
                      </span>
                    </div>

                    {/* Phone */}
                    {driver.phone && (
                      <div className="flex items-center">
                        <FaPhone className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-secondary">
                          {driver.phone}
                        </span>
                      </div>
                    )}

                    {/* Vehicle and Vehicle Number together */}
                    {driver.vehicle && (
                      <div className="flex items-center">
                        {getVehicleIcon(driver.vehicle)}
                        <span className="text-sm text-secondary ml-2">
                          {driver.vehicleNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDrivers;
