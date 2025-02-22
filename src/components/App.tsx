import { useState, useRef } from 'react';

export default function App() {
  const [userInput, setUserInput] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const chatRef = useRef<HTMLDivElement>(null);

  const sendPromptToOllama = (prompt: string) => {
    window.electronApi.sendPrompt(prompt);
    setMarkdown('');

    let markdownBuffer = '';
    window.electronApi.onStreamResponse((chunk: string) => {
      markdownBuffer += chunk;
      setMarkdown(markdownBuffer);
    });

    window.electronApi.onStreamError((error: string) => {
      console.error('Streaming error:', error);
    });
  };

  return (
    <>
      <header></header>
      <main>
        <h1 className="text-5xl">Welcome to OllamaChat</h1>
        <div ref={chatRef}>{markdown}</div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (userInput.trim()) {
              sendPromptToOllama(userInput);
              setUserInput('');
            }
          }}
        >
          <input
            placeholder="Type your message"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </main>
      <aside></aside>
    </>
  );
}
