import { Fragment, useEffect, useState, type ChangeEvent } from "react";
import { useParams } from "react-router";
import type { FullSet } from "../../types/set";
import { normalAxios } from "../../axiosInstance";
import type { AxiosResponse } from "axios";
import type { SetResponse } from "../../types/responses";
import Header from "../../components/Header";
import './TestPage.css';
import type { Flashcard } from "../../types/flashcards";

function TestPage() {
  const params = useParams();

  const [set, setSet] = useState<FullSet | null>(null);
  const [randomCards, setRandomCards] = useState<Flashcard[]>([]);
  const [showAsnwers, setShowAnswers] = useState(false);

  const [userAnswers, setUserAnswers] = useState<string[]>([]);

  function makeRandomCards(cards: Flashcard[]): void {
    const randomCards = [...cards];
    for (let i = 0; i < randomCards.length; i++) {
      const swapper: number = Math.floor(Math.random() * randomCards.length);
      [randomCards[i], randomCards[swapper]] = [randomCards[swapper], randomCards[i]];
    }
    setRandomCards(randomCards);
  }

  useEffect(() => {
    const id = params.id;

    normalAxios.get(`/api/sets/${id}`)
      .then((response: AxiosResponse<SetResponse>) => {
        if (response.status === 200) {
          setSet(response.data);
          makeRandomCards(response.data.flashcards);
        }
      })
  }, [params]);

  function checkAnswers() {
    setShowAnswers(true)
    console.log(userAnswers);
  }
  function reset() {
    if (!set) {
      return;
    }
    setUserAnswers([]);
    setShowAnswers(false)
    makeRandomCards(set.flashcards);
  }
  function handleChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const previousAnswers: string[] = [...userAnswers];
    const questionIndex: number = Number(event.target.name);

    if (isNaN(questionIndex)) {
      console.log('A question is missing a number name');
      return;
    }

    previousAnswers[questionIndex] = event.target.value;
    setUserAnswers(previousAnswers);
  }

  return (
    <>
      <title>Flashcards test</title>
      <Header />
      {!set 
        ? (
          <p className="test-page-not-exist">Set does not exist</p>
        ) : (
          <>
            <h1 className="test-page-name">{set.name}</h1>
            <div className={`test-questions-container ${showAsnwers ? 'show-answers' : ''}`}>
              {randomCards.map((card: Flashcard, index: number) => (
                <Fragment key={card.question}>
                  <span className="test-question">{card.question}</span>
                  <input 
                    className="test-answer-box" 
                    type="text" 
                    disabled={showAsnwers}
                    value={userAnswers[index] ?? ''}
                    onChange={handleChange}
                    name={String(index)}
                  />
                  {showAsnwers && (
                    ((userAnswers[index] ?? '') === card.answer)
                    ? (
                      <p className={"test-correction-text correct"}>Correct</p>
                    ) : (
                      <p className={"test-correction-text wrong"}>{card.answer}</p>
                    )
                  )}
                </Fragment>
              ))}
            </div>
            {showAsnwers && <p>{(() => {
              const questionCount: number = randomCards.length;
              let correctCount: number = 0;
              randomCards.forEach((card: Flashcard, index: number) => {
                if (card.answer === userAnswers[index]) {
                  correctCount++;
                }
              });
              const percentage = Math.round(correctCount / questionCount * 100);
              return (
                <p className="test-score-text">{correctCount}/{questionCount} correct, {percentage}%</p>
              )
            })()}</p>}

            <div className="test-button-container">
              <button onClick={reset}>Reset</button>
              <button onClick={checkAnswers} disabled={showAsnwers}>Check answers</button>
            </div>
          </>
        )
      }
    </>
  )
}
export default TestPage;