// Pagina de login interno GEA SERVICES ERP con traducciones
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useERPAuth } from "@/store/erp.auth.store";
import { useLangStore } from "@/store/lang.store";
import { useT } from "@/i18n/useT";

const DEMOS = [
  { email: "admin@geaservices.com",       password: "admin123",       rol_es: "Admin General",       rol_it: "Admin Generale",      color: "bg-blue-100 text-blue-700" },
  { email: "comercial@geaservices.com",   password: "comercial123",   rol_es: "Area Comercial",      rol_it: "Area Commerciale",    color: "bg-emerald-100 text-emerald-700" },
  { email: "operativa@geaservices.com",   password: "operativa123",   rol_es: "Area Operativa",      rol_it: "Area Operativa",      color: "bg-violet-100 text-violet-700" },
  { email: "empresarial@geaservices.com", password: "empresarial123", rol_es: "Gestion Empresarial", rol_it: "Area Aziendale",      color: "bg-amber-100 text-amber-700" },
  { email: "admin.sys@geaservices.com",   password: "admin123",       rol_es: "Administracion",      rol_it: "Amministrazione",     color: "bg-slate-100 text-slate-700" },
];

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

  const fillDemo = (demo: typeof DEMOS[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    clearError();
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo + toggle idioma */}
        <div className="text-center mb-8 relative">
          <button onClick={toggleLang}
            className="absolute right-0 top-0 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1.5">
            <span className={lang === "es" ? "text-blue-400 font-black" : "opacity-40"}>ES</span>
            <span className="text-slate-600">/</span>
            <span className={lang === "it" ? "text-blue-400 font-black" : "opacity-40"}>IT</span>
          </button>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-xl shadow-2xl shadow-blue-500/30 mb-4">
            GEA
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">GEA <span className="text-blue-500">SERVICES</span></h1>
          <p className="text-slate-400 text-sm mt-1">{t.erpEnterprise}</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl p-8">
          <h2 className="text-lg font-bold text-white mb-1">{t.iniciarSesion}</h2>
          <p className="text-slate-400 text-sm mb-6">{t.ingresaCredenciales}</p>

          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-900/30 border border-red-700 rounded-xl mb-5">
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">{t.contrasena}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); clearError(); }}
                  placeholder="••••••••" required
                  className="w-full pl-10 pr-10 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.verificando}</> : t.accederSistema}
            </button>
          </form>
        </div>

        {/* Cuentas demo */}
        <div className="mt-5 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.cuentasAccesoRapido}</p>
          <div className="space-y-2">
            {DEMOS.map(d => (
              <button key={d.email} onClick={() => fillDemo(d)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-700/50 transition-colors group">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${d.color}`}>
                    {lang === "es" ? d.rol_es : d.rol_it}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">{d.email}</span>
                </div>
                <span className="text-[10px] text-slate-600 group-hover:text-slate-400">{t.clicParaLlenar}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-4">
          GEA SERVICES ERP v2.0 · Distribuzione Prodotti per la Pulizia
        </p>
      </div>
    </div>
  );
}
