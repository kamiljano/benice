import { BrowserLocalStorage } from './browser-local-storage';
import { ChromeLocalStorage } from './chrome-local-storage';

export default function getLocalStorage() {
  if (window.chrome?.storage) {
    console.debug('[BeNice]: Using Chrome local storage');
    return new ChromeLocalStorage();
  }
  console.debug('[BeNice]: Using Browser local storage');
  return new BrowserLocalStorage();
}
