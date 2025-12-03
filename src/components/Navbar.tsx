import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link 
          to="/" 
          className={`nav-logo ${location.pathname === '/' ? 'active' : ''}`}
        >
          Woen
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/news" className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`}>
              News
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/calendar" className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}>
              Calendar
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/media" className={`nav-link ${location.pathname === '/media' ? 'active' : ''}`}>
              Media
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
