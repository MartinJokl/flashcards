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
      <p className="set-display-date">
        <span className="material-icons md-24">date_range</span>{date.toLocaleDateString()}
      </p>
      <div className="set-display-name-description-container">
        <h3 className="set-display-name">{set.name}</h3>
        <p>{set.description || 'No description'}</p>
      </div>
      <div className="set-display-creator-likes-container">
        <div className="set-display-creator"><span className="material-icons md-24">account_circle</span>{set.creatorName}</div>
        <div className="set-display-like">
          {set.likes}
          {set.isLiked 
          ? (
            <span className="material-icons">favorite</span>
          ) : (
            <span className="material-icons">favorite_border</span>
          )}
        </div>
      </div>
    </button>
  )
}

export default SetDisplay
