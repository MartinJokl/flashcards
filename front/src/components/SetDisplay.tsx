import type { Set } from "../types/set"
import './SetDisplay.css'

function SetDisplay({ set }: { set: Set }) {
  return (
    <button className="set-display">
      <h3 className="set-display-name">{set.name}</h3>
      <p>{set.description || 'No description'}</p>
      <div>{set.creatorName}</div>
      <div>{set.likes} likes</div>
    </button>
  )
}

export default SetDisplay