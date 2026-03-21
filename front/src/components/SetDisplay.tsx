import { useNavigate } from "react-router"
import type { Set } from "../types/set"
import './SetDisplay.css'

function SetDisplay({ set }: { set: Set }) {
  const navigate = useNavigate();
  
  const date: Date = new Date(set.createdAt);

  function openSet() {
    navigate(`/${set.id}`)
  }

  return (
    <button className="set-display" onClick={openSet}>
      <p className="set-display-date">{date.toLocaleDateString()}</p>
      <div className="set-display-name-description-container">
        <h3 className="set-display-name">{set.name}</h3>
        <p>{set.description || 'No description'}</p>
      </div>
      <div className="set-display-creator-likes-container">
        <div>Creator: {set.creatorName}</div>
        <div className={`set-display-like ${set.isLiked ? 'liked' : ''}`}>{set.likes} likes</div>
      </div>
    </button>
  )
}

export default SetDisplay
