import { useContext } from "react";
import Header from "../../components/Header";
import { Link, useNavigate } from 'react-router';
import UserContext from "../../contexts/UserContext";
import { authedAxios } from "../../axiosInstance";
import type { AxiosResponse } from "axios";
import type { MessageResponse } from "../../types/responses";

function ChangeUsernamePage() {
  const navigate = useNavigate();

  const { user, reloadUser } = useContext(UserContext)!;

  async function deleteAccount(): Promise<void> {
    const response: AxiosResponse<MessageResponse> = await authedAxios.delete('/api/accounts');

    if (response.status === 200){
      await reloadUser();
      navigate('/');
    }
    else {
      console.log(response.data.message)
    }
  }

  return (
    <>
      <title>Flashcards settings</title>

      <Header />

      <div className="container settings-container central-container">
        <h1>Delete account</h1>
        <p>Do you want to delete '{user?.username}' permanently?</p>
        <div className="settings-change-buttons-container">
          <Link to='/settings'><button>Back</button></Link>
          <button onClick={deleteAccount} className='red-button'>Delete</button>
        </div>
      </div>
    </>
  )
}

export default ChangeUsernamePage;