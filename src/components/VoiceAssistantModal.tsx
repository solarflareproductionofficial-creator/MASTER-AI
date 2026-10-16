import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Brain,
  Terminal,
  RotateCcw
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessVoicePrompt: (prompt: string) => Promise<string>;
  aiName: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onProcessVoicePrompt,
  aiName,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [statusText, setStatusText] = useState('Başlamak için mikrofonu etkinleştirin');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusText('Sizi dinliyorum, konuşun...');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event);
        setIsListening(false);
        setStatusText('Ses algılanamadı, lütfen tekrar deneyin');
      };

      recognition.onend = async () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // When speech recognition ends and we have a transcript, submit to AI
  const handleAutoSend = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setStatusText('MASTER AI düşünüyor...');
    try {
      const response = await onProcessVoicePrompt(userPrompt);
      setLastResponse(response);
      setStatusText('Yanıt veriliyor...');
      speakResponse(response);
    } catch (err) {
      setStatusText('Bir hata oluştu');
    }
  };

  const speakResponse = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    // Clean markdown
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Kod bloğu.')
      .replace(/[#*_~`]/g, '')
      .slice(0, 400);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatusText('Dinlemeye hazır');
    };
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setStatusText('Ses durduruldu');
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Tarayıcınızda ses tanıma özelliği desteklenmiyor.');
      return;
    }
    stopSpeaking();
    setTranscript('');
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.warn('Recognition start error:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-between p-6 sm:p-10 animate-fade-in">
      {/* Top Header */}
      <div className="w-full max-w-3xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            {aiName} Canlı Sesli Asistan Modu
          </span>
        </div>
        <button
          onClick={() => {
            stopSpeaking();
            if (recognitionRef.current && isListening) recognitionRef.current.stop();
            onClose();
          }}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Center Dynamic Neural Core / Audio Visualizer Orb */}
      <div className="flex flex-col items-center justify-center my-auto relative">
        {/* Concentric radiant pulses */}
        <div
          className={`absolute w-72 h-72 rounded-full transition-all duration-700 pointer-events-none ${
            isSpeaking
              ? 'bg-gradient-to-r from-cyan-500/30 via-indigo-500/30 to-fuchsia-500/30 scale-125 blur-3xl animate-pulse'
              : isListening
              ? 'bg-gradient-to-r from-red-500/30 via-amber-500/30 to-rose-500/30 scale-110 blur-3xl animate-pulse'
              : 'bg-indigo-600/10 blur-2xl scale-100'
          }`}
        />

        {/* Neural Core Orb Button */}
        <button
          onClick={isListening ? () => recognitionRef.current?.stop() : startListening}
          className={`relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center border transition-all duration-500 cursor-pointer shadow-2xl ${
            isSpeaking
              ? 'bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 border-cyan-400/80 shadow-cyan-500/40 scale-105'
              : isListening
              ? 'bg-gradient-to-tr from-red-600 via-rose-600 to-amber-600 border-red-400/80 shadow-red-500/40 animate-pulse scale-105'
              : 'bg-zinc-900 border-white/20 hover:border-cyan-400/50 hover:scale-105 shadow-indigo-600/20'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-14 h-14 text-white animate-bounce" />
          ) : isListening ? (
            <Mic className="w-14 h-14 text-white animate-pulse" />
          ) : (
            <MicOff className="w-12 h-12 text-zinc-400" />
          )}
          <span className="text-[11px] font-semibold text-white/90 mt-2">
            {isSpeaking ? 'Konuşuyor...' : isListening ? 'Dinliyor...' : 'Dokun ve Konuş'}
          </span>
        </button>

        {/* Status Text */}
        <p className="mt-6 text-sm font-medium text-zinc-400 tracking-wide text-center max-w-md">
          {statusText}
        </p>

        {/* Live Transcript Display */}
        {transcript && (
          <div className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 max-w-lg text-center text-sm text-cyan-200">
            "{transcript}"
          </div>
        )}

        {/* Send recognized text button if not auto-sent */}
        {transcript && !isListening && (
          <button
            onClick={() => handleAutoSend(transcript)}
            className="mt-3 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            Yanıtla & Çöz
          </button>
        )}

        {/* Last AI Response preview */}
        {lastResponse && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-900/80 border border-white/10 max-w-xl max-h-36 overflow-y-auto text-xs text-zinc-300 leading-relaxed scrollbar-thin">
            <span className="font-semibold text-cyan-400 block mb-1">Yanıt:</span>
            {lastResponse}
          </div>
        )}
      </div>

      {/* Bottom Voice Shortcuts */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => {
              setTranscript('Einstein bulmacasını adım adım çöz');
              handleAutoSend('Einstein bulmacasını adım adım çöz');
            }}
            className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 transition-colors"
          >
            🧩 "Einstein bulmacasını adım adım çöz"
          </button>

          <button
            onClick={() => {
              setTranscript('Kurt kuzu lahana nehir geçişini anlat');
              handleAutoSend('Kurt kuzu lahana nehir geçişini anlat');
            }}
            className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 transition-colors"
          >
            🌊 "Nehir geçişi taktiğini açıkla"
          </button>

          <button
            onClick={() => {
              setTranscript('Bugün için bilim ve teknoloji haberlerini özetle');
              handleAutoSend('Bugün için bilim ve teknoloji haberlerini özetle');
            }}
            className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 transition-colors"
          >
            🌐 "Günün teknoloji özetini çıkar"
          </button>
        </div>

        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 text-xs transition-colors"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>Sesi Kes</span>
          </button>
        )}
      </div>
    </div>
  );
};
