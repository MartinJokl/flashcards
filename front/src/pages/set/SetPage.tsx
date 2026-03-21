import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import type { FullSet } from "../../types/set"
import { useNavigate, useParams } from "react-router";
import { authedAxios, normalAxios } from "../../axiosInstance";
import type { AxiosResponse } from "axios";
import type { MessageResponse, SetResponse } from "../../types/responses";
import './SetPage.css'
import useFeedbackText from "../../hooks/feedbackText";
import type { User } from "../../types/user";
import UserContext from "../../contexts/UserContext";

function SetPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [shareFeedbackText, showShareFeedback] = useFeedbackText();
  const user: User | null = useContext(UserContext)!.user;

  const [set, setSet] = useState<FullSet | null>(null);

  useEffect(() => {
    const id = params.id;

    normalAxios.get(`/api/sets/${id}${user ? `?potencialLiker=${user.id}` : ''}`)
      .then((response: AxiosResponse<SetResponse>) => {
        if (response.status === 200) {
          setSet(response.data);
        }
      })
  }, [params, user]);

  function copyToClipboard() {
    const url = document.URL;
    navigator.clipboard.writeText(url)
      .then(() => {
        showShareFeedback('✔ Link copied to clipboard');
      })
      .catch(() => {
        showShareFeedback('Copying to clipboard failed');
      })
  }

  function showCreatorsSets() {
    navigate(`/?createdBy=${set?.createdBy}`);
  }
  function practiseSet() {
    if (!set) {
      return;
    }
    navigate(`/practise/${set.id}`)
  }
  function testSet() {
    if (!set) {
      return;
    }
    navigate(`/test/${set.id}`)
  }

  async function likeButtonPressed() {
    if (!set) {
      return
    }
    if (!user) {
      navigate('/login')
    }
    if (!set.isLiked) {
      const response: AxiosResponse<MessageResponse> = await authedAxios.post(`/api/sets/like/${set.id}`);
      if (response.status === 200) {
        setSet({
          ...set,
          likes: set.likes + 1,
          isLiked: true
        })
      }
    }
    else {
      const response: AxiosResponse<MessageResponse> = await authedAxios.delete(`/api/sets/like/${set.id}`);
      if (response.status === 200) {
        setSet({
          ...set,
          likes: set.likes - 1,
          isLiked: false
        })
      }
    }
  }

  function goToEditPage() {
    if (!set) {
      return;
    }
    navigate(`/edit/${set.id}`)
  }
  function goToDeletePage() {
    if (!set) {
      return;
    }
    navigate(`/delete/${set.id}`)
  }

  return ( 
    <>
      <title>Flashcards</title>
      <Header />
      {!set 
        ? (
          <p className="set-page-not-exist">Set does not exist</p>
        ) : (
          <div className="container set-page-container">
            <h1 className="set-page-name">{set.name}</h1>
            <p className="set-page-description">{set.description || 'No description'}</p>

            <div className="set-page-info-container">
              <p>{set.flashcards.length} flashcards</p>
              <p>released {(new Date(set.createdAt)).toLocaleDateString()}</p>
            </div>

            <div className="set-page-play-container">
              <button onClick={practiseSet} className="primary-button">Practise</button>
              <button onClick={testSet} className="primary-button">Test</button>
            </div>

            <p className={`set-page-share-feedback feedback-text ${shareFeedbackText === '' ? '' : 'visible' }`}>{shareFeedbackText || 'Error'}</p>
            <div className="set-page-creator-container">
              <button onClick={showCreatorsSets} className="set-page-creator">Creator: {set.creatorName}</button>
              <button onClick={likeButtonPressed} className={`set-page-like-button ${set.isLiked ? 'liked' : ''}`}>Like | {set.likes}</button>
              <button onClick={copyToClipboard}>Share</button>
              {user && (user.id === set.createdBy) && (
              <>
                <button onClick={goToEditPage}>Edit</button>
                <button onClick={goToDeletePage}>Delete</button>
              </>
            )}
            </div>
          </div>
        )
      }
    </>
  )
}

export default SetPage;