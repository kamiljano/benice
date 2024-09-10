import debounce from 'debounce';
import validateText from './validate-text';

const ignorePages = new Set<string>(
  ['google.com', 'translate.google.com']
    .reduce<string[][]>((acc, domain) => {
      acc.push([domain, `www.${domain}`]);
      return acc;
    }, [])
    .flat(),
);

const LOGO = chrome.runtime.getURL('images/logo-48.png');
const BAD_TEXT = chrome.runtime.getURL('images/bad-text.svg');

const publishTextChange = async (ev: Event) => {
  const target = ev.target as HTMLTextAreaElement;
  const result = await validateText(target.value);
  const iconElement = document.getElementById(
    target.getAttribute('data-be-nice-icon-id')!,
  ) as HTMLImageElement;
  iconElement.src = result.offensive ? BAD_TEXT : LOGO;
  console.log('Validation result:', result);
};

let iconIdIterator = 0;
const addIcon = (textarea: HTMLTextAreaElement) => {
  const rect = textarea.getBoundingClientRect();

  const iconId = `beNiceIcon_${iconIdIterator++}`;
  const icon = document.createElement('img');
  icon.src = LOGO;
  icon.id = iconId;
  icon.style.position = 'fixed';
  icon.style.top = `${rect.top + 5}px`;
  icon.style.left = `${rect.left + rect.width + 5}px`;
  icon.style.width = '20px';
  icon.style.height = '20px';
  icon.style.cursor = 'pointer';

  textarea.setAttribute('data-be-nice-icon-id', iconId);

  textarea.parentNode?.insertBefore(icon, textarea);
};

if (!ignorePages.has(window.location.hostname)) {
  console.debug('[BeNice]: extension active', window.location.hostname);
  const textareas = document.querySelectorAll('textarea');

  textareas.forEach((textarea) => {
    textarea.onkeyup = debounce(publishTextChange, 500);
    addIcon(textarea);
  });
} else {
  console.debug('[BeNice]: Ignoring page:', window.location.hostname);
}
