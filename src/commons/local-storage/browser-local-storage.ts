import { LocalStorage, Settings } from './local-storage';

export class BrowserLocalStorage extends LocalStorage {
  setSettingsVersion(settingsVersion: number): void | Promise<void> {
    localStorage.setItem('settingsVersion', `${settingsVersion}`);
  }

  async getSettingsVersion(): Promise<number | null> {
    const result = localStorage.getItem('settingsVersion');
    if (!result) {
      return null;
    }
    return parseInt(result, 10);
  }

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
