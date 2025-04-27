import { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";

const OrderDetailConfirm = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    province: "",
    postalCode: "",
    paymentMethod: "card",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderApi.get(`/order-service/order/my-orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrder(response.data);
        setFormData({
          street: response.data.deliveryAddress.street || "",
          city: response.data.deliveryAddress.city || "",
          province: response.data.deliveryAddress.province || "",
          postalCode: response.data.deliveryAddress.postalCode || "",
          paymentMethod: response.data.paymentMethod || "card",
        });
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      const updatedData = {
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
        },
        paymentMethod: formData.paymentMethod,
      };
  
      await orderApi.put(`/order-service/order/updateOrder/${orderId}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
  
      setSaveSuccess("Order updated successfully!");
  
      // Refresh order data
      const refreshed = await orderApi.get(`/order-service/order/my-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrder(refreshed.data);
  
      // Wait 1.5 seconds before closing modal
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess("");
      }, 1500);
  
    } catch (err) {
      console.error("Failed to update order:", err);
      setSaveError(err.response?.data?.message || "Failed to update order.");
    } finally {
      setSaving(false);
    }
  };
  

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="border rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">Order Confirmation</h2>
  
      {/* Order Details and Edit Button Layout */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        
        {/* Order Details */}
        <div className="space-y-3 md:w-2/3">
          <div>
            <span className="font-semibold">Order ID:</span> {order.orderId}
          </div>
          <div>
            <span className="font-semibold">Customer Name:</span> {order.customerName}
          </div>
          <div>
            <span className="font-semibold">Customer Mobile No:</span> {order.customerMobileNo}
          </div>
          <div>
            <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
          </div>
          <div>
            <span className="font-semibold">Delivery Address:</span>
            <div className="ml-4">
              <p>Street: {order.deliveryAddress.street}</p>
              <p>City: {order.deliveryAddress.city}</p>
              <p>Province: {order.deliveryAddress.province}</p>
              <p>Postal Code: {order.deliveryAddress.postalCode}</p>
            </div>
          </div>
        </div>
  
        {/* Edit Button */}
        <div className="mt-6 md:mt-0 md:w-1/3 flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-colors duration-200"
          >
            Edit Order
          </button>
        </div>
      </div>
  
      {/* Edit Modal */}
      {isEditing && (
        <>
          {/* Modal Background */}
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Content */}
            <div className="bg-white p-8 rounded-xl shadow-2xl w-11/12 max-w-md relative">
              <h3 className="text-xl font-bold mb-6 text-center">Edit Order Details</h3>
  
              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Street</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Province</label>
                  <input
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="border p-2 w-full rounded-lg"
                  >
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                    <option value="mobile_wallet">Mobile Wallet</option>
                  </select>
                </div>
              </div>
  
              {/* Success and Error Messages */}
              {saveError && <div className="text-red-500 mt-4 text-center">{saveError}</div>}
              {saveSuccess && <div className="text-green-500 mt-4 text-center">{saveSuccess}</div>}
  
              {/* Modal Buttons */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg bg-gray-300 text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );  
};

export default OrderDetailConfirm;
