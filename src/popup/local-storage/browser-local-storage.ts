import { LocalStorage, Settings } from './local-storage';

export class BrowserLocalStorage extends LocalStorage {
  async loadSettings() {
    const result = localStorage.getItem('settings');
    if (!result) {
      return null;
    }
    return JSON.parse(result);
  }

  setSettings(settings: Settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }
}
