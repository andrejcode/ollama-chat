import { OllamaStreamResponse } from '@shared/types';
import { ipcMain } from 'electron';
import { wrapAsync } from '@shared/utils';

export default function registerOllamaStreamHandler() {
  ipcMain.on(
    'ollama-stream',
    wrapAsync(async (event: Electron.IpcMainEvent, userPrompt: string) => {
      try {
        const chatResponse = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gemma2:latest',
            messages: [{ role: 'user', content: userPrompt }],
            stream: true,
          }),
        });

        if (!chatResponse.body) throw new Error('No response body received');

        // Create a reader for the response body stream
        const streamReader = chatResponse.body.getReader();
        // Instantiate a TextDecoder to convert the raw binary chunks (Uint8Array) into a string
        const textDecoder = new TextDecoder();

        for (;;) {
          const { done, value } = await streamReader.read();
          if (done) break;

          const decodedChunk = textDecoder.decode(value, { stream: true });
          const parsedData = JSON.parse(decodedChunk) as OllamaStreamResponse;

          if (!parsedData.done) {
            event.sender.send(
              'ollama-stream-response',
              parsedData.message.content,
            );
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        event.sender.send('ollama-stream-error', errorMessage);
      }
    }),
  );
}
