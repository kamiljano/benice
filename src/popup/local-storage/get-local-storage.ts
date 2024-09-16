import { BrowserLocalStorage } from './browser-local-storage';
import { ChromeLocalStorage } from './chrome-local-storage';

export default function getLocalStorage() {
  return window.chrome?.storage
    ? new ChromeLocalStorage()
    : new BrowserLocalStorage();
}
