import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  X,
  Download,
  Copy,
  Check,
  Send,
  Wand2,
  Maximize2
} from 'lucide-react';
import { GeneratedImage } from '../types.ts';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendImageToChat: (image: GeneratedImage) => void;
}

const STYLES = [
  { id: 'cinematic', label: 'Sinematik Fotogerçekçi' },
  { id: 'cyberpunk', label: 'Neon Cyberpunk' },
  { id: '3d-render', label: '3D Render / Unreal Engine 5' },
  { id: 'anime', label: 'Anime / Shinkai Stili' },
  { id: 'blueprint', label: 'Teknik Mimari Blueprint' },
  { id: 'fantasy', label: 'Epik Karanlık Fantastik' },
];

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  onSendImageToChat,
}) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cinematic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, aspectRatio }),
      });

      if (!res.ok) throw new Error('Görsel oluşturulamadı');

      const data = await res.json();
      const newImg: GeneratedImage = {
        url: data.imageUrl,
        enhancedPrompt: data.enhancedPrompt,
        originalPrompt: prompt,
        aspectRatio,
        style,
        timestamp: Date.now(),
      };

      setCurrentImage(newImg);
      setHistory((prev) => [newImg, ...prev]);
    } catch (err) {
      console.error(err);
      alert('Görsel oluşturulurken bir hata oluştu.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-500/30">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">MASTER AI Görsel Stüdyosu</h3>
              <p className="text-xs text-zinc-400">
                Projeleriniz ve konseptleriniz için üst düzey görsel ve illüstrasyon üretimi
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

        {/* Studio Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Controls */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto space-y-4 border-r border-white/5 text-xs">
            {/* Prompt input */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Görsel Açıklaması (Prompt)</label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Örn: Geleceğin kuantum süper bilgisayar odası, parıldayan optik devreler, holografik veri akışı..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-500 text-xs"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setPrompt('Fütüristik kuantum yapay zeka çekirdeği, neon nöron hatları')}
                className="px-2 py-1 rounded-md bg-zinc-900 text-zinc-400 hover:text-white text-[10px]"
              >
                + Kuantum Çekirdek
              </button>
              <button
                onClick={() => setPrompt('Karanlık odada parlayan satranç tahtası ve altın mantık taşları')}
                className="px-2 py-1 rounded-md bg-zinc-900 text-zinc-400 hover:text-white text-[10px]"
              >
                + Mantık Satrancı
              </button>
              <button
                onClick={() => setPrompt('Sibernetik siber dedektif, holografik veri ekranlarını inceliyor')}
                className="px-2 py-1 rounded-md bg-zinc-900 text-zinc-400 hover:text-white text-[10px]"
              >
                + Siber Dedektif
              </button>
            </div>

            {/* Style Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">Sanat & Render Stili</label>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    className={`p-2 rounded-lg border text-left transition-colors ${
                      style === s.id
                        ? 'bg-fuchsia-950/40 border-fuchsia-500/50 text-fuchsia-200'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-300">En-Boy Oranı</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['1:1', '16:9', '9:16', '4:3'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`p-2 rounded-lg border text-center font-medium transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-zinc-800 border-white/30 text-white'
                        : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-fuchsia-600/20 transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Görsel Sentezleniyor...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>MASTER AI ile Görsel Oluştur</span>
                </>
              )}
            </button>
          </div>

          {/* Right Image Display */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center bg-zinc-950/60 overflow-y-auto">
            {currentImage ? (
              <div className="w-full max-w-md space-y-3 animate-fade-in">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                  <img
                    src={currentImage.url}
                    alt={currentImage.originalPrompt}
                    className="w-full object-contain max-h-[380px]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                    Optimize Edilen Prompt:
                  </span>
                  <p className="text-[11px] text-zinc-300 font-mono line-clamp-2">
                    {currentImage.enhancedPrompt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={currentImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="master_ai_visual.png"
                    className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>İndir (HD)</span>
                  </a>

                  <button
                    onClick={() => {
                      onSendImageToChat(currentImage);
                      onClose();
                    }}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Sohbete Ekle</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 p-8 text-zinc-600">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-xs text-zinc-400">
                  Sol panelden bir açıklama girin ve stil seçerek görsel oluşturun.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
