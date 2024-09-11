import { Ollama } from 'ollama/browser';
import { z } from 'zod';

const ollama = new Ollama({
  host: 'http://127.0.0.1:11434',
});

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

const getResponse = async (text: string) => {
  const response = await ollama.chat({
    model: 'mixtral',
    format: 'json',
    messages: [
      {
        role: 'user',
        content: `Is the following message offensive or passive aggressive?\n\n"${text}"\n
                Provide the response in the json format like "{
                  "offensive": true | false,
                  "correctedText": string | null
                }" where the "correctedText" represents the modified version of the original text that is no longer offensive or passive aggressive
                If the text was not offensive to begin with, set "correctedText" to null.
                Do not include any text other than the JSON response.`,
      },
    ],
  });

  let content: object;

  try {
    content = JSON.parse(response.message.content);
  } catch (error) {
    throw new JsonParseError(response.message.content);
  }

  try {
    const result = LlmResponse.parse(content);
    return result;
  } catch (err) {
    throw new LlmResponseError(err as z.ZodError, content);
  }
};

export default async function validateText(
  text: string,
): Promise<z.infer<typeof LlmResponse>> {
  for (let i = 0; i < 3; i++) {
    try {
      return getResponse(text);
    } catch (error) {
      if (
        error instanceof LlmResponseError ||
        error instanceof JsonParseError
      ) {
        console.warn(error.message);
      } else {
        throw error;
      }
    }
  }
  throw new Error('Failed to get a valid response from the LLM');
}
