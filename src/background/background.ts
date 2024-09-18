import getLocalStorage from '../commons/local-storage/get-local-storage';
import { LocalStorage } from '../commons/local-storage/local-storage';
import validateOllamaAccess from '../popup/validate-ollama-access';

type OllamaExecution = 'success' | 'failure';

const executeOllama = async (
  lastExecution: OllamaExecution | null,
  localStorage: LocalStorage,
): Promise<OllamaExecution> => {
  try {
    const settings = await localStorage.getSettings();
    await validateOllamaAccess(settings.ollamaHost);
    if (lastExecution !== 'success') {
      chrome.action.setIcon({ path: 'images/logo-128.png' });
    }

    return 'success';
  } catch (error) {
    console.warn('Failed to validate Ollama access', error);

    if (lastExecution !== 'failure') {
      chrome.action.setIcon({ path: 'images/validation-error.png' });
    }

    return 'failure';
  }
};

const trackOllamaAccess = (localStorage: LocalStorage) => {
  let lastExecution: OllamaExecution | null = null;

  executeOllama(lastExecution, localStorage).then((result) => {
    lastExecution = result;
    setInterval(async () => {
      lastExecution = await executeOllama(lastExecution, localStorage);
    }, 5_000);
  });
};

(async () => {
  console.log('Initializing the local storage');
  const localStorage = getLocalStorage();
  await localStorage.migrateSettings();

  trackOllamaAccess(localStorage);
})().catch((error) => {
  console.error('Unexpected error', error);
});
