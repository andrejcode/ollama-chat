export interface ElectronApi {
  sendPrompt: (messages: Message[]) => void;
  onStreamResponse: (callback: (data: string) => void) => () => void;
  onStreamError: (callback: (error: string) => void) => void;
  onStreamComplete: (callback: () => void) => void;
}

export interface Message {
  id: string;
  role: string;
  content: string;
}
