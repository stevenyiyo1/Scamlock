import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Flame,
  Gift,
  Info,
  Key,
  Link as LinkIcon,
  Play,
  RotateCcw,
  Send,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AnalysisResult, RiskFactor } from '../types/scamlock';

const PRESET_MESSAGES = [
  {
    name: '⚠️ Caso Crítico (Falso Negativo Original Corregido)',
    category: 'financial_scam',
    content: 'help the first 15 people interested on how to start earning $7k within 24hours, but you will reimburse me 10% of your profits when you receive it. Note: only interested people should send a friend request or send me a dm! ask me HOW!',
  },
  {
    name: '💸 1. Promesa $10,000 en un día + DM',
    category: 'financial_scam',
    content: 'Earn $10,000 in one day! DM me!',
  },
  {
    name: '📈 2. Inversión irreal mañana ($100 → $1,000)',
    category: 'financial_scam',
    content: 'Invest $100 and receive $1,000 tomorrow!',
  },
  {
    name: '⏳ 3. Escasez artificial + Ganancia $5k semanal',
    category: 'financial_scam',
    content: 'First 20 people can make $5k this week.',
  },
  {
    name: '📩 4. Reclutamiento DM aislado (Sin dinero - Bajo riesgo)',
    category: 'clean',
    content: "Send me a DM and I'll explain how.",
  },
  {
    name: '💼 5. Test Negativo: Negocio legítimo',
    category: 'clean',
    content: 'I made money from this legitimate business.',
  },
  {
    name: '🛡️ 6. Test Negativo: Advertencia educativa sobre estafas',
    category: 'clean',
    content: 'This scam promises $10k in 24 hours.',
  },
  {
    name: '💬 7. Mensaje normal de chat',
    category: 'clean',
    content: 'Hey guys, are we playing Valorant tonight on Discord?',
  },
  {
    name: '🌐 8. Scam financiero + Enlace sospechoso externo',
    category: 'financial_scam',
    content: 'Earn $5,000 daily with automated trading! Sign up now at http://fast-profit-crypto.xyz and DM me for access',
  },
  {
    name: '🎁 Phishing Discord Nitro (Con URL)',
    category: 'nitro',
    content: '🚨 OMG guys discord is celebrating! FREE 3 MONTHS OF DISCORD NITRO for everyone: https://discord-nitro.gift/claim?promo=free99 Hurry only 20 spots left!',
  },
  {
    name: '🚨 Suplantación Staff + 2FA (Sin URL)',
    category: 'social_engineering',
    content: 'Atención: Soy del equipo de Discord Staff. Tu cuenta será eliminada en 5 minutos por un reporte de seguridad. Pásame tu código 2FA y token inmediatamente para verificar tu identidad.',
  },
  {
    name: '🛡️ Enlace en Whitelist (Bajo Riesgo)',
    category: 'whitelisted',
    content: 'Check the official source code and documentation on our repository: https://github.com/developer/scam-lock-bot',
  },
];

interface MessageSimulatorProps {
  onLogCreated?: () => void;
}

export const MessageSimulator: React.FC<MessageSimulatorProps> = ({ onLogCreated }) => {
  const [inputMessage, setInputMessage] = useState<string>(PRESET_MESSAGES[0].content);
  const [authorTag, setAuthorTag] = useState<string>('SuspiciousUser#9821');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  // Evaluate message via API or internal calculation
  const runAnalysis = async (contentToTest: string, saveToLog: boolean = false) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentToTest,
          guildId: 'default',
          saveLog: saveToLog,
          authorTag: authorTag,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysis(data.analysis);
        if (saveToLog) {
          setSendSuccessMessage('¡Mensaje enviado y registrado en los logs de seguridad!');
          setTimeout(() => setSendSuccessMessage(null), 3500);
          if (onLogCreated) onLogCreated();
        }
      }
    } catch (err) {
      console.error('Error al analizar mensaje:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runAnalysis(inputMessage, false);
  }, []);

  const getScoreColor = (score: number) => {
    if (score <= 30) return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', badge: 'bg-emerald-500/10 text-emerald-300' };
    if (score <= 60) return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40', badge: 'bg-amber-500/10 text-amber-300' };
    if (score <= 80) return { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/40', badge: 'bg-orange-500/10 text-orange-300' };
    return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/40', badge: 'bg-red-500/10 text-red-300' };
  };

  const currentTheme = analysis ? getScoreColor(analysis.score) : getScoreColor(0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Simulador y Laboratorio de Detección Heurística
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Prueba cualquier mensaje en tiempo real para verificar el cálculo del Risk Score (0–100),
              desglose de factores y la acción que Scam Lock ejecutará.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Canal simulado:</span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-indigo-300 border border-slate-700">
              #chat-general
            </span>
          </div>
        </div>

        {/* Preset Quick Selectors */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Ejemplos de Ataques & Escenarios Reales:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_MESSAGES.map((preset, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                onClick={() => {
                  setInputMessage(preset.content);
                  runAnalysis(preset.content, false);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1.5"
              >
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Input & Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Message Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="message-input" className="text-sm font-semibold text-slate-200">
                Mensaje a Examinar
              </label>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400">Autor simulado:</label>
                <input
                  type="text"
                  value={authorTag}
                  onChange={(e) => setAuthorTag(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-200 w-36 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <textarea
                id="message-input"
                rows={5}
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  runAnalysis(e.target.value, false);
                }}
                placeholder="Escribe o pega aquí el mensaje que deseas que Scam Lock analice..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                id="analyze-btn"
                onClick={() => runAnalysis(inputMessage, false)}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {isAnalyzing ? 'Analizando...' : 'Reanalizar Mensaje'}
              </button>

              <button
                id="simulate-send-btn"
                onClick={() => runAnalysis(inputMessage, true)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                Simular Envío a Discord
              </button>
            </div>

            {sendSuccessMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{sendSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Action Explainer Box */}
          {analysis && (
            <div className={`p-4 rounded-xl border ${currentTheme.border} bg-slate-900/80 space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Acción Determinada por Scam Lock
                </span>
                <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${currentTheme.badge}`}>
                  {analysis.actionTaken === 'deleted_and_alerted' && '🚨 Eliminar + Alerta Inmediata'}
                  {analysis.actionTaken === 'alerted' && '🟠 Registrar + Alerta Moderación'}
                  {analysis.actionTaken === 'logged' && '🟡 Registro en Auditoría'}
                  {analysis.actionTaken === 'none' && '🟢 Permitido (Sin Acción)'}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed">
                {analysis.actionTaken === 'deleted_and_alerted' && (
                  <p className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Riesgo Crítico (Score {analysis.score}/100):</strong> El bot invocará <code className="text-red-300">message.delete()</code> inmediatamente en Discord y enviará una alerta prioritaria al canal de moderadores para prevenir que ningún miembro caiga en la trampa.
                    </span>
                  </p>
                )}
                {analysis.actionTaken === 'alerted' && (
                  <p className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Alto Riesgo (Score {analysis.score}/100):</strong> Se notifica inmediatamente al equipo de moderadores en el canal de alertas configurado con el desglose de sospecha. No se elimina automáticamente para evitar falsos positivos.
                    </span>
                  </p>
                )}
                {analysis.actionTaken === 'logged' && (
                  <p className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Nivel Sospechoso (Score {analysis.score}/100):</strong> Se archiva en los logs de seguridad silenciosos del servidor para auditoría sin interrumpir la conversación.
                    </span>
                  </p>
                )}
                {analysis.actionTaken === 'none' && (
                  <p className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Nivel Seguro (Score {analysis.score}/100):</strong> El mensaje no presenta patrones maliciosos conocidos ni dominios engañosos. Pasa libremente.
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Score Gauge & Factors Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          {analysis && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
              {/* Score Meter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    Evaluación de Risk Score
                  </span>
                  <span className={`text-sm font-bold ${currentTheme.text}`}>
                    {analysis.levelLabel} ({analysis.score} / 100)
                  </span>
                </div>

                {/* Visual Bar */}
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${currentTheme.bg}`}
                    style={{ width: `${Math.max(5, analysis.score)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-mono">
                  <span>0 (Bajo)</span>
                  <span>30</span>
                  <span>60 (Sospechoso)</span>
                  <span>80 (Alto)</span>
                  <span>100 (Crítico)</span>
                </div>
              </div>

              {/* Factors list */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Factores & Razones del Cálculo ({analysis.factors.length}):
                </h4>

                {analysis.factors.length === 0 ? (
                  <div className="p-3 bg-slate-800/50 rounded-lg text-slate-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    No se encontraron indicadores de riesgo en este mensaje.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {analysis.factors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-slate-800/70 border border-slate-700/60 rounded-lg text-xs flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <p className="text-slate-200 font-medium leading-tight">
                            {factor.description}
                          </p>
                          {factor.evidence && (
                            <p className="text-[11px] text-slate-400 font-mono">
                              Evidencia: <span className="text-amber-300 bg-amber-950/40 px-1 py-0.5 rounded">{factor.evidence}</span>
                            </p>
                          )}
                        </div>
                        <span className="font-mono font-bold text-amber-400 bg-amber-950/50 border border-amber-800/40 px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap">
                          +{factor.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Social Engineering Layer Diagnostic */}
              {analysis.socialEngineering && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                      Capa de Ingeniería Social (Zero-URL)
                    </h4>
                    {analysis.socialEngineering.isMultiSignalScam ? (
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        Multi-Señal ({analysis.socialEngineering.distinctSignalsCount}) • Sinergia +{analysis.socialEngineering.synergyBonus}
                      </span>
                    ) : analysis.socialEngineering.correlationLevel === 'single_signal' ? (
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        Mención Aislada (Segura)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-full">
                        Sin señales
                      </span>
                    )}
                  </div>

                  {analysis.socialEngineering.detectedSignals.length > 0 ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {analysis.socialEngineering.detectedSignals.map((sig, sIdx) => {
                          const icon =
                            sig.type === 'easy_money' ? <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> :
                            sig.type === 'suspicious_prize' ? <Gift className="w-3.5 h-3.5 text-purple-400" /> :
                            sig.type === 'artificial_urgency' ? <Clock className="w-3.5 h-3.5 text-amber-400" /> :
                            sig.type === 'indirect_redirect' ? <Share2 className="w-3.5 h-3.5 text-blue-400" /> :
                            sig.type === 'impersonation' ? <UserCheck className="w-3.5 h-3.5 text-red-400" /> :
                            <Key className="w-3.5 h-3.5 text-rose-400" />;

                          return (
                            <div
                              key={sIdx}
                              className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-start gap-2 text-xs"
                            >
                              <div className="mt-0.5 flex-shrink-0">{icon}</div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-slate-200 truncate">{sig.name}</span>
                                  <span className="text-[10px] font-mono text-slate-400 ml-1">+{sig.points}</span>
                                </div>
                                {sig.evidence && (
                                  <div className="text-[11px] font-mono text-amber-300/90 truncate mt-0.5">
                                    "{sig.evidence}"
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {analysis.detectedUrls.length === 0 && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                          <Info className="w-3 h-3 text-indigo-400" />
                          Detectado mediante análisis heurístico de comportamiento psicológico (sin URL requerida).
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800/50">
                      No se detectaron vectores de coerción psicológica, ofertas falsas ni suplantación.
                    </p>
                  )}
                </div>
              )}

              {/* Financial Scam Analyzer Diagnostic */}
              {analysis.financialScam && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Analizador Financiero (Zero-URL Get-Rich-Quick)
                    </h4>
                    {analysis.financialScam.hasEducationalContext ? (
                      <span className="text-[11px] font-medium text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-400" />
                        Contexto Educativo / Advertencia
                      </span>
                    ) : analysis.financialScam.isFinancialScam ? (
                      <span className="text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red-400" />
                        Scam Financiero Detectado ({analysis.financialScam.signalsCount} vectores)
                      </span>
                    ) : analysis.financialScam.signalsCount === 1 ? (
                      <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                        Mención Aislada (Segura)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-full">
                        Sin patrones financieros
                      </span>
                    )}
                  </div>

                  {analysis.financialScam.hasEducationalContext && (
                    <div className="p-2.5 bg-blue-950/30 border border-blue-800/40 rounded-lg text-xs text-blue-300 flex items-start gap-2 mb-2">
                      <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Filtro contextual activado:</span> El mensaje discute o advierte sobre estafas en lugar de promoverlas. Puntuación atenuada a 0 para prevenir falsos positivos.
                      </div>
                    </div>
                  )}

                  {analysis.financialScam.signals.length > 0 && !analysis.financialScam.hasEducationalContext && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {analysis.financialScam.signals.map((sig, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-start gap-2 text-xs"
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-200 truncate">{sig.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 ml-1">+{sig.points}</span>
                              </div>
                              {sig.evidence && (
                                <div className="text-[11px] font-mono text-amber-300/90 truncate mt-0.5">
                                  "{sig.evidence}"
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {analysis.financialScam.synergyBonus > 0 && (
                        <div className="p-2 bg-amber-950/30 border border-amber-800/40 rounded-lg text-xs text-amber-300 flex items-center justify-between">
                          <span>Sinergia Multi-Vector Financiero</span>
                          <span className="font-mono font-bold">+{analysis.financialScam.synergyBonus} pts</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Detected URLs section */}
              {analysis.detectedUrls.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-indigo-400" />
                    Enlaces Extraídos ({analysis.detectedUrls.length})
                  </h4>
                  <div className="space-y-1.5">
                    {analysis.detectedUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between overflow-x-auto"
                      >
                        <span className="truncate mr-2">{url}</span>
                        {analysis.isWhitelisted ? (
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded whitespace-nowrap">
                            En Whitelist
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded whitespace-nowrap">
                            No verificado
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Simulated Discord Embed Preview */}
          {analysis && analysis.score >= 31 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Vista Previa del Embed en Canal de Discord:
              </span>
              <div className="bg-[#2b2d31] p-3.5 rounded-lg border-l-4 border-l-red-500 font-sans text-xs text-slate-200 shadow-inner">
                <div className="flex items-center gap-2 font-bold text-[#f2f3f5] text-sm mb-1.5">
                  <span>{analysis.level === 'critical' ? '🔴' : analysis.level === 'high' ? '🟠' : '🟡'}</span>
                  <span>Scam Lock — Detección de Amenaza</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 block font-semibold">👤 Usuario</span>
                    <span>{authorTag}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">📊 Risk Score</span>
                    <span className="font-bold text-red-400">{analysis.score} / 100 ({analysis.levelLabel})</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 mb-2">
                  <span className="text-slate-400 block font-semibold">⚙️ Acción</span>
                  <span className="font-mono bg-[#1e1f22] px-1.5 py-0.5 rounded text-amber-300">
                    {analysis.actionTaken}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 border-t border-[#3f4147] pt-2">
                  <span className="text-slate-400 block font-semibold mb-1">💬 Contenido</span>
                  <div className="bg-[#1e1f22] p-2 rounded text-slate-300 italic">
                    "{inputMessage.substring(0, 120)}{inputMessage.length > 120 ? '...' : ''}"
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
