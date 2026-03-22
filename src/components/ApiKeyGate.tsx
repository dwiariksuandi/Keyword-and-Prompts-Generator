import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, ShieldCheck, AlertCircle, ArrowRight, Sparkles, Cpu, Zap, Loader2, CheckCircle2, Plus, Trash2, Layers } from 'lucide-react';
import { useApiStore } from '../store/useApiStore';
import { validateApiKey } from '../services/gemini';

interface ApiKeyGateProps {
  onKeySubmit: (key: string) => void;
}

export const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onKeySubmit }) => {
  const { apiKeys, setApiKey, switchKey, removeKey } = useApiStore();
  const [key, setKey] = useState('');
  const [keyName, setKeyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);
  const [showAddForm, setShowAddForm] = useState(apiKeys.length === 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('API Key tidak boleh kosong');
      return;
    }
    
    if (!key.startsWith('AIza')) {
      setError('Format API Key Gemini tidak valid (biasanya dimulai dengan AIza)');
      return;
    }

    setIsValidating(true);
    setError(null);
    
    try {
      const result = await validateApiKey(key.trim());
      if (result.isValid) {
        setValidationSuccess(true);
        setTimeout(() => {
          setApiKey(key.trim(), keyName || `Key ${apiKeys.length + 1}`);
          onKeySubmit(key.trim());
          setIsValidating(false);
          setValidationSuccess(false);
          setKey('');
          setKeyName('');
          setShowAddForm(false);
        }, 1500);
      } else {
        setError(result.error || 'API Key tidak valid');
        setIsValidating(false);
      }
    } catch (err) {
      setError('Gagal memvalidasi API Key. Periksa koneksi internet Anda.');
      setIsValidating(false);
    }
  };

  const handleSelectKey = (id: string) => {
    switchKey(id);
    const activeKey = useApiStore.getState().apiKey;
    onKeySubmit(activeKey);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg relative"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Cpu className="w-24 h-24" />
          </div>

          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 relative group">
              <div className="absolute inset-0 bg-white/10 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Key className="w-10 h-10 text-white relative z-10" />
            </div>
            
            <h1 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">
              Neural Access <span className="text-white/40">Required</span>
            </h1>
            <p className="text-white/40 font-medium leading-relaxed">
              {apiKeys.length > 0 
                ? 'Pilih API Key yang sudah ada atau tambahkan yang baru untuk melanjutkan.' 
                : 'Masukkan Gemini API Key Anda untuk mengaktifkan mesin kecerdasan buatan.'}
            </p>
          </div>

          {apiKeys.length > 0 && !showAddForm && (
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  Stored Vaults
                </span>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add New
                </button>
              </div>
              <div className="grid gap-3">
                {apiKeys.map((k) => (
                  <div 
                    key={k.id}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      k.isActive 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                    onClick={() => handleSelectKey(k.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${k.isActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-white/10'}`} />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">{k.name}</span>
                        <span className="text-[10px] font-medium text-white/20 font-mono">
                          AIza...{decryptKey(k.key).slice(-4)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-white/10 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Last used: {new Date(k.lastUsed).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeKey(k.id);
                        }}
                        className="p-2 text-white/10 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {showAddForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">Key Name (Optional)</label>
                    <input
                      type="text"
                      value={keyName}
                      onChange={(e) => setKeyName(e.target.value)}
                      placeholder="e.g., Primary Account"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">API Key</label>
                    <div className="relative group">
                      <input
                        type="password"
                        value={key}
                        onChange={(e) => {
                          setKey(e.target.value);
                          setError(null);
                        }}
                        placeholder="AIza..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-white/20 transition-all font-mono text-sm"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <ShieldCheck className={`w-5 h-5 transition-colors ${key.startsWith('AIza') ? 'text-emerald-400' : 'text-white/10'}`} />
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider px-2"
                      >
                        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3">
                  {apiKeys.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 bg-white/5 text-white font-black py-4 rounded-2xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isValidating || validationSuccess}
                    className={`flex-[2] font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] group uppercase text-xs tracking-widest ${
                      validationSuccess 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white text-black hover:bg-white/90 disabled:opacity-50'
                    }`}
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memverifikasi...
                      </>
                    ) : validationSuccess ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Berhasil!
                      </>
                    ) : (
                      <>
                        Aktifkan Mesin
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-10 border-t border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/20">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Keamanan Terjamin</span>
            </div>
            <p className="text-[10px] text-white/20 font-medium leading-relaxed">
              API Key Anda dienkripsi menggunakan AES-256 dan disimpan secara lokal di browser Anda. Kami melakukan panggilan "ping" ringan ke Google Gemini untuk memastikan kunci Anda aktif dan memiliki kuota yang cukup.
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-white/40 hover:text-white font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              Dapatkan API Key Gratis
              <Sparkles className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper for display
import { decryptKey } from '../services/crypto';
