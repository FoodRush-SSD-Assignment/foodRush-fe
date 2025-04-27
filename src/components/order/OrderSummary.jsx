const OrderSummary = ({ cartItems, restaurantName }) => {

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = cartItems.reduce((total, item) => total + (item.quantity * 2), 0);
    const deliveryFee = 250.0;
    const totalAmount = totalPrice + taxAmount + deliveryFee;
  
    return (
      <div className="mb-8 border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="mb-4">
          <h3 className="font-semibold">{restaurantName}</h3>
          {cartItems.map((item, idx) => (
            <div key={idx} className="flex justify-between text-gray-700">
              <span>{item.name} (x{item.quantity})</span>
              <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
            <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs.{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>Rs.{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
                <span>Tax:</span>
                <span>Rs.{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span>Rs.{(totalAmount).toFixed(2)}</span>
            </div>
        </div>
      </div>
    );
  };
  
  export default OrderSummary;
  