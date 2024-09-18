import { FormEvent, useEffect, useState } from 'react';
import './App.css';
import getLocalStorage from '../commons/local-storage/get-local-storage';
import { Settings } from '../commons/local-storage/local-storage';
import { ChromeLocalStorage } from '../commons/local-storage/chrome-local-storage';

const getTrashIconUrl = () => {
  // @ts-ignore
  if (window.chrome?.runtime?.getURL) {
    return chrome.runtime.getURL('/images/trash.svg');
  }
  return '/images/trash.svg';
};

function IgnoredWebsite({
  website,
  onDelete,
}: {
  website: string;
  onDelete: () => void;
}) {
  return (
    <tr>
      <td>{website}</td>
      <td>
        <button
          className="form-item benice-button"
          style={{
            height: 25,
            width: 15,
          }}
          onClick={onDelete}
        >
          <img src={getTrashIconUrl()} alt="Remove" width={20} height={20} />
        </button>
      </td>
    </tr>
  );
}

function App() {
  const localStorage = getLocalStorage();

  const [ollamaHost, setOllamaHost] = useState('');
  const [allowedWebsites, setAllowedWebsites] = useState<string[]>([]);

  useEffect(() => {
    localStorage
      .getSettings()
      .then((settings) => {
        console.log('Loaded settings:', settings);
        setOllamaHost(settings.ollamaHost);
        setAllowedWebsites(settings.allowedWebsites);
      })
      .catch((error) => {
        console.error('Failed to load settings:', error);
      });
  }, []);

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();

    const settings: Settings = {
      ollamaHost,
      allowedWebsites,
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

        <h2>Allowed websites</h2>
        <table>
          {allowedWebsites.map((website) => (
            <IgnoredWebsite
              website={website}
              key={website}
              onDelete={() => {
                setAllowedWebsites((websites) =>
                  websites.filter((w) => w !== website),
                );
              }}
            />
          ))}
        </table>
        <input
          style={{ marginTop: '1em' }}
          className="form-item benice-button"
          type="submit"
          value="Save"
        />
      </form>
    </>
  );
}

export default App;
