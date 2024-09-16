export interface Settings {
  ollamaHost: string;
}

const DEFAULT_SETTINGS: Settings = {
  ollamaHost: 'http://127.0.0.1:11434',
};

export abstract class LocalStorage {
  async getSettings(): Promise<Settings> {
    try {
      const result = await this.loadSettings();
      if (!result?.ollamaHost) {
        return DEFAULT_SETTINGS;
      }
      return result;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  abstract setSettings(settings: Settings): void | Promise<void>;
  abstract loadSettings(): Promise<Settings | null>;
}
