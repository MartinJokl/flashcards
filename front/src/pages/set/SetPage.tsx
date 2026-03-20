import { useEffect, useState } from "react";
import Header from "../../components/Header";
import type { FullSet } from "../../types/set"
import { useNavigate, useParams } from "react-router";
import { normalAxios } from "../../axiosInstance";
import type { AxiosResponse } from "axios";
import type { SetResponse } from "../../types/responses";
import './SetPage.css'
import useFeedbackText from "../../hooks/feedbackText";

function SetPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [shareFeedbackText, showShareFeedback] = useFeedbackText();

  const [set, setSet] = useState<FullSet | null>(null);

  useEffect(() => {
    const id = params.id;

    normalAxios.get(`/api/sets/${id}`)
      .then((response: AxiosResponse<SetResponse>) => {
        if (response.status === 200) {
          setSet(response.data);
        }
      })
  }, [params]);

  function copyToClipboard() {
    const url = document.URL;
    navigator.clipboard.writeText(url)
      .then(() => {
        showShareFeedback('Link copied to clipboard');
      })
      .catch(() => {
        showShareFeedback('Copying to clipboard failed');
      })
  }

  function showCreatorsSets() {
    navigate(`/?createdBy=${set?.createdBy}`);
  }

  return ( 
    <>
      <title>Flashcards {}</title>
      <Header />
      {!set 
        ? (
          <p className="set-page-not-exist">Set does not exist</p>
        ) : (
          <div className="container set-page-container">
            <h1 className="set-page-name">{set.name}</h1>
            <p className="set-page-description">{set.description}</p>

            <div className="set-page-play-container">
              <button className="primary-button">Practise</button>
              <button className="primary-button">Test</button>
            </div>

            <p className={`set-page-share-feedback feedback-text ${shareFeedbackText === '' ? '' : 'visible' }`}>{shareFeedbackText || 'Error'}</p>
            <div className="set-page-creator-container">
              <button onClick={showCreatorsSets} className="set-page-creator">Creator: {set.creatorName}</button>
              <button>Like | {set.likes}</button>
              <button onClick={copyToClipboard}>Share</button>
            </div>
          </div>
        )
      }
    </>
  )
}

export default SetPage;