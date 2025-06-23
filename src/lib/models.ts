export interface ProviderOption {
  id: 'openai' | 'together';
  name: string;
}

export const PROVIDERS: ProviderOption[] = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'together', name: 'Together.ai' },
];

export interface ModelOption {
  name: string;
  value: string;
  provider: ProviderOption['id'];
}

export const MODEL_OPTIONS: ModelOption[] = [
  // OpenAI models
  { name: 'GPT-4o Mini', value: 'gpt-4o-mini', provider: 'openai' },
  { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo', provider: 'openai' },

  // Together.ai models
  { name: 'Llama 3.3 70B Turbo', value: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', provider: 'together' },
  { name: 'Llama 3.1 8B Instruct Turbo', value: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo', provider: 'together' },
  { name: 'Qwen3 235B A22B FP8 Throughput', value: 'Qwen/Qwen3-235B-A22B-fp8-tput', provider: 'together' },
  { name: 'Qwen 2.5 72B Instruct Turbo', value: 'Qwen/Qwen2.5-72B-Instruct-Turbo', provider: 'together' },
  { name: 'DeepSeek R1', value: 'deepseek-ai/DeepSeek-R1', provider: 'together' },
  { name: 'DeepSeek V3', value: 'deepseek-ai/DeepSeek-V3', provider: 'together' },
  { name: 'Perplexity AI R1-1776', value: 'perplexity-ai/r1-1776', provider: 'together' },
  { name: 'Magistral Small 2506', value: 'mistralai/Magistral-Small-2506', provider: 'together' },
  { name: 'Marin 8B Instruct', value: 'marin-community/marin-8b-instruct', provider: 'together' },
  { name: 'Mistral Small 3 Instruct (24B)', value: 'mistralai/Mistral-Small-24B-Instruct-2501', provider: 'together' },
  { name: 'Llama 3.1 Nemotron 70B (NVIDIA)', value: 'nvidia/Llama-3.1-Nemotron-70B-Instruct-HF', provider: 'together' },
  { name: 'Arcee AI Virtuoso Medium', value: 'arcee-ai/virtuoso-medium-v2', provider: 'together' },
  { name: 'Arcee AI Maestro', value: 'arcee-ai/maestro-reasoning', provider: 'together' },
  { name: 'Arcee AI Blitz', value: 'arcee-ai/arcee-blitz', provider: 'together' },
  { name: 'Llama 3.1 405B Instruct Turbo', value: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo', provider: 'together' },
  { name: 'Llama 3.2 3B Instruct Turbo', value: 'meta-llama/Llama-3.2-3B-Instruct-Turbo', provider: 'together' },
  { name: 'Llama 3 8B Instruct Lite', value: 'meta-llama/Meta-Llama-3-8B-Instruct-Lite', provider: 'together' },
  { name: 'Llama 3 8B Instruct Reference', value: 'meta-llama/Llama-3-8b-chat-hf', provider: 'together' },
  { name: 'Llama 3 70B Instruct Reference', value: 'meta-llama/Llama-3-70b-chat-hf', provider: 'together' },
  { name: 'Gemma 2 27B', value: 'google/gemma-2-27b-it', provider: 'together' },
  { name: 'Mistral 7B Instruct v0.3', value: 'mistralai/Mistral-7B-Instruct-v0.3', provider: 'together' },
  { name: 'Nous Hermes 2 - Mixtral 8x7B-DPO', value: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO', provider: 'together' },
]; 