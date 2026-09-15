import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Code,
  Copy,
  Download,
  ExternalLink,
  Key,
  Play,
  Send,
  Shield,
  Terminal,
} from 'lucide-react';
import React, { useState } from 'react';

export const SetupGuideView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [clientIdInput, setClientIdInput] = useState<string>('');
  const [customTokenInput, setCustomTokenInput] = useState<string>('');
  const [deployResult, setDeployResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDeployCommands = async () => {
    setIsDeploying(true);
    setDeployResult(null);
    try {
      const res = await fetch('/api/deploy-commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: customTokenInput || undefined,
          clientId: clientIdInput || undefined,
        }),
      });
      const data = await res.json();
      setDeployResult(data);
    } catch (err) {
      setDeployResult({ success: false, message: (err as Error).message });
    } finally {
      setIsDeploying(false);
    }
  };

  const generatedInviteUrl = clientIdInput.trim()
    ? `https://discord.com/api/oauth2/authorize?client_id=${clientIdInput.trim()}&permissions=1113088&scope=bot%20applications.commands`
    : null;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Guía Completa de Instalación y Ejecución de Scam Lock
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Sigue estos sencillos pasos para registrar el bot en Discord Developer Portal, invitarlo a tu servidor
          con los permisos mínimos y ejecutarlo en tu máquina o servidor local.
        </p>
      </div>

      {/* Direct Download ZIP Card */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CÓDIGO FUENTE ACTUALIZADO
            </span>
            <h3 className="font-bold text-white text-base">Descargar Archivo ZIP (scamlock-bot.zip)</h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Incluye todo el código fuente listo para producción: el nuevo analizador financiero (Zero-URL), motor heurístico, Discord.js v14, TypeScript, Dockerfile y panel web interactivo.
          </p>
        </div>
        <a
          id="setup-download-zip-btn"
          href="/scamlock-bot.zip"
          download="scamlock-bot.zip"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow flex items-center gap-2 transition-colors whitespace-nowrap border border-indigo-400/30"
        >
          <Download className="w-4 h-4" />
          Descargar ZIP (.zip)
        </a>
      </div>

      {/* Step 1: Discord Developer Portal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-500/40">
            1
          </span>
          <h3 className="font-bold text-white text-base">Crear la Aplicación en Discord Developer Portal</h3>
        </div>
        <div className="text-xs text-slate-300 space-y-2 pl-8">
          <p>
            1. Ingresa a <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-1">Discord Developer Portal <ExternalLink className="w-3 h-3" /></a> con tu cuenta de Discord.
          </p>
          <p>
            2. Haz clic en <strong>New Application</strong> y dale el nombre <strong>Scam Lock</strong>.
          </p>
          <p>
            3. En la sección <strong>Bot</strong>, haz clic en <strong>Reset Token</strong> para obtener tu token secreto. Guárdalo de forma segura.
          </p>
        </div>
      </div>

      {/* Step 2: Privileged Gateway Intents */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-500/40">
            2
          </span>
          <h3 className="font-bold text-white text-base">Activar el Privileged Intent: "Message Content Intent" (Crítico)</h3>
        </div>
        <div className="text-xs text-slate-300 space-y-2.5 pl-8">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Requisito obligatorio de Discord:</strong> Para que Scam Lock pueda leer y analizar el texto de los mensajes y detectar enlaces fraudulentos antes de que dañen a los miembros, debes activar el <strong>Message Content Intent</strong>.
            </span>
          </div>
          <p>
            En el Discord Developer Portal, ve a la pestaña <strong>Bot</strong>, baja hasta la sección <strong>Privileged Gateway Intents</strong> y activa el interruptor de <strong>MESSAGE CONTENT INTENT</strong>.
          </p>
        </div>
      </div>

      {/* Step 3: Invite Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-500/40">
            3
          </span>
          <h3 className="font-bold text-white text-base">Generador de Enlace de Invitación (Permisos Mínimos)</h3>
        </div>
        <div className="text-xs text-slate-300 space-y-3 pl-8">
          <p>
            Scam Lock sigue el principio de privilegio mínimo. Solo requiere:
            <span className="text-indigo-300 font-mono"> Ver Canales, Enviar Mensajes, Gestionar Mensajes (para auto-delete crítico) y Adjuntar Enlaces/Embeds.</span>
          </p>

          <div className="space-y-2">
            <label className="block text-slate-400 font-semibold">
              Pega tu Client ID (Application ID) de Discord:
            </label>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Ejemplo: 129384729102938472"
                value={clientIdInput}
                onChange={(e) => setClientIdInput(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono flex-1 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {generatedInviteUrl && (
              <div className="mt-3 p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-lg flex items-center justify-between gap-3">
                <span className="text-xs text-indigo-200 truncate font-mono">{generatedInviteUrl}</span>
                <a
                  href={generatedInviteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold whitespace-nowrap flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Invitar al Servidor
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 4: Environment Variables */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-500/40">
            4
          </span>
          <h3 className="font-bold text-white text-base">Configurar Variables de Entorno (.env)</h3>
        </div>
        <div className="text-xs text-slate-300 space-y-2.5 pl-8">
          <p>Crea o edita tu archivo <code className="text-indigo-300">.env</code> en la raíz del proyecto:</p>
          <div className="relative">
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 overflow-x-auto">
{`# Token de bot obtenido en Discord Developer Portal
DISCORD_TOKEN="tu_token_aqui"

# Client ID de tu aplicación en Discord
DISCORD_CLIENT_ID="tu_client_id_aqui"

# Opcional: ID de servidor para registro instantáneo de comandos en desarrollo
DISCORD_GUILD_ID=""`}
            </pre>
            <button
              onClick={() => copyCode(`DISCORD_TOKEN="tu_token_aqui"\nDISCORD_CLIENT_ID="tu_client_id_aqui"\nDISCORD_GUILD_ID=""`, 'env')}
              className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              title="Copiar contenido"
            >
              {copiedSection === 'env' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Step 5: Register Slash Commands */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-500/40">
            5
          </span>
          <h3 className="font-bold text-white text-base">Registrar los Comandos Slash en la API de Discord</h3>
        </div>
        <div className="text-xs text-slate-300 space-y-3 pl-8">
          <p>
            Ejecuta el script de registro con npm para sincronizar los comandos <code className="text-indigo-300">/scamlock</code>:
          </p>

          <div className="relative">
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200">
              npm run deploy-commands
            </pre>
            <button
              onClick={() => copyCode('npm run deploy-commands', 'deploy-cmd')}
              className="absolute right-2 top-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              title="Copiar comando"
            >
              {copiedSection === 'deploy-cmd' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Direct registration test from UI */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <span className="text-slate-300 font-semibold block">O prueba el registro directamente desde aquí:</span>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Token de bot temporal (opcional si ya está en .env)"
                value={customTokenInput}
                onChange={(e) => setCustomTokenInput(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono flex-1 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleDeployCommands}
                disabled={isDeploying}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-medium transition-colors whitespace-nowrap"
              >
                {isDeploying ? 'Registrando...' : 'Registrar Comandos'}
              </button>
            </div>

            {deployResult && (
              <div className={`p-2.5 rounded text-xs ${
                deployResult.success
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}>
                {deployResult.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 6: Start Bot Locally */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-500/40">
            6
          </span>
          <h3 className="font-bold text-white text-base">Ejecutar Scam Lock Localmente</h3>
        </div>
        <div className="text-xs text-slate-300 space-y-2.5 pl-8">
          <p>Puedes ejecutar el bot junto con el Dashboard web o como proceso exclusivo de Discord:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-semibold text-white block">Opción A: Bot + Dashboard Web</span>
              <pre className="text-indigo-300 font-mono text-xs">npm run dev</pre>
              <p className="text-slate-400 text-[11px]">Inicia el bot de Discord y el panel web en http://localhost:3000</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
              <span className="font-semibold text-white block">Opción B: Solo Bot de Discord (CLI)</span>
              <pre className="text-indigo-300 font-mono text-xs">npm run bot</pre>
              <p className="text-slate-400 text-[11px]">Ejecuta el bot de Discord como demonio ligero en consola</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
