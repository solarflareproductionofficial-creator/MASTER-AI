export type Role = 'user' | 'model' | 'system';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface GeneratedImage {
  url: string;
  enhancedPrompt: string;
  originalPrompt: string;
  aspectRatio: string;
  style: string;
  timestamp: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  thinking?: string | null;
  webSources?: GroundingSource[];
  searchQueries?: string[];
  images?: GeneratedImage[];
  isOffline?: boolean;
  timestamp: number;
  tokensEstimate?: number;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  isEncrypted: boolean;
  mode: 'standard' | 'deep-logic' | 'google-search' | 'code-architect';
  pinned?: boolean;
}

export interface UserMemoryItem {
  id: string;
  key: string;
  value: string;
  category: 'preference' | 'reasoning' | 'coding' | 'habit' | 'personal';
  confidence: number;
  lastUpdated: number;
}

export type SubscriptionTier = 'free' | 'pro' | 'ultra';

export interface AIModelChoice {
  id: string;
  name: string;
  description: string;
  badge: string;
  isPro: boolean;
  icon: string;
}

export interface UserPersona {
  aiName: string;
  userName: string;
  roleTitle: string;
  systemPrompt: string;
  reasoningRigor: 'standard' | 'high' | 'proof';
  creativityLevel: number; // 0 to 1
  accentColor: string;
  language: string;
  autoDetectLanguage?: boolean;
  offlineModePreferred: boolean;
  subscriptionTier: SubscriptionTier;
  selectedModel: string;
  themeMode?: 'dark' | 'light';
}

export interface LogicPuzzle {
  id: string;
  title: string;
  category: 'einstein' | 'knights-knaves' | 'river-crossing' | 'math' | 'paradox' | 'chess';
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'Üst Düzey';
  description: string;
  clues: string[];
  prompt: string;
  solutionHint?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'chat' | 'logic' | 'visual' | 'voice' | 'security' | 'pro' | 'games';
  unlocked: boolean;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
  points: number;
}

export interface UserStats {
  messagesCount: number;
  puzzlesSolved: number;
  imagesGenerated: number;
  voiceUsedCount: number;
  vaultExports: number;
  hasCustomPersona: boolean;
  daysActive: number;
  isProSubscriber: boolean;
  gamesTestedCount?: number;
  themeSwitchedCount?: number;
}

