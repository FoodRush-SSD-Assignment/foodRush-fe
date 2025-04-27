import { useState } from "react";
import restaurantApi from '../../api/restaurantApi';

function AddItemForm() {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDescription: "",
    itemPrice: "",
    itemCategory: "mains",
    restaurantId: "",
    restaurantName: "",
    image: null,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("itemName", formData.itemName);
      formDataToSend.append("itemDescription", formData.itemDescription);
      formDataToSend.append("itemPrice", formData.itemPrice);
      formDataToSend.append("itemCategory", formData.itemCategory);
      formDataToSend.append("restaurantId", formData.restaurantId);
      formDataToSend.append("restaurantName", formData.restaurantName);
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

      setFormData({
        itemName: "",
        itemDescription: "",
        itemPrice: "",
        itemCategory: "mains",
        restaurantId: "",
        restaurantName: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      encType="multipart/form-data"
      className="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Item</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Item Name:</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Item Description:</label>
        <textarea
          name="itemDescription"
          value={formData.itemDescription}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Item Price:</label>
        <input
          type="number"
          name="itemPrice"
          value={formData.itemPrice}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Item Category:</label>
        <select
          name="itemCategory"
          value={formData.itemCategory}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="mains">Mains</option>
          <option value="sides">Sides</option>
          <option value="desserts">Desserts</option>
          <option value="beverages">Beverages</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Restaurant ID:</label>
        <input
          type="text"
          name="restaurantId"
          value={formData.restaurantId}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">Restaurant Name:</label>
        <input
          type="text"
          name="restaurantName"
          value={formData.restaurantName}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Item Image:</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
      >
        Add Item
      </button>
    </form>
  );
}

export default AddItemForm;
