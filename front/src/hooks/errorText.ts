import { useState } from "react";

function useErrorText(): { errorText: string, showError: (error: string) => void } {
  const [errorText, setErrorText] = useState('');

  function showError(error: string): void {
    setErrorText(error);
    setTimeout(() => {
      setErrorText('');
    }, 2500)
  }

  return { errorText, showError }
}

export default useErrorText;