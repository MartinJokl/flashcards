import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import UserContext from '../contexts/UserContext';
import './Header.css';
import SearchIcon from '../assets/search.png'
import { deleteToken } from '../tokenManager';

function Header() {
  
  const navigate = useNavigate();
  
  const { reloadUser } = useContext(UserContext)!;
  
  const { user } = useContext(UserContext)!;
  
  async function logOut(): Promise<void> {
    deleteToken();
    await reloadUser();
    navigate('/');
  }

  return (
    <header>
      <div id='header-logo'><NavLink className='header-nav-link' to='/'>Flashcards</NavLink></div>
      <div id='header-search'>
        <input type="text" id='header-search-input' placeholder='Search' />
        <button id='header-search-button'>
          <img src={SearchIcon} alt="search icon" id='header-search-icon' />
        </button>
      </div>
      {user 
      ? (
        <>
          <div><NavLink className='header-nav-link' to='/settings'>{user.username}</NavLink></div>
          <button onClick={logOut} className='primary-button'>Log out</button>
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