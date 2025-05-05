import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function Navbar() {
  const{authUser}=useAuthStore()
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">ChatApp</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar; 