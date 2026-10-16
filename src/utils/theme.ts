/**
 * Theme & Accent Color Palette Management Suite
 * Supports dynamic CSS variables injection on :root and location-based language detection.
 */

export interface ThemeColorOption {
  id: string;
  name: string;
  hex: string;
  gradient: string;
}

export const THEME_PALETTES: ThemeColorOption[] = [
  {
    id: 'cyan',
    name: 'Kuantum Camgöbeği',
    hex: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'indigo',
    name: 'Elektrik İndigo',
    hex: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    id: 'fuchsia',
    name: 'Cyberpunk Fuşya',
    hex: '#d946ef',
    gradient: 'from-fuchsia-500 to-pink-600',
  },
  {
    id: 'emerald',
    name: 'Zümrüt Matrix',
    hex: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'amber',
    name: 'Güneş Kehribarı',
    hex: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'orange',
    name: 'Ateş Turuncusu',
    hex: '#f97316',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'rose',
    name: 'Kızıl Gül',
    hex: '#f43f5e',
    gradient: 'from-rose-500 to-red-600',
  },
  {
    id: 'sky',
    name: 'Derin Gökyüzü',
    hex: '#0284c7',
    gradient: 'from-sky-500 to-indigo-600',
  },
  {
    id: 'lime',
    name: 'Siber Yeşil',
    hex: '#84cc16',
    gradient: 'from-lime-500 to-emerald-600',
  },
];

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function applyAccentColor(hexColor: string): void {
  if (typeof document === 'undefined') return;

  try {
    const { r, g, b } = hexToRgb(hexColor);
    const root = document.documentElement;

    root.style.setProperty('--accent-color', hexColor);
    root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.38)`);
    root.style.setProperty('--accent-light', `rgba(${r}, ${g}, ${b}, 0.15)`);
    root.style.setProperty('--accent-border', `rgba(${r}, ${g}, ${b}, 0.45)`);
  } catch (err) {
    console.warn('Failed to apply accent color:', err);
  }
}

/**
 * Apply Light or Dark theme mode to document and root body
 */
export function applyThemeMode(mode: 'dark' | 'light'): void {
  if (typeof document === 'undefined') return;

  try {
    const root = document.documentElement;
    const body = document.body;
    root.setAttribute('data-theme', mode);
    if (mode === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      body.classList.add('theme-light');
      body.classList.remove('theme-dark');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      body.classList.add('theme-dark');
      body.classList.remove('theme-light');
    }
  } catch (err) {
    console.warn('Failed to apply theme mode:', err);
  }
}

/**
 * Detect location/browser language
 */
export function getDetectedBrowserLanguage(): { code: string; label: string; fullLocale: string } {
  if (typeof navigator === 'undefined') {
    return { code: 'tr', label: 'Türkçe', fullLocale: 'tr-TR' };
  }

  const locale = navigator.language || (navigator as any).userLanguage || 'tr-TR';
  const prefix = locale.split('-')[0].toLowerCase();

  const languageMap: Record<string, string> = {
    tr: 'Türkçe',
    en: 'English',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español',
    ru: 'Русский',
    ja: '日本語',
    ar: 'العربية',
    it: 'Italiano',
    pt: 'Português',
  };

  return {
    code: languageMap[prefix] ? prefix : 'tr',
    label: languageMap[prefix] || 'Türkçe',
    fullLocale: locale,
  };
}

