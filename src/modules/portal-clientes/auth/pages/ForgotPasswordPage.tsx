import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { usePortalAuthStore } from '../store/auth.store';

export default function ForgotPasswordPage() {
  const { recuperarPassword, loading, error, clearError } = usePortalAuthStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await recuperarPassword(email.trim());
      setSent(true);
    } catch { /* error shown */ }
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Email enviado</h2>
        <p className="text-slate-500 text-sm mb-6">
          Si existe una cuenta con ese email, recibirás un enlace de recuperación en breve.
          <span className="block mt-1 text-slate-400 text-xs">(Demo: simulado, no se envía email real.)</span>
        </p>
        <Link to="/portal/login" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
          <ArrowLeft className="w-4 h-4" /> Volver al login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/portal/login" className="inline-flex items-center gap-2 text-slate-500 text-sm hover:text-slate-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver
      </Link>

      <h2 className="text-2xl font-bold text-slate-900 mb-1">Recuperar contraseña</h2>
      <p className="text-slate-500 text-sm mb-7">Introduce tu email y te enviaremos un enlace de recuperación.</p>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-5">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearError(); }}
              placeholder="tu@empresa.com"
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : 'Enviar enlace de recuperación'}
        </button>
      </form>
    </div>
  );
}
