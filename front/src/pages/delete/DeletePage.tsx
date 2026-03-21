import Header from "../../components/Header";
import { Link, useNavigate, useParams } from 'react-router';
import { authedAxios, normalAxios } from "../../axiosInstance";
import type { AxiosResponse } from "axios";
import type { MessageResponse, SetResponse } from "../../types/responses";
import { useEffect, useState } from "react";

function ChangeUsernamePage() {
  const navigate = useNavigate();

  const params = useParams();

  const [setName, setSetName] = useState('set');

  useEffect(() => {
    normalAxios.get(`/api/sets/${params.id}`)
      .then((response: AxiosResponse<SetResponse>) => {
        if (response.status === 200) {
          setSetName(response.data.name);
        }
      })
  }, [params])

  async function deleteSet(): Promise<void> {
    const response: AxiosResponse<MessageResponse> = await authedAxios.delete(`/api/sets/${params.id}`);

    if (response.status === 200){
      navigate('/');
    }
    else {
      console.log(response.data.message)
    }
  }

  return (
    <>
      <title>Flashcards delete set</title>

      <Header />

      <div className="container settings-container central-container">
        <h1>Delete set</h1>
        <p>Do you want to delete '{setName}' permanently?</p>
        <div className="settings-change-buttons-container">
          <Link to={`/${params.id}`}><button>Back</button></Link>
          <button onClick={deleteSet} className='red-button'>Delete</button>
        </div>
      </div>
    </>
  )
}

export default ChangeUsernamePage;