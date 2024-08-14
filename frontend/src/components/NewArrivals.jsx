import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'; 
import { useNavigate } from 'react-router-dom';
import './NewArrivals.css';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate('/cart'); 
  };

  return (
    <section className="new-arrivals">
      <h2 className="title">New Arrivals</h2>
      <div className="products">
        {products.map(product => (
          <div className="product" key={product.id}>
            <img src={product.image_path} alt={product.name} />
            <h3>{product.name}</h3>
            <p>KES:{product.price.toFixed(2)}</p>
            <button 
              onClick={() => handleAddToCart(product)} 
              className="add-to-cart-button"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
