import { useState, useEffect } from "react";

const WELCOME_MODAL_KEY = "aithor_welcome_modal_shown";

// Hook to check if welcome modal should be shown
export function useWelcomeModal() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const hasShown = localStorage.getItem(WELCOME_MODAL_KEY);
    if (!hasShown) {
      setShouldShow(true);
    }
  }, []);

  const hide = () => setShouldShow(false);

  return { shouldShow, hide };
}

export { WELCOME_MODAL_KEY };
