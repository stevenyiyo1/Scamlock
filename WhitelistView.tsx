import {
  Check,
  CheckCircle2,
  ExternalLink,
  Globe,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  XCircle,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const WhitelistView: React.FC = () => {
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [testDomainInput, setTestDomainInput] = useState<string>('store.steampowered.com');
  const [testResult, setTestResult] = useState<boolean | null>(null);

  useEffect(() => {
    fetchWhitelist();
  }, []);

  const fetchWhitelist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setWhitelist(data.whitelist || []);
      }
    } catch (err) {
      console.error('Error fetching whitelist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    if (!clean || clean.length < 3) {
      setFeedback({ type: 'error', message: 'Ingresa un dominio válido (ej. miempresa.com).' });
      return;
    }

    if (whitelist.includes(clean)) {
      setFeedback({ type: 'error', message: 'Ese dominio ya se encuentra en la whitelist.' });
      return;
    }

    try {
      const res = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: 'default',
          action: 'add',
          domain: clean,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWhitelist(data.whitelist);
        setNewDomain('');
        setFeedback({ type: 'success', message: `Dominio "${clean}" añadido a la whitelist con éxito.` });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error al conectar con la API.' });
    }
  };

  const handleRemoveDomain = async (domainToRemove: string) => {
    try {
      const res = await fetch('/api/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: 'default',
          action: 'remove',
          domain: domainToRemove,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWhitelist(data.whitelist);
        setFeedback({ type: 'success', message: `Dominio "${domainToRemove}" eliminado de la whitelist.` });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error al eliminar dominio.' });
    }
  };

  const verifyDomainTest = () => {
    const clean = testDomainInput.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    const isWhitelisted = whitelist.some(w => clean === w || clean.endsWith(`.${w}`));
    setTestResult(isWhitelisted);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Gestión de Whitelist de Dominios Confiables
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Los dominios agregados a la whitelist son considerados legítimos y no activarán penalizaciones de riesgo
              ni alertas a los moderadores.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-indigo-300 font-mono border border-slate-700 w-fit">
            {whitelist.length} dominios autorizados
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Domain List */}
        <div className="lg:col-span-7 space-y-4">
          {/* Add Domain Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <form onSubmit={handleAddDomain} className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="ejemplo: servidor-oficial.com, twitch.tv..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                id="add-domain-btn"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Añadir Dominio
              </button>
            </form>

            {feedback && (
              <div className={`mt-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-300 border border-red-500/30'
              }`}>
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{feedback.message}</span>
              </div>
            )}
          </div>

          {/* List of Whitelisted Domains */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Dominios Permitidos Actualmente
              </span>
              <span className="text-[11px] text-slate-500">
                Soporta coincidencias exactas y subdominios (*.dominio)
              </span>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Cargando whitelist...</div>
            ) : whitelist.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No hay dominios en la lista blanca.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
                {whitelist.map((domain, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono text-xs text-slate-200">{domain}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveDomain(domain)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded transition-colors"
                      title="Eliminar de la whitelist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Whitelist Live Tester & Safety Explanation */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Domain Verifier */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-400" />
              Comprobador de Dominio
            </h3>
            <p className="text-xs text-slate-400">
              Verifica al instante si una URL o subdominio está cubierto por la whitelist activa.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={testDomainInput}
                onChange={(e) => {
                  setTestDomainInput(e.target.value);
                  setTestResult(null);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={verifyDomainTest}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                Comprobar Estado
              </button>
            </div>

            {testResult !== null && (
              <div className={`p-3 rounded-lg text-xs border ${
                testResult
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}>
                {testResult ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span><strong>Autorizado:</strong> El dominio está en la whitelist y no generará alertas falsas.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                    <span><strong>No presente:</strong> Será evaluado mediante las reglas de detección heurística estándar.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security Note on Typosquatting */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-300 space-y-2.5">
            <h4 className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              Seguridad Anti-Spoofing en la Whitelist
            </h4>
            <p className="text-slate-400 leading-relaxed">
              La lista blanca requiere coincidencia de sufijo exacto de dominio (ejemplo: <code className="text-emerald-300">discord.com</code> valida <code className="text-emerald-300">support.discord.com</code>).
            </p>
            <p className="text-slate-400 leading-relaxed">
              Variaciones maliciosas como <code className="text-red-300">dlscord.com</code>, <code className="text-red-300">discord-nitro.gift</code> o <code className="text-red-300">steancommunity.com</code> <strong>NO</strong> serán autorizadas, ya que son dominios completamente distintos y serán bloqueadas por el motor de typosquatting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
