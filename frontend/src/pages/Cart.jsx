import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const { cart, addToCart, removeFromCart, getTotal } = useCart();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="container my-5">
      <h2 className="text-4xl font-bold mb-8 text-center">Your Cart</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {cart.length === 0 ? (
          <p className="text-xl text-center text-gray-600">Your cart is empty</p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-2xl font-semibold text-gray-700">{item.title}</h3>
                  <p className="text-lg text-gray-600 mb-1">Price: KSh {item.price}</p>
                  <p className="text-lg text-gray-600 mb-3">Quantity: {item.quantity}</p>
                </div>
                <div className="flex-shrink-0 ml-4 space-x-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    -
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-t-lg shadow-lg text-right mt-6">
        <h3 className="text-3xl font-semibold mb-4">Total: KSh {getTotal().toFixed(2)}</h3>
        <div className="space-x-4">
          <button
            onClick={handleContinueShopping}
            className="continue-btn"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleProceedToCheckout}
            className="checkout-btn"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
