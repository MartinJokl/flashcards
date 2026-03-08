import { useContext } from 'react';
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
          <button>Log in</button>
          <button>Register</button>
        </>
      )}
    </header>
  )
}

export default Header;