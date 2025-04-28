import { FaEdit } from "react-icons/fa";

const CheckoutDetailsForm = ({ formData, handleChange, totalAmount }) => {
  // Check if cash is allowed based on total amount
  const isCashDisabled = totalAmount > 3000;

  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-7">Delivery Details</h2>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {/* Contact Details Section */}
        <div className="mt-2">
          <h3 className="text-lg font-medium mb-2">Contact Details</h3>
          <div className="bg-gray-50 border rounded p-4 flex justify-between items-center">
            <div>
              <div className="text-base">
                {formData.mobileNo || "0766902686"}
              </div>
              <div className="text-sm text-gray-500">Senith</div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-2">
          <h3 className="text-lg font-medium mb-2">Address</h3>
          <div className="bg-gray-50 border rounded p-4 flex justify-between items-center">
            <div>
              <div className="text-base">
                {formData.address || "No.296, Main Street, Colombo"}
              </div>
              <div className="text-sm text-gray-500">Colombo 13</div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-4">
          <label className="font-semibold">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-4 mb-4"
          >
            <option value="card">Card</option>

            {/* Conditionally render and disable cash option */}
            <option value="cash" disabled={isCashDisabled}>
              Cash
            </option>
          </select>

          {/* Display warning if cash is disabled */}
          {isCashDisabled && (
            <p className="text-red-500 text-sm mt-2">
              Cash payment not allowed for orders above Rs. 3000.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutDetailsForm;
