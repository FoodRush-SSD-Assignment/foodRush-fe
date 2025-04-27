import react, { useEffect, useState } from "react";
import AddItemForm from "../restaurant/AddItemForm";

const RestaurantManagement = () => {
  return (
    <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
      <h2 className="text-lg font-semibold text-green-700">
        Restaurant Owner Dashboard
      </h2>
      <p className="text-sm text-green-600">
        Add menus, manage orders, and view revenue stats.
      </p>
      <AddItemForm/>
    </div>
  );
};

export default RestaurantManagement;
