import { OllamaStreamResponse } from './types';

/**
 * Reads a stream and processes NDJSON by accumulating chunks into a buffer,
 * splitting on newline characters, and parsing complete JSON objects.
 * Calls the provided callback for each parsed JSON object.
 */
export async function processNDJSONStream(
  streamReader: ReadableStreamDefaultReader<Uint8Array>,
  onJSON: (data: OllamaStreamResponse) => void,
  onError: (errorMessage: string) => void,
  onDone: () => void,
) {
  const textDecoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await streamReader.read();
      if (done) {
        onDone();
        break;
      }

      buffer += textDecoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const jsonLine = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);

        if (jsonLine) {
          try {
            const parsedData = JSON.parse(jsonLine) as OllamaStreamResponse;
            onJSON(parsedData);
          } catch (error) {
            onError(
              'Unable to understand the response from Ollama. The model might be experiencing issues or sending an unexpected format.',
            );
          }
        }
      }
    }

    // Process any remaining buffered data.
    if (buffer.trim()) {
      try {
        const parsedData = JSON.parse(buffer) as OllamaStreamResponse;
        onJSON(parsedData);
      } catch {
        onError(
          "Unable to process the final part of Ollama's response. The message may be incomplete.",
        );
      }
    }
  } catch {
    onError(
      'Something went wrong while communicating with Ollama. Please check if Ollama is running correctly and try again.',
    );
  }
}
