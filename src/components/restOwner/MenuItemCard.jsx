import React, { useEffect, useState } from "react";
import restaurantApi from "../../api/restaurantApi.js";

const MenuItemCard = ({ id }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    itemPrice: "",
    itemDescription: "",
    itemCategory: "",
    isAvailable: true,
  });

  // Category options for the dropdown
  const categoryOptions = ["mains", "sides", "desserts", "beverages"];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await restaurantApi.get(`/items/restaurant/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [id]);

  const handleDelete = async (e, itemId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const token = localStorage.getItem("token");
        await restaurantApi.delete(`/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMenuItems(menuItems.filter((item) => item._id !== itemId));
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item. Please try again.");
      }
    }
  };

  const openEditModal = (e, item) => {
    e.stopPropagation();
    setSelectedItem(item);
    setFormData({
      itemName: item.itemName,
      itemPrice: item.itemPrice,
      itemDescription: item.itemDescription,
      itemCategory: item.itemCategory,
      isAvailable: item.isAvailable,
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await restaurantApi.put(
        `/items/${selectedItem._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedItem = response.data;
      const updatedItems = menuItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      );
      setMenuItems(updatedItems);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        <p className="ml-4 text-lg font-medium text-secondary">
          Loading menu items...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ITEM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
          >
            <div className="absolute top-3 right-3 flex space-x-2 z-10">
              <button
                onClick={(e) => openEditModal(e, item)}
                className="bg-secondary text-white p-2 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-md"
                title="Edit item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-12 12a2 2 0 01-1.414.586H2a1 1 0 01-1-1v-1a2 2 0 01.586-1.414l12-12z" />
                </svg>
              </button>
              <button
                onClick={(e) => handleDelete(e, item._id)}
                className="bg-primary text-white p-2 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-md"
                title="Delete item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {item.imageUrl ? (
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24 opacity-50"></div>
              </div>
            ) : (
              <div className="h-56 bg-gray-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-secondary">
                  {item.itemName}
                </h3>
                <span className="text-lg font-bold text-primary">
                  Rs. {item.itemPrice}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {item.itemDescription}
              </p>

              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {item.itemCategory}
                </span>
                <span
                  className={`flex items-center ${
                    item.isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      item.isAvailable ? "bg-green-600" : "bg-red-600"
                    }`}
                  ></span>
                  <span className="text-sm font-medium">
                    {item.isAvailable ? "Available" : "Not Available"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-secondary">
                Edit Menu Item
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    Rs.
                  </span>
                  <input
                    type="number"
                    name="itemPrice"
                    value={formData.itemPrice}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="itemCategory"
                  value={formData.itemCategory}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none bg-white"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="inline-flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`block w-14 h-8 rounded-full transition-colors ${
                        formData.isAvailable ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform ${
                        formData.isAvailable ? "translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Available
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;
