import {
  BookOpen,
  CheckCircle,
  Copy,
  FileText,
  Play,
  Settings,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

export const CommandsView: React.FC = () => {
  const [activeCommand, setActiveCommand] = useState<string>('status');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const commands = [
    {
      id: 'status',
      name: '/scamlock status',
      description: 'Muestra el estado operativo de Scam Lock en el servidor, latencia, métricas y canales activos.',
      permissions: 'Todos los miembros',
      parameters: 'Ninguno',
      sampleOutput: {
        title: '🛡️ Scam Lock — Estado Operativo del Sistema',
        color: 'border-l-emerald-500',
        fields: [
          { name: '⚙️ Estado en este servidor', value: '🟢 Activo & Protegiendo' },
          { name: '📡 Latencia WebSocket', value: '24ms' },
          { name: '📊 Umbrales de Seguridad', value: '• Alerta Moderación: Score ≥ 61\n• Eliminación Auto: Score ≥ 81' },
          { name: '📍 Canales Configurados', value: '• Alertas: #alertas-moderación\n• Logs: #scamlock-logs' },
          { name: '📈 Métricas Recientes', value: '• Mensajes analizados: 142\n• Amenazas bloqueadas: 18' },
        ],
      },
    },
    {
      id: 'test',
      name: '/scamlock test [mensaje]',
      description: 'Evalúa un mensaje o enlace sospechoso en tiempo real y muestra su desglose de puntuación y factores de riesgo.',
      permissions: 'Todos los miembros / Moderadores',
      parameters: 'mensaje: string (requerido)',
      sampleOutput: {
        title: '🧪 Scam Lock — Diagnóstico de Riesgo en Vivo',
        color: 'border-l-red-500',
        fields: [
          { name: '🎯 Risk Score', value: '85 / 100 — 🔴 Crítico' },
          { name: '⚡ Acción que se aplicaría', value: 'Eliminar mensaje y alertar inmediatamente al staff' },
          { name: '📝 Mensaje Evaluado', value: '🚨 FREE NITRO FOR EVERYONE: https://discord-nitro.gift/claim' },
          { name: '🔬 Factores Detectados', value: '• [+35 pts] Promesa de Discord Nitro gratis\n• [+40 pts] Uso de marca imitando discord.com (discord-nitro.gift)\n• [+10 pts] Presión con urgencia artificial' },
        ],
      },
    },
    {
      id: 'config',
      name: '/scamlock config [opciones]',
      description: 'Consulta o modifica los umbrales de alerta y eliminación, canales de notificación y activación.',
      permissions: 'Gestionar Servidor / Administrador',
      parameters: 'activo: boolean, canal-alertas: channel, canal-logs: channel, umbral-alerta: int, umbral-eliminar: int',
      sampleOutput: {
        title: '✅ Configuración Actualizada — Scam Lock',
        color: 'border-l-indigo-500',
        fields: [
          { name: 'Protección', value: '🟢 Activa' },
          { name: 'Umbral Alerta Moderación', value: 'Score ≥ 61' },
          { name: 'Umbral Eliminación Auto', value: 'Score ≥ 81' },
          { name: 'Canal de Alertas', value: '#alertas-moderación' },
          { name: 'Canal de Logs', value: '#scamlock-logs' },
        ],
      },
    },
    {
      id: 'whitelist',
      name: '/scamlock whitelist [accion] [dominio]',
      description: 'Administra la lista de dominios confiables autorizados en el servidor.',
      permissions: 'Gestionar Servidor / Administrador',
      parameters: 'accion: [list | add | remove], dominio: string (opcional para list)',
      sampleOutput: {
        title: '🛡️ Whitelist de Dominios Confiables',
        color: 'border-l-blue-500',
        fields: [
          { name: 'Acción Ejecutada', value: '✅ Dominio `miempresa.com` añadido correctamente a la whitelist.' },
          { name: 'Protección activa', value: 'Los enlaces a `*.miempresa.com` no generarán falsos positivos.' },
        ],
      },
    },
    {
      id: 'logs',
      name: '/scamlock logs [limite]',
      description: 'Muestra los incidentes de seguridad y mensajes sospechosos recientes en este servidor.',
      permissions: 'Moderadores / Administradores',
      parameters: 'limite: integer (1 a 10)',
      sampleOutput: {
        title: '📋 Registros de Seguridad Recientes (3)',
        color: 'border-l-amber-500',
        fields: [
          { name: '🔴 [95/100] FreeNitroBot#9921', value: 'Acción: Eliminado & Alerta\nMensaje: Free 3 months nitro https://discord-nitro.gift/claim' },
          { name: '🟠 [75/100] CryptoHunter#1022', value: 'Acción: Alerta Enviada\nMensaje: Solana Airdrop live at http://solana-airdrop.buzz' },
        ],
      },
    },
  ];

  const currentCmd = commands.find((c) => c.id === activeCommand) || commands[0];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Comandos Slash de Scam Lock
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Scam Lock implementa comandos nativos de Discord con autocompletado, validación de permisos
          y respuestas con embeds claros para usuarios y moderadores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Command Selector List */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
            Comandos Disponibles ({commands.length})
          </span>
          {commands.map((cmd) => (
            <div
              key={cmd.id}
              onClick={() => setActiveCommand(cmd.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                activeCommand === cmd.id
                  ? 'bg-indigo-600/15 border-indigo-500/50 text-white shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-indigo-300">{cmd.name.split(' ')[0]} {cmd.name.split(' ')[1]}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {cmd.permissions.includes('Admin') ? 'Admin' : 'General'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {cmd.description}
              </p>
            </div>
          ))}
        </div>

        {/* Command Detail & Discord Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-base font-bold text-white block">
                  {currentCmd.name}
                </span>
                <span className="text-xs text-slate-400">{currentCmd.description}</span>
              </div>
              <button
                onClick={() => copyToClipboard(currentCmd.name)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1.5 transition-colors"
                title="Copiar comando"
              >
                {copiedCmd === currentCmd.name ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd === currentCmd.name ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-0.5">Permisos Requeridos</span>
                <span className="text-indigo-300 font-medium">{currentCmd.permissions}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 font-semibold block mb-0.5">Parámetros</span>
                <span className="text-slate-300 font-mono text-[11px] break-all">{currentCmd.parameters}</span>
              </div>
            </div>

            {/* Visual Discord Response Preview */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Respuesta en Discord del Bot:
              </span>
              <div className={`bg-[#2b2d31] p-4 rounded-lg border-l-4 ${currentCmd.sampleOutput.color} text-xs font-sans space-y-3 shadow-inner`}>
                <div className="font-bold text-[#f2f3f5] text-sm flex items-center gap-2">
                  <span>{currentCmd.sampleOutput.title}</span>
                </div>

                <div className="space-y-2 text-slate-200">
                  {currentCmd.sampleOutput.fields.map((f, i) => (
                    <div key={i} className="bg-[#1e1f22]/60 p-2 rounded">
                      <span className="text-slate-400 block font-semibold text-[11px] mb-0.5">{f.name}</span>
                      <p className="font-mono text-xs whitespace-pre-line text-slate-200">{f.value}</p>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-slate-500 pt-1 border-t border-[#383a40]">
                  Scam Lock Guard • Respuesta efímera segura
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
