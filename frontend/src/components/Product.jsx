import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useCart } from '../context/CartContext'; 
import './Product.css';

const Product = ({ product, reviews }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="product">
      <img src={product.image_path} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>{`Price: KES ${product.price.toLocaleString()}`}</p>
      <p>{`Available Quantity: ${product.quantity}`}</p>

      <h3>Reviews:</h3>
      <ul>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review.user_id}>
              <p>{`Rating: ${review.rating}`}</p>
              <p>{review.comment}</p>
            </li>
          ))
        ) : (
          <li>No reviews yet.</li>
        )}
      </ul>

      <button onClick={handleAddToCart} className="add-to-cart-button">
        Add to Cart
      </button>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.shape({
    image_path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      user_id: PropTypes.number.isRequired,
      user_id: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Product;
