import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Globe,
  Cpu,
  Image as ImageIcon,
  Puzzle,
  Command,
  HelpCircle,
  WifiOff,
  ChevronUp
} from 'lucide-react';
import { getModelById } from '../utils/aiModels.ts';

interface InputBarProps {
  onSendMessage: (text: string, options?: { mode?: 'standard' | 'deep-logic' | 'google-search' }) => void;
  isLoading: boolean;
  activeMode: 'standard' | 'deep-logic' | 'google-search' | 'code-architect';
  onToggleMode: (mode: 'standard' | 'deep-logic' | 'google-search') => void;
  onOpenImageStudio: () => void;
  onOpenPuzzleStudio: () => void;
  onOpenModelSelector?: () => void;
  isOfflineMode: boolean;
  accentColor?: string;
  language?: string;
  selectedModelId?: string;
}

export const InputBar: React.FC<InputBarProps> = ({
  onSendMessage,
  isLoading,
  activeMode,
  onToggleMode,
  onOpenImageStudio,
  onOpenPuzzleStudio,
  onOpenModelSelector,
  isOfflineMode,
  accentColor = '#06b6d4',
  language = 'en',
  selectedModelId = 'gemini-2.5-flash',
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const isTurkish = language === 'tr';
  const activeModel = getModelById(selectedModelId);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isTurkish ? 'tr-TR' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isTurkish]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(
        isTurkish
          ? 'Tarayıcınızda ses tanıma (Web Speech API) desteklenmiyor veya mikrofon izni verilmedi.'
          : 'Speech recognition is not supported in this browser or microphone permission was denied.'
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech error:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!text.trim() || isLoading) return;

    const trimmed = text.trim();

    // Check slash commands
    if (trimmed.startsWith('/image')) {
      onOpenImageStudio();
      setText('');
      setShowCommands(false);
      return;
    }

    if (trimmed.startsWith('/puzzle')) {
      onOpenPuzzleStudio();
      setText('');
      setShowCommands(false);
      return;
    }

    if (trimmed.startsWith('/logic')) {
      const prompt = trimmed.replace('/logic', '').trim();
      onSendMessage(prompt, { mode: 'deep-logic' });
      setText('');
      setShowCommands(false);
      return;
    }

    if (trimmed.startsWith('/search')) {
      const prompt = trimmed.replace('/search', '').trim();
      onSendMessage(prompt, { mode: 'google-search' });
      setText('');
      setShowCommands(false);
      return;
    }

    onSendMessage(trimmed);
    setText('');
    setShowCommands(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (e.target.value.startsWith('/')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
  };

  return (
    <div className="relative p-3 sm:p-4 max-w-4xl mx-auto w-full z-10 shrink-0">
      {/* Slash Commands Dropup */}
      {showCommands && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-zinc-900 border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-md z-30">
          <div className="text-[10px] uppercase font-semibold text-zinc-500 px-2 py-1">
            {isTurkish ? 'Hızlı Komutlar' : 'Slash Commands'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs">
            <button
              onClick={() => {
                setText('/logic ');
                setShowCommands(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-left text-zinc-300 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <div>
                <span className="font-semibold text-white">/logic</span>
                <span className="text-[11px] text-zinc-400 block">
                  {isTurkish ? 'Derin akıl yürütme' : 'Deep chain of thought'}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                setText('/search ');
                setShowCommands(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-left text-zinc-300 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <span className="font-semibold text-white">/search</span>
                <span className="text-[11px] text-zinc-400 block">
                  {isTurkish ? 'Google canlı araştırma' : 'Live Google search'}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                onOpenImageStudio();
                setShowCommands(false);
              }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 text-left text-zinc-300 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
              <div>
                <span className="font-semibold text-white">/image</span>
                <span className="text-[11px] text-zinc-400 block">
                  {isTurkish ? 'Görsel Stüdyosu aç' : 'Open Image Studio'}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main input container */}
      <div className="relative rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-white/20 focus-within:border-cyan-500/50 shadow-2xl transition-all">
        {/* Upper mode selectors / toggles */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1 border-b border-white/5 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Active Model Switcher Pill */}
            {onOpenModelSelector && (
              <button
                type="button"
                onClick={onOpenModelSelector}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-colors font-semibold cursor-pointer"
                title={isTurkish ? 'Yapay zeka modelini değiştir' : 'Change AI model'}
              >
                <span>{activeModel.icon}</span>
                <span className="truncate max-w-[120px]">{activeModel.name}</span>
                <ChevronUp className="w-3 h-3 text-zinc-400" />
              </button>
            )}

            {/* Logic Mode Toggle */}
            <button
              type="button"
              onClick={() =>
                onToggleMode(activeMode === 'deep-logic' ? 'standard' : 'deep-logic')
              }
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMode === 'deep-logic'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
              title={isTurkish ? 'Mantık Bulmacası ve Adım Adım Düşünce Süreci' : 'Deep Logic Mode'}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{isTurkish ? 'Mantık Modu' : 'Logic'}</span>
            </button>

            {/* Google Search Toggle */}
            <button
              type="button"
              onClick={() =>
                onToggleMode(activeMode === 'google-search' ? 'standard' : 'google-search')
              }
              disabled={isOfflineMode}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeMode === 'google-search'
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              } ${isOfflineMode ? 'opacity-40 cursor-not-allowed' : ''}`}
              title={isTurkish ? 'Google Arama Entegrasyonu (Grounding)' : 'Google Search Grounding'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isTurkish ? 'Google Arama' : 'Google Search'}</span>
            </button>

            {/* Visual Studio modal trigger */}
            <button
              type="button"
              onClick={onOpenImageStudio}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-zinc-400 hover:text-fuchsia-300 hover:bg-white/5 transition-colors font-medium cursor-pointer"
              title={isTurkish ? 'Görsel Oluşturma Aracı' : 'Image Studio'}
            >
              <ImageIcon className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="hidden sm:inline">{isTurkish ? 'Görsel' : 'Image'}</span>
            </button>

            {/* Puzzle Library trigger */}
            <button
              type="button"
              onClick={onOpenPuzzleStudio}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-white/5 transition-colors font-medium cursor-pointer"
              title={isTurkish ? 'Hazır Mantık Bulmacaları Kütüphanesi' : 'Puzzle Lab'}
            >
              <Puzzle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isTurkish ? 'Bulmacalar' : 'Puzzles'}</span>
            </button>
          </div>

          {/* Offline status indicator in input */}
          {isOfflineMode && (
            <span className="text-[11px] text-amber-400 flex items-center gap-1">
              <WifiOff className="w-3 h-3" />
              <span>{isTurkish ? 'Çevrimdışı' : 'Offline'}</span>
            </span>
          )}
        </div>

        {/* Text Input Row */}
        <div className="flex items-end px-3 py-2 gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={adjustTextareaHeight}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? isTurkish
                  ? 'Sizi dinliyorum, konuşun...'
                  : 'Listening... speak freely...'
                : activeMode === 'deep-logic'
                ? isTurkish
                  ? 'Mantık bulmacanızı veya probleminizi yazın, adım adım çözelim...'
                  : 'Enter your logic puzzle or proof; let us solve it step-by-step...'
                : isTurkish
                ? 'MASTER AI\'a sorun, karmaşık bulmaca girin veya / yazarak komut seçin...'
                : 'Ask MASTER AI anything, solve complex logic, or type / for commands...'
            }
            className="flex-1 bg-transparent border-0 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none max-h-40 py-1.5 scrollbar-thin"
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title={isListening ? 'Dinlemeyi Durdur' : 'Sesli Komut ile Yaz'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className={`p-2 rounded-xl transition-all ${
              text.trim() && !isLoading
                ? 'text-white shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
            style={
              text.trim() && !isLoading
                ? {
                    backgroundColor: accentColor,
                    boxShadow: `0 4px 14px ${accentColor}40`,
                  }
                : undefined
            }
            title={isTurkish ? 'Gönder (Enter)' : 'Send (Enter)'}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
