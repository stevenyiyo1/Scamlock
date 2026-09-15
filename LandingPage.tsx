import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  ExternalLink,
  EyeOff,
  FileCheck,
  FileCode,
  FileText,
  FileWarning,
  Globe,
  Layers,
  LifeBuoy,
  Lock,
  PlayCircle,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck,
  Users,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { analyzeMessage } from '../../bot/analyzer/riskEngine';
import { Link } from '../../context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from '../../data/branding';
import { PageNavButtons } from './PageNavButtons';

const SAMPLE_INSPECTOR_PROMPTS = [
  {
    title: 'Scam Financiero Zero-URL (Promesa $7k + DM)',
    text: 'help the first 15 people interested on how to start earning $7k within 24hours, but you will reimburse me 10% of your profits when you receive it. Note: only interested people should send a friend request or send me a dm! ask me HOW!',
  },
  {
    title: 'Phishing Nitro Falso (Dominio .gift)',
    text: '🎉 Discord 9th Anniversary Giveaway! Claim your 3-MONTH FREE NITRO here: https://discord-nitro.gift/claim?promo=free hurry only 10 left!',
  },
  {
    title: 'Suplantación de Staff (Robo de Código 2FA)',
    text: 'URGENT: This is Discord Security Support. Your account was flagged for illegal activity and will be suspended in 10 minutes. Send your 2FA backup code to verify ownership.',
  },
  {
    title: 'Archivo Sospechoso Disfrazado (.scr / .exe)',
    text: 'Check out the beta test of our new game! Download installer: http://steam-beta-update.xyz/GameSetup.scr.exe and send feedback.',
  },
  {
    title: 'Mensaje Limpio / Conversación Comunitaria',
    text: 'Hola a todos, ¡recuerden que esta noche a las 20:00 UTC tenemos noche de juegos en el servidor! Nos vemos en el canal de voz.',
  },
];

export const LandingPage: React.FC = () => {
  const [inputText, setInputText] = useState(SAMPLE_INSPECTOR_PROMPTS[0].text);
  const [analysisResult, setAnalysisResult] = useState(() => analyzeMessage(SAMPLE_INSPECTOR_PROMPTS[0].text));

  const handleInspect = (text: string) => {
    setInputText(text);
    const result = analyzeMessage(text);
    setAnalysisResult(result);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-400 bg-red-950/60 border-red-800/80';
    if (score >= 60) return 'text-orange-400 bg-orange-950/60 border-orange-800/80';
    if (score >= 30) return 'text-amber-400 bg-amber-950/60 border-amber-800/80';
    return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80';
  };

  // The 9 threat categories explicitly specified by the user
  const threatVectors = [
    {
      title: 'Phishing',
      icon: ShieldAlert,
      desc: 'Páginas falsificadas que imitan portales legítimos para cosechar contraseñas, tokens y credenciales de acceso.',
      tag: 'Phishing Interception',
    },
    {
      title: 'Estafas',
      icon: AlertOctagon,
      desc: 'Promociones engañosas, falsos sorteos de Discord Nitro, regalos de Steam y fraudes dirigidos a miembros de la comunidad.',
      tag: 'Scam Detection',
    },
    {
      title: 'Enlaces Maliciosos',
      icon: Zap,
      desc: 'URLs con descargas automáticas (drive-by), exploits de navegador y redirecciones peligrosas no autorizadas.',
      tag: 'Malicious Links',
    },
    {
      title: 'Ingeniería Social',
      icon: Users,
      desc: 'Patrones de manipulación psicológica, creación de urgencia artificial, presión temporal y solicitudes fraudulentas en privado.',
      tag: 'Social Engineering',
    },
    {
      title: 'Scams Financieros',
      icon: Sparkles,
      desc: 'Detección de esquemas Ponzi, promesas de ganancias astronómicas en 24h, comisiones adelantadas y captación sin URL.',
      tag: 'Zero-URL Scams',
    },
    {
      title: 'Suplantación de Identidad',
      icon: UserCheck,
      desc: 'Falsos moderadores, supuestos agentes del soporte de Discord o administradores exigiendo códigos 2FA o contraseñas.',
      tag: 'Impersonation Guard',
    },
    {
      title: 'Archivos Peligrosos',
      icon: FileWarning,
      desc: 'Detección de archivos con extensiones dobles o ejecutables maliciosos (.exe, .scr, .bat, .vbs) disfrazados de capturas o juegos.',
      tag: 'Dangerous Attachments',
    },
    {
      title: 'Typosquatting',
      icon: Search,
      desc: 'Dominios que imitan marcas reales con variaciones de letras (ej. disccord, steamcommunityy) calculados con distancia Levenshtein.',
      tag: 'Typosquatting Engine',
    },
    {
      title: 'URLs Sospechosas',
      icon: Globe,
      desc: 'Bloqueo de TLDs de alto riesgo (.xyz, .gift, .top, .ru), registradores desechables y acortadores de enlaces ocultos.',
      tag: 'Suspicious Domains',
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-6">
        {/* Subtle red ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Security badge pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono font-medium shadow-inner">
          <Shield className="w-3.5 h-3.5 text-red-500" />
          <span>MOTOR HEURÍSTICO DE CIBERSEGURIDAD PARA DISCORD</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Seguridad Preventiva y Anti-Phishing para{' '}
          <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent">
            Comunidades de Discord
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          <strong className="text-white">Scam Lock</strong> analiza mensajes en tiempo real para detectar enlaces fraudulentos, ingeniería social, suplantación de staff y esquemas financieros antes de que afecten a tus miembros.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <a
            id="hero-add-to-discord-btn"
            href={DEFAULT_BRAND_CONFIG.discordInviteUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-semibold text-sm shadow-xl shadow-red-950/60 border border-red-500/40 transition-all active:scale-95"
          >
            <Shield className="w-4 h-4 text-white" />
            <span>Añadir a Discord</span>
            <ExternalLink className="w-3.5 h-3.5 text-red-200" />
          </a>

          <Link
            id="hero-open-console-btn"
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-800 hover:border-red-900/60 font-semibold text-sm transition-all"
          >
            <PlayCircle className="w-4 h-4 text-red-500" />
            <span>Probar Consola Interactiva</span>
          </Link>

          <Link
            id="hero-security-architecture-btn"
            href="/security"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-transparent hover:bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 font-mono text-xs transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Arquitectura & Auditoría</span>
          </Link>
        </div>

        {/* Honest Security Disclaimer Pill */}
        <div className="pt-3 max-w-xl mx-auto">
          <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-800 text-left flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              <strong className="text-zinc-200 font-semibold">Aviso de Responsabilidad y Ciberseguridad:</strong>{' '}
              Scam Lock opera como una capa preventiva de defensa en profundidad (defense-in-depth). Ningún sistema de seguridad puede garantizar la detección del 100% de las amenazas emergentes o del engaño humano.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE 9 THREAT VECTORS (User requested explicitly) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-red-500 uppercase font-bold tracking-wider">
            Capacidades del Motor
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            9 Vectores de Amenaza Monitoreados
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Scam Lock correlaciona múltiples factores heurísticos para neutralizar campañas maliciosas en canales públicos:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {threatVectors.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-850 hover:border-red-900/50 hover:bg-zinc-900/40 transition-all space-y-3 group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-red-900/60 flex items-center justify-center text-red-500 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    {v.tag}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-red-300 transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                    {v.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE THREAT INSPECTOR */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800/90 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-red-500" />
              <span>Demostración Heurística en Vivo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Probador de Mensajes en Tiempo Real
            </h2>
            <p className="text-xs text-zinc-400">
              Prueba un mensaje sospechoso y observa la evaluación heurística con puntuación de 0 a 100.
            </p>
          </div>

          <Link
            id="inspector-full-console-link"
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-xs text-zinc-200 border border-zinc-700 hover:border-red-900/60 font-semibold transition-colors self-start sm:self-auto font-mono"
          >
            <PlayCircle className="w-3.5 h-3.5 text-red-500" />
            <span>Abrir Consola Completa</span>
          </Link>
        </div>

        {/* Quick Example Selector Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-400 font-mono">
            Selecciona un caso de prueba para evaluar:
          </label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_INSPECTOR_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                id={`inspector-prompt-${idx}`}
                onClick={() => handleInspect(sample.text)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  inputText === sample.text
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/50 border border-red-500'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 border border-zinc-800'
                }`}
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea & Analyze Trigger */}
        <div className="space-y-2">
          <textarea
            id="inspector-message-input"
            value={inputText}
            onChange={(e) => handleInspect(e.target.value)}
            rows={3}
            className="w-full p-4 rounded-xl bg-black border border-zinc-800 text-sm text-zinc-100 font-mono focus:outline-none focus:border-red-500/70 transition-colors placeholder:text-zinc-600"
            placeholder="Escribe o pega aquí un mensaje sospechoso para evaluarlo en vivo..."
          />
        </div>

        {/* Inspection Result Box */}
        <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-zinc-400 uppercase">Puntaje de Riesgo:</span>
              <span
                id="inspector-risk-score"
                className={`text-xl font-mono font-black px-3 py-1 rounded-xl border ${getScoreColor(
                  analysisResult.score
                )}`}
              >
                {analysisResult.score}/100
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                [{analysisResult.level}]
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>Acción sugerida:</span>
              <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-200 font-semibold">
                {analysisResult.actionTaken === 'deleted_and_alerted' || analysisResult.score >= 80
                  ? 'Eliminar Mensaje + Alerta Inmediata'
                  : analysisResult.actionTaken === 'alerted' || analysisResult.score >= 60
                  ? 'Notificación a Moderación'
                  : analysisResult.actionTaken === 'logged' || analysisResult.score >= 31
                  ? 'Registro en Auditoría'
                  : 'Permitido (Mensaje Seguro)'}
              </span>
            </div>
          </div>

          {/* Factores Detectados */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-400 font-mono">
              Vectores Heurísticos Identificados ({analysisResult.factors.length}):
            </div>
            {analysisResult.factors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {analysisResult.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-black border border-zinc-800 text-xs font-mono flex items-start gap-2 text-zinc-300"
                  >
                    <span className="text-red-500 font-bold flex-shrink-0">
                      +{factor.points ?? (factor as any).weight ?? 0}
                    </span>
                    <div>
                      <span className="text-zinc-200 block font-sans">{factor.description}</span>
                      {factor.evidence && (
                        <span className="text-[11px] text-zinc-500 font-mono block truncate">
                          Evidencia: "{factor.evidence}"
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-black border border-zinc-800 text-xs text-emerald-400 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No se detectaron vectores maliciosos en este mensaje.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. DEFENSE IN DEPTH ARCHITECTURE */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-red-500 uppercase font-bold tracking-wider">
            Arquitectura del Sistema
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Flujo de Protección en 4 Fases
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Diseñado con el principio de mínima latencia y cero retención de mensajes seguros:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-red-500 font-bold">
              <span className="w-6 h-6 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-xs">
                1
              </span>
              <span>Ingestión Efímera</span>
            </div>
            <h4 className="font-bold text-sm text-white">Gateway WebSocket</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              El bot recibe el evento <code className="text-zinc-300 font-mono">messageCreate</code> en memoria RAM volátil. No se guarda en disco.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-red-500 font-bold">
              <span className="w-6 h-6 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-xs">
                2
              </span>
              <span>Análisis Heurístico</span>
            </div>
            <h4 className="font-bold text-sm text-white">Evaluación &lt;15ms</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Comprobación simultánea de URLs, typosquatting Levenshtein, TLDs desechables, tokens y fraudes financieros.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-red-500 font-bold">
              <span className="w-6 h-6 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-xs">
                3
              </span>
              <span>Calibración & Filtro</span>
            </div>
            <h4 className="font-bold text-sm text-white">Anti Falsos Positivos</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Aplica excepciones de contexto educativo, lista blanca de dominios comunitarios y análisis gramatical.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-red-500 font-bold">
              <span className="w-6 h-6 rounded-full bg-red-950/60 border border-red-800/60 flex items-center justify-center text-xs">
                4
              </span>
              <span>Acción Inmediata</span>
            </div>
            <h4 className="font-bold text-sm text-white">Despacho de Política</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Si supera el umbral, se elimina el mensaje, se aísla la cuenta comprometida y se alerta al equipo en el canal de logs.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY & TRANSPARENCY COMMITMENT */}
      <section className="p-8 rounded-3xl bg-zinc-950/90 border border-zinc-800 space-y-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-900/50 text-red-400 text-xs font-mono">
            <EyeOff className="w-3.5 h-3.5 text-red-500" />
            <span>TRANSPARENCIA TOTAL & PRIVACIDAD POR DISEÑO</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Nuestros Compromisos con los Servidores y Usuarios
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Scam Lock fue creado para proteger a los usuarios de Discord, no para recopilar sus datos privados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Sin Archivo de Conversaciones</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Los mensajes cotidianos que resultan seguros se descartan de la memoria RAM inmediatamente tras ser analizados.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Sin Venta ni Comercio de Datos</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Jamás comercializamos, compartimos ni monetizamos información de los usuarios o servidores con terceros.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Sin Acceso a Mensajes Privados (DMs)</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              El bot únicamente evalúa canales de texto del servidor donde los administradores le hayan otorgado permisos.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION & GITHUB PAGES READINESS */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-zinc-800 text-center space-y-6 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Protege Tu Comunidad de Discord Hoy Mismo
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Añade el bot oficial a tu servidor o descarga el proyecto para autohospedarlo en tu propia infraestructura con Node.js y Discord.js.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            id="bottom-invite-btn"
            href={DEFAULT_BRAND_CONFIG.discordInviteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all shadow-lg shadow-red-950/60 border border-red-500/40"
          >
            <span>Invitar Scam Lock a mi Servidor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <Link
            id="bottom-support-btn"
            href="/support"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 text-xs font-semibold transition-colors"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-red-400" />
            <span>Centro de Ayuda & FAQ</span>
          </Link>
        </div>
      </section>

      {/* 7. CROSS-PAGE NAVIGATION FOOTER */}
      <PageNavButtons currentPage="home" />
    </div>
  );
};
