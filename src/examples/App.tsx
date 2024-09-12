import './App.css';
import { initContent } from '../scripts/init-content';
import { useEffect, useState } from 'react';

function Text({
  setText,
  removeText,
  text,
}: {
  setText: (text: string) => void;
  removeText: () => void;
  text: string;
}) {
  return (
    <div>
      <textarea
        name="text"
        rows={10}
        cols={50}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
      ></textarea>
      <button onClick={removeText}>Remove</button>
    </div>
  );
}

function App() {
  useEffect(() => {
    setTimeout(() => {
      initContent({
        defaultIconUrl: '/images/logo-128.png',
        goodTextIconUrl: '/images/good-text.svg',
        badTextIconUrl: '/images/bad-text.svg',
        validationErrorIconUrl: '/images/validation-error.svg',
        validatingIconUrl: '/images/validating-text.svg',
        tooltipStylesUrl: '../../../node_modules/tippy.js/dist/tippy.css',
        iconStylesUrl: '/src/assets/icon.css',
      });
    }, 500);
  }, []);

  const [texts, setTexts] = useState<string[]>(['']);

  return (
    <div>
      <input type="text" name="name" value="John Doe" />
      <button
        onClick={() => {
          setTexts([...texts, '']);
        }}
      >
        Add
      </button>
      {texts.map((text, i) => {
        return (
          <Text
            key={i}
            text={text}
            setText={(ev) => {
              const newTexts = [...texts];
              newTexts[i] = ev;
              setTexts(newTexts);
            }}
            removeText={() => {
              const newTexts = [...texts];
              newTexts.splice(i, 1);
              setTexts(newTexts);
            }}
          />
        );
      })}
    </div>
  );
}

export default App;
