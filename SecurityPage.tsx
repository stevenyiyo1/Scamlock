import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  Bug,
  CheckCircle2,
  Code2,
  Cpu,
  EyeOff,
  FileCode,
  FileWarning,
  Key,
  Layers,
  Lock,
  Mail,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Zap
} from 'lucide-react';
import React from 'react';
import { Link } from '../../context/RouterContext';
import { DEFAULT_BRAND_CONFIG } from '../../data/branding';
import { PageNavButtons } from './PageNavButtons';
import { PlaceholderNotice } from './PlaceholderNotice';

export const SecurityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Top Breadcrumb & Return to Home */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <Link
          id="security-back-home-top"
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
          <span>Volver al Inicio</span>
        </Link>
        <span className="text-[11px] font-mono text-zinc-500">
          Centro de Seguridad, Auditoría & Confianza
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/60 text-red-400 text-xs font-mono">
          <Lock className="w-3.5 h-3.5 text-red-500" />
          <span>ARQUITECTURA DE SEGURIDAD & DEFENSA EN PROFUNDIDAD</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Seguridad, Auditoría y Transparencia de {DEFAULT_BRAND_CONFIG.projectName}
        </h1>
        <p className="text-sm text-zinc-300 leading-relaxed max-w-2xl">
          Conoce en detalle cómo opera técnicamente Scam Lock, los permisos estrictos que solicita a la API de Discord y nuestras políticas de divulgación responsable de vulnerabilidades.
        </p>
      </div>

      {/* Operator Customization Banner */}
      <PlaceholderNotice pageName="Seguridad y Confianza" />

      {/* Realistic Defense-in-Depth Disclaimer */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-red-900/50 space-y-2.5 shadow-xl">
        <div className="flex items-center gap-2 text-red-400 font-bold text-xs font-mono uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>Principio de Realidad: Ningún Software Detecta el 100% de Amenazas</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          En ciberseguridad profesional, prometer un 100% de eficacia frente a amenazas desconocidas es engañoso e irresponsable. Los ciberdelincuentes crean constantemente nuevos vectores de ataque, dominios recién registrados y textos con variaciones morfológicas.
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          <strong className="text-zinc-200">Scam Lock opera como una capa de defensa en profundidad (defense-in-depth):</strong> neutraliza de forma automática y fulminante la gran mayoría de campañas masivas de phishing, scams financieros y malware, permitiendo a los moderadores humanos concentrarse en la gestión de su comunidad.
        </p>
      </div>

      {/* Discord Gateway Permissions & Intents Audit Table */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
            <Key className="w-4 h-4 text-red-500" />
            <span>Auditoría de Permisos e Intents de Discord</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Por Qué Solicitamos Cada Permiso y Cómo lo Protegemos
          </h2>
          <p className="text-xs text-zinc-400">
            Scam Lock sigue el principio del mínimo privilegio necesario para cumplir su cometido de protección:
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 border-b border-zinc-850 font-mono font-bold text-zinc-400 bg-zinc-900/60 uppercase text-[11px]">
            <div>Permiso / Intent</div>
            <div>Justificación Operativa</div>
            <div>Medida de Salvaguarda</div>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 border-b border-zinc-850 gap-2">
            <div className="font-mono font-bold text-white">
              <span className="text-red-400">MessageContent</span> (Gateway Intent)
            </div>
            <div className="text-zinc-300">
              Permite examinar el texto de mensajes y URLs en canales públicos autorizados para calcular la puntuación heurística de riesgo.
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">
              Inspección en memoria volátil (RAM); descarte en milisegundos para mensajes legítimos. Sin archivo en disco.
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 border-b border-zinc-850 gap-2">
            <div className="font-mono font-bold text-white">
              <span className="text-red-400">Manage Messages</span> (Gestionar Mensajes)
            </div>
            <div className="text-zinc-300">
              Permite suprimir mensajes confirmados como phishing o scam antes de que otros usuarios hagan clic en el enlace malicioso.
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">
              Solo se ejecuta cuando el umbral supera la política configurada por los administradores del servidor.
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 border-b border-zinc-850 gap-2">
            <div className="font-mono font-bold text-white">
              <span className="text-red-400">Moderate Members</span> (Aislar Miembros)
            </div>
            <div className="text-zinc-300">
              Permite aplicar un timeout temporal a cuentas comprometidas que propagan spam masivo de phishing mientras el usuario recupera el control.
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">
              Sujeto a la jerarquía de roles de Discord; nunca afecta a administradores ni roles superiores al bot.
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-2">
            <div className="font-mono font-bold text-white">
              <span className="text-red-400">Send Messages & Embeds</span> (Enviar Mensajes)
            </div>
            <div className="text-zinc-300">
              Permite emitir reportes de seguridad en el canal de auditoría privado configurado por el equipo de moderación.
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">
              Canal restringido únicamente al personal autorizado del servidor.
            </div>
          </div>
        </div>
      </section>

      {/* Multi-vector Analysis Engine Breakdown */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-red-500" />
            <span>Módulos de Inspección Heurística</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Cómo Funciona el Motor de Detección en Tiempo Real
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-red-500" />
              <span>Algoritmo Levenshtein para Typosquatting</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Calcula la distancia de edición entre los dominios incluidos en los mensajes y marcas oficiales (como <code className="text-zinc-200">discord.com</code>, <code className="text-zinc-200">steamcommunity.com</code>). Detecta sustituciones tramposas como <code className="text-red-300">disccord-app.net</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              <span>Motor Zero-URL de Scams Financieros</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Identifica estafas que no contienen enlaces mediante análisis de patrones lingüísticos: promesas de beneficios en 24h, exigencia de comisiones posteriores y solicitud obligatoria de mensajes directos ("DM me").
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-red-500" />
              <span>Filtro de Archivos y Extensiones Peligrosas</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Detecta archivos adjuntos con extensiones ejecutables o de scripting (<code className="text-zinc-200">.exe</code>, <code className="text-zinc-200">.scr</code>, <code className="text-zinc-200">.bat</code>, <code className="text-zinc-200">.vbs</code>) y técnicas de doble extensión fraudulentas comunes en Discord.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-500" />
              <span>Calibración Dinámica Anti Falsos Positivos</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Integra listas blancas comunitarias de confianza y descuentos de riesgo en contextos de advertencia educativa entre miembros legítimos para minimizar interrupciones innecesarias.
            </p>
          </div>
        </div>
      </section>

      {/* Responsible Vulnerability Disclosure Policy */}
      <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
          <Bug className="w-4 h-4 text-red-500" />
          <span>Programa de Divulgación Responsable de Vulnerabilidades</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          Reportar una Falla de Seguridad en Scam Lock
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed">
          Si eres un investigador de seguridad o usuario y has descubierto una vulnerabilidad técnica en el bot o en este sitio web, agradecemos enormemente tu reporte responsable:
        </p>

        <div className="p-4 rounded-xl bg-black border border-zinc-850 space-y-2 text-xs text-zinc-300 font-mono">
          <div>
            <span className="text-zinc-500">Correo de divulgación responsable:</span>{' '}
            <code className="text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/60 font-bold">
              {DEFAULT_BRAND_CONFIG.securityEmail}
            </code>
          </div>
          <div>
            <span className="text-zinc-500">Plazo de acuse de recibo inicial:</span>{' '}
            <span className="text-zinc-200">Menos de 48 horas laborables.</span>
          </div>
          <div>
            <span className="text-zinc-500">Compromiso:</span>{' '}
            <span className="text-zinc-200">No emprender acciones legales contra investigadores que actúen de buena fe sin comprometer datos de terceros.</span>
          </div>
        </div>

        <p className="text-xs text-zinc-400">
          Por favor incluye en tu reporte los pasos detallados para reproducir el fallo (PoC), el vector de ataque identificado y el impacto estimado.
        </p>
      </section>

      {/* Cross-page Navigation Footer */}
      <PageNavButtons currentPage="security" />
    </div>
  );
};
