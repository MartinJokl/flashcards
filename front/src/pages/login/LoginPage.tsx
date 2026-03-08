import { useContext, useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { normalAxios } from '../../axiosInstance';
import { saveToken } from '../../tokenManager';
import Header from '../../components/Header';
import UserContext from '../../contexts/UserContext';
import useErrorText from '../../hooks/errorText';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { errorText, showError } = useErrorText();

  const { reloadUser } = useContext(UserContext)!;

  async function login(): Promise<void> {
    const response = await normalAxios.post('/api/accounts/login', {
      username,
      password
    });
    if (response.status === 200){
      saveToken(response.data.token)
      await reloadUser();
      navigate('/');
    }
    else {
      showError(response.data.message)
    }
  }

  function changeUsernameText(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setUsername(event.target.value);
  }
  function changePasswordText(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setPassword(event.target.value);
  }

  return (
    <>
      <title>Flashcards login</title>

      <Header />

      <div className="container central-container">
        <h1>Log in</h1>
        <div className='input-container'>
          <span>Username: </span>
          <input type="text" value={username} onChange={changeUsernameText} />
        </div>
        <div className='input-container'>
          <span>Password: </span>
          <input type="password" value={password} onChange={changePasswordText} />
        </div>
        <p className={`error-text ${errorText === '' ? '' : 'visible'}`}>{errorText || 'Error'}</p>
        <button onClick={login} className='login-button primary'>Log in</button>
        <Link className="link" to="/register">Dont have an account? Register</Link>
      </div>
    </>
  )
}

export default LoginPage;