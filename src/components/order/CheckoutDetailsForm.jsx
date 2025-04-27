const CheckoutDetailsForm = ({ formData, handleChange, handlePlaceOrder }) => {
  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-7">Add checkout Details</h2>

      <div className="grid grid-cols-1 gap-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded"
          disabled
        />

        {/* Contact Number */}
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Contact No."
          className="border p-2 rounded"
        />

        {/* Delivery Address Label */}
        <label className="font-semibold mt-4">Delivery Address</label>

        {/* Address fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            placeholder="Province / State"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 rounded mb-3"
          />
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="border p-2 rounded mb-3"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="font-semibold">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-4 mb-4"
          >
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="mobile_wallet">Mobile Wallet</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePlaceOrder}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CheckoutDetailsForm;
