import './Header.css';
import SearchIcon from '../assets/search.png'

function Header() {
  return (
    <header>
      <div id='header-logo'>FC</div>
      <div id='header-search'>
        <input type="text" id='header-search-input' placeholder='Search' />
        <button id='header-search-button'>
          <img src={SearchIcon} alt="search icon" id='header-search-icon' />
        </button>
      </div>
      <div>John</div>
      <div>My sets</div>
    </header>
  )
}

export default Header;