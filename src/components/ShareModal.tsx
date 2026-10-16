import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  Globe,
  QrCode,
  Sparkles,
  Gamepad2,
  Download,
  BookOpen,
  ArrowRight,
  Send,
  MessageCircle
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
  language?: string;
  onOpenGameStudio?: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  accentColor = '#06b6d4',
  language = 'tr',
  onOpenGameStudio,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'app' | 'gamejolt'>('gamejolt');

  if (!isOpen) return null;

  const isTurkish = language === 'tr';
  const appUrl = typeof window !== 'undefined'
    ? (window.location.origin.includes('localhost')
      ? 'https://ais-pre-odbrwhdwl7boymovfkznuq-688802734455.europe-west1.run.app'
      : window.location.href.split('?')[0])
    : 'https://ais-pre-odbrwhdwl7boymovfkznuq-688802734455.europe-west1.run.app';

  const shareText = isTurkish
    ? 'MASTER AI - Üst Seviye Zeki Yapay Zeka & HTML5 Oyun Stüdyosu! Şimdi dene:'
    : 'MASTER AI - Intelligent AI Assistant & HTML5 Game Studio! Try it now:';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-emerald-600 hover:bg-emerald-500',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${appUrl}`)}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-sky-600 hover:bg-sky-500',
      url: `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'X (Twitter)',
      icon: '𝕏',
      color: 'bg-zinc-800 hover:bg-zinc-700',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`,
    },
    {
      name: 'Reddit',
      icon: '👾',
      color: 'bg-orange-600 hover:bg-orange-500',
      url: `https://reddit.com/submit?url=${encodeURIComponent(appUrl)}&title=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Glow backdrop */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between relative z-10 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: `${accentColor}40`,
                color: accentColor,
              }}
            >
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isTurkish ? 'Paylaş & Game Jolt Yayınlama Rehberi' : 'Share & Game Jolt Publishing'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  REHBER
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                {isTurkish
                  ? 'MASTER AI uygulamasını veya HTML5 oyunlarını arkadaşlarınla ve Game Jolt topluluğuyla paylaş.'
                  : 'Share MASTER AI or export HTML5 games to the Game Jolt gaming community.'}
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

        {/* Tab Switcher */}
        <div className="px-6 py-2.5 bg-zinc-900/40 border-b border-white/5 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('gamejolt')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'gamejolt'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/15'
                : 'text-zinc-400 hover:text-white'
            }`}
            style={{
              borderColor: activeTab === 'gamejolt' ? accentColor : undefined,
              color: activeTab === 'gamejolt' ? '#ffffff' : undefined,
            }}
          >
            <Gamepad2 className="w-4 h-4 text-emerald-400" />
            <span>{isTurkish ? '🎮 Game Jolt Üzerinde Paylaşma' : '🎮 Game Jolt Publishing'}</span>
          </button>

          <button
            onClick={() => setActiveTab('app')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'app'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/15'
                : 'text-zinc-400 hover:text-white'
            }`}
            style={{
              borderColor: activeTab === 'app' ? accentColor : undefined,
              color: activeTab === 'app' ? '#ffffff' : undefined,
            }}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{isTurkish ? '🌐 Canlı Web Bağlantısı & QR' : '🌐 Web Link & QR'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin text-xs">
          {activeTab === 'gamejolt' ? (
            /* GAME JOLT STEP BY STEP GUIDE */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-zinc-900 to-zinc-900 border border-emerald-500/30">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-base">
                    GJ
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {isTurkish
                        ? 'Oyununu Game Jolt Üzerinde Nasıl Yayınlarsın?'
                        : 'How to Publish Your Game on Game Jolt?'}
                    </h4>
                    <p className="text-zinc-300 text-xs mt-1 leading-relaxed">
                      {isTurkish
                        ? 'Game Jolt, bağımsız HTML5 oyunlarını doğrudan tarayıcı üzerinden milyonlarca oyuncuya sunabileceğin dünyanın en popüler oyun platformlarından biridir.'
                        : 'Game Jolt is one of the premier platforms where you can publish HTML5 browser games for millions of indie gamers.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[11px] font-mono">
                      1
                    </span>
                    {isTurkish ? 'HTML5 Oyun Dosyanı Hazırla' : 'Prepare Your HTML5 Game File'}
                  </span>
                  {onOpenGameStudio && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenGameStudio();
                      }}
                      className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>{isTurkish ? 'Oyun Stüdyosunu Aç' : 'Open Game Studio'}</span>
                    </button>
                  )}
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {isTurkish
                    ? 'HTML5 Oyun Stüdyomuzdan istediğin oyunu seç ya da kendi kodunu yaz. Ardından "Game Jolt İçin İndir" butonuna basarak `index.html` dosyasını bilgisayarına indir.'
                    : 'Pick or code a game in the HTML5 Game Studio, then click "Export Game Jolt" to download the `index.html` file.'}
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[11px] font-mono">
                    2
                  </span>
                  {isTurkish ? 'index.html Dosyasını .ZIP Olarak Sıkıştır' : 'Compress index.html into a .ZIP Archive'}
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {isTurkish
                    ? 'Game Jolt web oyunlarını .ZIP arşivi formatında kabul eder. İndirdiğin `index.html` dosyasına sağ tıklayıp "Gönder > Sıkıştırılmış Klasör (ZIP)" (veya Mac/Linux\'ta "Compress") de. Arşivin adı örneğin `oyunum.zip` olsun. (Önemli: zip dosyasını açınca index.html doğrudan kök dizinde olmalıdır).'
                    : 'Game Jolt requires HTML5 games inside a .ZIP archive. Right-click your `index.html` and compress it to `mygame.zip`. Make sure `index.html` is at the root of the archive.'}
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px] font-mono">
                      3
                    </span>
                    {isTurkish ? 'Game Jolt\'ta Yeni Oyun Oluştur' : 'Create New Game on Game Jolt'}
                  </span>
                  <a
                    href="https://gamejolt.com/dashboard/games/add"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
                  >
                    <span>gamejolt.com/add</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <ul className="list-disc list-inside space-y-1 text-zinc-300 text-xs pl-1">
                  <li>
                    {isTurkish
                      ? 'Game Jolt Dashboard sayfasına gidin ve "Add Game" butonuna tıklayın.'
                      : 'Go to Game Jolt Dashboard and click "Add Game".'}
                  </li>
                  <li>
                    {isTurkish
                      ? 'Oyun Başlığı (Title), açıklama ve kategori (Arcade, Action, Puzzle vb.) seçin.'
                      : 'Provide title, description, and tags (HTML5, Arcade, Puzzle).'}
                  </li>
                  <li>
                    {isTurkish
                      ? '"Packages" veya "Releases" sekmesine gelin.'
                      : 'Navigate to "Packages" / "Releases".'}
                  </li>
                </ul>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[11px] font-mono">
                    4
                  </span>
                  {isTurkish ? '"Web (HTML)" Olarak Yükle & Boyut Ayarla' : 'Upload as "Web (HTML)" & Set Resolution'}
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {isTurkish
                    ? 'Oyun türü olarak "Browser / Web (HTML)" seçeneğini işaretleyin. 2. adımda oluşturduğun `oyunum.zip` dosyasını buraya yükleyin. Çözünürlük olarak oyunun boyutuna göre (örneğin 600x400, 480x520 veya Responsive) seçebilirsiniz.'
                    : 'Select "Browser / Web (HTML)" build type. Upload your `.zip` file and adjust screen dimensions (e.g. 600x400 or responsive).'}
                </p>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2">
                <span className="font-bold text-white flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-[11px] font-mono">
                    5
                  </span>
                  {isTurkish ? 'Yayınla & Canlı Bağlantıyı Paylaş!' : 'Publish & Share Live Game!'}
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {isTurkish
                    ? '"Publish Release" ve ardından "Publish Game" butonuna tıklayın. Tebrikler, oyununuz artık Game Jolt üzerinde herkes tarafından oynanabilir!'
                    : 'Click "Publish Release" and "Publish Game". Your game is now live and playable for the entire world on Game Jolt!'}
                </p>
              </div>
            </div>
          ) : (
            /* SHARE LIVE APP LINK */
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3">
                <label className="font-bold text-zinc-300 uppercase tracking-wider block text-xs">
                  {isTurkish ? 'MASTER AI Canlı Paylaşım Bağlantısı' : 'MASTER AI Live Public Link'}
                </label>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-zinc-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono truncate select-all">
                    {appUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-zinc-950 transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
                    style={{ backgroundColor: accentColor }}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-zinc-950" />
                        <span>{isTurkish ? 'Kopyalandı!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-zinc-950" />
                        <span>{isTurkish ? 'Kopyala' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Grid */}
              <div className="space-y-2">
                <label className="font-bold text-zinc-300 uppercase tracking-wider block text-xs">
                  {isTurkish ? 'Hızlı Paylaşım Seçenekleri' : 'Quick Social Share'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl ${link.color} text-white font-semibold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md`}
                    >
                      <span>{link.icon}</span>
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* QR Code Presentation */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      appUrl
                    )}`}
                    alt="App QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-white text-xs flex items-center justify-center sm:justify-start gap-1.5">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>{isTurkish ? 'Telefondan Tara & Aç' : 'Scan & Open on Mobile'}</span>
                  </h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {isTurkish
                      ? 'Kameranızla bu karekodu taratarak MASTER AI ve oyun stüdyosunu mobil cihazlarda anında açabilir ve arkadaşlarınızla paylaşabilirsiniz.'
                      : 'Scan this QR code with any smartphone camera to open and use the application on mobile immediately.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-zinc-900/60 flex items-center justify-between text-xs">
          <div className="text-zinc-500 text-[11px]">
            MASTER AI Cloud Run Preview Engine
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium cursor-pointer transition-colors"
          >
            {isTurkish ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
