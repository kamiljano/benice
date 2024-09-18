import { describe, test, expect, beforeAll, vi, MockInstance } from 'vitest';
import validateText from './validate-text';
import * as localStorage from '../commons/local-storage/get-local-storage';

describe('validate-text', () => {
  beforeAll(() => {
    const getLocalStorage: MockInstance = vi.spyOn(localStorage, 'default');
    getLocalStorage.mockReturnValue({
      getSettings: () => ({
        ollamaHost: 'http://127.0.0.1:11434',
      }),
    });
  });

  test('the non-offensive text', async () => {
    for (let i = 0; i < 10; i++) {
      const result = await validateText('This is nice');

      expect(result).toEqual({
        offensive: false,
        correctedText: null,
      });
    }
  }, 900_000);

  test('the offensive text', async () => {
    const aggressiveText =
      'This is the worst code I have ever seen. Change double quote to single quote.';
    for (let i = 0; i < 5; i++) {
      const result = await validateText(aggressiveText);

      expect(result.offensive).toBe(true);
      expect(result.correctedText).not.toBeNull();
      expect(result.correctedText).not.toContain('worst');
    }
  }, 900_000);
});
