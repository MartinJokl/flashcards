import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { normalAxios } from "../../axiosInstance";
import type { AxiosResponse } from "axios";
import type { SetResponse } from "../../types/responses";
import type { FullSet } from "../../types/set";
import Header from "../../components/Header";
import './PractisePage.css';
import type { Flashcard } from "../../types/flashcards";

function PractisePage() {
  const flyAnimationTime = 200;

  const params = useParams();

  const [set, setSet] = useState<FullSet | null>(null);

  const [currentCard, setCurrentCard] = useState(0);
  const [questionSide, setQuestionSide] = useState(true);

  const [cards, setCards] = useState<Flashcard[]>([]);
  const [wrongCards, setWrongCards] = useState<Flashcard[]>([]);

  const flashcardEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = params.id;

    normalAxios.get(`/api/sets/${id}`)
      .then((response: AxiosResponse<SetResponse>) => {
        if (response.status === 200) {
          setSet(response.data);
          setCards(response.data.flashcards);
        }
      })
  }, [params]);

  function nextCard() {
    if (currentCard < cards.length) {
      setCurrentCard(currentCard + 1);
      setQuestionSide(true);
    }
  }
  function correct() {
    flashcardEl.current?.classList.add('fly-right')
    setTimeout(() => {
      flashcardEl.current?.classList.remove('fly-right');
      nextCard();
    }, flyAnimationTime);
  }
  function wrong() {
    flashcardEl.current?.classList.add('fly-left')
    setTimeout(() => {
      flashcardEl.current?.classList.remove('fly-left');
      nextCard();
      setWrongCards([
        ...wrongCards,
        cards[currentCard]
      ]);
    }, flyAnimationTime);

  }
  function flipCard() {
    setQuestionSide(!questionSide);
    flashcardEl.current?.classList.toggle('flipped')
  }
  function restart() {
    if (!set) {
      return;
    }
    setCards(set.flashcards);
    setCurrentCard(0);
    setWrongCards([]);
  }
  function practiseWrong() {
    setCards(wrongCards);
    setCurrentCard(0);
    setWrongCards([]);
  }
  function randomizeCards() {
    const newCards: Flashcard[] = [...cards];
    for (let i = currentCard; i < newCards.length; i++) {
      const swapper: number = Math.floor(Math.random() * (newCards.length - currentCard) + currentCard);
      [newCards[i], newCards[swapper]] = [newCards[swapper], newCards[i]];
    }
    setCards(newCards);
  }

  function keyDown(event: KeyboardEvent) {
    if (currentCard >= cards.length) {
      return;
    }
    if (event.key === 'ArrowRight') {
      correct();
    }
    else if (event.key === 'ArrowLeft') {
      wrong();
    }
  }

  useEffect(() => {
    document.body.addEventListener('keydown', keyDown);
    return () => {
      document.body.removeEventListener('keydown', keyDown);
    }
  });

  return (
    <>
      <title>Flashcards {}</title>
      <Header />
      {!set 
        ? (
          <p className="practise-page-not-exist">Set does not exist</p>
        ) : (
          <>
            <h1 className="practise-page-name">{set.name}</h1>
            {(currentCard === cards.length) 
              ? (
                <div className="container central-container">
                  <h3>Set finished</h3>
                  <div className="practise-score-container">
                    <div className="practise-progress-bar-bottom">
                      <div style={{width: `${(cards.length - wrongCards.length) / cards.length * 100}%`}} className="practise-progress-bar-top" />
                    </div>
                    <div>{cards.length - wrongCards.length} / {cards.length} correct</div>
                  </div>
                  <div className="practise-summary-button-container">
                    <button onClick={restart}>Restart set</button>
                    <button disabled={wrongCards.length === 0} onClick={practiseWrong}>Practise wrong cards</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="practise-page-progress">{currentCard + 1} / {cards.length}</p>
                  <div className="flashcard-stats-container">
                    <div className="practise-wrong">{wrongCards.length} wrong</div>
                    <div ref={flashcardEl} className="flashcard" onClick={flipCard}>
                      <div>{questionSide ? cards[currentCard].question : cards[currentCard].answer}</div>
                    </div>
                    <div className="practise-correct">{currentCard - wrongCards.length} correct</div>
                  </div>
                  <div className="practise-page-button-container">
                    <button onClick={wrong}>Wrong</button>
                    <button onClick={randomizeCards}>Randomize</button>
                    <button onClick={correct}>Correct</button>
                  </div>
                </>
              )}
          </>
        )
      }
    </>
  )
}

export default PractisePage;