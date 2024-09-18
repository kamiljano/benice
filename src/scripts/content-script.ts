import getLocalStorage from '../commons/local-storage/get-local-storage';
import { initContent } from './init-content';

(async () => {
  const settings = await getLocalStorage().getSettings();

  const allowPages = new Set<string>(
    (settings.allowedWebsites as string[])
      .reduce<string[][]>((acc, domain) => {
        acc.push([domain, `www.${domain}`]);
        return acc;
      }, [])
      .flat(),
  );

  if (allowPages.has(window.location.hostname)) {
    initContent({
      tooltipStylesUrl: chrome.runtime.getURL('assets/tippy.css'),
      goodTextIconUrl: chrome.runtime.getURL('images/good-text.svg'),
      defaultIconUrl: chrome.runtime.getURL('images/logo-128.png'),
      badTextIconUrl: chrome.runtime.getURL('images/bad-text.svg'),
      validationErrorIconUrl: chrome.runtime.getURL(
        'images/validation-error.svg',
      ),
      validatingIconUrl: chrome.runtime.getURL('images/validating-text.svg'),
      iconStylesUrl: chrome.runtime.getURL('assets/icon.css'),
    });
  } else {
    console.debug('[BeNice]: Ignoring page:', window.location.hostname);
  }
})();
