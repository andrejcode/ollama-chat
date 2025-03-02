export interface ElectronApi {
  sendPrompt: (messages: Message[]) => void;
  onStreamResponse: (callback: (data: string) => void) => () => void;
  onStreamError: (callback: (error: string) => void) => void;
  onStreamComplete: (callback: () => void) => void;
}

interface OllamaStreamMessage {
  role: string;
  content: string;
}

interface BaseOllamaStreamResponse {
  model: string;
  created_at: string;
}

export interface OllamaStreamResponsePartial extends BaseOllamaStreamResponse {
  done: false;
  message: OllamaStreamMessage;
}

export interface OllamaStreamFinalResponse extends BaseOllamaStreamResponse {
  done: true;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export type OllamaStreamResponse =
  | OllamaStreamResponsePartial
  | OllamaStreamFinalResponse;

export interface Message {
  id: string;
  role: string;
  content: string;
}
