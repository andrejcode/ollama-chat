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

  GET_IS_SIDEBAR_OPEN = 'get-is-sidebar-open',
  SET_IS_SIDEBAR_OPEN = 'set-is-sidebar-open',

  OLLAMA_URL_CHANGE = 'ollama-url-change',

  OLLAMA_GET_HEALTH = 'ollama-get-health',
  OLLAMA_HEALTH_CHECK = 'ollama-health-check',
  OLLAMA_HEALTH_STATUS = 'ollama-health-status',

  OLLAMA_MODELS_GET = 'ollama-models-get',
  OLLAMA_MODELS_UPDATED = 'ollama-models-updated',
  OLLAMA_GET_CURRENT_MODEL = 'ollama-get-current-model',
  OLLAMA_SET_CURRENT_MODEL = 'ollama-set-current-model',

  THEME_DARK = 'theme-dark',
  THEME_LIGHT = 'theme-light',
  THEME_SYSTEM = 'theme-system',
}
