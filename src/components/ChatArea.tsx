import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ExternalLink,
  Download,
  Search,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Share2,
  WifiOff,
  Lightbulb,
  Trash2,
  ArrowDown
} from 'lucide-react';
import { Message, UserPersona } from '../types.ts';
import { LogoM } from './LogoM.tsx';
import { getModelById } from '../utils/aiModels.ts';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  activeMode: string;
  onSelectPrompt: (prompt: string) => void;
  persona: UserPersona;
  onOpenImageStudio: () => void;
  onOpenPuzzleStudio: () => void;
  onPlayTTS: (text: string, id: string) => void;
  onDeleteMessage?: (id: string) => void;
  onClearChat?: () => void;
  playingAudioId: string | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  activeMode,
  onSelectPrompt,
  persona,
  onOpenImageStudio,
  onOpenPuzzleStudio,
  onPlayTTS,
  onDeleteMessage,
  onClearChat,
  playingAudioId,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Record<string, boolean>>({});
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const accent = persona.accentColor || '#06b6d4';
  const isTurkish = persona.language === 'tr';
  const currentModel = getModelById(persona.selectedModel || 'gemini-2.5-flash');

  // AUTO-SCROLL TO BOTTOM ON MESSAGES / LOADING UPDATE
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };

  useEffect(() => {
    // Whenever messages change or AI finishes/starts loading, immediately scroll to bottom
    scrollToBottom('smooth');
  }, [messages.length, isLoading, messages[messages.length - 1]?.content]);

  // Track if user scrolled away from bottom to show floating scroll-down pill
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 160);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  // Welcome Screen when no messages exist
  if (messages.length === 0) {
    return (
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-center max-w-4xl mx-auto w-full scrollbar-thin"
      >
        <div className="text-center space-y-4 mb-8">
          {/* CAPITAL 'M' LOGO */}
          <div className="inline-flex">
            <LogoM size="xl" accentColor={accent} animate />
          </div>

          <div className="space-y-2">
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, #ffffff, ${accent}, #a5b4fc)`,
              }}
            >
              {isTurkish
                ? `Selam ${persona.userName || 'Dostum'}! Ben ${persona.aiName || 'MASTER AI'} ⚡`
                : `Hello ${persona.userName || 'Friend'}! I am ${persona.aiName || 'MASTER AI'} ⚡`}
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              {isTurkish
                ? 'Kafana ne takıldıysa rahatça sor! İster iki lafın belini kıralım, ister en zorlu mantık bulmacalarını beraber tereyağından kıl çeker gibi çözelim. Bugün ne yapıyoruz?'
                : 'Ask anything freely! From high-level logic deductions and code architecture to friendly daily brainstorming. Ready to dive in?'}
            </p>
          </div>

          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs"
            style={{
              backgroundColor: `${accent}15`,
              borderColor: `${accent}35`,
              color: accent,
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {isTurkish
                ? 'Tüm oturumlar uçtan uca AES-256 şifreli ve çevrimdışı çalışmaya hazır'
                : 'End-to-end AES-256 encrypted & offline reasoning ready'}
            </span>
          </div>
        </div>

        {/* Feature Suggestion Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <button
            onClick={() =>
              onSelectPrompt(
                isTurkish
                  ? 'Bana meşhur Einstein/Zebra mantık bulmacasını adım adım çöz: 5 farklı renkte ev, 5 milliyet, 5 içecek ve 5 evcil hayvan var. Balığı kimin beslediğini hipotezler ve çelişki elemesiyle kanıtla.'
                  : 'Solve the famous Einstein Zebra Puzzle step-by-step: 5 houses of different colors, 5 nationalities, 5 beverages, 5 pets. Prove who keeps the fish using contradiction elimination.'
              )
            }
            className="group p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-indigo-500/40 text-left transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                {isTurkish ? 'Mantık Bulmacası' : 'Logic Puzzle'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <p className="text-xs text-zinc-300 font-medium line-clamp-2">
              {isTurkish
                ? 'Einstein Zebra Bulmacası: 5 ev, 5 renk, balığı kim besliyor?'
                : 'Einstein Zebra Riddle: 5 houses, 5 pets, who owns the fish?'}
            </p>
          </button>

          <button
            onClick={() =>
              onSelectPrompt(
                isTurkish
                  ? 'Selam kanka! Keyifler nasıl, bugün bana kodlama ve yaratıcı projelerimde nasıl destek olabilirsin? Havalı bir özet geç bakalım.'
                  : 'Hey there! How are you doing today? Give me a cool, friendly overview of how you can assist my coding, reasoning, and visual projects!'
              )
            }
            className="group p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-cyan-500/40 text-left transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {isTurkish ? 'Samimi Tanışma' : 'Quick Chat'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <p className="text-xs text-zinc-300 font-medium line-clamp-2">
              {isTurkish
                ? 'Selam kanka! Neler yapabilirsin bana özel ve şekilli anlat.'
                : 'Hey! Tell me what you can do in a stylish, structured overview.'}
            </p>
          </button>

          <button
            onClick={() =>
              onSelectPrompt(
                isTurkish
                  ? 'Ada ve Doğrucular/Yalancılar problemi: A ve B adında iki kişi var. A diyor ki: "İkimiz de yalancıyız." A ve B kimdir? Adım adım ispatla.'
                  : 'Knights and Knaves Island: Person A says "We are both liars." Determine if A and B are knights or knaves step-by-step.'
              )
            }
            className="group p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-purple-500/40 text-left transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                {isTurkish ? 'Doğrucu & Yalancı Çözümü' : 'Knights & Knaves'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <p className="text-xs text-zinc-300 font-medium line-clamp-2">
              {isTurkish
                ? 'Doğrucu ve Yalancı Paradoksu: Mantıksal çıkarım ve çelişki testi.'
                : 'Knights and Knaves Paradox: Deductive inference test.'}
            </p>
          </button>

          <button
            onClick={() =>
              onSelectPrompt(
                isTurkish
                  ? 'Bugün yapay zeka ve kuantum bilgisayar dünyasında yaşanan en son teknolojik gelişmeleri Google ile araştır ve analiz et.'
                  : 'Search and analyze the latest breakthrough developments in quantum computing and AI today.'
              )
            }
            className="group p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-emerald-500/40 text-left transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                {isTurkish ? 'Web Trend Analizi' : 'Web Trend Analysis'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
            </div>
            <p className="text-xs text-zinc-300 font-medium line-clamp-2">
              {isTurkish
                ? 'Google Arama Araçları ile en güncel küresel haberleri tara.'
                : 'Scan global trends with Google Search Grounding.'}
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Active Chat Messages View
  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-5 max-w-4xl mx-auto w-full scrollbar-thin relative"
    >
      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={() => scrollToBottom('smooth')}
          className="fixed bottom-24 right-6 sm:right-10 z-30 p-2.5 rounded-full bg-zinc-900/90 border border-white/20 text-white shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium backdrop-blur-md"
          style={{ borderColor: accent }}
        >
          <ArrowDown className="w-4 h-4" style={{ color: accent }} />
          <span className="hidden sm:inline">{isTurkish ? 'En Aşağı Kaydır' : 'Scroll Down'}</span>
        </button>
      )}

      {/* Top Session Action Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-300">
            {messages.length} {isTurkish ? 'mesaj' : 'messages'}
          </span>
          <span>•</span>
          <span className="text-zinc-500 flex items-center gap-1">
            <span>{currentModel.icon}</span>
            <span>{currentModel.name}</span>
          </span>
        </div>

        {onClearChat && (
          <button
            onClick={onClearChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all cursor-pointer text-xs"
            title={isTurkish ? 'Bu sohbeti temizle' : 'Clear chat'}
          >
            <Trash2 className="w-3 h-3" />
            <span>{isTurkish ? 'Sohbeti Temizle' : 'Clear Chat'}</span>
          </button>
        )}
      </div>

      {messages.map((message) => {
        const isUser = message.role === 'user';
        const isExpanded = expandedThinking[message.id] ?? true;
        const isPlaying = playingAudioId === message.id;

        return (
          <div
            key={message.id}
            className={`group relative flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
          >
            {/* Header info */}
            <div className="flex items-center gap-2 px-1 text-xs text-zinc-500">
              {/* Monogram for model */}
              {!isUser && (
                <LogoM size="xs" accentColor={accent} className="shrink-0" />
              )}

              <span className="font-semibold text-zinc-300">
                {isUser ? persona.userName || (isTurkish ? 'Siz' : 'You') : persona.aiName || 'MASTER AI'}
              </span>

              {!isUser && message.model && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                  {message.model}
                </span>
              )}

              {message.isOffline && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <WifiOff className="w-2.5 h-2.5" />
                  {isTurkish ? 'Çevrimdışı' : 'Offline'}
                </span>
              )}

              <span className="text-[10px] text-zinc-500">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>

              {/* Individual Message Delete Button */}
              {onDeleteMessage && (
                <button
                  onClick={() => onDeleteMessage(message.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                  title={isTurkish ? 'Bu mesajı sil' : 'Delete message'}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Bubble / Container */}
            <div
              className={`w-full rounded-2xl p-4 sm:p-5 transition-all text-sm leading-relaxed ${
                isUser
                  ? 'max-w-2xl text-zinc-100 self-end shadow-sm'
                  : 'bg-zinc-900/85 border border-white/5 text-zinc-200'
              }`}
              style={
                isUser
                  ? {
                      background: `linear-gradient(135deg, ${accent}25, rgba(99, 102, 241, 0.2))`,
                      borderColor: `${accent}40`,
                      borderWidth: '1px',
                    }
                  : undefined
              }
            >
              {/* Thinking / Chain of Thought Accordion */}
              {!isUser && message.thinking && (
                <div
                  className="mb-4 rounded-xl border bg-zinc-950/40 overflow-hidden"
                  style={{ borderColor: `${accent}30` }}
                >
                  <button
                    onClick={() => toggleThinking(message.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                    style={{ color: accent }}
                  >
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 animate-pulse" style={{ color: accent }} />
                      <span>{isTurkish ? 'Akıl Yürütme Süreci (Chain of Thought)' : 'Chain of Thought Reasoning'}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" style={{ color: accent }} />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" style={{ color: accent }} />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 py-3 border-t border-white/5 bg-zinc-950/70 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto scrollbar-thin">
                      {message.thinking}
                    </div>
                  )}
                </div>
              )}

              {/* Main Content Render */}
              <div className="prose prose-invert max-w-none text-zinc-200 text-sm whitespace-pre-wrap break-words">
                {message.content}
              </div>

              {/* Generated Images Preview */}
              {message.images && message.images.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {message.images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative rounded-xl overflow-hidden border border-white/10 bg-zinc-950"
                    >
                      <img
                        src={img.url}
                        alt={img.originalPrompt}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                        <p className="text-xs text-zinc-200 font-medium line-clamp-2">
                          {img.enhancedPrompt}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-[10px] text-zinc-400">
                          <span>{img.style}</span>
                          <a
                            href={img.url}
                            download="master-ai-art.jpg"
                            className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Web Search Grounding Citations */}
              {!isUser && message.webSources && message.webSources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isTurkish ? 'Doğrulanmış Kaynaklar (Google Search)' : 'Verified Sources (Google Search)'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.webSources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-950/60 border border-white/10 hover:border-cyan-400/40 text-[11px] text-zinc-300 hover:text-cyan-300 transition-colors"
                      >
                        <span className="truncate max-w-[200px]">{source.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Bottom Action Bar */}
              {!isUser && (
                <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    {/* TTS Read Aloud */}
                    <button
                      onClick={() => onPlayTTS(message.content, message.id)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
                        isPlaying
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title={isPlaying ? 'Durdur' : 'Sesli Dinle'}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                          <span className="text-cyan-400">{isTurkish ? 'Durdur' : 'Stop'}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{isTurkish ? 'Sesli Dinle' : 'Listen'}</span>
                        </>
                      )}
                    </button>

                    {/* Copy Content */}
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                      title="Metni Kopyala"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">{isTurkish ? 'Kopyalandı' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isTurkish ? 'Kopyala' : 'Copy'}</span>
                        </>
                      )}
                    </button>

                    {/* Delete Message Button */}
                    {onDeleteMessage && (
                      <button
                        onClick={() => onDeleteMessage(message.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Bu mesajı sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isTurkish ? 'Sil' : 'Delete'}</span>
                      </button>
                    )}
                  </div>

                  <div className="text-[10px] text-zinc-600 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-zinc-500" />
                    <span>{isTurkish ? 'Şifreli Kayıt' : 'Encrypted'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading state indicator with Capital 'M' logo & animated wave */}
      {isLoading && (
        <div className="flex flex-col items-start space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 px-1 text-xs text-zinc-500">
            <LogoM size="xs" accentColor={accent} animate />
            <span className="font-semibold" style={{ color: accent }}>
              {persona.aiName || 'MASTER AI'}
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              ({currentModel.name})
            </span>
          </div>

          <div className="w-full max-w-xl rounded-2xl p-4 bg-zinc-900/90 border border-white/10 flex items-center gap-3.5 shadow-lg">
            <LogoM size="sm" accentColor={accent} animate />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-200">
                  {activeMode === 'deep-logic'
                    ? (isTurkish ? 'Hipotezler ve mantık ağacı taranıyor...' : 'Synthesizing hypotheses and deduction tree...')
                    : activeMode === 'google-search'
                    ? (isTurkish ? 'Google ile gerçek zamanlı bilgi doğrulanıyor...' : 'Verifying real-time facts with Google Grounding...')
                    : (isTurkish ? 'Yanıt hazırlanıyor...' : 'Generating optimal response...')}
                </span>
              </div>
              <div className="flex gap-1.5 pt-0.5">
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: accent, animationDelay: '0ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: accent, animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: accent, animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target anchor to guarantee scrolling to the absolute bottom */}
      <div ref={messagesEndRef} className="h-4 w-full shrink-0" />
    </div>
  );
};
