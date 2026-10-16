import { AchievementBadge, UserStats } from '../types.ts';

const STATS_STORAGE_KEY = 'master_ai_user_stats_v1';
const BADGES_STORAGE_KEY = 'master_ai_badges_v1';

export const INITIAL_BADGES: AchievementBadge[] = [
  {
    id: 'first-contact',
    title: 'First Contact',
    description: 'Sent your very first message to MASTER AI.',
    icon: '👋',
    category: 'chat',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 50,
  },
  {
    id: 'conversationalist',
    title: 'Silver Conversationalist',
    description: 'Engaged in 10 smart conversations with MASTER AI.',
    icon: '💬',
    category: 'chat',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    points: 100,
  },
  {
    id: 'power-talker',
    title: 'Golden Communicator',
    description: 'Reached 30 messages across multiple sessions.',
    icon: '⚡',
    category: 'chat',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    points: 250,
  },
  {
    id: 'logic-initiate',
    title: 'Logic Initiate',
    description: 'Challenged MASTER AI with a deductive logic puzzle.',
    icon: '🧩',
    category: 'logic',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 150,
  },
  {
    id: 'grand-logician',
    title: 'Grand Logician',
    description: 'Solved 5 complex logic puzzles using deep chain-of-thought.',
    icon: '🧠',
    category: 'logic',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    points: 400,
  },
  {
    id: 'visual-dreamer',
    title: 'Visual Dreamer',
    description: 'Synthesized your first high-definition AI image.',
    icon: '🎨',
    category: 'visual',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 100,
  },
  {
    id: 'art-director',
    title: 'Art Director',
    description: 'Created 5 distinctive artworks in the Visual Studio.',
    icon: '🖼️',
    category: 'visual',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    points: 300,
  },
  {
    id: 'voice-commander',
    title: 'Voice Commander',
    description: 'Interacted hands-free with the Live Voice Assistant HUD.',
    icon: '🎙️',
    category: 'voice',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 120,
  },
  {
    id: 'web-navigator',
    title: 'Web Navigator',
    description: 'Analyzed live web trends using Google Search Grounding.',
    icon: '🌐',
    category: 'chat',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 150,
  },
  {
    id: 'crypto-sentinel',
    title: 'Crypto Sentinel',
    description: 'Secured or exported your AES-GCM 256-bit encrypted vault.',
    icon: '🔒',
    category: 'security',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 200,
  },
  {
    id: 'neural-architect',
    title: 'Neural Architect',
    description: 'Customized MASTER AI persona, theme palette and rules.',
    icon: '🧬',
    category: 'pro',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 180,
  },
  {
    id: 'game-creator',
    title: 'HTML5 Game Creator',
    description: 'Tested, wrote or previewed an interactive game in the HTML5 Game Studio.',
    icon: '🎮',
    category: 'games',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 200,
  },
  {
    id: 'theme-alchemist',
    title: 'Theme Alchemist',
    description: 'Switched between White and Dark themes for the interface.',
    icon: '🌓',
    category: 'pro',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 100,
  },
  {
    id: 'pro-master',
    title: 'Pro Master Tier',
    description: 'Unlocked Pro Membership by achieving 3 master badges!',
    icon: '👑',
    category: 'pro',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    points: 500,
  },
];


export const INITIAL_STATS: UserStats = {
  messagesCount: 0,
  puzzlesSolved: 0,
  imagesGenerated: 0,
  voiceUsedCount: 0,
  vaultExports: 0,
  hasCustomPersona: false,
  daysActive: 1,
  isProSubscriber: false,
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    return raw ? { ...INITIAL_STATS, ...JSON.parse(raw) } : INITIAL_STATS;
  } catch {
    return INITIAL_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
}

export function loadBadges(): AchievementBadge[] {
  try {
    const raw = localStorage.getItem(BADGES_STORAGE_KEY);
    if (!raw) return INITIAL_BADGES;
    const stored: AchievementBadge[] = JSON.parse(raw);
    // Merge in case new badges were added
    return INITIAL_BADGES.map((initBadge) => {
      const found = stored.find((b) => b.id === initBadge.id);
      return found ? { ...initBadge, ...found } : initBadge;
    });
  } catch {
    return INITIAL_BADGES;
  }
}

export function saveBadges(badges: AchievementBadge[]): void {
  localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badges));
}

export function checkAndUnlockBadges(
  stats: UserStats,
  currentBadges: AchievementBadge[],
  onNewUnlock?: (badge: AchievementBadge) => void
): AchievementBadge[] {
  let hasNew = false;
  const updated = currentBadges.map((badge) => {
    let currentProgress = badge.progress;
    let shouldUnlock = badge.unlocked;

    switch (badge.id) {
      case 'first-contact':
        currentProgress = Math.min(badge.maxProgress, stats.messagesCount);
        if (stats.messagesCount >= 1) shouldUnlock = true;
        break;
      case 'conversationalist':
        currentProgress = Math.min(badge.maxProgress, stats.messagesCount);
        if (stats.messagesCount >= 10) shouldUnlock = true;
        break;
      case 'power-talker':
        currentProgress = Math.min(badge.maxProgress, stats.messagesCount);
        if (stats.messagesCount >= 30) shouldUnlock = true;
        break;
      case 'logic-initiate':
        currentProgress = Math.min(badge.maxProgress, stats.puzzlesSolved);
        if (stats.puzzlesSolved >= 1) shouldUnlock = true;
        break;
      case 'grand-logician':
        currentProgress = Math.min(badge.maxProgress, stats.puzzlesSolved);
        if (stats.puzzlesSolved >= 5) shouldUnlock = true;
        break;
      case 'visual-dreamer':
        currentProgress = Math.min(badge.maxProgress, stats.imagesGenerated);
        if (stats.imagesGenerated >= 1) shouldUnlock = true;
        break;
      case 'art-director':
        currentProgress = Math.min(badge.maxProgress, stats.imagesGenerated);
        if (stats.imagesGenerated >= 5) shouldUnlock = true;
        break;
      case 'voice-commander':
        currentProgress = Math.min(badge.maxProgress, stats.voiceUsedCount);
        if (stats.voiceUsedCount >= 1) shouldUnlock = true;
        break;
      case 'crypto-sentinel':
        currentProgress = Math.min(badge.maxProgress, stats.vaultExports);
        if (stats.vaultExports >= 1) shouldUnlock = true;
        break;
      case 'neural-architect':
        currentProgress = stats.hasCustomPersona ? 1 : 0;
        if (stats.hasCustomPersona) shouldUnlock = true;
        break;
      case 'game-creator':
        currentProgress = (stats.gamesTestedCount && stats.gamesTestedCount >= 1) ? 1 : 0;
        if (stats.gamesTestedCount && stats.gamesTestedCount >= 1) shouldUnlock = true;
        break;
      case 'theme-alchemist':
        currentProgress = (stats.themeSwitchedCount && stats.themeSwitchedCount >= 1) ? 1 : 0;
        if (stats.themeSwitchedCount && stats.themeSwitchedCount >= 1) shouldUnlock = true;
        break;
      case 'pro-master':
        currentProgress = stats.isProSubscriber ? 1 : 0;
        if (stats.isProSubscriber) shouldUnlock = true;
        break;
      default:
        break;
    }

    if (!badge.unlocked && shouldUnlock) {
      hasNew = true;
      const unlockedBadge = {
        ...badge,
        unlocked: true,
        unlockedAt: Date.now(),
        progress: badge.maxProgress,
      };
      if (onNewUnlock) onNewUnlock(unlockedBadge);
      return unlockedBadge;
    }

    return {
      ...badge,
      progress: currentProgress,
      unlocked: shouldUnlock,
    };
  });

  if (hasNew) {
    saveBadges(updated);
  }
  return updated;
}
