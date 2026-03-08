import { useContext } from 'react';
import { Link } from 'react-router';
import UserContext from '../contexts/UserContext';
import './Header.css';
import SearchIcon from '../assets/search.png'

function Header() {
  const user = useContext(UserContext);

  return (
    <header>
      <div id='header-logo'>FC</div>
      <div id='header-search'>
        <input type="text" id='header-search-input' placeholder='Search' />
        <button id='header-search-button'>
          <img src={SearchIcon} alt="search icon" id='header-search-icon' />
        </button>
      </div>
      {user 
      ? (
        <>
          <div>{user}</div>
          <div>My sets</div>
        </>
      ) : (
        <>
          <Link to='/login'><button className='primary-button' id='header-login-button'>Log in</button></Link>
          <Link to='/login'><button className='secondary-button' id='header-register-button'>Register</button></Link>
        </>
      )}
    </header>
  )
}

export default Header;