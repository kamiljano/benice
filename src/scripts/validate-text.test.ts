import { describe, test, expect } from 'vitest';
import validateText from './validate-text';

describe('validate-text', () => {
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
    for (let i = 0; i < 10; i++) {
      const result = await validateText(aggressiveText);

      expect(result.offensive).toBe(true);
      expect(result.correctedText).not.toBeNull();
      expect(result.correctedText).not.toContain('worst');
    }
  }, 900_000);
});
