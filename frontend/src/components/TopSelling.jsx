import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './TopSelling.css';


const TopSelling = () => {
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
        const topSellingProducts = data.slice(0, 4);
        setProducts(topSellingProducts);
      } catch (error) {
        console.error('Error fetching top-selling products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate('/cart', { state: { product } }); 
  };

  return (
    <section className="top-selling">
      <h2>Top Selling</h2>
      <div className="products">
        {products.map(product => (
          <div key={product.id} className="product">
            <img 
              src={product.image_path } 
              alt={product.name} 
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price.toFixed(2)}</p>
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

export default TopSelling;
