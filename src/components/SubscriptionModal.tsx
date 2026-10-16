import React, { useState } from 'react';
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Star,
  Award,
  ArrowRight,
  Trophy,
  Lock,
  Unlock
} from 'lucide-react';
import { SubscriptionTier, UserPersona } from '../types.ts';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  onUpgradeTier: (tier: SubscriptionTier) => void;
  accentColor?: string;
  language?: string;
  unlockedBadgesCount?: number;
  onOpenAchievements?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onUpgradeTier,
  accentColor = '#06b6d4',
  language = 'tr',
  unlockedBadgesCount = 0,
  onOpenAchievements,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCelebration, setSuccessCelebration] = useState(false);

  if (!isOpen) return null;

  const isTurkish = language === 'tr';

  // Badges requirements
  const PRO_REQUIRED_BADGES = 3;
  const ULTRA_REQUIRED_BADGES = 6;

  const canUnlockPro = unlockedBadgesCount >= PRO_REQUIRED_BADGES;
  const canUnlockUltra = unlockedBadgesCount >= ULTRA_REQUIRED_BADGES;

  const handleSelectTier = (tier: SubscriptionTier) => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpgradeTier(tier);
      setIsProcessing(false);
      setSuccessCelebration(true);
      setTimeout(() => {
        setSuccessCelebration(false);
        onClose();
      }, 1500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Glow backdrop */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between relative z-10 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl p-[1px] flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, #f59e0b, #d946ef, ${accentColor})`,
              }}
            >
              <div className="w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isTurkish ? 'Başarım Tabanlı Paketler' : 'Achievement-Unlocked Tiers'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {isTurkish ? 'Para İle Değil, Başarımla Açılır!' : 'Unlocked by Achievements!'}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                {isTurkish
                  ? 'MASTER AI paketleri para ile değil, kazandığın başarım rozetlerinin sayısına göre açılır.'
                  : 'Unlock Pro and Ultra models by completing achievements and earning badges!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badges Summary Banner */}
        <div className="py-3 px-6 bg-zinc-900/80 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-zinc-300">
              {isTurkish ? 'Mevcut Başarım Rozetlerin:' : 'Your Current Badges:'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-xs">
              🏆 {unlockedBadgesCount} {isTurkish ? 'Rozet Açıldı' : 'Badges Unlocked'}
            </span>
          </div>

          {onOpenAchievements && (
            <button
              onClick={() => {
                onClose();
                onOpenAchievements();
              }}
              className="text-xs font-semibold text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              {isTurkish ? 'Tüm Rozetleri İncele ➔' : 'View All Badges ➔'}
            </button>
          )}
        </div>

        {/* Success celebration overlay */}
        {successCelebration && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4 text-3xl animate-bounce">
              👑
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {isTurkish ? 'Tebrikler! Paket Kilidi Açıldı!' : 'Congratulations! Tier Unlocked!'}
            </h3>
            <p className="text-xs text-zinc-300 max-w-sm mb-4">
              {isTurkish
                ? 'Başarımların sayesinde yeni yapay zeka modelleri ve derin mantık yetenekleri aktif edildi.'
                : 'Your achievements unlocked powerful new AI models and reasoning capabilities.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <Award className="w-4 h-4" />
              <span>{isTurkish ? 'Paket Aktif Edildi' : 'Plan Activated'}</span>
            </div>
          </div>
        )}

        {/* Pricing Cards Grid - Achievement Driven */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 scrollbar-thin">
          {/* FREE / STARTER TIER */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              currentTier === 'free'
                ? 'bg-zinc-900/90 border-white/20'
                : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isTurkish ? 'Başlangıç Paketi' : 'Starter Tier'}
                </span>
                {currentTier === 'free' && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/10">
                    {isTurkish ? 'Mevcut Plan' : 'Current Plan'}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">0 {isTurkish ? 'Rozet' : 'Badges'}</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {isTurkish
                    ? 'Tüm kullanıcılar için her zaman açık temel seviye.'
                    : 'Open to everyone with classic reasoning.'}
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-300 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Gemini 2.5 Flash & GPT-4o Mini</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isTurkish ? 'HTML5 Oyun Stüdyosu' : 'HTML5 Game Studio'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isTurkish ? 'Çevrimdışı Mantık Motoru' : 'Offline Heuristic Solver'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AES-GCM 256 {isTurkish ? 'Kripto Kasa' : 'Crypto Vault'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectTier('free')}
              disabled={currentTier === 'free' || isProcessing}
              className={`mt-6 w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTier === 'free'
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              {currentTier === 'free'
                ? isTurkish
                  ? 'Mevcut Plan'
                  : 'Active Plan'
                : isTurkish
                ? 'Başlangıç Paketine Dön'
                : 'Select Starter'}
            </button>
          </div>

          {/* PRO TIER - UNLOCKED AT 3 ACHIEVEMENTS */}
          <div
            className={`p-5 rounded-2xl border relative flex flex-col justify-between transition-all ${
              currentTier === 'pro'
                ? 'bg-zinc-900 border-amber-500 shadow-xl'
                : 'bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-900 border-amber-500/50 shadow-lg'
            }`}
          >
            {/* Populer Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 font-black text-[10px] uppercase tracking-wider shadow">
              {isTurkish ? '🏆 3 BAŞARIM GEREKLİ' : '🏆 3 BADGES NEEDED'}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-4 h-4" />
                  <span>{isTurkish ? 'Pro Paket' : 'Pro Tier'}</span>
                </span>
                {currentTier === 'pro' && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {isTurkish ? 'Aktif' : 'Active'}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">3 {isTurkish ? 'Başarım Rozeti' : 'Badges'}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{isTurkish ? 'İlerleme:' : 'Progress:'}</span>
                  <span className="font-bold text-amber-400">{unlockedBadgesCount} / {PRO_REQUIRED_BADGES}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-zinc-800 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (unlockedBadgesCount / PRO_REQUIRED_BADGES) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-200 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white">
                    GPT-4o, Claude 3.5 & DeepSeek-R1
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isTurkish ? 'Sınırsız Derin Mantık & İspat' : 'Unlimited Deep Logic'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isTurkish ? 'Sınırsız 4K Görsel Stüdyosu' : 'Unlimited 4K Image Studio'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isTurkish ? 'HTML5 Oyun Yapım & Game Jolt Dışa Aktarma' : 'HTML5 Game Studio & Game Jolt Export'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-300 font-medium">
                    👑 {isTurkish ? '"Pro Master" Rozeti (+500 XP)' : '"Pro Master" Badge (+500 XP)'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectTier('pro')}
              disabled={!canUnlockPro || currentTier === 'pro' || isProcessing}
              className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                currentTier === 'pro'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-not-allowed'
                  : canUnlockPro
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-zinc-950 hover:brightness-110 active:scale-[0.98]'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {currentTier === 'pro' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isTurkish ? 'Pro Paket Aktif' : 'Pro Tier Active'}</span>
                </>
              ) : canUnlockPro ? (
                <>
                  <Unlock className="w-4 h-4 text-zinc-950" />
                  <span>{isTurkish ? 'Pro Paket Kilidini Aç' : 'Unlock Pro Tier'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-zinc-500" />
                  <span>{isTurkish ? `${PRO_REQUIRED_BADGES - unlockedBadgesCount} Başarım Daha Gerekli` : `${PRO_REQUIRED_BADGES - unlockedBadgesCount} More Badges Needed`}</span>
                </>
              )}
            </button>
          </div>

          {/* ULTRA TIER - UNLOCKED AT 6 ACHIEVEMENTS */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
              currentTier === 'ultra'
                ? 'bg-zinc-900/90 border-purple-500 shadow-xl'
                : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  <span>{isTurkish ? 'Ultra Master' : 'Ultra Master'}</span>
                </span>
                {currentTier === 'ultra' && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {isTurkish ? 'Aktif' : 'Active'}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white">6 {isTurkish ? 'Başarım Rozeti' : 'Badges'}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{isTurkish ? 'İlerleme:' : 'Progress:'}</span>
                  <span className="font-bold text-purple-400">{unlockedBadgesCount} / {ULTRA_REQUIRED_BADGES}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-zinc-800 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (unlockedBadgesCount / ULTRA_REQUIRED_BADGES) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-zinc-300 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isTurkish ? 'Tüm Pro Özellikleri Dahil' : 'All Pro Features Included'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isTurkish ? 'Özel Nöral Hafıza Matrisi' : 'Custom Neural Weights & Matrix'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isTurkish ? 'Sıfır Gecikmeli Canlı Yanıtlar' : 'Zero-Latency Priority Stream'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{isTurkish ? 'Özel API Entegrasyon Anahtarları' : 'Dedicated API Integration Keys'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectTier('ultra')}
              disabled={!canUnlockUltra || currentTier === 'ultra' || isProcessing}
              className={`mt-6 w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                currentTier === 'ultra'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-not-allowed'
                  : canUnlockUltra
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 active:scale-95 shadow-md'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {currentTier === 'ultra' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isTurkish ? 'Ultra Aktif' : 'Ultra Active'}</span>
                </>
              ) : canUnlockUltra ? (
                <>
                  <Unlock className="w-4 h-4 text-white" />
                  <span>{isTurkish ? 'Ultra Paket Kilidini Aç' : 'Unlock Ultra Tier'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-zinc-500" />
                  <span>{isTurkish ? `${ULTRA_REQUIRED_BADGES - unlockedBadgesCount} Başarım Daha Gerekli` : `${ULTRA_REQUIRED_BADGES - unlockedBadgesCount} More Badges Needed`}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
