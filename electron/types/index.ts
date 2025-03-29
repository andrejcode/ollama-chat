interface OllamaStreamMessage {
  role: string;
  content: string;
}

interface BaseOllamaStreamResponse {
  model: string;
  created_at: string;
}

interface OllamaStreamResponsePartial extends BaseOllamaStreamResponse {
  done: false;
  message: OllamaStreamMessage;
}

interface OllamaStreamFinalResponse extends BaseOllamaStreamResponse {
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

export enum IpcChannels {
  OLLAMA_STREAM = 'ollama-stream',
  OLLAMA_RESPONSE = 'ollama-stream-response',
  OLLAMA_ERROR = 'ollama-stream-error',
  OLLAMA_COMPLETE = 'ollama-stream-complete',
  STORE_GET = 'store-get',
  STORE_SET = 'store-set',
}
