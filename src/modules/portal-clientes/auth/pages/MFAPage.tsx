import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { usePortalAuthStore } from '../store/auth.store';

export default function MFAPage() {
  const navigate = useNavigate();
  const { verificarMFA, loading, error, clearError, mfaPendiente, cliente } = usePortalAuthStore();
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!mfaPendiente) navigate('/portal/login', { replace: true });
  }, [mfaPendiente, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...codigo];
    next[idx] = val.slice(-1);
    setCodigo(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codigo[idx] && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCodigo(pasted.split(''));
      inputs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codigo.join('');
    if (code.length < 6) return;
    try {
      await verificarMFA(code);
      navigate('/portal/dashboard', { replace: true });
    } catch { /* error shown */ }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Verificación MFA</h2>
          <p className="text-slate-500 text-sm">Cuenta: {cliente?.email}</p>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-6">
        Introduce el código de 6 dígitos de tu aplicación de autenticación.
        <span className="block text-slate-400 text-xs mt-1">(Demo: usa el código <span className="font-mono font-bold text-slate-600">123456</span>)</span>
      </p>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-5">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
          {codigo.map((d, i) => (
            <input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || codigo.join('').length < 6}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verificando...</> : 'Verificar código'}
        </button>
      </form>

      <button
        onClick={() => navigate('/portal/login')}
        className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
      </button>
    </div>
  );
}
