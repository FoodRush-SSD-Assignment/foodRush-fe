import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import restaurantApi from "../../api/restaurantAPI";
import { showSuccess, showError } from "../../utils/alertService";

function AddItemForm() {
  const { id } = useParams(); // Get restaurantId from URL
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    itemPrice: "",
    itemCategory: "mains",
    restaurantId: id || "", // Set restaurantId to the URL parameter
    restaurantName: "",
    image: null,
  });

  // Update restaurantId in formData when restaurantId changes in the URL
  useEffect(() => {
    if (id) {
      setFormData((prev) => ({
        ...prev,
        restaurantId: id, // Update restaurantId if it's available
      }));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await restaurantApi.get(`/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(res.data);
  
        // Also update the restaurantName in the formData
        setFormData((prev) => ({
          ...prev,
          restaurantName: res.data.restaurantName,
        }));
  
      } catch (err) {
        console.error("Failed to fetch restaurant details", err);
        showError("Error", "Failed to fetch restaurant details");
      }
    };
  
    fetchRestaurant();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("itemName", formData.itemName);
      formDataToSend.append("itemDescription", formData.itemDescription);
      formDataToSend.append("itemPrice", formData.itemPrice);
      formDataToSend.append("itemCategory", formData.itemCategory);
      formDataToSend.append("restaurantId", formData.restaurantId);
      formDataToSend.append("restaurantName", restaurant.restaurantName);
      formDataToSend.append("image", formData.image);

      const res = await restaurantApi.post(
        "/items",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      console.log("Item added successfully:", res.data);
      showSuccess("Success", "Menu item added successfully");

      setFormData({
        itemName: "",
        itemDescription: "",
        itemPrice: "",
        itemCategory: "mains",
        restaurantId: id || "",
        restaurantName: restaurant?.restaurantName || "",
        image: null,
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
      showError("Error", error.response?.data?.message || "Failed to add menu item");
    }
  };

  return (
    <div className="bg-lightgray py-8 min-h-screen">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-lg border border-darkgrey"
      >
        <h2 className="text-3xl font-bold mb-8 text-primary text-center">Add Menu Item</h2>

        <div className="mb-6">
          <label className="block text-secondary font-semibold mb-2">Item Name</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="Enter item name"
            required
            className="w-full border border-darkgrey rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-secondary font-semibold mb-2">Description</label>
          <textarea
            name="itemDescription"
            value={formData.itemDescription}
            onChange={handleChange}
            placeholder="Describe your dish in detail"
            className="w-full border border-darkgrey rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows="4"
          />
        </div>

        <div className="mb-6">
          <label className="block text-secondary font-semibold mb-2">Price ($)</label>
          <input
            type="number"
            name="itemPrice"
            value={formData.itemPrice}
            onChange={handleChange}
            placeholder="0.00"
            required
            step="0.01"
            min="0"
            className="w-full border border-darkgrey rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-secondary font-semibold mb-2">Category</label>
          <select
            name="itemCategory"
            value={formData.itemCategory}
            onChange={handleChange}
            required
            className="w-full border border-darkgrey rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="mains">Mains</option>
            <option value="sides">Sides</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-secondary font-semibold mb-2">Restaurant ID</label>
          <input
            type="text"
            name="restaurantId"
            value={formData.restaurantId}
            onChange={handleChange}
            placeholder="Restaurant ID"
            required
            readOnly={!!id}
            className={`w-full border border-darkgrey rounded-lg px-4 py-3 focus:outline-none ${
              id ? "bg-lightgray" : "focus:ring-2 focus:ring-primary focus:border-transparent"
            }`}
          />
        </div>

        <div className="mb-6">
          <label className="block text-secondary font-semibold mb-2">Restaurant Name</label>
          <input
            type="text"
            name="restaurantName"
            value={formData.restaurantName}
            onChange={handleChange}
            placeholder="Restaurant Name"
            required
            readOnly={!!restaurant}
            className={`w-full border border-darkgrey rounded-lg px-4 py-3 focus:outline-none ${
              restaurant ? "bg-lightgray" : "focus:ring-2 focus:ring-primary focus:border-transparent"
            }`}
          />
        </div>

        <div className="mb-8">
          <label className="block text-secondary font-semibold mb-2">Item Image</label>
          <div className="border-2 border-dashed border-darkgrey rounded-lg p-4 text-center">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">Upload a high-quality image of your dish</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-md"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}

export default AddItemForm;