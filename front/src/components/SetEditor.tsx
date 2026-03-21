import type { ChangeEvent } from "react";
import type { CreationSet } from "../types/set";
import './SetEditor.css'
import type { KeyFlashcard } from "../types/flashcards";

function SetEditor({ set, setSet }: { set: CreationSet, setSet: (set: CreationSet) => void }) {
  function handleInputChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    setSet({
      ...set,
      [event.target.name]: event.target.value
    })
  }

  function handleCardInputChange(event: ChangeEvent<HTMLInputElement, HTMLInputElement>): void {
    const newCards = [...set.flashcards]
    
    const isQuestion: boolean = event.target.name.startsWith('q');
    const index: number = Number(event.target.name.substring(1));

    if (isNaN(index)) {
      console.log('A question is missing a number name');
      return;
    }
    if (isQuestion) {
      newCards[index].question = event.target.value
    }
    else {
      newCards[index].answer = event.target.value 
    }

    setSet({
      ...set,
      flashcards: newCards
    })
  }
  function addCard(): void {
    setSet({
      ...set,
      flashcards: [
        ...set.flashcards,
        {
          question: '',
          answer: '',
          key: crypto.randomUUID()
        }
      ]
    })
  }

  function deleteCard(index: number) {
    const newCards = [...set.flashcards]
    newCards.splice(index, 1);
    setSet({
      ...set,
      flashcards: newCards
    })
  }

  return (
    <>
      <div className="set-editor-input-container container">
        <div className='input-container'>
          <span>Name: </span>
          <input name="name" type="text" value={set.name} onChange={handleInputChange} />
        </div>
        <div className='input-container'>
          <span>Description: </span>
          <input name="description" type="text" value={set.description} onChange={handleInputChange} />
        </div>
      </div>
      <h2 className="set-editor-cards-count">{set.flashcards.length} flashcards</h2>
      <div className="set-editor-flashcards-container">
        {set.flashcards.map((card: KeyFlashcard, index: number) => (
          <div className="set-editor-card-container" key={card.key}>
            <button onClick={() => deleteCard(index)} className="set-editor-delete-card">×</button>
            <div className='input-container'>
              <span>Question: </span>
              <input name={`q${index}`} type="text" value={set.flashcards[index].question} onChange={handleCardInputChange} />
            </div>
            <div className='input-container'>
              <span>Answer: </span>
              <input name={`a${index}`} type="text" value={set.flashcards[index].answer} onChange={handleCardInputChange} />
            </div>
          </div>
        ))}
        <button onClick={addCard} className="set-editor-card-adder">+</button>
      </div>
    </>
  )
}
export default SetEditor;