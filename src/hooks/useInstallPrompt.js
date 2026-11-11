import { useEffect, useState } from "react";

// Chrome, Edge and Samsung Internet on Android fire `beforeinstallprompt`
// when the app can be installed. Safari and Firefox never do, so there
// `canInstall` stays false and no install button is shown.
export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState(null);

  useEffect(() => {
    function onBeforeInstallPrompt(event) {
      event.preventDefault(); // don't let the browser show its own banner
      setPromptEvent(event); // keep it, to show it when the user asks
    }
    function onInstalled() {
      setPromptEvent(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    promptEvent.prompt(); // the browser's own install dialog
    await promptEvent.userChoice; // "accepted" or "dismissed"
    setPromptEvent(null); // an event can be prompted only once
  }

  return { canInstall: promptEvent !== null, install };
}
