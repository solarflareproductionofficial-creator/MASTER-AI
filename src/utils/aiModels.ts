import { AIModelChoice } from '../types.ts';

export const AVAILABLE_AI_MODELS: AIModelChoice[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Sub-second real-time latency. Optimal for everyday inquiries, fast logic deduction, and instant search grounding.',
    badge: 'FREE',
    isPro: false,
    icon: '⚡',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Lightweight and smart OpenAI engine. Balanced for rapid code brainstorming and creative discussions.',
    badge: 'FREE',
    isPro: false,
    icon: '🤖',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    description: 'Flagship multimodal intelligence. Superb linguistic nuance, high-IQ logic deduction, and advanced reasoning synthesis.',
    badge: 'PRO ($4.99)',
    isPro: true,
    icon: '👑',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Premier system architect and code synthesis engine with deep philosophical and analytic capabilities.',
    badge: 'PRO ($4.99)',
    isPro: true,
    icon: '🎭',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1 (Thinking)',
    description: 'Pure open reasoning & mathematical chain-of-thought. Unravels hardest logic puzzles step-by-step.',
    badge: 'PRO ($4.99)',
    isPro: true,
    icon: '🔬',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Google heavyweight analytical model. Handles massive context, complex reasoning, and multimodal inputs.',
    badge: 'PRO ($4.99)',
    isPro: true,
    icon: '🧠',
  },
];

export function getModelById(id: string): AIModelChoice {
  return AVAILABLE_AI_MODELS.find((m) => m.id === id) || AVAILABLE_AI_MODELS[0];
}
