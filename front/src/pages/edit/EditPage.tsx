import { useEffect, useState } from "react";
import Header from "../../components/Header";
import SetEditor from "../../components/SetEditor";
import type { CreationSet } from "../../types/set";
import { authedAxios, normalAxios } from "../../axiosInstance";
import type { AxiosResponse } from "axios";
import type { MessageResponse, SetResponse } from "../../types/responses";
import { useNavigate, useParams } from "react-router";
import useFeedbackText from "../../hooks/feedbackText";
import './EditPage.css'
import type { Flashcard } from "../../types/flashcards";

function EditPage() {
  const navigate = useNavigate();

  const params = useParams();

  const [errorText, changeErrorText] = useFeedbackText();

  const [set , setSet] = useState<CreationSet>({
    name: '',
    description: '',
    flashcards: []
  });

  useEffect(() => {
      const id = params.id;
  
      normalAxios.get(`/api/sets/${id}`)
        .then((response: AxiosResponse<SetResponse>) => {
          if (response.status === 200) {
            setSet({
              name: response.data.name,
              description: response.data.description ?? '',
              flashcards: response.data.flashcards.map((card: Flashcard) => ({
                question: card.question,
                answer: card.answer,
                key: crypto.randomUUID()
              }))
            });
          }
        })
    }, [params]);

  async function save() {
    const response: AxiosResponse<MessageResponse> = await authedAxios.patch(`/api/sets/${params.id}`, set);
    if (response.status === 200) {
      navigate(`/${params.id}`);
    }
    else {
      changeErrorText(response.data.message)
    }
  }
  function cancel() {
    navigate(`/${params.id}`)
  }

  return (
    <>
      <title>Flashcards edit</title>
      <Header />
      
      <h1 className="create-page-title">Edit '{set.name}'</h1>
      <SetEditor set={set} setSet={setSet}/>
      <p className={`feedback-text error-text ${errorText === '' ? '' : 'visible'}`}>{errorText || 'Error'}</p>
      <div className="edit-page-buttons-container">
        <button onClick={cancel}>Cancel</button>
        <button className="primary-button" onClick={save}>Save set</button>
      </div>
    </>
  )
}

export default EditPage;