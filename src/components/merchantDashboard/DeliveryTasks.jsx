import react, { useEffect, useState } from "react";

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

export default DeliveryTasks;
