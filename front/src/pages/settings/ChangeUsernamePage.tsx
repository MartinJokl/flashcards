import { useContext, useState, type ChangeEvent } from "react";
import Header from "../../components/Header";
import { Link, useNavigate } from 'react-router';
import UserContext from "../../contexts/UserContext";
import { authedAxios } from "../../axiosInstance";
import useErrorText from "../../hooks/errorText";

function ChangeUsernamePage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');

  const { errorText, showError } = useErrorText();

  const { reloadUser } = useContext(UserContext)!;

  function changeUsernameText(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setUsername(event.target.value);
  }

  async function change(): Promise<void> {
    if (username === '') {
      showError('Enter a new username')
      return;
    }
    const response = await authedAxios.patch('/api/accounts', { username })

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
        <h1>Change username</h1>

        <div className='input-container'>
          <span>New username: </span>
          <input type="text" value={username} onChange={changeUsernameText} />
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

export default ChangeUsernamePage;