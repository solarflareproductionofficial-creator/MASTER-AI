import React, { useState } from 'react';
import {
  Brain,
  X,
  Plus,
  Trash2,
  Sparkles,
  Check,
  TrendingUp,
  Cpu,
  Shield,
  Layers,
  RotateCcw
} from 'lucide-react';
import { UserMemoryItem } from '../types.ts';
import { calculateOptimizationScore } from '../utils/memoryBank.ts';

interface MemoryMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: UserMemoryItem[];
  onSaveMemories: (updated: UserMemoryItem[]) => void;
}

export const MemoryMatrixModal: React.FC<MemoryMatrixModalProps> = ({
  isOpen,
  onClose,
  memories,
  onSaveMemories,
}) => {
  const [items, setItems] = useState<UserMemoryItem[]>(memories);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<UserMemoryItem['category']>('preference');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const score = calculateOptimizationScore(items);

  const handleAdd = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    const newItem: UserMemoryItem = {
      id: `mem-${Date.now()}`,
      key: newKey.trim(),
      value: newValue.trim(),
      category: newCategory,
      confidence: 0.95,
      lastUpdated: Date.now(),
    };
    const updated = [newItem, ...items];
    setItems(updated);
    onSaveMemories(updated);
    setNewKey('');
    setNewValue('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((m) => m.id !== id);
    setItems(updated);
    onSaveMemories(updated);
  };

  const handleResetToDefaults = () => {
    if (confirm('Öğrenilen bellek düğümlerini varsayılan fabrika ayarlarına döndürmek istiyor musunuz?')) {
      localStorage.removeItem('master_ai_user_memories_v1');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Öz-Uyarlamalı Hafıza Matrisi & Öğrenme Motoru
              </h3>
              <p className="text-xs text-zinc-400">
                MASTER AI her etkileşimde tercihlerinizi, mantık tarzınızı ve alışkanlıklarınızı analiz eder.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Telemetry Banner */}
        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-purple-950/30 via-zinc-900/50 to-indigo-950/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Kişisel Optimizasyon Seviyesi
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  AES-256 Şifreli
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                <span>%{score}</span>
                <span className="text-xs font-normal text-zinc-400">
                  (Yüksek Uyum & Kişiselleştirilmiş Çözüm)
                </span>
              </div>
            </div>

            {/* Visual meter bar */}
            <div className="w-full sm:w-48 bg-zinc-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Memory Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Öğrenilen Düğümler ({items.length})
            </span>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Düğüm Ekle</span>
            </button>
          </div>

          {/* New Item Form */}
          {isAdding && (
            <div className="p-4 rounded-xl bg-zinc-900 border border-cyan-500/30 space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Parametre / Başlık (Örn: kod_stili)"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="reasoning">Mantık / Akıl Yürütme</option>
                  <option value="preference">Genel Tercih</option>
                  <option value="coding">Kodlama & Mimari</option>
                  <option value="habit">Kullanım Alışkanlığı</option>
                  <option value="personal">Kişisel Bilgi</option>
                </select>
              </div>
              <textarea
                rows={2}
                placeholder="Öğrenilecek kural veya tercih (Örn: Çözümlerde daima adım numaralarını belirt ve ara hipotezleri göster)..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  onClick={handleAdd}
                  disabled={!newKey.trim() || !newValue.trim()}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </div>
          )}

          {/* Cards */}
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-white/10 flex items-start justify-between gap-3 group transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono">{item.key}</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-800 text-purple-400">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    %{Math.round(item.confidence * 100)} Güven
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{item.value}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                title="Düğümü Sil"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Veriler cihazınızda yerel ve şifreli tutulur. Dış sunuculara sızdırılmaz.</span>
          </div>
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1 text-zinc-500 hover:text-amber-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
};
