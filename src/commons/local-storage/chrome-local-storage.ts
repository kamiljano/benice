import { LocalStorage, Settings } from './local-storage';

export class ChromeLocalStorage extends LocalStorage {
  async setSettingsVersion(settingsVersion: number) {
    await chrome.storage.local.set({ settingsVersion });
  }

  async getSettingsVersion(): Promise<number | null> {
    const result = (await chrome.storage.local.get('settingsVersion'))
      .settingsVersion;
    return result;
  }

  async loadSettings() {
    return (await chrome.storage.local.get('settings')).settings as Settings;
  }
  async setSettings(settings: Settings) {
    await chrome.storage.local.set({ settings });
  }
}
