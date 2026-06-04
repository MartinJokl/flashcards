import { useEffect } from "react";


// This should disable hover effects on touch screens
function useHoverClass() {
  useEffect(() => {
    // lastTouchTime is used for ignoring emulated mousemove events
    let lastTouchTime: number = 0

    function enableHover() {
      if (Date.now() - lastTouchTime < 500) return
      document.body.classList.add('hasHover')
    }

    function disableHover() {
      document.body.classList.remove('hasHover')
    }

    function updateLastTouchTime() {
      lastTouchTime = Date.now();
    }

    document.addEventListener('touchstart', updateLastTouchTime, true);
    document.addEventListener('touchstart', disableHover, true);
    document.addEventListener('mousemove', enableHover, true);

    enableHover();

    return () => {
      document.removeEventListener('touchstart', updateLastTouchTime, true);
      document.removeEventListener('touchstart', disableHover, true);
      document.removeEventListener('mousemove', enableHover, true);
    }
  }, []);
}

export default useHoverClass;