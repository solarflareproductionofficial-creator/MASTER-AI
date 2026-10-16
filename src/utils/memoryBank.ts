import { UserMemoryItem } from '../types.ts';
import { encryptData, decryptData } from './crypto.ts';

const MEMORY_STORAGE_KEY = 'master_ai_user_memories_v1';
const VAULT_PASS_KEY = 'master_ai_vault_pass';

// Default initial learning memory
export const INITIAL_MEMORIES: UserMemoryItem[] = [
  {
    id: 'mem-1',
    key: 'mantik_cozumu',
    value: 'Karmaşık bulmacalarda adım adım hipotez ve çelişki elemesi formatını tercih eder',
    category: 'reasoning',
    confidence: 0.98,
    lastUpdated: Date.now() - 3600000 * 24,
  },
  {
    id: 'mem-2',
    key: 'dil_tercihi',
    value: 'Türkçe akıcı, zengin teknik terimler ve net üslup',
    category: 'preference',
    confidence: 0.95,
    lastUpdated: Date.now() - 3600000 * 12,
  },
  {
    id: 'mem-3',
    key: 'guvenlik_seviyesi',
    value: 'Uçtan uca şifreleme ve yerel çevrimdışı gizlilik etkin',
    category: 'habit',
    confidence: 0.99,
    lastUpdated: Date.now() - 3600000 * 6,
  },
  {
    id: 'mem-4',
    key: 'kodlama_yaklasimi',
    value: 'TypeScript, modüler temiz kod ve açıklayıcı yorum satırları',
    category: 'coding',
    confidence: 0.92,
    lastUpdated: Date.now() - 3600000 * 2,
  },
];

export async function loadMemories(): Promise<UserMemoryItem[]> {
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) {
      await saveMemories(INITIAL_MEMORIES);
      return INITIAL_MEMORIES;
    }
    const pass = localStorage.getItem(VAULT_PASS_KEY) || 'master_ai_vault_key';
    const decrypted = await decryptData(raw, pass);
    const parsed = JSON.parse(decrypted);
    return Array.isArray(parsed) ? parsed : INITIAL_MEMORIES;
  } catch (err) {
    console.warn('Memory load fallback:', err);
    return INITIAL_MEMORIES;
  }
}

export async function saveMemories(memories: UserMemoryItem[]): Promise<void> {
  try {
    const pass = localStorage.getItem(VAULT_PASS_KEY) || 'master_ai_vault_key';
    const rawString = JSON.stringify(memories);
    const encrypted = await encryptData(rawString, pass);
    localStorage.setItem(MEMORY_STORAGE_KEY, encrypted);
  } catch (err) {
    console.error('Failed to save memories:', err);
  }
}

export function calculateOptimizationScore(memories: UserMemoryItem[]): number {
  if (memories.length === 0) return 20;
  const baseScore = 60;
  const memoryBonus = Math.min(30, memories.length * 5);
  const avgConfidence = memories.reduce((acc, m) => acc + m.confidence, 0) / memories.length;
  const confidenceBonus = Math.round(avgConfidence * 10);
  return Math.min(99, baseScore + memoryBonus + confidenceBonus);
}
