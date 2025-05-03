// src/components/StatusBadge.jsx
import React from "react";

const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-400 px-3 py-2",
    confirmed: "bg-green-100 text-green-700 border-green-400 px-3 py-2",
    accepted: "bg-blue-100 text-blue-700 border-blue-400 px-3 py-2",
    preparing: "bg-purple-100 text-purple-700 border-purple-400 px-3 py-2",
    ready_for_pickup: "bg-orange-100 text-orange-700 border-orange-400 px-3 py-2",
    delivery_accepted: "bg-cyan-100 text-cyan-700 border-cyan-400 px-3 py-2",
    delivering: "bg-indigo-100 text-indigo-700 border-indigo-400 px-3 py-2",
    delivered: "bg-green-100 text-green-700 border-green-400 px-3 py-2",
    cancelled_by_customer: "bg-red-100 text-red-700 border-red-400 px-3 py-2",
    cancelled_by_restaurant: "bg-red-100 text-red-700 border-red-400 px-3 py-2",
    cancelled_by_delivery: "bg-red-100 text-red-700 border-red-400 px-3 py-2",
    paid: "bg-green-100 text-green-700 border-green-400 px-3 py-2",
    refunded: "bg-gray-100 text-gray-700 border-gray-400 px-3 py-2",
  };

  const colorClass = statusColors[status] || "bg-gray-100 text-gray-700 border-gray-400";

  return (
    <span className={`px-3 py-1 rounded-full border text-sm font-semibold ${colorClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

export default StatusBadge;
