import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav>
      <ul>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/contact">Contact Form</Link></li>
        {user && user.role === 'admin' && (
          <>
            <li><Link to="/admin">Admin Page</Link></li>
            <li><Link to="/users">Users Page</Link></li>
            <li><Link to="/reports">Reports Page</Link></li>
          </>
        )}
        {user && user.role === 'reader' && (
          <li><Link to="/reader">Reader Page</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
