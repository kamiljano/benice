export interface Settings {
  ollamaHost: string;
  allowedWebsites: string[];
}

const CURRENT_SETTINGS_VERSION = 1;

const DEFAULT_SETTINGS: Settings = {
  ollamaHost: 'http://127.0.0.1:11434',
  allowedWebsites: ['github.com', 'stackoverflow.com'],
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

  async migrateSettings() {
    const version = await this.getSettingsVersion();
    if (!version || version < CURRENT_SETTINGS_VERSION) {
      console.log(
        `[BeNice]: Settings version found: ${version}, while the current version is ${CURRENT_SETTINGS_VERSION}. Migrating settings...`,
      );
      await this.setSettings(DEFAULT_SETTINGS); // TODO: might need more magic, in the future versions
      await this.setSettingsVersion(CURRENT_SETTINGS_VERSION);
    } else {
      console.log('[BeNice]: Settings are up to date');
    }
  }

  abstract setSettings(settings: Settings): void | Promise<void>;
  abstract loadSettings(): Promise<Settings | null>;
  abstract getSettingsVersion(): Promise<number | null>;
  abstract setSettingsVersion(version: number): void | Promise<void>;
}
