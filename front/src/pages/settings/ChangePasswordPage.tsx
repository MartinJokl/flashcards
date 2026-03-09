import { useContext, useState, type ChangeEvent } from "react";
import Header from "../../components/Header";
import { Link, useNavigate } from 'react-router';
import UserContext from "../../contexts/UserContext";
import { authedAxios } from "../../axiosInstance";
import useErrorText from "../../hooks/errorText";
import type { AxiosResponse } from "axios";
import type { MessageResponse } from "../../types/responses";

function ChangePasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const { errorText, showError } = useErrorText();

  const { reloadUser } = useContext(UserContext)!;

  function changePasswordText(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setPassword(event.target.value);
  }
  function changePasswordText2(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setPassword2(event.target.value);
  }

  async function change(): Promise<void> {
    if (password === '') {
      showError('Enter a new password')
      return;
    }
    if (password !== password2) {
      showError('Passwords do not match')
      return;
    }
    const response: AxiosResponse<MessageResponse> = await authedAxios.patch('/api/accounts', { password })

    if (response.status === 200){
      await reloadUser();
      navigate('/settings');
    }
    else {
      showError(response.data.message)
    }
  }

  return (
    <>
      <title>Flashcards settings</title>

      <Header />

      <div className="container settings-container central-container">
        <h1>Change password</h1>

        <div className='input-container'>
          <span>New password: </span>
          <input type="password" value={password} onChange={changePasswordText} />
        </div>
        <div className='input-container'>
          <span>New password again: </span>
          <input type="password" value={password2} onChange={changePasswordText2} />
        </div>

        <p className={`error-text ${errorText === '' ? '' : 'visible'}`}>{errorText || 'Error'}</p>

        <div className="settings-change-buttons-container">
          <Link to='/settings'><button className='secondary-button'>Back</button></Link>
          <button onClick={change} className='primary-button'>Change</button>
        </div>
      </div>
    </>
  )
}

export default ChangePasswordPage;