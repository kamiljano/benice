import { Ollama } from 'ollama/browser';

export default async function validateOllamaAccess(
  host: string,
): Promise<void> {
  const ollama = new Ollama({ host });

  const result = await ollama.list();

  if (!result?.models) {
    throw new Error('Failed to access ollama');
  }

  console.debug('[BeNice]: Available models:', result.models);

  if (!result.models.some((model) => model.name === 'llama3.1:latest')) {
    throw new Error(
      'The model "llama3.1" is not available. Run `ollama run llama3.1` to install it.',
    );
  }
}
