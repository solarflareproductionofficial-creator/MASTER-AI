import React, { useState } from 'react';
import {
  Trophy,
  X,
  Sparkles,
  CheckCircle2,
  Lock,
  Award,
  Flame,
  Star,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AchievementBadge, UserStats } from '../types.ts';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: AchievementBadge[];
  stats: UserStats;
  accentColor?: string;
  language?: string;
  onOpenSubscription?: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  badges,
  stats,
  accentColor = '#06b6d4',
  language = 'en',
  onOpenSubscription,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const isTurkish = language === 'tr';

  const totalPoints = badges
    .filter((b) => b.unlocked)
    .reduce((sum, b) => sum + b.points, 0);

  const maxPossiblePoints = badges.reduce((sum, b) => sum + b.points, 0);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  // Calculate Level
  let level = 1;
  let levelTitle = isTurkish ? 'Çırak Zihin' : 'Apprentice Mind';
  if (totalPoints >= 1200) {
    level = 5;
    levelTitle = isTurkish ? 'Kozmik Zeka' : 'Cosmic Intelligence';
  } else if (totalPoints >= 800) {
    level = 4;
    levelTitle = isTurkish ? 'Büyük Mimar' : 'Grand Architect';
  } else if (totalPoints >= 450) {
    level = 3;
    levelTitle = isTurkish ? 'Usta Mantıkçı' : 'Master Logician';
  } else if (totalPoints >= 150) {
    level = 2;
    levelTitle = isTurkish ? 'Nöral Çırak' : 'Neural Adept';
  }

  const nextLevelThreshold =
    level === 1 ? 150 : level === 2 ? 450 : level === 3 ? 800 : level === 4 ? 1200 : 1500;
  const currentLevelBase =
    level === 1 ? 0 : level === 2 ? 150 : level === 3 ? 450 : level === 4 ? 800 : 1200;
  const levelProgress = Math.min(
    100,
    Math.round(((totalPoints - currentLevelBase) / (nextLevelThreshold - currentLevelBase)) * 100)
  );

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked' && !b.unlocked) return false;
    if (filter === 'locked' && b.unlocked) return false;
    if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div
          className="px-6 py-5 border-b border-white/10 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(24, 24, 27, 0.95), rgba(9, 9, 11, 0.98))`,
          }}
        >
          {/* Subtle glow highlight */}
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: accentColor }}
          />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl p-[1px] flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, #f59e0b, #ef4444, ${accentColor})`,
                  boxShadow: `0 0 20px rgba(245, 158, 11, 0.3)`,
                }}
              >
                <div className="w-full h-full bg-zinc-950 rounded-xl flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{isTurkish ? 'Başarı Rozetleri' : 'Achievement Badges'}</span>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      borderColor: `${accentColor}40`,
                      color: accentColor,
                    }}
                  >
                    {unlockedCount} / {badges.length} {isTurkish ? 'Kazanıldı' : 'Unlocked'}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  {isTurkish
                    ? 'Uygulamayı kullandıkça ve hedeflere ulaştıkça kilitleri aç.'
                    : 'Unlock rewards and milestones as you converse, solve puzzles, and generate content.'}
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

          {/* Level Progress Bar Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-sm shrink-0">
                Lv.{level}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{levelTitle}</span>
                  <span className="text-[11px] text-amber-400 flex items-center gap-0.5 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400" /> {totalPoints} XP
                  </span>
                </div>
                <div className="w-40 sm:w-52 h-1.5 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${levelProgress}%`,
                      background: `linear-gradient(90deg, #f59e0b, ${accentColor})`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick stats chips */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 border-t sm:border-t-0 sm:border-l border-white/5 pt-2 sm:pt-0 sm:pl-3">
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{stats.messagesCount} {isTurkish ? 'mesaj' : 'msgs'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>{stats.puzzlesSolved} {isTurkish ? 'bulmaca' : 'puzzles'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="px-6 py-2.5 border-b border-white/5 flex items-center justify-between bg-zinc-900/30 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isTurkish ? 'Tümü' : 'All'} ({badges.length})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'unlocked'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isTurkish ? 'Kazanılanlar' : 'Unlocked'} ({unlockedCount})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filter === 'locked'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isTurkish ? 'Kilitli' : 'Locked'} ({badges.length - unlockedCount})
            </button>
          </div>

          {/* Pro tier callout */}
          {onOpenSubscription && !stats.isProSubscriber && (
            <button
              onClick={onOpenSubscription}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <span>👑 Pro $4.99</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Badges Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredBadges.map((badge) => {
              const isLocked = !badge.unlocked;
              const percent = Math.min(
                100,
                Math.round((badge.progress / (badge.maxProgress || 1)) * 100)
              );

              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isLocked
                      ? 'bg-zinc-900/40 border-white/5 opacity-75 hover:opacity-90'
                      : 'bg-zinc-900/90 border-white/10 hover:border-amber-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Badge Icon Container */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border relative ${
                        isLocked
                          ? 'bg-zinc-900 border-white/5 grayscale text-zinc-500'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-sm'
                      }`}
                    >
                      <span>{badge.icon}</span>
                      {isLocked ? (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                          <Lock className="w-2.5 h-2.5 text-zinc-500" />
                        </div>
                      ) : (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Badge Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isLocked ? 'text-zinc-400' : 'text-white'
                          }`}
                        >
                          {badge.title}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${
                            isLocked
                              ? 'bg-zinc-800 text-zinc-500 border-white/5'
                              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          +{badge.points} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar & Status */}
                  <div className="mt-3 pt-2.5 border-t border-white/5">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                      <span>
                        {isLocked
                          ? isTurkish
                            ? 'İlerleme'
                            : 'Progress'
                          : isTurkish
                          ? 'Tamamlandı'
                          : 'Unlocked'}
                      </span>
                      <span className="font-mono font-medium text-zinc-400">
                        {badge.progress} / {badge.maxProgress} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: isLocked ? '#52525b' : '#10b981',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBadges.length === 0 && (
            <div className="text-center py-12 text-zinc-500 text-xs">
              {isTurkish ? 'Bu kategoride rozet bulunamadı.' : 'No badges found for this filter.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
