import { useState } from "react";

function useFeedbackText(): [ string, (error: string) => void ] {
  const [feedbackText, setFeedbackText] = useState('');

  function showFeedback(error: string): void {
    setFeedbackText(error);
    setTimeout(() => {
      setFeedbackText('');
    }, 2500)
  }

  return [ feedbackText, showFeedback ]
}

export default useFeedbackText;