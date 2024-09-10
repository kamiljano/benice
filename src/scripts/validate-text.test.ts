import { describe, test, expect } from 'vitest';
import validateText from './validate-text';

describe('validate-text', () => {
  test('the non-offensive text', async () => {
    const result = await validateText('Hello, how are you?');

    expect(result).toEqual({
      offensive: false,
      correctedText: null,
    });
  }, 900_000);

  test('the offensive text', async () => {
    const result = await validateText(
      'This is the worst code I have ever seen. Change double quote to single quote.',
    );

    expect(result.offensive).toBe(true);
    expect(result.correctedText).not.toBeNull();
  }, 900_000);
});
