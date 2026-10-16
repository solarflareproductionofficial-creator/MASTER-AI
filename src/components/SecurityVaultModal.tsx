import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  Key,
  Download,
  Upload,
  Trash2,
  X,
  Check,
  Eye,
  EyeOff,
  AlertTriangle
} from 'lucide-react';
import { generateFingerprint } from '../utils/crypto.ts';

interface SecurityVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportVault: () => void;
  onImportVault: (file: File) => void;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({
  isOpen,
  onClose,
  onExportVault,
  onImportVault,
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [savedPassphrase, setSavedPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [fingerprint, setFingerprint] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const current = localStorage.getItem('master_ai_vault_pass') || 'master_ai_vault_key';
    setSavedPassphrase(current);
    generateFingerprint(current).then(setFingerprint);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdatePassphrase = () => {
    if (!passphrase.trim()) return;
    localStorage.setItem('master_ai_vault_pass', passphrase.trim());
    setSavedPassphrase(passphrase.trim());
    generateFingerprint(passphrase.trim()).then(setFingerprint);
    setPassphrase('');
    setStatusMsg('Şifreleme anahtarı başarıyla güncellendi!');
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportVault(file);
      setStatusMsg('Şifreli yedek içeri aktarıldı!');
      setTimeout(() => setStatusMsg(''), 2500);
    }
  };

  const handleCryptographicWipe = () => {
    if (
      confirm(
        'DİKKAT: Cihazınızdaki tüm şifreli sohbet geçmişi ve öğrenilen hafıza düğümleri kalıcı olarak sıfırlanacak. Onaylıyor musunuz?'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Uçtan Uca Şifreleme & Gizlilik Merkezi
              </h3>
              <p className="text-xs text-zinc-400">
                Web Crypto API • 256-bit AES-GCM • Sıfır Bilgi Mimarisi
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto scrollbar-thin text-xs">
          {/* Status Message */}
          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Key Status Banner */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">
                Aktif Kriptografik Parmak İzi
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[10px]">
                SHA-256 / AES-GCM
              </span>
            </div>
            <div className="font-mono text-zinc-400 bg-zinc-950 px-3 py-2 rounded-lg border border-white/5 break-all">
              {fingerprint || 'e8f7a912b4c5...'}
            </div>
            <p className="text-[11px] text-zinc-500">
              Verileriniz bu cihazda doğrudan tarayıcı donanım hızlandırmasıyla şifrelenir.
            </p>
          </div>

          {/* Change Master Passphrase */}
          <div className="space-y-2">
            <label className="font-semibold text-zinc-300 block">
              Özel Kasa Parolası (Opsiyonel)
            </label>
            <p className="text-zinc-400 text-[11px]">
              Dilerseniz şifreleme anahtarını kendi belirleyeceğiniz gizli bir parola ile güçlendirebilirsiniz.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Yeni gizli kasa parolası girin..."
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={handleUpdatePassphrase}
                disabled={!passphrase.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold transition-colors"
              >
                Güncelle
              </button>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="font-semibold text-zinc-300 block">Şifreli Kasa Yedekleme</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={onExportVault}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Kasayı İndir (.enc.json)</span>
              </button>

              <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Yedekten Geri Yükle</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Zeroing Wipe */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>Kriptografik Sıfırlama (Wipe)</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Tüm oturumları, öğrenilen hafızaları ve şifreleme anahtarlarını cihazdan kalıcı olarak siler.
            </p>
            <button
              onClick={handleCryptographicWipe}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Verileri Güvenle Sıfırla</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
