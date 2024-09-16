import { Ollama } from 'ollama/browser';
import { z } from 'zod';

const OffensiveResponse = z.object({
  offensive: z.literal(true),
  correctedText: z.string(),
});

const NonOffensiveResponse = z.object({
  offensive: z.literal(false),
  correctedText: z.literal(null),
});

const LlmResponse = OffensiveResponse.or(NonOffensiveResponse);

class JsonParseError extends Error {
  constructor(readonly body: string) {
    super('Failed to parse JSON response:\n' + body);
    this.name = 'JsonParseError';
  }
}

class LlmResponseError extends Error {
  constructor(
    readonly response: z.ZodError,
    readonly returnedMessage: object,
  ) {
    super(
      `Invalid response from the LLM: ${JSON.stringify(returnedMessage, null, 2)}`,
    );
    this.name = 'LlmResponseError';
  }
}

class NoTextChangeError extends Error {
  constructor() {
    super('The text was not changed by the LLM');
    this.name = 'NoTextChangeError';
  }
}

const getResponse = async (
  text: string,
): Promise<z.infer<typeof LlmResponse>> => {
  const settings = await chrome.storage.local.get('settings');
  const host = settings.settings?.ollamaHost || 'http://127.0.0.1:11434';

  console.debug(`[BeNice]: Contacting ollama at ${host}`);

  const ollama = new Ollama({ host });

  const response = await ollama.chat({
    model: 'llama3.1',
    format: 'json',
    messages: [
      {
        role: 'system',
        content: `User is providing a message that may be offensive or passive aggressive.
                Provide a response in the json format like "{
                  "offensive": true | false,
                  "correctedText": string | null
                }". Set the "offensive" to true if the text is offensive or passive aggresive.
                Set the "correctedText" to a new text that represents the same idea, but is not offensive or passive aggressive.
                It should not be the same text as the original.
                If the text was not offensive to begin with, set "correctedText" to null and "offensive" to false.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
  });

  let content: object;

  try {
    content = JSON.parse(response.message.content);
  } catch (error) {
    throw new JsonParseError(response.message.content);
  }

  let result: z.infer<typeof LlmResponse>;

  try {
    result = LlmResponse.parse(content);
  } catch (err) {
    throw new LlmResponseError(err as z.ZodError, content);
  }

  if (result.correctedText === text) {
    throw new NoTextChangeError();
  }

  return result;
};

export default async function validateText(
  text: string,
): Promise<z.infer<typeof LlmResponse>> {
  for (let i = 0; i < 3; i++) {
    try {
      return await getResponse(text);
    } catch (error) {
      if (
        error instanceof LlmResponseError ||
        error instanceof JsonParseError ||
        error instanceof NoTextChangeError
      ) {
        console.debug(
          `[BeNice]: Failed to parse LLM response: ${error.message}. Retrying...`,
        );
      } else {
        throw error;
      }
    }
  }
  throw new Error('Failed to get a valid response from the LLM');
}
