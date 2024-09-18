import { FormEvent, useEffect, useState } from 'react';
import './App.css';
import getLocalStorage from '../commons/local-storage/get-local-storage';
import { Settings } from '../commons/local-storage/local-storage';
import { ChromeLocalStorage } from '../commons/local-storage/chrome-local-storage';
import validateOllamaAccess from './validate-ollama-access';

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

const getCurrentSebsite = (): Promise<string> => {
  if (chrome?.tabs) {
    return new Promise((resolve, reject) => {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs || !tabs[0] || !tabs[0].url) {
            return reject(
              new Error('Failed to acquire the current website URL'),
            );
          }
          const url = new URL(tabs[0].url);
          resolve(url.hostname);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  return Promise.resolve(window.location.hostname);
};

function App() {
  const localStorage = getLocalStorage();

  const [ollamaHost, setOllamaHost] = useState('');
  const [allowedWebsites, setAllowedWebsites] = useState<string[]>([]);
  const [currentWebsite, setCurrentWebsite] = useState<string | null>(null);
  const [ollamaError, setOllamaError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      localStorage.getSettings().then((settings) => {
        console.log('Loaded settings:', settings);
        setOllamaHost(settings.ollamaHost);
        setAllowedWebsites(settings.allowedWebsites);
        return checkOllama(settings.ollamaHost);
      }),
      getCurrentSebsite().then((website) => {
        setCurrentWebsite(website);
      }),
    ]).catch((error) => {
      console.error('Failed to load settings:', error);
    });
  }, []);

  const checkOllama = async (host: string) => {
    try {
      await validateOllamaAccess(host);
      setOllamaError(null);
      return true;
    } catch (err) {
      console.error('[BeNice]: Failed to validate ollama access:', err);
      setOllamaError((err as Error).message);
      return false;
    }
  };

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();

    if (!(await checkOllama(ollamaHost))) {
      return false;
    }

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
            onChange={(e) => {
              setOllamaHost(e.target.value);
              checkOllama(e.target.value);
            }}
            value={ollamaHost}
            name="ollamaHost"
            style={{ marginLeft: '0.5em' }}
          />
          {ollamaError && <div style={{ color: 'red' }}>{ollamaError}</div>}
        </label>

        <h2>Allowed websites</h2>

        {currentWebsite && !allowedWebsites.includes(currentWebsite) && (
          <div style={{ marginBottom: '1em' }}>
            Current website: <strong>{currentWebsite}</strong>
            <button
              onClick={() => {
                setAllowedWebsites((websites) => [...websites, currentWebsite]);
              }}
              className="form-item benice-button"
              style={{ height: 25, width: 15, marginLeft: '4px' }}
            >
              Add
            </button>
          </div>
        )}

        <table>
          <tbody>
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
          </tbody>
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
