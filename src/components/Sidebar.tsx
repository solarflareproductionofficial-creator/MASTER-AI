import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Puzzle,
  Trash2,
  Pin,
  Lock,
  Search,
  Sparkles,
  Sliders,
  Database,
  Shield,
  HelpCircle,
  X,
  FileCode,
  Globe,
  Image as ImageIcon,
  Trophy,
  Crown,
  Cpu,
  Gamepad2,
  Share2
} from 'lucide-react';
import { ChatSession, SubscriptionTier } from '../types.ts';
import { CLASSIC_LOGIC_PUZZLES } from '../utils/puzzlePresets.ts';
import { LogoM } from './LogoM.tsx';
import { getModelById } from '../utils/aiModels.ts';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: (mode?: 'standard' | 'deep-logic' | 'google-search' | 'code-architect') => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions?: () => void;
  onPinSession: (id: string) => void;
  onOpenPuzzleStudio: () => void;
  onSelectPuzzle: (puzzlePrompt: string) => void;
  onOpenMemory: () => void;
  onOpenPersona: () => void;
  onOpenSecurity: () => void;
  onOpenImageStudio: () => void;
  onOpenAchievements?: () => void;
  onOpenSubscription?: () => void;
  onOpenModelSelector?: () => void;
  onOpenGameStudio?: () => void;
  onOpenShare?: () => void;
  accentColor?: string;
  language?: string;
  subscriptionTier?: SubscriptionTier;
  unlockedBadgesCount?: number;
  selectedModelId?: string;
}


export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAllSessions,
  onPinSession,
  onOpenPuzzleStudio,
  onSelectPuzzle,
  onOpenMemory,
  onOpenPersona,
  onOpenSecurity,
  onOpenImageStudio,
  onOpenAchievements,
  onOpenSubscription,
  onOpenModelSelector,
  onOpenGameStudio,
  onOpenShare,
  accentColor = '#06b6d4',
  language = 'en',
  subscriptionTier = 'free',
  unlockedBadgesCount = 0,
  selectedModelId = 'gemini-2.5-flash',
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  const isTurkish = language === 'tr';
  const isPro = subscriptionTier === 'pro' || subscriptionTier === 'ultra';
  const activeModel = getModelById(selectedModelId);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 sm:w-80 bg-zinc-950 border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Branding & New Chat button */}
        <div className="p-3.5 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LogoM size="sm" accentColor={accentColor} />
              <span className="font-extrabold text-sm tracking-tight text-white">
                MASTER AI
              </span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                v2.5
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => onNewSession('standard')}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-white font-medium text-xs tracking-wide shadow-md transition-all cursor-pointer active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, #6366f1)`,
              boxShadow: `0 4px 15px ${accentColor}30`,
            }}
          >
            <Plus className="w-4 h-4" />
            <span>{isTurkish ? 'Yeni Oturum Başlat' : 'New Chat Session'}</span>
          </button>
        </div>

        {/* Pro Plan Banner - Unlocked by achievements */}
        <div className="px-3.5 pt-3">
          <div
            onClick={onOpenSubscription}
            className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex items-center justify-between gap-2.5 ${
              isPro
                ? 'bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border-amber-500/30'
                : 'bg-zinc-900/80 hover:bg-zinc-900 border-amber-500/30 hover:border-amber-500/60 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {isPro
                      ? (isTurkish ? 'Pro Paket Aktif' : 'Pro Active')
                      : (isTurkish ? 'Pro Paket (3 Rozet)' : 'Pro Tier (3 Badges)')}
                  </span>
                  {!isPro && (
                    <span className="text-[9px] font-bold px-1 rounded bg-amber-400 text-zinc-950">
                      3 ROZET
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400">
                  {isPro
                    ? (isTurkish ? 'Tüm GPT & Claude açık' : 'All GPT & Claude models')
                    : (isTurkish ? '3 Başarım ile ücretsiz açılır' : 'Unlocks at 3 badges')}
                </p>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-bold shrink-0">➔</span>
          </div>
        </div>


        {/* Search Session Bar */}
        <div className="px-3.5 py-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3" />
            <input
              type="text"
              placeholder={isTurkish ? 'Sohbet veya bulmaca ara...' : 'Search chats or puzzles...'}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-white/20"
            />
          </div>
        </div>

        {/* Quick Launch Tools */}
        <div className="px-3.5 py-1 space-y-1">
          <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 py-0.5">
            {isTurkish ? 'Özel Modlar & Araçlar' : 'Modes & Studio Tools'}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {/* AI Model Selector */}
            <button
              onClick={onOpenModelSelector}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 text-left transition-colors text-xs text-zinc-300 cursor-pointer col-span-2"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate flex-1 font-medium">{activeModel.name}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                {activeModel.badge}
              </span>
            </button>

            {/* HTML5 Game Studio Button */}
            {onOpenGameStudio && (
              <button
                onClick={onOpenGameStudio}
                className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-left transition-colors text-xs text-emerald-300 cursor-pointer col-span-2"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate flex-1 font-semibold">{isTurkish ? 'HTML5 Oyun Stüdyosu' : 'HTML5 Game Studio'}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  Oyna
                </span>
              </button>
            )}

            <button
              onClick={() => onNewSession('deep-logic')}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 text-left transition-colors text-xs text-zinc-300 cursor-pointer"
            >
              <Puzzle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{isTurkish ? 'Mantık Modu' : 'Logic Mode'}</span>
            </button>
            <button
              onClick={() => onNewSession('google-search')}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 text-left transition-colors text-xs text-zinc-300 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{isTurkish ? 'Web Analizi' : 'Web Search'}</span>
            </button>
            <button
              onClick={onOpenImageStudio}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 text-left transition-colors text-xs text-zinc-300 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="truncate">{isTurkish ? 'Görsel Stüdyo' : 'Image Studio'}</span>
            </button>
            <button
              onClick={onOpenPuzzleStudio}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 text-left transition-colors text-xs text-zinc-300 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{isTurkish ? 'Bulmaca Kütüphanesi' : 'Puzzle Lab'}</span>
            </button>
          </div>
        </div>


        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3.5 py-2 space-y-1 scrollbar-thin">
          <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 py-1">
            <span>{isTurkish ? 'Sohbet Geçmişi' : 'Chat History'}</span>
            {sessions.length > 1 && onClearAllSessions && (
              <button
                onClick={onClearAllSessions}
                className="text-zinc-500 hover:text-red-400 transition-colors cursor-pointer text-[10px]"
                title={isTurkish ? 'Tüm sohbetleri sil' : 'Delete all chats'}
              >
                {isTurkish ? 'Tümünü Sil' : 'Clear All'}
              </button>
            )}
          </div>

          {filteredSessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white font-medium border border-white/10 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
                style={{
                  borderLeftColor: isActive ? accentColor : undefined,
                  borderLeftWidth: isActive ? '3px' : undefined,
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MessageSquare
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: isActive ? accentColor : undefined }}
                  />
                  <span className="truncate">{session.title || (isTurkish ? 'İsimsiz Sohbet' : 'Untitled Chat')}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPinSession(session.id);
                    }}
                    className={`p-1 rounded hover:bg-white/10 ${
                      session.pinned ? 'text-amber-400 opacity-100' : 'text-zinc-500'
                    }`}
                    title={session.pinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400"
                      title={isTurkish ? 'Sohbeti Sil' : 'Delete session'}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredSessions.length === 0 && (
            <div className="text-center py-6 text-zinc-600 text-xs">
              {isTurkish ? 'Kayıtlı sohbet bulunamadı' : 'No chats found'}
            </div>
          )}

          {/* Quick Classic Puzzles Teaser */}
          <div className="pt-3 border-t border-white/5">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>{isTurkish ? 'Klasik Bulmacalar' : 'Classic Puzzles'}</span>
              <button
                onClick={onOpenPuzzleStudio}
                className="hover:underline capitalize cursor-pointer text-[10px]"
                style={{ color: accentColor }}
              >
                {isTurkish ? 'Tümü' : 'All'}
              </button>
            </div>
            <div className="space-y-1 mt-1">
              {CLASSIC_LOGIC_PUZZLES.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPuzzle(p.prompt)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-zinc-900 text-[11px] text-zinc-400 hover:text-white truncate transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span className="truncate">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Profile & System Settings */}
        <div className="p-3 border-t border-white/10 bg-zinc-950/90 space-y-1 text-xs">
          {/* Achievements Button */}
          {onOpenAchievements && (
            <button
              onClick={onOpenAchievements}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-white">
                  {isTurkish ? 'Başarı Rozetleri' : 'Achievement Badges'}
                </span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">
                {unlockedBadgesCount} / 12
              </span>
            </button>
          )}

          <button
            onClick={onOpenMemory}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>{isTurkish ? 'Öğrenen Bellek Matrisi' : 'Adaptive Memory Matrix'}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">
              {isTurkish ? 'Canlı' : 'Live'}
            </span>
          </button>

          <button
            onClick={onOpenPersona}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" style={{ color: accentColor }} />
              <span>{isTurkish ? 'Yapay Zekayı Özelleştir' : 'Customize Persona'}</span>
            </div>
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: accentColor }}
            />
          </button>

          <button
            onClick={onOpenSecurity}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 text-zinc-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: accentColor }} />
              <span>{isTurkish ? 'Uçtan Uca Şifreleme' : 'E2E Encryption Vault'}</span>
            </div>
            <Lock className="w-3 h-3 text-zinc-500" />
          </button>

          {/* Share & Game Jolt Guide Button */}
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-900 text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span className="font-medium">{isTurkish ? 'Paylaş & Game Jolt' : 'Share & Game Jolt'}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-semibold">
                Link
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

