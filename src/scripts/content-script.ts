import { initContent } from './init-content';

const ignorePages = new Set<string>(
  ['google.com', 'translate.google.com']
    .reduce<string[][]>((acc, domain) => {
      acc.push([domain, `www.${domain}`]);
      return acc;
    }, [])
    .flat(),
);

if (!ignorePages.has(window.location.hostname)) {
  initContent({
    goodTextIconUrl: chrome.runtime.getURL('images/good-text.svg'),
    defaultIconUrl: chrome.runtime.getURL('images/logo-128.png'),
    badTextIconUrl: chrome.runtime.getURL('images/bad-text.svg'),
    validationErrorIconUrl: chrome.runtime.getURL(
      'images/validation-error.svg',
    ),
    validatingIconUrl: chrome.runtime.getURL('images/validating-text.svg'),
  });
} else {
  console.debug('[BeNice]: Ignoring page:', window.location.hostname);
}
