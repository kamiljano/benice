import debounce from 'debounce';

const ignorePages = new Set<string>(
  ['google.com', 'translate.google.com']
    .reduce<string[][]>((acc, domain) => {
      acc.push([domain, `www.${domain}`]);
      return acc;
    }, [])
    .flat(),
);

const publishTextChange = (ev: Event) => {
  chrome.runtime.sendMessage({
    type: 'text-change',
    text: (ev.target as HTMLTextAreaElement).value,
  });
};

const addIcon = (textarea: HTMLTextAreaElement) => {
  const rect = textarea.getBoundingClientRect();

  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('images/logo-48.png');
  icon.style.position = 'fixed';
  icon.style.top = `${rect.top + 5}px`;
  icon.style.left = `${rect.left + rect.width + 5}px`;
  icon.style.width = '20px';
  icon.style.height = '20px';
  icon.style.cursor = 'pointer';

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
