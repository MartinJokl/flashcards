import { useContext, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router';
import UserContext from '../contexts/UserContext';
import './Header.css';
import { deleteToken } from '../tokenManager';
import type { User } from '../types/user';

function Header() {
  const [searchParams] = useSearchParams();
  const initialSearchText = searchParams.get('name') ?? '';
  const navigate = useNavigate();
  
  const reloadUser: () => Promise<void> = useContext(UserContext)!.reloadUser;
  const user: User | null = useContext(UserContext)!.user;

  const [searchInput, setSearchInput] = useState(initialSearchText);

  async function logOut(): Promise<void> {
    deleteToken();
    await reloadUser();
    navigate('/');
  }

  function search(): void {
    navigate(`/?name=${searchInput}`);
  }

  function updateSearchInput(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setSearchInput(event.target.value);
  }

  function searchBarKeyPressed(event: KeyboardEvent<HTMLInputElement>){
    if (event.key === 'Enter'){
      search();
    }
  }

  return (
    <header>
      <div id='header-logo'><NavLink className='header-nav-link' to='/'>Home</NavLink></div>
      <div id='header-home'><NavLink className='header-nav-link' to={user ? `/create` : '/login/'}>Create</NavLink></div>
      <div id='header-search'>
        <input 
          type="text" 
          id='header-search-input' 
          placeholder='Search' 
          value={searchInput} 
          onChange={updateSearchInput}
          onKeyDown={searchBarKeyPressed} />
          <button id='header-search-button' onClick={search}>
            <span className="material-icons md-24">search</span>
          </button>
      </div>
      {user 
      ? (
        <>
          <div>
            <NavLink className='header-nav-link header-account-container' to='/settings'>
              <span className="material-icons md-24">account_circle</span>{user.username}
            </NavLink>
          </div>
          <button onClick={logOut}>Log out</button>
        </>
      ) : (
        <>
          <Link to='/login'><button className='primary-button' id='header-login-button'>Log in</button></Link>
          <Link to='/register'><button id='header-register-button'>Register</button></Link>
        </>
      )}
    </header>
  )
}

export default Header;