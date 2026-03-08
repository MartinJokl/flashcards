import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import { normalAxios } from "../../axiosInstance";
import { saveToken } from "../../tokenManager";
import Header from "../../components/Header";


function RegisterPage({ reloadUser }: { reloadUser: () => void}) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [errorText, setErrorText] = useState('');

  function showError(error: string): void {
    setErrorText(error);
    setTimeout(() => {
      setErrorText('');
    }, 2500)
  }

  async function register(): Promise<void> {
    if (password !== password2) {
      showError('Passwords do not match')
      return;
    }
    const response = await normalAxios.post('/api/accounts', {
      username,
      password
    });
    if (response.status === 201){
      saveToken(response.data.token);
      reloadUser();
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
  function changePassword2Text(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setPassword2(event.target.value);
  }

  return (
    <>
      <title>Jobs app register</title>

      <Header />

      <div className="login-container container">
        <h1>Register</h1>
        <div className='input-container'>
          <span>Username: </span>
          <input type="text" value={username} onChange={changeUsernameText} />
        </div>
        <div className='input-container'>
          <span>Password: </span>
          <input type="password" value={password} onChange={changePasswordText} />
        </div>
        <div className='input-container'>
          <span>Password again: </span>
          <input type="password" value={password2} onChange={changePassword2Text} />
        </div>
        <p className={`login-error-text ${errorText === '' ? '' : 'visible'}`}>{errorText || 'Error'}</p>
        <button onClick={register} className='login-button primary'>Register</button>
        <Link className="link" to="/login">Have an account already? Log in</Link>
      </div>
    </>
  )
}

export default RegisterPage;