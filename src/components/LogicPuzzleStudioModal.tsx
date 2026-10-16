import React, { useState } from 'react';
import {
  Puzzle,
  X,
  Sparkles,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Filter,
  Layers,
  BookOpen,
  Plus
} from 'lucide-react';
import { LogicPuzzle } from '../types.ts';
import { CLASSIC_LOGIC_PUZZLES } from '../utils/puzzlePresets.ts';

interface LogicPuzzleStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolvePuzzle: (prompt: string) => void;
}

export const LogicPuzzleStudioModal: React.FC<LogicPuzzleStudioModalProps> = ({
  isOpen,
  onClose,
  onSolvePuzzle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePuzzle, setActivePuzzle] = useState<LogicPuzzle>(CLASSIC_LOGIC_PUZZLES[0]);
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customClues, setCustomClues] = useState('');

  if (!isOpen) return null;

  const filteredPuzzles =
    selectedCategory === 'all'
      ? CLASSIC_LOGIC_PUZZLES
      : CLASSIC_LOGIC_PUZZLES.filter((p) => p.category === selectedCategory);

  const handleLaunchCustom = () => {
    if (!customClues.trim()) return;
    const prompt = `Lütfen aşağıdaki özel mantık problemini hipotez sınaması ve çelişki elemesi ile adım adım çöz:\nBaşlık: ${customTitle || 'Özel Mantık Bulmacası'}\nKısıtlar & İpuçları:\n${customClues}`;
    onSolvePuzzle(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">MASTER AI Mantık Bulmaca Stüdyosu</h3>
              <p className="text-xs text-zinc-400">
                Klasik mantık bilmeceleri, ada paradoksları ve algoritmik akıl yürütme motoru
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

        {/* Categories Bar */}
        <div className="px-6 py-2.5 border-b border-white/5 bg-zinc-900/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setShowCustomBuilder(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'all' && !showCustomBuilder
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Tümü
          </button>
          <button
            onClick={() => {
              setSelectedCategory('einstein');
              setShowCustomBuilder(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'einstein' && !showCustomBuilder
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Einstein / Zebra
          </button>
          <button
            onClick={() => {
              setSelectedCategory('knights-knaves');
              setShowCustomBuilder(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'knights-knaves' && !showCustomBuilder
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Şövalyeler & Sahtekarlar
          </button>
          <button
            onClick={() => {
              setSelectedCategory('river-crossing');
              setShowCustomBuilder(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'river-crossing' && !showCustomBuilder
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Nehir Geçişi
          </button>
          <button
            onClick={() => {
              setSelectedCategory('math');
              setShowCustomBuilder(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === 'math' && !showCustomBuilder
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Olasılık & Paradoks
          </button>
          <button
            onClick={() => setShowCustomBuilder(true)}
            className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showCustomBuilder
                ? 'bg-cyan-600 text-white'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kendi Bulmacanı Yaz</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {showCustomBuilder ? (
            /* Custom Puzzle Builder View */
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Özel Mantık Bulmacası Oluşturucu
              </h4>
              <p className="text-xs text-zinc-400">
                Kendi kurguladığınız bilmeceyi veya mantık kısıtlarını girin. MASTER AI, hipotezleri ve çelişkileri test ederek adım adım kesin sonuca ulaşacaktır.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Bulmaca Başlığı</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Örn: 3 Kardeşin Yaş Bilmecesi"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">İpuçları, Öncüller ve Kısıtlar</label>
                <textarea
                  rows={6}
                  value={customClues}
                  onChange={(e) => setCustomClues(e.target.value)}
                  placeholder="1. Ali Veli'den büyüktür.&#10;2. Can ile Ali'nin yaşları toplamı 30'dur.&#10;3. En küçük olan asla yalan söylemez..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <button
                onClick={handleLaunchCustom}
                disabled={!customClues.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-600/20 transition-all cursor-pointer disabled:opacity-40"
              >
                MASTER AI ile Adım Adım Çözüm Başlat
              </button>
            </div>
          ) : (
            /* Standard Preset Puzzles List + Inspector */
            <>
              {/* Left puzzle list */}
              <div className="w-full md:w-2/5 border-r border-white/5 overflow-y-auto p-3 space-y-1.5">
                {filteredPuzzles.map((puzzle) => {
                  const isSelected = activePuzzle.id === puzzle.id;
                  return (
                    <button
                      key={puzzle.id}
                      onClick={() => setActivePuzzle(puzzle)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/40 text-white shadow-sm'
                          : 'bg-zinc-900/40 border-white/5 hover:bg-zinc-800/60 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {puzzle.difficulty}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {puzzle.clues.length} İpucu
                        </span>
                      </div>
                      <h5 className="text-xs font-semibold">{puzzle.title}</h5>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                        {puzzle.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Right puzzle preview */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {activePuzzle.difficulty} Seviye
                    </span>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      {activePuzzle.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white">{activePuzzle.title}</h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      {activePuzzle.description}
                    </p>
                  </div>

                  {/* Clues Box */}
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-2">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                      Verilen Kısıtlar ve İpuçları:
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {activePuzzle.clues.map((clue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{clue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {activePuzzle.solutionHint && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block">Düşünce Stratejisi İpucu:</span>
                        {activePuzzle.solutionHint}
                      </div>
                    </div>
                  )}
                </div>

                {/* Launch Button */}
                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={() => {
                      onSolvePuzzle(activePuzzle.prompt);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-indigo-700 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Adım Adım Gerekçeli Çözümü Başlat</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
