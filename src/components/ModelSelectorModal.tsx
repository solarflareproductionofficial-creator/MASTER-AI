import React from 'react';
import {
  Cpu,
  X,
  Sparkles,
  Check,
  Lock,
  Crown,
  Zap,
  Info,
  ArrowRight
} from 'lucide-react';
import { AVAILABLE_AI_MODELS } from '../utils/aiModels.ts';
import { SubscriptionTier, AIModelChoice } from '../types.ts';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  subscriptionTier: SubscriptionTier;
  onOpenSubscription: () => void;
  accentColor?: string;
  language?: string;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedModelId,
  onSelectModel,
  subscriptionTier,
  onOpenSubscription,
  accentColor = '#06b6d4',
  language = 'en',
}) => {
  if (!isOpen) return null;

  const isTurkish = language === 'tr';
  const isProUser = subscriptionTier === 'pro' || subscriptionTier === 'ultra';

  const handlePickModel = (model: AIModelChoice) => {
    if (model.isPro && !isProUser) {
      onOpenSubscription();
      return;
    }
    onSelectModel(model.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl border transition-colors"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isTurkish ? 'Yapay Zeka Modeli Seç' : 'Select AI Model'}</span>
                {isProUser && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    👑 PRO UNLOCKED
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-400">
                {isTurkish
                  ? 'İhtiyacına uygun zeka modelini seç. GPT-4o, Claude veya DeepSeek-R1.'
                  : 'Choose the optimal intelligence model for coding, logic puzzles, or omni reasoning.'}
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

        {/* Pro Banner if user on free tier */}
        {!isProUser && (
          <div className="px-6 py-3 bg-gradient-to-r from-amber-500/10 via-amber-600/10 to-transparent border-b border-amber-500/20 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-zinc-300">
                {isTurkish
                  ? 'GPT-4o ve Claude modelleri Pro pakette aktiftir ($4.99/ay).'
                  : 'GPT-4o, Claude 3.5 & DeepSeek-R1 are included with Pro ($4.99/mo).'}
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenSubscription();
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-amber-950 bg-amber-400 hover:bg-amber-300 transition-all shrink-0 cursor-pointer shadow"
            >
              {isTurkish ? 'Pro\'ya Geç' : 'Get Pro $4.99'}
            </button>
          </div>
        )}

        {/* Model List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 scrollbar-thin">
          {AVAILABLE_AI_MODELS.map((model) => {
            const isSelected = selectedModelId === model.id;
            const isLocked = model.isPro && !isProUser;

            return (
              <div
                key={model.id}
                onClick={() => handlePickModel(model)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 relative ${
                  isSelected
                    ? 'bg-zinc-900 border-white/20 shadow-md ring-1'
                    : isLocked
                    ? 'bg-zinc-900/40 border-white/5 opacity-80 hover:opacity-100'
                    : 'bg-zinc-900/60 border-white/5 hover:border-white/10 hover:bg-zinc-800/60'
                }`}
                style={{
                  borderColor: isSelected ? accentColor : undefined,
                  boxShadow: isSelected ? `0 0 15px ${accentColor}25` : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                      isSelected
                        ? 'border-transparent'
                        : 'border-white/5 bg-zinc-950 text-zinc-300'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: `${accentColor}20`,
                            color: accentColor,
                          }
                        : undefined
                    }
                  >
                    <span>{model.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{model.name}</h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                          model.isPro
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                      {model.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isSelected && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: accentColor }}
                    >
                      <Check className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />
                    </div>
                  )}

                  {!isSelected && isLocked && (
                    <div className="p-1.5 rounded-lg bg-zinc-800/80 border border-white/5 text-zinc-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
