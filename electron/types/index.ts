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

  OLLAMA_URL_CHANGE = 'ollama-url-change',
  OLLAMA_HEALTH_CHECK = 'ollama-health-check',

  THEME_DARK = 'theme-dark',
  THEME_LIGHT = 'theme-light',
  THEME_SYSTEM = 'theme-system',

  STORE_GET = 'store-get',
  STORE_SET = 'store-set',
}
