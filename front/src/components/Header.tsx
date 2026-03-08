import { useContext } from 'react';
import { Link, NavLink } from 'react-router';
import UserContext from '../contexts/UserContext';
import './Header.css';
import SearchIcon from '../assets/search.png'

function Header() {
  const user = useContext(UserContext);

  return (
    <header>
      <div id='header-logo'><NavLink className='header-nav-link' to='/'>FC</NavLink></div>
      <div id='header-search'>
        <input type="text" id='header-search-input' placeholder='Search' />
        <button id='header-search-button'>
          <img src={SearchIcon} alt="search icon" id='header-search-icon' />
        </button>
      </div>
      {user 
      ? (
        <>
          <div><NavLink className='header-nav-link' to='/settings'>{user}</NavLink></div>
          <div><NavLink className='header-nav-link' to='/my-sets'>My sets</NavLink></div>
        </>
      ) : (
        <>
          <Link to='/login'><button className='primary-button' id='header-login-button'>Log in</button></Link>
          <Link to='/register'><button className='secondary-button' id='header-register-button'>Register</button></Link>
        </>
      )}
    </header>
  )
}

export default Header;