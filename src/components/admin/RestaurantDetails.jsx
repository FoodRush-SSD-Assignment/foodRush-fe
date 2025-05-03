import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import restaurantApi from "../../api/restaurantApi.js";
import { showError, showSuccess } from "../../utils/alertService";
import {
  FaUtensils,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaPencilAlt,
  FaSyncAlt,
} from "react-icons/fa";

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await restaurantApi.get(`/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(res.data);

        const itemsResponse = await restaurantApi.get(
          `/items/restaurant/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setItems(itemsResponse.data || []); // Update: directly use the array
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
        setLoadingItems(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/restaurants/${id}/edit`);
  };

  const handleUpdateStatus = () => {
    setNewStatus(restaurant.status);
    setShowStatusModal(true);
  };

  const submitStatusUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await restaurantApi.patch(
        `/restaurants/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update status locally after success
      setRestaurant((prev) => ({ ...prev, status: newStatus }));
      setShowStatusModal(false);
      showSuccess("Status updated successfully!");
    } catch (err) {
      console.error("Failed to update status", err);
      showError("Failed to update status. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
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
        return (
          <span className="inline-block w-3 h-3 bg-gray-500 rounded-full"></span>
        );
    }
  };

  if (loading || loadingItems) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600 text-2xl">Loading...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-2xl">Restaurant not found.</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 mx-2 m-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">
            <span>{restaurant.restaurantName || "N/A"}</span>
          </h1>
          <p className="text-sm text-gray-600">Restaurant ID: {id}</p>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-primary hover:text-secondary transition-all"
        >
          &larr; Back
        </button>
      </div>
      <hr className="mb-6 rounded-md" />

      {/* Details */}
      <h2 className="text-lg font-semibold mb-3">Restaurant Details</h2>
      <div className="bg-gray-100 border border-gray-200 rounded p-4 relative mb-4">
        <div className="space-y-2">
          <div className="flex">
            <span className="w-32 text-gray-700 flex items-center">
              Category:
            </span>{" "}
            <span>
              {restaurant.category
                ? restaurant.category.replace("_", " ")
                : "Fast Food"}
            </span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-700 flex items-center">Owner:</span>{" "}
            <span>{restaurant.ownerName || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-700 flex items-center">
              Contact Number:
            </span>{" "}
            <span>{restaurant.contactNumber || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-700 flex items-center">
              Address:
            </span>{" "}
            <span>{restaurant.location || "N/A"}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-gray-700 flex items-center">
              Joined:
            </span>{" "}
            <span>
              {restaurant.createdAt
                ? new Date(restaurant.createdAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex items-center">
          {getStatusBadge(restaurant.status)}
          <span className="ml-2 text-gray-700 capitalize">
            {restaurant.status || "N/A"}
          </span>
        </div>

        {/* Edit and Update Status Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={handleEdit}
            className="bg-red-600 text-white rounded px-6 py-1 text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleUpdateStatus}
            className="bg-secondary text-white rounded px-6 py-1 text-sm"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Items Section */}
      <h2 className="text-lg font-semibold mb-3 mt-8">Items listed</h2>
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item._id}
            className="bg-gray-100 border border-gray-200 rounded p-4 mb-3"
          >
            <h3 className="font-semibold text-gray-800">{item.itemName}</h3>
            <p className="text-sm text-gray-700 mt-1">{item.itemDescription}</p>
          </div>
        ))
      ) : (
        <div className="bg-gray-100 border border-gray-200 rounded p-4 mb-3">
          <h3 className="font-semibold text-gray-800">
            No items are listed under this restaurant
          </h3>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            >
              <option value="">Select Status</option>
              <option value="Pending">
                Pending{" "}
                <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
              </option>
              <option value="Approved">
                Approved{" "}
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
              </option>
              <option value="suspended">
                Suspended{" "}
                <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
              </option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitStatusUpdate}
                className="px-4 py-2 rounded bg-primary text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
