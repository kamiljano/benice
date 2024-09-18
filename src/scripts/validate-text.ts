import { Ollama } from 'ollama/browser';
import { z } from 'zod';
import getLocalStorage from '../commons/local-storage/get-local-storage';

const llmResponse = z.object({
  offensiveProbability: z.number().min(0).max(100),
  correctedText: z.string().nullable().optional(),
});

interface OffensiveText {
  offensive: true;
  correctedText: string;
}

interface NonOffensiveText {
  offensive: false;
  correctedText: null;
}

type LlmResponse = OffensiveText | NonOffensiveText;

class LlmError extends Error {}

class JsonParseError extends LlmError {
  constructor(readonly body: string) {
    super('Failed to parse JSON response:\n' + body);
    this.name = 'JsonParseError';
  }
}

class LlmResponseError extends LlmError {
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

class NoTextChangeError extends LlmError {
  constructor() {
    super('The text was not changed by the LLM');
    this.name = 'NoTextChangeError';
  }
}

const getResponse = async (text: string): Promise<LlmResponse> => {
  const settings = await getLocalStorage().getSettings();
  const host = settings.ollamaHost;

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
                  "offensiveProbability": number,
                  "correctedText": string
                }"
                Where the "offensiveProbability" represents the probability that the text is offensive or passive aggressive, where 0 means not offensive and 100 means very offensive.
                The "correctedText" is the rephrased user input that is no longer offensive or passive aggressive.`,
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

  let result: z.infer<typeof llmResponse>;

  try {
    result = llmResponse.parse(content);
  } catch (err) {
    throw new LlmResponseError(err as z.ZodError, content);
  }

  if (result.correctedText === text) {
    throw new NoTextChangeError();
  }

  if (result.offensiveProbability >= 50) {
    if (!result.correctedText) {
      throw new LlmError(
        'Detected an offensive response, but no corrected text was provided',
      );
    }
    return {
      offensive: true,
      correctedText: result.correctedText,
    };
  }

  return {
    offensive: false,
    correctedText: null,
  };
};

export default async function validateText(text: string): Promise<LlmResponse> {
  for (let i = 0; i < 5; i++) {
    try {
      return await getResponse(text);
    } catch (error) {
      if (error instanceof LlmError) {
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
