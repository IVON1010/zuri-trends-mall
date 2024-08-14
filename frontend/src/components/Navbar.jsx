import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const isLoggedIn = false;

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Zuri-Trends</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/contact-us">Contact Us</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
        
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
