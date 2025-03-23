import { Message } from '@shared/types';

export async function fetchChatStream(
  messages: Message[],
): Promise<ReadableStreamDefaultReader<Uint8Array>> {
  const chatResponse = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma2:latest',
      messages: messages.map(({ role, content }) => ({ role, content })),
      stream: true,
    }),
  });

  if (!chatResponse.body) {
    throw new Error('No response body received');
  }

  return chatResponse.body.getReader();
}
