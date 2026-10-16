import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ChatArea } from './components/ChatArea.tsx';
import { InputBar } from './components/InputBar.tsx';
import { VoiceAssistantModal } from './components/VoiceAssistantModal.tsx';
import { LogicPuzzleStudioModal } from './components/LogicPuzzleStudioModal.tsx';
import { MemoryMatrixModal } from './components/MemoryMatrixModal.tsx';
import { PersonaCustomizerModal } from './components/PersonaCustomizerModal.tsx';
import { SecurityVaultModal } from './components/SecurityVaultModal.tsx';
import { ImageStudioModal } from './components/ImageStudioModal.tsx';
import { AchievementsModal } from './components/AchievementsModal.tsx';
import { SubscriptionModal } from './components/SubscriptionModal.tsx';
import { ModelSelectorModal } from './components/ModelSelectorModal.tsx';
import { HtmlGameStudioModal } from './components/HtmlGameStudioModal.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import {
  ChatSession,
  Message,
  UserPersona,
  UserMemoryItem,
  GeneratedImage,
  AchievementBadge,
  SubscriptionTier,
  UserStats
} from './types.ts';
import { encryptData, decryptData } from './utils/crypto.ts';
import { loadMemories, saveMemories, calculateOptimizationScore } from './utils/memoryBank.ts';
import { solveGenericOffline } from './utils/offlineEngine.ts';
import { applyAccentColor, applyThemeMode, getDetectedBrowserLanguage } from './utils/theme.ts';
import {

  loadBadges,
  saveBadges,
  loadUserStats,
  saveUserStats,
  checkAndUnlockBadges
} from './utils/achievements.ts';
import { Award, Sparkles, X, Trophy } from 'lucide-react';

const SESSIONS_STORAGE_KEY = 'master_ai_chat_sessions_v1';
const PERSONA_STORAGE_KEY = 'master_ai_user_persona_v1';
const VAULT_PASS_KEY = 'master_ai_vault_pass';

// Default language is English as explicitly requested!
const DEFAULT_PERSONA: UserPersona = {
  aiName: 'MASTER AI',
  userName: 'Friend',
  roleTitle: 'Intelligent Companion & Super Assistant',
  systemPrompt: 'Be calm, friendly, sharp, approachable, and intellectually formidable. Format your responses with aesthetic Markdown, sleek badges, and clear bullet points (✦, ⚡, 🎯, 🚀, 💡). Solve problems with precision and clarity.',
  reasoningRigor: 'standard',
  creativityLevel: 0.8,
  accentColor: '#06b6d4',
  language: 'en',
  autoDetectLanguage: false,
  offlineModePreferred: false,
  subscriptionTier: 'free',
  selectedModel: 'gemini-2.5-flash',
  themeMode: 'dark',
};

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [persona, setPersona] = useState<UserPersona>(DEFAULT_PERSONA);
  const [memories, setMemories] = useState<UserMemoryItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Gamification & Badges State
  const [badges, setBadges] = useState<AchievementBadge[]>(() => loadBadges());
  const [userStats, setUserStats] = useState<UserStats>(() => loadUserStats());
  const [unlockedToast, setUnlockedToast] = useState<AchievementBadge | null>(null);

  // Modals state
  const [voiceHUDOpen, setVoiceHUDOpen] = useState(false);
  const [puzzleStudioOpen, setPuzzleStudioOpen] = useState(false);
  const [memoryMatrixOpen, setMemoryMatrixOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [imageStudioOpen, setImageStudioOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [gameStudioOpen, setGameStudioOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load Persona, Memories & Encrypted Sessions on mount
  useEffect(() => {
    // Load persona
    try {
      const storedPersona = localStorage.getItem(PERSONA_STORAGE_KEY);
      if (storedPersona) {
        const parsed = JSON.parse(storedPersona);
        setPersona(parsed);
        applyAccentColor(parsed.accentColor || '#06b6d4');
        applyThemeMode(parsed.themeMode || 'dark');
      } else {
        applyAccentColor(DEFAULT_PERSONA.accentColor);
        applyThemeMode('dark');
      }
    } catch (e) {
      console.warn('Persona load fallback:', e);
      applyAccentColor('#06b6d4');
      applyThemeMode('dark');
    }

    // Load memories
    loadMemories().then(setMemories);

    // Load sessions
    const initSessions = async () => {
      try {
        const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const pass = localStorage.getItem(VAULT_PASS_KEY) || 'master_ai_vault_key';
        if (raw) {
          const decrypted = await decryptData(raw, pass);
          const parsed: ChatSession[] = JSON.parse(decrypted);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSessions(parsed);
            setActiveSessionId(parsed[0].id);
            return;
          }
        }
      } catch (err) {
        console.warn('Sessions decrypt/load fallback:', err);
      }

      // Default first session
      const newInitialSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: 'General Workspace & Logic Core',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
        isEncrypted: true,
        mode: 'standard',
      };
      setSessions([newInitialSession]);
      setActiveSessionId(newInitialSession.id);
    };

    initSessions();
  }, []);

  // Helper to trigger badge checks
  const updateStatsAndBadges = (statUpdater: (prev: UserStats) => UserStats) => {
    setUserStats((prevStats) => {
      const updatedStats = statUpdater(prevStats);
      saveUserStats(updatedStats);

      const updatedBadges = checkAndUnlockBadges(updatedStats, badges, (newUnlocked) => {
        setUnlockedToast(newUnlocked);
        setTimeout(() => {
          setUnlockedToast((curr) => (curr?.id === newUnlocked.id ? null : curr));
        }, 5000);
      });

      setBadges(updatedBadges);
      return updatedStats;
    });
  };

  // Save sessions encrypted whenever updated
  const saveSessionsEncrypted = async (newSessions: ChatSession[]) => {
    setSessions(newSessions);
    try {
      const pass = localStorage.getItem(VAULT_PASS_KEY) || 'master_ai_vault_key';
      const encrypted = await encryptData(JSON.stringify(newSessions), pass);
      localStorage.setItem(SESSIONS_STORAGE_KEY, encrypted);
    } catch (err) {
      console.error('Failed to encrypt & save sessions:', err);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Session Handlers
  const handleNewSession = (
    mode: 'standard' | 'deep-logic' | 'google-search' | 'code-architect' = 'standard'
  ) => {
    const isTurkish = persona.language === 'tr';
    const modeTitles: Record<string, string> = {
      standard: isTurkish ? 'Yeni Sohbet' : 'New Chat',
      'deep-logic': isTurkish ? 'Mantık Bulmacası Alanı' : 'Deep Logic Arena',
      'google-search': isTurkish ? 'Web Analiz Oturumu' : 'Web Research Session',
      'code-architect': isTurkish ? 'Yazılım Mimarisi' : 'Code Architecture',
    };

    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: modeTitles[mode] || (isTurkish ? 'Yeni Oturum' : 'New Session'),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      isEncrypted: true,
      mode,
    };
    const updated = [newSession, ...sessions];
    saveSessionsEncrypted(updated);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (sessions.length <= 1) return;
    const remaining = sessions.filter((s) => s.id !== sessionId);
    saveSessionsEncrypted(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleClearAllSessions = () => {
    const isTurkish = persona.language === 'tr';
    const first: ChatSession = {
      id: `session-${Date.now()}`,
      title: isTurkish ? 'Yeni Çalışma Alanı' : 'New Workspace',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
      isEncrypted: true,
      mode: 'standard',
    };
    saveSessionsEncrypted([first]);
    setActiveSessionId(first.id);
  };

  const handleClearCurrentChat = () => {
    if (!activeSession) return;
    const updated = { ...activeSession, messages: [], updatedAt: Date.now() };
    saveSessionsEncrypted(sessions.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeSession) return;
    const updatedMsgs = activeSession.messages.filter((m) => m.id !== messageId);
    const updated = { ...activeSession, messages: updatedMsgs, updatedAt: Date.now() };
    saveSessionsEncrypted(sessions.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handlePinSession = (sessionId: string) => {
    const updated = sessions.map((s) =>
      s.id === sessionId ? { ...s, pinned: !s.pinned } : s
    );
    saveSessionsEncrypted(updated);
  };

  const handleToggleMode = (mode: 'standard' | 'deep-logic' | 'google-search') => {
    if (!activeSession) return;
    const updated = { ...activeSession, mode };
    saveSessionsEncrypted(sessions.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSavePersona = (updated: UserPersona) => {
    setPersona(updated);
    localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(updated));
    applyAccentColor(updated.accentColor || '#06b6d4');
    applyThemeMode(updated.themeMode || 'dark');
    updateStatsAndBadges((s) => ({ ...s, hasCustomPersona: true }));
  };

  const handleToggleThemeMode = () => {
    const nextMode = persona.themeMode === 'light' ? 'dark' : 'light';
    const updated: UserPersona = {
      ...persona,
      themeMode: nextMode,
    };
    handleSavePersona(updated);
    updateStatsAndBadges((s) => ({
      ...s,
      themeSwitchedCount: (s.themeSwitchedCount || 0) + 1,
    }));
  };

  const handleGameTested = () => {
    updateStatsAndBadges((s) => ({
      ...s,
      gamesTestedCount: (s.gamesTestedCount || 0) + 1,
    }));
  };

  const handleUpgradeTier = (tier: SubscriptionTier) => {
    const updatedPersona: UserPersona = {
      ...persona,
      subscriptionTier: tier,
    };
    handleSavePersona(updatedPersona);
    updateStatsAndBadges((s) => ({
      ...s,
      isProSubscriber: tier === 'pro' || tier === 'ultra',
    }));
  };


  const handleSelectModel = (modelId: string) => {
    const updatedPersona: UserPersona = {
      ...persona,
      selectedModel: modelId,
    };
    handleSavePersona(updatedPersona);
  };

  const handleSaveMemories = (updated: UserMemoryItem[]) => {
    setMemories(updated);
    saveMemories(updated);
  };

  // Resolve active language
  const getActiveLanguage = (): string => {
    if (persona.autoDetectLanguage) {
      return getDetectedBrowserLanguage().code;
    }
    return persona.language || 'en';
  };

  // Core Prompt Send Logic
  const handleSendMessage = async (
    promptText: string,
    options?: { mode?: 'standard' | 'deep-logic' | 'google-search' }
  ) => {
    if (!promptText.trim() || isLoading) return;

    const currentMode = options?.mode || activeSession?.mode || 'standard';

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: promptText,
      timestamp: Date.now(),
    };

    const updatedMessages = [...(activeSession?.messages || []), userMessage];
    const sessionTitle =
      activeSession?.messages.length === 0
        ? promptText.slice(0, 32) + (promptText.length > 32 ? '...' : '')
        : activeSession?.title || 'Session';

    const updatedSession: ChatSession = {
      ...activeSession,
      title: sessionTitle,
      updatedAt: Date.now(),
      messages: updatedMessages,
      mode: currentMode,
    };

    saveSessionsEncrypted(
      sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );

    // Track stats
    updateStatsAndBadges((s) => ({
      ...s,
      messagesCount: s.messagesCount + 1,
      puzzlesSolved:
        currentMode === 'deep-logic' || persona.reasoningRigor === 'proof'
          ? s.puzzlesSolved + 1
          : s.puzzlesSolved,
    }));

    setIsLoading(true);

    // Check if user specifically requested an image generation in text
    const lower = promptText.toLowerCase();
    const isImageRequest =
      lower.startsWith('/image') ||
      lower.includes('generate image') ||
      lower.includes('görsel oluştur') ||
      lower.includes('resim çiz');

    if (isImageRequest && (!isOfflineMode && isOnline)) {
      try {
        const cleanPrompt = promptText
          .replace('/image', '')
          .replace('generate image', '')
          .replace('görsel oluştur', '')
          .replace('resim çiz', '')
          .trim();

        const imgRes = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: cleanPrompt || promptText,
            style: 'cinematic',
            aspectRatio: '1:1',
          }),
        });

        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const generatedImg: GeneratedImage = {
            url: imgData.imageUrl,
            enhancedPrompt: imgData.enhancedPrompt,
            originalPrompt: promptText,
            aspectRatio: '1:1',
            style: 'cinematic',
            timestamp: Date.now(),
          };

          const aiMsg: Message = {
            id: `msg-${Date.now()}-m`,
            role: 'model',
            content: `Your visual concept is ready! 🎨 "${promptText}". You can inspect or download it below.`,
            images: [generatedImg],
            timestamp: Date.now(),
            model: persona.selectedModel,
          };

          const finalSession = {
            ...updatedSession,
            messages: [...updatedMessages, aiMsg],
          };
          saveSessionsEncrypted(
            sessions.map((s) => (s.id === finalSession.id ? finalSession : s))
          );
          updateStatsAndBadges((s) => ({ ...s, imagesGenerated: s.imagesGenerated + 1 }));
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Image generation fallback to text:', err);
      }
    }

    // Heuristic offline reasoning fallback
    if (isOfflineMode || !isOnline) {
      setTimeout(() => {
        const offlineResult = solveGenericOffline(promptText);
        const offlineMsg: Message = {
          id: `msg-${Date.now()}-m`,
          role: 'model',
          content: offlineResult.solution,
          thinking: offlineResult.thinking || null,
          isOffline: true,
          timestamp: Date.now(),
          model: 'Offline Heuristic Engine',
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedMessages, offlineMsg],
        };
        saveSessionsEncrypted(
          sessions.map((s) => (s.id === finalSession.id ? finalSession : s))
        );
        setIsLoading(false);
      }, 500);
      return;
    }

    // Online Gemini API Chat
    try {
      const memoryPrefs = memories.reduce((acc: Record<string, string>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          history: updatedMessages.slice(-10),
          systemPrompt: persona.systemPrompt,
          mode: currentMode,
          reasoningRigor: persona.reasoningRigor,
          language: getActiveLanguage(),
          selectedModel: persona.selectedModel || 'gemini-2.5-flash',
          userDirectives: `Role: ${persona.roleTitle}. User: ${persona.userName}. Creativity: ${persona.creativityLevel}`,
          userPreferences: memoryPrefs,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();

      const aiMsg: Message = {
        id: `msg-${Date.now()}-m`,
        role: 'model',
        content: data.content || '...',
        thinking: data.thinking || null,
        webSources: data.webSources || [],
        searchQueries: data.searchQueries || [],
        timestamp: Date.now(),
        model: data.model || persona.selectedModel,
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, aiMsg],
      };
      saveSessionsEncrypted(
        sessions.map((s) => (s.id === finalSession.id ? finalSession : s))
      );

      // Background Memory extraction
      triggerMemoryExtraction(promptText, data.content);
    } catch (err: any) {
      console.warn('API error, falling back to internal logic solver:', err);
      const fallbackResult = solveGenericOffline(promptText);
      const fallbackMsg: Message = {
        id: `msg-${Date.now()}-m`,
        role: 'model',
        content: fallbackResult.solution,
        thinking: fallbackResult.thinking || null,
        isOffline: true,
        timestamp: Date.now(),
        model: 'MASTER AI Local Engine',
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedMessages, fallbackMsg],
      };
      saveSessionsEncrypted(
        sessions.map((s) => (s.id === finalSession.id ? finalSession : s))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Memory extraction
  const triggerMemoryExtraction = async (userPrompt: string, aiResponse: string) => {
    try {
      const res = await fetch('/api/extract-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, aiResponse }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.extractedNodes && Array.isArray(data.extractedNodes) && data.extractedNodes.length > 0) {
          const newNodes: UserMemoryItem[] = data.extractedNodes.map((n: any) => ({
            id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            key: n.key || 'observation',
            value: n.value || '',
            category: n.category || 'preference',
            confidence: 0.85,
            lastUpdated: Date.now(),
          }));

          const merged = [...memories, ...newNodes];
          handleSaveMemories(merged);
        }
      }
    } catch {
      // Non-critical background task
    }
  };

  // Text-To-Speech Playback
  const handlePlayTTS = async (text: string, messageId: string) => {
    if (playingAudioId === messageId) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setPlayingAudioId(null);
      return;
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Puck' }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        currentAudioRef.current = audio;
        setPlayingAudioId(messageId);

        audio.onended = () => {
          setPlayingAudioId(null);
        };
        audio.onerror = () => {
          setPlayingAudioId(null);
        };
        await audio.play();
      } else {
        // Browser Speech fallback
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
        utterance.lang = persona.language === 'tr' ? 'tr-TR' : 'en-US';
        speechSynthesis.speak(utterance);
      }
    } catch {
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
      utterance.lang = persona.language === 'tr' ? 'tr-TR' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  // Voice Assistant HUD prompt executor
  const handleVoiceProcess = async (voicePrompt: string): Promise<string> => {
    updateStatsAndBadges((s) => ({ ...s, voiceUsedCount: s.voiceUsedCount + 1 }));
    await handleSendMessage(voicePrompt, { mode: 'standard' });
    return 'Voice command executed smoothly.';
  };

  // Vault Export / Import
  const handleExportVault = async () => {
    updateStatsAndBadges((s) => ({ ...s, vaultExports: s.vaultExports + 1 }));
    const vault = {
      sessions,
      persona,
      memories,
      stats: userStats,
      badges,
      exportedAt: Date.now(),
      version: '2.5',
    };
    const pass = localStorage.getItem(VAULT_PASS_KEY) || 'master_ai_vault_key';
    const encrypted = await encryptData(JSON.stringify(vault), pass);
    const blob = new Blob([encrypted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `master-ai-vault-${new Date().toISOString().slice(0, 10)}.master`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportVault = async (file: File) => {
    try {
      const text = await file.text();
      const pass = localStorage.getItem(VAULT_PASS_KEY) || 'master_ai_vault_key';
      const decrypted = await decryptData(text, pass);
      const vault = JSON.parse(decrypted);

      if (vault.sessions) {
        saveSessionsEncrypted(vault.sessions);
      }
      if (vault.persona) {
        handleSavePersona(vault.persona);
      }
      if (vault.memories) {
        handleSaveMemories(vault.memories);
      }
      if (vault.badges) {
        setBadges(vault.badges);
        saveBadges(vault.badges);
      }
      if (vault.stats) {
        setUserStats(vault.stats);
        saveUserStats(vault.stats);
      }
      alert('Encrypted vault restored successfully!');
    } catch (err) {
      console.error(err);
      alert('Error importing vault: Invalid passphrase or corrupted file.');
    }
  };

  // Inject image to chat
  const handleSendImageToChat = (image: GeneratedImage) => {
    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: `[Visual Prompt]: ${image.originalPrompt}`,
      timestamp: Date.now(),
    };
    const aiMsg: Message = {
      id: `msg-${Date.now()}-m`,
      role: 'model',
      content: `Artwork generated! ⚡ Style: ${image.style}, Aspect: ${image.aspectRatio}.`,
      images: [image],
      timestamp: Date.now(),
      model: persona.selectedModel,
    };
    const updated = [...(activeSession?.messages || []), userMsg, aiMsg];
    const session = { ...activeSession, messages: updated, updatedAt: Date.now() };
    saveSessionsEncrypted(sessions.map((s) => (s.id === session.id ? session : s)));
    updateStatsAndBadges((s) => ({ ...s, imagesGenerated: s.imagesGenerated + 1 }));
  };

  const optimizationScore = calculateOptimizationScore(memories);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Toast Notification when a new badge is unlocked */}
      {unlockedToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-zinc-900 border border-amber-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl shrink-0">
            {unlockedToast.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">
                🏆 {persona.language === 'tr' ? 'Rozet Kazanıldı!' : 'Achievement Unlocked!'}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                +{unlockedToast.points} XP
              </span>
            </div>
            <h4 className="text-sm font-black text-white">{unlockedToast.title}</h4>
            <p className="text-[11px] text-zinc-400">{unlockedToast.description}</p>
          </div>
          <button
            onClick={() => setUnlockedToast(null)}
            className="p-1 rounded-lg text-zinc-500 hover:text-white cursor-pointer ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setSidebarOpen(false);
        }}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        onPinSession={handlePinSession}
        onOpenPuzzleStudio={() => setPuzzleStudioOpen(true)}
        onSelectPuzzle={(puzzlePrompt) => {
          handleSendMessage(puzzlePrompt, { mode: 'deep-logic' });
          setSidebarOpen(false);
        }}
        onOpenMemory={() => setMemoryMatrixOpen(true)}
        onOpenPersona={() => setPersonaOpen(true)}
        onOpenSecurity={() => setSecurityOpen(true)}
        onOpenImageStudio={() => setImageStudioOpen(true)}
        onOpenAchievements={() => setAchievementsOpen(true)}
        onOpenSubscription={() => setSubscriptionOpen(true)}
        onOpenModelSelector={() => setModelSelectorOpen(true)}
        onOpenGameStudio={() => setGameStudioOpen(true)}
        onOpenShare={() => setShareOpen(true)}
        accentColor={persona.accentColor || '#06b6d4'}
        language={persona.language}
        subscriptionTier={persona.subscriptionTier}
        unlockedBadgesCount={unlockedBadgesCount}
        selectedModelId={persona.selectedModel}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header with Capital 'M' Logo, Achievements, Pro Upgrade, Game Studio & Share */}
        <Header
          persona={persona}
          isOnline={isOnline}
          isOfflineMode={isOfflineMode}
          onToggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
          reasoningRigor={persona.reasoningRigor}
          onChangeRigor={(rigor) => {
            const updated = { ...persona, reasoningRigor: rigor };
            handleSavePersona(updated);
          }}
          onOpenVoiceHUD={() => setVoiceHUDOpen(true)}
          onOpenSecurity={() => setSecurityOpen(true)}
          onOpenPersona={() => setPersonaOpen(true)}
          onOpenMemory={() => setMemoryMatrixOpen(true)}
          onOpenImageStudio={() => setImageStudioOpen(true)}
          onOpenAchievements={() => setAchievementsOpen(true)}
          onOpenSubscription={() => setSubscriptionOpen(true)}
          onOpenModelSelector={() => setModelSelectorOpen(true)}
          onOpenGameStudio={() => setGameStudioOpen(true)}
          onOpenShare={() => setShareOpen(true)}
          onToggleThemeMode={handleToggleThemeMode}
          onClearChat={handleClearCurrentChat}
          hasMessages={Boolean(activeSession?.messages?.length)}
          optimizationScore={optimizationScore}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          unlockedBadgesCount={unlockedBadgesCount}
        />

        {/* Chat History View with instant auto-scroll down on send & reply */}
        <ChatArea
          messages={activeSession?.messages || []}
          isLoading={isLoading}
          activeMode={activeSession?.mode || 'standard'}
          onSelectPrompt={(p) => handleSendMessage(p, { mode: 'deep-logic' })}
          persona={persona}
          onOpenImageStudio={() => setImageStudioOpen(true)}
          onOpenPuzzleStudio={() => setPuzzleStudioOpen(true)}
          onPlayTTS={handlePlayTTS}
          onDeleteMessage={handleDeleteMessage}
          onClearChat={handleClearCurrentChat}
          playingAudioId={playingAudioId}
        />

        {/* Input Dock with active model switcher */}
        <InputBar
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          activeMode={activeSession?.mode || 'standard'}
          onToggleMode={handleToggleMode}
          onOpenImageStudio={() => setImageStudioOpen(true)}
          onOpenPuzzleStudio={() => setPuzzleStudioOpen(true)}
          onOpenModelSelector={() => setModelSelectorOpen(true)}
          isOfflineMode={isOfflineMode || !isOnline}
          accentColor={persona.accentColor || '#06b6d4'}
          language={persona.language}
          selectedModelId={persona.selectedModel}
        />
      </div>

      {/* Interactive Modals */}
      <VoiceAssistantModal
        isOpen={voiceHUDOpen}
        onClose={() => setVoiceHUDOpen(false)}
        onProcessVoicePrompt={handleVoiceProcess}
        aiName={persona.aiName || 'MASTER AI'}
      />

      <LogicPuzzleStudioModal
        isOpen={puzzleStudioOpen}
        onClose={() => setPuzzleStudioOpen(false)}
        onSolvePuzzle={(prompt) => handleSendMessage(prompt, { mode: 'deep-logic' })}
      />

      <MemoryMatrixModal
        isOpen={memoryMatrixOpen}
        onClose={() => setMemoryMatrixOpen(false)}
        memories={memories}
        onSaveMemories={handleSaveMemories}
      />

      <PersonaCustomizerModal
        isOpen={personaOpen}
        onClose={() => setPersonaOpen(false)}
        persona={persona}
        onSavePersona={handleSavePersona}
        onOpenGameStudio={() => {
          setPersonaOpen(false);
          setGameStudioOpen(true);
        }}
      />

      <SecurityVaultModal
        isOpen={securityOpen}
        onClose={() => setSecurityOpen(false)}
        onExportVault={handleExportVault}
        onImportVault={handleImportVault}
      />

      <ImageStudioModal
        isOpen={imageStudioOpen}
        onClose={() => setImageStudioOpen(false)}
        onSendImageToChat={handleSendImageToChat}
      />

      {/* Achievements Badges Modal */}
      <AchievementsModal
        isOpen={achievementsOpen}
        onClose={() => setAchievementsOpen(false)}
        badges={badges}
        stats={userStats}
        accentColor={persona.accentColor || '#06b6d4'}
        language={persona.language}
        onOpenSubscription={() => {
          setAchievementsOpen(false);
          setSubscriptionOpen(true);
        }}
      />

      {/* Subscription Plans Modal (Achievement-based unlocks) */}
      <SubscriptionModal
        isOpen={subscriptionOpen}
        onClose={() => setSubscriptionOpen(false)}
        currentTier={persona.subscriptionTier || 'free'}
        onUpgradeTier={handleUpgradeTier}
        accentColor={persona.accentColor || '#06b6d4'}
        language={persona.language}
        unlockedBadgesCount={unlockedBadgesCount}
        onOpenAchievements={() => {
          setSubscriptionOpen(false);
          setAchievementsOpen(true);
        }}
      />

      {/* AI Model Selector Modal (GPT-4o, Claude, DeepSeek-R1, Gemini) */}
      <ModelSelectorModal
        isOpen={modelSelectorOpen}
        onClose={() => setModelSelectorOpen(false)}
        selectedModelId={persona.selectedModel || 'gemini-2.5-flash'}
        onSelectModel={handleSelectModel}
        subscriptionTier={persona.subscriptionTier || 'free'}
        onOpenSubscription={() => {
          setModelSelectorOpen(false);
          setSubscriptionOpen(true);
        }}
        accentColor={persona.accentColor || '#06b6d4'}
        language={persona.language}
      />

      {/* HTML5 Game Studio Modal */}
      <HtmlGameStudioModal
        isOpen={gameStudioOpen}
        onClose={() => setGameStudioOpen(false)}
        accentColor={persona.accentColor || '#06b6d4'}
        language={persona.language}
        onGameTested={handleGameTested}
        onOpenShareGuide={() => {
          setGameStudioOpen(false);
          setShareOpen(true);
        }}
      />

      {/* Share & Game Jolt Guide Modal */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        accentColor={persona.accentColor || '#06b6d4'}
        language={persona.language}
        onOpenGameStudio={() => {
          setShareOpen(false);
          setGameStudioOpen(true);
        }}
      />
    </div>
  );
}

