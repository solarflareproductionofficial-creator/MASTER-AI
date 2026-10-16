import {
  Sparkles,
  Lock,
  Mic,
  Cpu,
  Wifi,
  WifiOff,
  Sliders,
  ShieldCheck,
  Languages,
  Layers,
  Image as ImageIcon,
  Trash2,
  Trophy,
  Crown,
  Sun,
  Moon,
  Gamepad2,
  Share2
} from 'lucide-react';
import { UserPersona } from '../types.ts';
import { LogoM } from './LogoM.tsx';
import { getModelById } from '../utils/aiModels.ts';

interface HeaderProps {
  persona: UserPersona;
  isOnline: boolean;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  reasoningRigor: 'standard' | 'high' | 'proof';
  onChangeRigor: (rigor: 'standard' | 'high' | 'proof') => void;
  onOpenVoiceHUD: () => void;
  onOpenSecurity: () => void;
  onOpenPersona: () => void;
  onOpenMemory: () => void;
  onOpenImageStudio: () => void;
  onOpenAchievements: () => void;
  onOpenSubscription: () => void;
  onOpenModelSelector: () => void;
  onClearChat: () => void;
  hasMessages: boolean;
  optimizationScore: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  unlockedBadgesCount?: number;
  onOpenGameStudio?: () => void;
  onOpenShare?: () => void;
  onToggleThemeMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  persona,
  isOnline,
  isOfflineMode,
  onToggleOfflineMode,
  reasoningRigor,
  onChangeRigor,
  onOpenVoiceHUD,
  onOpenSecurity,
  onOpenPersona,
  onOpenMemory,
  onOpenImageStudio,
  onOpenAchievements,
  onOpenSubscription,
  onOpenModelSelector,
  onClearChat,
  hasMessages,
  optimizationScore,
  sidebarOpen,
  onToggleSidebar,
  unlockedBadgesCount = 0,
  onOpenGameStudio,
  onOpenShare,
  onToggleThemeMode,
}) => {
  const accent = persona.accentColor || '#06b6d4';
  const isTurkish = persona.language === 'tr';
  const isPro = persona.subscriptionTier === 'pro' || persona.subscriptionTier === 'ultra';
  const activeModel = getModelById(persona.selectedModel || 'gemini-2.5-flash');
  const isLight = persona.themeMode === 'light';

  return (
    <header className="h-16 border-b border-white/10 bg-zinc-950/85 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between z-20 shrink-0">
      {/* Left branding & sidebar toggle */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
          title={isTurkish ? 'Menüyü Aç/Kapat' : 'Toggle Sidebar'}
        >
          <Layers className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          {/* CAPITAL 'M' LOGO */}
          <div className="relative">
            <LogoM size="md" accentColor={accent} animate />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: accent }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: accent }}
              />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                {persona.aiName || 'MASTER AI'}
              </h1>

              {/* Subscription Tier Pill (Unlocked by achievements!) */}
              <button
                onClick={onOpenSubscription}
                className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all cursor-pointer ${
                  isPro
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-zinc-800/80 text-zinc-400 border-white/10 hover:border-amber-500/40 hover:text-amber-300'
                }`}
                title={
                  isPro
                    ? (isTurkish ? 'Pro Paket Aktif (3 Başarımla Açıldı)' : 'Pro Tier Active')
                    : (isTurkish ? '3 Başarım Rozeti ile Ücretsiz Açılır' : 'Unlocks at 3 Badges')
                }
              >
                <Crown className="w-2.5 h-2.5 text-amber-400" />
                <span>{isPro ? 'PRO' : (isTurkish ? 'PRO (3 Rozet)' : 'PRO (3 Badges)')}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 hidden sm:block truncate max-w-[180px] lg:max-w-none">
              {persona.roleTitle || (isTurkish ? 'Zeki Yol Arkadaşı & Süper Asistan' : 'Intelligent Companion & Super Assistant')}
            </p>
          </div>
        </div>
      </div>


      {/* Middle: AI Model Selector & Rigor */}
      <div className="hidden lg:flex items-center gap-2">
        {/* Model Selector Pill */}
        <button
          onClick={onOpenModelSelector}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 transition-all text-zinc-200 cursor-pointer shadow-sm group"
          title={isTurkish ? 'Yapay Zeka Modelini Değiştir' : 'Change AI Model'}
        >
          <span>{activeModel.icon}</span>
          <span className="font-bold">{activeModel.name}</span>
          <span
            className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
              activeModel.isPro
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-emerald-500/15 text-emerald-400'
            }`}
          >
            {activeModel.badge}
          </span>
        </button>

        {/* Rigor Toggles */}
        <div className="flex items-center gap-1 bg-zinc-900/90 border border-white/5 p-1 rounded-xl text-xs">
          <button
            onClick={() => onChangeRigor('standard')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              reasoningRigor === 'standard'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={isTurkish ? 'Standart akıcı yanıtlar' : 'Standard fast responses'}
          >
            ⚡ {isTurkish ? 'Standart' : 'Standard'}
          </button>
          <button
            onClick={() => onChangeRigor('high')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              reasoningRigor === 'high'
                ? 'border shadow-sm text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            style={{
              backgroundColor: reasoningRigor === 'high' ? `${accent}25` : undefined,
              borderColor: reasoningRigor === 'high' ? `${accent}50` : undefined,
              color: reasoningRigor === 'high' ? accent : undefined,
            }}
            title={isTurkish ? 'Detaylı Düşünce Süreci' : 'Chain of Thought Reasoning'}
          >
            <Sparkles className="w-3 h-3" />
            <span>{isTurkish ? 'Derin Mantık' : 'Deep Logic'}</span>
          </button>
          <button
            onClick={() => onChangeRigor('proof')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
              reasoningRigor === 'proof'
                ? 'border shadow-sm text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            style={{
              backgroundColor: reasoningRigor === 'proof' ? `${accent}25` : undefined,
              borderColor: reasoningRigor === 'proof' ? `${accent}50` : undefined,
              color: reasoningRigor === 'proof' ? accent : undefined,
            }}
            title={isTurkish ? 'Matematiksel Kesinlik ve İspat' : 'Mathematical Proof'}
          >
            <Cpu className="w-3 h-3" />
            <span>{isTurkish ? 'İspat' : 'Proof'}</span>
          </button>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Achievements / Rozetler Button */}
        <button
          onClick={onOpenAchievements}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 hover:border-amber-500/40 text-xs font-semibold text-amber-300 transition-all cursor-pointer shadow-sm group"
          title={isTurkish ? 'Başarı Rozetleri & XP' : 'Achievement Badges & XP'}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">{isTurkish ? 'Rozetler' : 'Badges'}</span>
          {unlockedBadgesCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] flex items-center justify-center font-bold">
              {unlockedBadgesCount}
            </span>
          )}
        </button>

        {/* Clear Chat Button */}
        {hasMessages && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
            title={isTurkish ? 'Mevcut Sohbeti Temizle' : 'Clear Current Chat'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isTurkish ? 'Temizle' : 'Clear'}</span>
          </button>
        )}

        {/* Offline Engine Toggle */}
        <button
          onClick={onToggleOfflineMode}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
            isOfflineMode || !isOnline
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
          }`}
          title={isOfflineMode || !isOnline ? (isTurkish ? 'Çevrimdışı Mantık Motoru devrede' : 'Offline Engine Active') : (isTurkish ? 'Çevrimiçi Gemini Bağlantısı Aktif' : 'Online AI Active')}
        >
          {isOfflineMode || !isOnline ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isTurkish ? 'Çevrimdışı' : 'Offline'}</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isTurkish ? 'Çevrimiçi' : 'Online'}</span>
            </>
          )}
        </button>

        {/* Visual Studio shortcut */}
        <button
          onClick={onOpenImageStudio}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          title={isTurkish ? 'Görsel Oluşturma Stüdyosu' : 'Visual Studio'}
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Voice Assistant HUD Button */}
        <button
          onClick={onOpenVoiceHUD}
          className="relative group p-2 rounded-lg border transition-all shadow-sm cursor-pointer"
          style={{
            backgroundColor: `${accent}20`,
            borderColor: `${accent}40`,
            color: accent,
          }}
          title={isTurkish ? 'Sesli Asistan Modu' : 'Voice Assistant HUD'}
        >
          <Mic className="w-4 h-4" />
          <span
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </button>

        {/* Self-optimization & Memory Meter */}
        <button
          onClick={onOpenMemory}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-white/10 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
          title={isTurkish ? 'Öğrenme Matrisi ve Uyum Skoru' : 'Adaptive Memory Matrix'}
        >
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>%{optimizationScore}</span>
        </button>

        {/* E2E Encryption Status Badge */}
        <button
          onClick={onOpenSecurity}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-zinc-900 border border-white/5 hover:border-white/10 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
          title={isTurkish ? 'AES-GCM 256 Şifreleme Kasası' : 'AES-GCM 256 Security Vault'}
        >
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: accent }} />
          <span className="hidden 2xl:inline text-zinc-400 text-[11px]">AES-256</span>
        </button>

        {/* HTML5 Game Studio shortcut */}
        {onOpenGameStudio && (
          <button
            onClick={onOpenGameStudio}
            className="p-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all cursor-pointer relative"
            title={isTurkish ? 'HTML5 Oyun Stüdyosu & Game Jolt' : 'HTML5 Game Studio & Game Jolt'}
          >
            <Gamepad2 className="w-4 h-4" />
          </button>
        )}

        {/* Share & Game Jolt Guide shortcut */}
        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="p-2 rounded-lg text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer"
            title={isTurkish ? 'Uygulamayı Paylaş & Game Jolt Rehberi' : 'Share App & Game Jolt Guide'}
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}

        {/* Quick Dark / White Theme Toggle */}
        {onToggleThemeMode && (
          <button
            onClick={onToggleThemeMode}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title={
              isLight
                ? (isTurkish ? 'Koyu Temaya Geç' : 'Switch to Dark Theme')
                : (isTurkish ? 'Beyaz Temaya Geç' : 'Switch to White Theme')
            }
          >
            {isLight ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        )}

        {/* Persona Customization & Theme Palette Button */}
        <button
          onClick={onOpenPersona}
          className="p-2 rounded-lg border transition-all cursor-pointer"
          style={{
            backgroundColor: `${accent}15`,
            borderColor: `${accent}35`,
            color: accent,
          }}
          title={isTurkish ? 'Tema, Dil ve Kişilik Ayarları' : 'Settings & Customization'}
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

