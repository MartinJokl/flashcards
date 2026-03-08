import './SettingsPage.css'
import Header from "../../components/Header";
import { Link } from 'react-router';

function SettingsPage() {

  return (
    <>
      <title>Flashcards settings</title>

      <Header />

      <div className="container central-container">
        <h1>Settings</h1>
        <div className='settings-button-container'>
          <Link to='/settings/username'><button className='secondary-button settings-button'>Change username</button></Link>
          <Link to='/settings/password'><button className='secondary-button settings-button'>Change password</button></Link>
          <Link to='/settings/delete'><button className='red-button settings-button'>Delete account</button></Link>
        </div>
      </div>
    </>
  )
}

export default SettingsPage;