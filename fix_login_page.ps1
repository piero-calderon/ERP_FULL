$file = "src\pages\ERPLoginPage.tsx"

$newContent = @'
// Pagina de login interno GEA SERVICES ERP con traducciones
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useERPAuth } from "@/store/erp.auth.store";
import { useLangStore } from "@/store/lang.store";
import { useT } from "@/i18n/useT";

export default function ERPLoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearError, isAuthenticated } = useERPAuth();
  const { lang, toggleLang } = useLangStore();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => { clearError(); }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    await login(email.trim(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 60% 20%, #1e3a5f 0%, #0f172a 50%, #020617 100%)",
      }}>

      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #0ea5e9, transparent)" }} />
        {/* Grid sutil */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Logo + toggle idioma */}
        <div className="text-center mb-8 relative">
          <button onClick={toggleLang}
            className="absolute right-0 top-0 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-1.5 backdrop-blur-sm">
            <span className={lang === "es" ? "text-blue-400 font-black" : "opacity-40"}>ES</span>
            <span className="text-slate-600">/</span>
            <span className={lang === "it" ? "text-blue-400 font-black" : "opacity-40"}>IT</span>
          </button>

          {/* Logo con glow */}
          <div className="relative inline-flex mb-4">
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-60"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }} />
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white font-bold text-xl shadow-2xl"
              style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
              GEA
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            GEA <span className="text-blue-400">SERVICES</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">{t.erpEnterprise}</p>
        </div>

        {/* Card con glassmorphism */}
        <div className="rounded-3xl border border-white/10 shadow-2xl p-8 backdrop-blur-md"
          style={{ background: "rgba(15, 23, 42, 0.75)" }}>

          <h2 className="text-lg font-bold text-white mb-1">{t.iniciarSesion}</h2>
          <p className="text-slate-400 text-sm mb-6">{t.ingresaCredenciales}</p>

          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-900/30 border border-red-700/50 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); clearError(); }}
                  placeholder={t.emailPlaceholder} required
                  className="w-full pl-10 pr-4 py-3 border text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.contrasena}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••" required
                  className="w-full pl-10 pr-10 py-3 border text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 font-semibold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2 shadow-lg hover:shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99]"
              style={{ background: loading ? "#1d4ed8" : "linear-gradient(135deg, #2563eb, #4f46e5)" , color: "white" }}>
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.verificando}</>
                : t.accederSistema}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          GEA SERVICES ERP v2.0 · Distribuzione Prodotti per la Pulizia
        </p>
      </div>
    </div>
  );
}
'@

Set-Content $file -Value $newContent -Encoding UTF8
Write-Host "✅ Login actualizado — sin acceso rápido, fondo mejorado"
