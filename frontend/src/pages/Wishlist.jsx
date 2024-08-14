import './Wishlist.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Wishlist = () => {

  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/wishlists");
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await axios.post("http://127.0.0.1:5000/cart", item);

      handleDeleteFromWishlist(item.id);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };


  const handleDeleteFromWishlist = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/wishlists/${id}`);
      fetchWishlist(); 
    } catch (error) {
      console.error("Error deleting from wishlist:", error);
    }
  };

  const handleNavigateToCart = () => {
    navigate("/cart");
  };

  const handleContinueShopping = () => {
    navigate("/home");
  };


  return (
    <div className="wishlist-page">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
              Wishlist
            </h2>
            <div className="space-y-6">
              {wishlist.length === 0 ? (
                <p className="text-xl text-center text-gray-600">
                  No items in your wishlist
                </p>
              ) : (
                Wishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
                  >
                    <img
                      src={item.image_path}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="text-xl font-semibold text-gray-700">
                        {item.name}
                      </h3>
                      <p className="text-lg text-gray-600">
                        KSh{item.price ? item.price.toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleDeleteFromWishlist(item.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-t-lg shadow-lg text-right">
        <div className="space-x-4">
          <button
            onClick={handleContinueShopping}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleNavigateToCart}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
