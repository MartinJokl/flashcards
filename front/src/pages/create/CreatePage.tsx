import { useState } from "react";
import Header from "../../components/Header";
import SetEditor from "../../components/SetEditor";
import './CreatePage.css'
import type { CreationSet } from "../../types/set";
import { authedAxios } from "../../axiosInstance";
import type { AxiosResponse } from "axios";
import type { IdResponse, MessageResponse } from "../../types/responses";
import { useNavigate } from "react-router";
import useFeedbackText from "../../hooks/feedbackText";

function CreatePage() {
  const navigate = useNavigate();

  const [errorText, changeErrorText] = useFeedbackText();

  const [set , setSet] = useState<CreationSet>({
    name: '',
    description: '',
    private: false,
    flashcards: []
  });

  async function create() {
    const response: AxiosResponse<IdResponse & MessageResponse> = await authedAxios.post('/api/sets', set);
    if (response.status === 201) {
      navigate(`/${response.data.id}`);
    }
    else {
      changeErrorText(response.data.message)
    }
  }

  return (
    <>
      <title>Flashcards create</title>
      <Header />
      
      <h1 className="create-page-title">Create a set</h1>
      <SetEditor set={set} setSet={setSet}/>
      <p className={`feedback-text error-text ${errorText === '' ? '' : 'visible'}`}>{errorText || 'Error'}</p>
      <button onClick={create} className="create-page-button">Create set</button>
    </>
  )
}

export default CreatePage;