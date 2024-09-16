import { LocalStorage, Settings } from './local-storage';

export class ChromeLocalStorage extends LocalStorage {
  async loadSettings() {
    return (await chrome.storage.local.get('settings')) as Settings;
  }
  async setSettings(settings: Settings) {
    await chrome.storage.local.set({ settings });
  }
}
