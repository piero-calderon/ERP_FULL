import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';
import { usePortalAuthStore } from '../store/auth.store';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, mfaPendiente, loading, error, clearError, isAuthenticated } = usePortalAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recordarme, setRecordarme] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/portal/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (mfaPendiente) navigate('/portal/mfa', { replace: true });
  }, [mfaPendiente, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    try {
      await login({ email: email.trim(), password, recordarme });
    } catch { /* error shown via store */ }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Bienvenido</h2>
      <p className="text-slate-500 text-sm mb-7">Inicia sesión con tu cuenta de cliente</p>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl mb-6">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearError(); }}
              placeholder="tu@empresa.com"
              autoComplete="email"
              required
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-slate-700">Contraseña</label>
            <Link to="/portal/forgot-password" className="text-xs text-blue-600 hover:underline">¿Olvidaste tu contraseña?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); clearError(); }}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" checked={recordarme} onChange={e => setRecordarme(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm text-slate-600">Recordarme en este dispositivo</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Iniciando sesión...</> : 'Iniciar sesión'}
        </button>
      </form>

      {/* Demo credentials hint */}
      <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-xs font-medium text-slate-500 mb-2">Cuentas demo disponibles:</p>
        <div className="space-y-1 text-xs text-slate-600">
          <p><span className="font-medium">admin@cliente.com</span> — Admin (con MFA)</p>
          <p><span className="font-medium">comprador@cliente.com</span> — Comprador</p>
          <p><span className="font-medium">viewer@cliente.com</span> — Visualizador</p>
          <p className="text-slate-400 mt-1">Contraseña: <span className="font-mono font-medium text-slate-600">demo1234</span></p>
        </div>
      </div>
    </div>
  );
}
