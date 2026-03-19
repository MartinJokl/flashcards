import type { Set } from "../types/set"
import './SetDisplay.css'

function SetDisplay({ set }: { set: Set }) {
  return (
    <button className="set-display">
      <div className="set-display-name-description-container">
        <h3 className="set-display-name">{set.name}</h3>
        <p>{set.description || 'No description'}</p>
      </div>
      <div className="set-display-creator-likes-container">
        <div>{set.creatorName}</div>
        <div>{set.likes} likes</div>
      </div>
    </button>
  )
}

export default SetDisplay
