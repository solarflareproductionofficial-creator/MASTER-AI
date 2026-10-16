import React, { useState, useEffect } from 'react';
import {
  Sliders,
  X,
  Sparkles,
  Brain,
  Cpu,
  User,
  Shield,
  Palette,
  Check,
  RotateCcw,
  Globe,
  Compass,
  Pipette,
  Sun,
  Moon,
  Gamepad2
} from 'lucide-react';

import { UserPersona } from '../types.ts';
import { THEME_PALETTES, applyAccentColor, applyThemeMode, getDetectedBrowserLanguage } from '../utils/theme.ts';

interface PersonaCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: UserPersona;
  onSavePersona: (updated: UserPersona) => void;
  onOpenGameStudio?: () => void;
}


const PERSONA_PRESETS = [
  {
    title: '🔥 Samimi Kanka & Şekilli Asistan (Önerilen)',
    role: 'Zeki Yol Arkadaşı & Süper Asistan',
    prompt: 'Resmiyetten uzak, çok sakin, samimi, cana yakın ve kanka gibi konuş. Yanıtlarını şekilli şukullu, havalı emojilerle, maddelerle (✦, ⚡, 🎯, 🚀) ve estetik markdown bloklarıyla süsle. Kullanıcının her sorusunu samimiyetle ve eksiksiz çöz.',
    rigor: 'standard' as const,
  },
  {
    title: '🧠 Master Mantıkçı & Bilim İnsanı',
    role: 'Üst Seviye Zeki Mantık Çözücü',
    prompt: 'Karmaşık mantık bulmacalarını, matematiksel problemleri ve analitik soruları First Principles (Birinci İlkeler) ve çelişki elemesi ile adım adım çöz. Her hipotezi test et ve gerekçesini belirt.',
    rigor: 'proof' as const,
  },
  {
    title: '💻 Kıdemli Yazılım Mimarı & Algoritmacı',
    role: 'Kıdemli Sistem & Algoritma Mimarı',
    prompt: 'Algoritmik problemleri, veri yapılarını ve yazılım mimarilerini en iyi pratiklerle, modüler TypeScript veya Python koduyla çöz. Zaman karmaşıklığını (Big-O) ve kenar durumları analiz et.',
    rigor: 'high' as const,
  },
  {
    title: '🤝 Samimi Günlük Üretkenlik Asistanı',
    role: 'Kişisel Yapay Zeka Asistanı',
    prompt: 'Günlük planlamalarda, yazışmalarda, özet çıkarmada ve genel sorularda hızlı, net, samimi ve son derece yardımsever ol.',
    rigor: 'standard' as const,
  },
];

export const PersonaCustomizerModal: React.FC<PersonaCustomizerModalProps> = ({
  isOpen,
  onClose,
  persona,
  onSavePersona,
  onOpenGameStudio,
}) => {
  const [formData, setFormData] = useState<UserPersona>(persona);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [detectedLang, setDetectedLang] = useState<{ code: string; label: string; fullLocale: string }>({
    code: 'tr',
    label: 'Türkçe',
    fullLocale: 'tr-TR',
  });

  useEffect(() => {
    setFormData(persona);
    setDetectedLang(getDetectedBrowserLanguage());
  }, [persona, isOpen]);

  if (!isOpen) return null;

  const isTurkish = formData.language === 'tr';

  const handleApplyPreset = (preset: typeof PERSONA_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      roleTitle: preset.role,
      systemPrompt: preset.prompt,
      reasoningRigor: preset.rigor,
    }));
  };

  const handleSelectColor = (hex: string) => {
    setFormData((prev) => ({ ...prev, accentColor: hex }));
    applyAccentColor(hex);
  };

  const handleSelectThemeMode = (mode: 'dark' | 'light') => {
    setFormData((prev) => ({ ...prev, themeMode: mode }));
    applyThemeMode(mode);
  };

  const handleSave = () => {
    onSavePersona(formData);
    applyAccentColor(formData.accentColor || '#06b6d4');
    applyThemeMode(formData.themeMode || 'dark');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl border transition-colors"
              style={{
                backgroundColor: `${formData.accentColor}20`,
                borderColor: `${formData.accentColor}40`,
                color: formData.accentColor,
              }}
            >
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isTurkish ? 'Yapay Zekayı Kişiselleştir & Ayarlar' : 'Settings & Persona Customization'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isTurkish
                  ? 'Koyu / Beyaz tema, HTML5 oyun stüdyosu, tema rengi ve karakter ayarları.'
                  : 'Dark/White themes, HTML5 game studio, accent colors and intelligence tuning.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              applyAccentColor(persona.accentColor || '#06b6d4');
              applyThemeMode(persona.themeMode || 'dark');
              onClose();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin text-xs">
          {/* THEME MODE: DARK VS WHITE (LIGHT) */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                {formData.themeMode === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-cyan-400" />
                )}
                <span>{isTurkish ? 'Görünüm Teması (Açık Beyaz / Koyu Tema)' : 'Interface Theme (Dark / Light)'}</span>
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                {formData.themeMode === 'light'
                  ? (isTurkish ? 'BEYAZ TEMA AKTİF' : 'WHITE THEME ACTIVE')
                  : (isTurkish ? 'KOYU TEMA AKTİF' : 'DARK THEME ACTIVE')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Dark Theme Button */}
              <button
                type="button"
                onClick={() => handleSelectThemeMode('dark')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  (formData.themeMode || 'dark') === 'dark'
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-md ring-1 ring-cyan-500/40'
                    : 'border-white/10 bg-zinc-950/70 hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-cyan-400">
                  <Moon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-white block text-xs">
                    {isTurkish ? 'Koyu Siber Tema' : 'Dark Cyber Theme'}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {isTurkish ? 'Göz yormayan siyah & neon' : 'Obsidian & neon accents'}
                  </span>
                </div>
              </button>

              {/* Light Theme Button */}
              <button
                type="button"
                onClick={() => handleSelectThemeMode('light')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  formData.themeMode === 'light'
                    ? 'border-amber-500 bg-amber-500/10 shadow-md ring-1 ring-amber-500/40'
                    : 'border-white/10 bg-zinc-950/70 hover:border-white/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sun className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-white block text-xs">
                    {isTurkish ? 'Açık Beyaz Tema' : 'White / Light Theme'}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {isTurkish ? 'Ferah ve aydınlık arayüz' : 'Clean & bright interface'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* HTML5 GAME STUDIO MENU ITEM IN SETTINGS */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-zinc-900 to-zinc-900 border border-emerald-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  {isTurkish ? 'HTML5 Oyun Yapma Özelliği & Oynama' : 'HTML5 Game Studio & Play'}
                </span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                YENİ / NEW
              </span>
            </div>

            <p className="text-[11px] text-zinc-300 leading-relaxed">
              {isTurkish
                ? 'Kendi HTML/JS oyunlarını yazabilir, anında pencere içinde oynayabilir veya Game Jolt platformuna yüklemek için indirebilirsiniz.'
                : 'Write and preview HTML/JS arcade games in real-time or export them to Game Jolt.'}
            </p>

            {onOpenGameStudio && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenGameStudio();
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{isTurkish ? '🎮 HTML5 Oyun Stüdyosunu Başlat' : '🎮 Launch HTML5 Game Studio'}</span>
              </button>
            )}
          </div>

          {/* THEME COLOR PALETTE SECTION */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <Palette className="w-4 h-4 text-cyan-400" style={{ color: formData.accentColor }} />
                <span>Tema Rengi Paleti (CSS Vurgu Rengi)</span>
              </label>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: formData.accentColor }}
                />
                <span className="font-mono text-[11px] text-zinc-400 uppercase">
                  {formData.accentColor}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Seçtiğiniz renk tüm arayüzdeki vurguları, butonları, ışık halkalarını ve aktif sekmeleri anında renklendirir.
            </p>

            {/* Swatches Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {THEME_PALETTES.map((palette) => {
                const isSelected = formData.accentColor.toLowerCase() === palette.hex.toLowerCase();
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => handleSelectColor(palette.hex)}
                    className={`relative p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-white/10 scale-105 shadow-lg'
                        : 'border-white/5 bg-zinc-950/70 hover:border-white/20'
                    }`}
                  >
                    <span
                      className="w-6 h-6 rounded-lg shadow-md transition-transform flex items-center justify-center"
                      style={{
                        backgroundColor: palette.hex,
                        boxShadow: isSelected ? `0 0 12px ${palette.hex}` : undefined,
                      }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </span>
                    <span className="text-[10px] text-zinc-300 font-medium truncate w-full text-center">
                      {palette.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Picker Input */}
            <div className="pt-2 border-t border-white/5 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 cursor-pointer shadow-sm">
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => handleSelectColor(e.target.value)}
                    className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer opacity-0"
                    title="Özel Renk Seç"
                  />
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: formData.accentColor }}
                  >
                    <Pipette className="w-3.5 h-3.5 text-white drop-shadow" />
                  </div>
                </div>
                <span className="text-zinc-300 text-xs font-medium">Özel Renk:</span>
              </div>

              <input
                type="text"
                value={formData.accentColor}
                onChange={(e) => handleSelectColor(e.target.value)}
                placeholder="#06b6d4"
                className="w-28 bg-zinc-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* LANGUAGE & LOCATION DETECTION SECTION */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <Globe className="w-4 h-4 text-cyan-400" style={{ color: formData.accentColor }} />
                <span>Dil & Konum Ayarı</span>
              </label>

              {formData.autoDetectLanguage && (
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                  style={{
                    backgroundColor: `${formData.accentColor}15`,
                    borderColor: `${formData.accentColor}30`,
                    color: formData.accentColor,
                  }}
                >
                  Otomatik Algılama Açık
                </span>
              )}
            </div>

            {/* Auto detect location toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/80 border border-white/5">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-medium text-white block">
                    Konuma & Tarayıcıya Göre Otomatik Dil Seçimi
                  </span>
                  <span className="text-[11px] text-zinc-400 block">
                    Algılanan: {detectedLang.fullLocale} ({detectedLang.label})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextState = !formData.autoDetectLanguage;
                  setFormData((prev) => ({
                    ...prev,
                    autoDetectLanguage: nextState,
                    language: nextState ? detectedLang.code : prev.language,
                  }));
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.autoDetectLanguage ? 'bg-cyan-500' : 'bg-zinc-800'
                }`}
                style={{
                  backgroundColor: formData.autoDetectLanguage ? formData.accentColor : undefined,
                }}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    formData.autoDetectLanguage ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Manual Language Dropdown */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">
                {formData.autoDetectLanguage ? 'Manuel Seçim (Geçersiz Kıl):' : 'Tercih Edilen Dil:'}
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    language: e.target.value,
                    autoDetectLanguage: false,
                  })
                }
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
                style={{ borderColor: `${formData.accentColor}40` }}
              >
                <option value="en">🇺🇸 English (Default / Varsayılan)</option>
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>
            </div>
          </div>

          {/* Presets Row */}
          <div className="space-y-2">
            <label className="font-semibold text-zinc-300 uppercase tracking-wider block">
              Hazır Karakter & Rol Şablonları
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PERSONA_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/5 hover:border-cyan-500/30 text-left transition-colors group cursor-pointer"
                >
                  <span className="font-semibold text-zinc-200 block text-xs group-hover:text-cyan-300">
                    {p.title}
                  </span>
                  <span className="text-[11px] text-zinc-400 block truncate mt-0.5">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Yapay Zeka İsmi</label>
              <input
                type="text"
                value={formData.aiName}
                onChange={(e) => setFormData({ ...formData, aiName: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none"
                style={{ borderColor: `${formData.accentColor}30` }}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-zinc-300">Hitap Edeceği İsminiz</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none"
                style={{ borderColor: `${formData.accentColor}30` }}
              />
            </div>
          </div>

          {/* Role Title */}
          <div className="space-y-1">
            <label className="font-medium text-zinc-300">Rol Tanımı / Uzmanlık Başlığı</label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-500 focus:outline-none"
              style={{ borderColor: `${formData.accentColor}30` }}
            />
          </div>

          {/* Reasoning Rigor */}
          <div className="space-y-2">
            <label className="font-medium text-zinc-300 block">Akıl Yürütme Titizliği (Rigor)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, reasoningRigor: 'standard' })}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.reasoningRigor === 'standard'
                    ? 'bg-zinc-800 border-white/30 text-white shadow-sm'
                    : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="font-semibold block">Standart</span>
                <span className="text-[10px] text-zinc-400">Sakin & Doğal</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, reasoningRigor: 'high' })}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.reasoningRigor === 'high'
                    ? 'border-indigo-500 text-indigo-200 shadow-sm'
                    : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: formData.reasoningRigor === 'high' ? `${formData.accentColor}25` : undefined,
                  borderColor: formData.reasoningRigor === 'high' ? formData.accentColor : undefined,
                }}
              >
                <span className="font-semibold block">Derin Mantık</span>
                <span className="text-[10px] text-zinc-400">Gerekçeli Adımlar</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, reasoningRigor: 'proof' })}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.reasoningRigor === 'proof'
                    ? 'border-cyan-500 text-cyan-200 shadow-sm'
                    : 'bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white'
                }`}
                style={{
                  backgroundColor: formData.reasoningRigor === 'proof' ? `${formData.accentColor}25` : undefined,
                  borderColor: formData.reasoningRigor === 'proof' ? formData.accentColor : undefined,
                }}
              >
                <span className="font-semibold block">Matematiksel Kanıt</span>
                <span className="text-[10px] text-zinc-400">Çelişki Elemesi</span>
              </button>
            </div>
          </div>

          {/* System Prompt Directives */}
          <div className="space-y-1">
            <label className="font-medium text-zinc-300">Özel Sistem İstemleri ve Kuralları</label>
            <textarea
              rows={3}
              value={formData.systemPrompt}
              onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
              placeholder="MASTER AI'ın mutlaka uymasını istediğiniz özel direktifler..."
              className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none font-mono text-xs"
              style={{ borderColor: `${formData.accentColor}30` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-zinc-900/60 flex items-center justify-between">
          <button
            onClick={() => {
              const def = {
                aiName: 'MASTER AI',
                userName: 'Friend',
                roleTitle: 'Intelligent Companion & Super Assistant',
                systemPrompt: 'Be calm, friendly, sharp, approachable, and intellectually formidable. Format your responses with aesthetic Markdown, sleek badges, and clear bullet points (✦, ⚡, 🎯, 🚀, 💡). Solve problems with precision and clarity.',
                reasoningRigor: 'standard' as const,
                creativityLevel: 0.8,
                accentColor: '#06b6d4',
                language: 'en',
                autoDetectLanguage: false,
                offlineModePreferred: false,
                subscriptionTier: persona.subscriptionTier || 'free',
                selectedModel: persona.selectedModel || 'gemini-2.5-flash',
              };
              setFormData(def);
              applyAccentColor('#06b6d4');
            }}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılanlara Dön</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold text-xs tracking-wide shadow-md transition-all cursor-pointer"
            style={{
              backgroundColor: formData.accentColor,
              boxShadow: `0 4px 14px ${formData.accentColor}40`,
            }}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Kaydedildi & Uygulandı!</span>
              </>
            ) : (
              <span>Kaydet ve Uygula</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
