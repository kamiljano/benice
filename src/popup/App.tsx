import { FormEvent, useEffect, useState } from 'react';
import './App.css';
import getLocalStorage from './local-storage/get-local-storage';
import { Settings } from './local-storage/local-storage';
import { ChromeLocalStorage } from './local-storage/chrome-local-storage';

function App() {
  const localStorage = getLocalStorage();

  const [ollamaHost, setOllamaHost] = useState('');

  useEffect(() => {
    localStorage
      .getSettings()
      .then((settings) => {
        console.log('Loaded settings:', settings);
        setOllamaHost(settings.ollamaHost);
      })
      .catch((error) => {
        console.error('Failed to load settings:', error);
      });
  }, []);

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();

    const settings: Settings = {
      ollamaHost,
    };

    console.log('Saving settings:', settings);

    await localStorage.setSettings(settings);

    if (localStorage instanceof ChromeLocalStorage) {
      window.close();
    }
  };

  return (
    <>
      <h1>BeNice</h1>
      <form className="form-container" onSubmit={saveSettings}>
        <label className="form-item">
          Ollama host:
          <input
            type="text"
            onChange={(e) => setOllamaHost(e.target.value)}
            value={ollamaHost}
            name="ollamaHost"
            style={{ marginLeft: '0.5em' }}
          />
        </label>
        <input className="form-item benice-button" type="submit" value="Save" />
      </form>
    </>
  );
}

export default App;
