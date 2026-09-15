import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Bell,
  CheckCircle2,
  Clock,
  FileText,
  Power,
  Save,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SanctionType, ServerConfig } from '../types/scamlock';

export const ServerConfigView: React.FC = () => {
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core detection form states
  const [enabled, setEnabled] = useState<boolean>(true);
  const [alertThreshold, setAlertThreshold] = useState<number>(61);
  const [deleteThreshold, setDeleteThreshold] = useState<number>(81);
  const [alertChannelName, setAlertChannelName] = useState<string>('alertas-moderación');
  const [logChannelName, setLogChannelName] = useState<string>('scamlock-logs');

  // Sanction policy form states
  const [autoSanctionEnabled, setAutoSanctionEnabled] = useState<boolean>(false);
  const [sanctionType, setSanctionType] = useState<SanctionType>('timeout');
  const [sanctionThreshold, setSanctionThreshold] = useState<number>(90);
  const [timeoutDurationMinutes, setTimeoutDurationMinutes] = useState<number>(60);

  // Protected entities state
  const [protectedUsers, setProtectedUsers] = useState<string[]>([]);
  const [protectedRoles, setProtectedRoles] = useState<string[]>([]);
  const [newProtectedUserId, setNewProtectedUserId] = useState<string>('');
  const [newProtectedRoleId, setNewProtectedRoleId] = useState<string>('');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data: ServerConfig = await res.json();
        setConfig(data);
        setEnabled(data.enabled);
        setAlertThreshold(data.alertThreshold);
        setDeleteThreshold(data.deleteThreshold);
        setAlertChannelName(data.alertChannelName || 'alertas-moderación');
        setLogChannelName(data.logChannelName || 'scamlock-logs');
        setAutoSanctionEnabled(data.autoSanctionEnabled ?? false);
        setSanctionType(data.sanctionType || 'timeout');
        setSanctionThreshold(Math.max(75, data.sanctionThreshold ?? 90));
        setTimeoutDurationMinutes(data.timeoutDurationMinutes || 60);
        setProtectedUsers(data.protectedUsers || []);
        setProtectedRoles(data.protectedRoles || []);
      }
    } catch (err) {
      console.error('Error fetching config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: config?.guildId || 'default',
          enabled,
          alertThreshold,
          deleteThreshold,
          alertChannelName,
          logChannelName,
          autoSanctionEnabled,
          sanctionType,
          sanctionThreshold: Math.max(75, sanctionThreshold),
          timeoutDurationMinutes,
          protectedUsers,
          protectedRoles,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setConfig(updated);
        setToastMessage('¡Configuración de Scam Lock guardada exitosamente!');
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (err) {
      console.error('Error saving config:', err);
    } finally {
      setSaving(false);
    }
  };

  const addProtectedUser = async () => {
    const id = newProtectedUserId.trim();
    if (!id || protectedUsers.includes(id)) return;
    try {
      const res = await fetch('/api/protected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user', action: 'add', id }),
      });
      if (res.ok) {
        setProtectedUsers([...protectedUsers, id]);
        setNewProtectedUserId('');
      }
    } catch (err) {
      console.error('Error adding protected user:', err);
    }
  };

  const removeProtectedUser = async (id: string) => {
    try {
      await fetch('/api/protected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user', action: 'remove', id }),
      });
      setProtectedUsers(protectedUsers.filter(u => u !== id));
    } catch (err) {
      console.error('Error removing protected user:', err);
    }
  };

  const addProtectedRole = async () => {
    const id = newProtectedRoleId.trim();
    if (!id || protectedRoles.includes(id)) return;
    try {
      const res = await fetch('/api/protected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'role', action: 'add', id }),
      });
      if (res.ok) {
        setProtectedRoles([...protectedRoles, id]);
        setNewProtectedRoleId('');
      }
    } catch (err) {
      console.error('Error adding protected role:', err);
    }
  };

  const removeProtectedRole = async (id: string) => {
    try {
      await fetch('/api/protected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'role', action: 'remove', id }),
      });
      setProtectedRoles(protectedRoles.filter(r => r !== id));
    } catch (err) {
      console.error('Error removing protected role:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              Configuración de Protección por Servidor
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Personaliza los canales de notificación y los umbrales de riesgo para alertas y eliminación de mensajes.
            </p>
          </div>
          {config && (
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 font-mono text-slate-300 border border-slate-700">
              {config.guildName}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 text-sm">Cargando configuración...</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Card: Master Switch & Thresholds */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Shield className="w-4 h-4 text-indigo-400" />
                Control de Operación & Umbrales de Detección
              </h3>

              {/* Toggle Enable/Disable */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-lg border border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-sm font-medium text-white block">
                    Activar Scam Lock
                  </span>
                  <span className="text-xs text-slate-400 block">
                    {enabled ? 'El bot analiza activamente todos los mensajes entrantes.' : 'Protección en pausa temporal en este servidor.'}
                  </span>
                </div>
                <button
                  type="button"
                  id="enable-toggle-btn"
                  onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    enabled ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Alert Threshold Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="alert-threshold" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-orange-400" />
                    Umbral de Alerta a Moderadores (Score ≥)
                  </label>
                  <span className="font-mono text-sm font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-800/40">
                    {alertThreshold} pts
                  </span>
                </div>
                <input
                  id="alert-threshold"
                  type="range"
                  min="31"
                  max="90"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <p className="text-[11px] text-slate-400">
                  Los mensajes con Risk Score igual o mayor enviarán una notificación con embed detallado al canal de alertas.
                </p>
              </div>

              {/* Delete Threshold Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="delete-threshold" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    Umbral de Eliminación Automática (Score ≥)
                  </label>
                  <span className="font-mono text-sm font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40">
                    {deleteThreshold} pts
                  </span>
                </div>
                <input
                  id="delete-threshold"
                  type="range"
                  min={alertThreshold}
                  max="100"
                  value={deleteThreshold}
                  onChange={(e) => setDeleteThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <p className="text-[11px] text-slate-400">
                  Los mensajes clasificados como Críticos serán borrados de inmediato si el bot cuenta con permiso de Gestionar Mensajes.
                </p>
              </div>
            </div>

            {/* Right Card: Channels Setup & Active Rules */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Bell className="w-4 h-4 text-indigo-400" />
                Canales de Destino en Discord
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="alert-channel" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Canal de Alertas de Staff / Moderación
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">#</span>
                    <input
                      id="alert-channel"
                      type="text"
                      value={alertChannelName}
                      onChange={(e) => setAlertChannelName(e.target.value)}
                      placeholder="alertas-moderación"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Aquí se enviarán los avisos inmediatos de alto riesgo y mensajes borrados.
                  </span>
                </div>

                <div>
                  <label htmlFor="log-channel" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Canal de Auditoría y Logs Silenciosos
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-mono text-xs">#</span>
                    <input
                      id="log-channel"
                      type="text"
                      value={logChannelName}
                      onChange={(e) => setLogChannelName(e.target.value)}
                      placeholder="scamlock-logs"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Canal para registro discreto de mensajes sospechosos de nivel intermedio (Score 31–60).
                  </span>
                </div>
              </div>

              {/* Behavior Matrix Visualizer */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Matriz de Acción con estos ajustes:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-emerald-400 font-bold block">🟢 0 – 30 pts</span>
                    <span className="text-slate-400">Sin acción (Permitido)</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-amber-400 font-bold block">🟡 31 – {alertThreshold - 1} pts</span>
                    <span className="text-slate-400">Auditar en logs</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-orange-400 font-bold block">🟠 {alertThreshold} – {deleteThreshold - 1} pts</span>
                    <span className="text-slate-400">Alertar a moderadores</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-red-400 font-bold block">🔴 {deleteThreshold} – 100 pts</span>
                    <span className="text-slate-400">Eliminar + Alerta prioritaria</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Sistema de Sanciones Automáticas y Reglas de Seguridad */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${autoSanctionEnabled ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-400'}`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Sistema de Sanciones Automáticas (Baneo / Timeout)
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                      Opcional
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Aplica automáticamente un timeout o baneo a usuarios que envíen ataques confirmados de alto riesgo.
                  </p>
                </div>
              </div>

              {/* Master toggle */}
              <button
                type="button"
                id="toggle-auto-sanction-btn"
                onClick={() => setAutoSanctionEnabled(!autoSanctionEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  autoSanctionEnabled
                    ? 'bg-red-950/40 text-red-400 border-red-800/60 shadow-inner'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <Power className={`w-3.5 h-3.5 ${autoSanctionEnabled ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
                {autoSanctionEnabled ? 'Sanción Automática: ACTIVADA' : 'Sanción Automática: DESACTIVADA (Recomendado)'}
              </button>
            </div>

            {/* Safety Banner */}
            <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200/90 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Reglas de Seguridad y Protección contra Falsos Positivos</span>
              </div>
              <ul className="text-[11px] text-amber-200/80 list-disc list-inside space-y-1 pl-1">
                <li><strong>Desactivado por defecto:</strong> Un Risk Score alto no es prueba absoluta e inequívoca de estafa.</li>
                <li><strong>Prohibición de scores bajos:</strong> El umbral no puede ser menor a 75 pts para evitar penalizaciones injustas.</li>
                <li><strong>Chequeo de Jerarquía y Permisos:</strong> El bot valida permisos antes de actuar; nunca sancionará al Owner, a sí mismo o a miembros superiores en roles.</li>
                <li><strong>Fail-safe:</strong> Si la sanción automática está desactivada, el bot emite una alerta prioritaria para revisión manual del staff.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Sanction Configuration Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5 text-red-400" />
                    Tipo de Sanción Automática
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={!autoSanctionEnabled}
                      onClick={() => setSanctionType('timeout')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        sanctionType === 'timeout'
                          ? 'bg-indigo-950/40 border-indigo-500/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      } ${!autoSanctionEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-indigo-300 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        Timeout Temporal
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Aísla temporalmente al miembro para frenar spam masivo sin expulsarlo.
                      </p>
                    </button>

                    <button
                      type="button"
                      disabled={!autoSanctionEnabled}
                      onClick={() => setSanctionType('ban')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        sanctionType === 'ban'
                          ? 'bg-red-950/40 border-red-500/60 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      } ${!autoSanctionEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-red-400 mb-1">
                        <Ban className="w-3.5 h-3.5" />
                        Baneo Permanente
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Expulsa y veta permanentemente al atacante del servidor.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Sanction Threshold Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="sanction-threshold" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      Umbral de Sanción (Mínimo de seguridad: 75 pts)
                    </label>
                    <span className="font-mono text-sm font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40">
                      {sanctionThreshold} pts
                    </span>
                  </div>
                  <input
                    id="sanction-threshold"
                    type="range"
                    min="75"
                    max="100"
                    disabled={!autoSanctionEnabled}
                    value={sanctionThreshold}
                    onChange={(e) => setSanctionThreshold(Math.max(75, Number(e.target.value)))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>75 (Mínimo seguro)</span>
                    <span>90 (Por defecto recomendado)</span>
                    <span>100 (Solo certezas)</span>
                  </div>
                </div>

                {/* Timeout Duration */}
                {sanctionType === 'timeout' && (
                  <div className="space-y-1.5">
                    <label htmlFor="timeout-duration" className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      Duración del Aislamiento / Timeout (en minutos)
                    </label>
                    <input
                      id="timeout-duration"
                      type="number"
                      min="5"
                      max="10080"
                      disabled={!autoSanctionEnabled}
                      value={timeoutDurationMinutes}
                      onChange={(e) => setTimeoutDurationMinutes(Math.max(5, Number(e.target.value)))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-40"
                    />
                    <span className="text-[11px] text-slate-500 block">
                      Ejemplos: 60 = 1 hora, 1440 = 24 horas, 10080 = 7 días (máximo permitido por Discord).
                    </span>
                  </div>
                )}
              </div>

              {/* Protected Users & Roles */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Lista de Inmunidad (Usuarios y Roles Protegidos)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Cualquier ID especificado aquí jamás recibirá una sanción automática por parte del bot:
                </p>

                {/* Add User ID */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-indigo-400" /> Proteger ID de Usuario
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProtectedUserId}
                      onChange={(e) => setNewProtectedUserId(e.target.value)}
                      placeholder="ID Discord (ej: 123456789012345678)"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={addProtectedUser}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors"
                    >
                      Añadir
                    </button>
                  </div>
                  {protectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {protectedUsers.map(uid => (
                        <span key={uid} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
                          👤 {uid}
                          <button type="button" onClick={() => removeProtectedUser(uid)} className="text-slate-500 hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Role ID */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" /> Proteger ID de Rol
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProtectedRoleId}
                      onChange={(e) => setNewProtectedRoleId(e.target.value)}
                      placeholder="ID de Rol (ej: 987654321098765432)"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={addProtectedRole}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg transition-colors"
                    >
                      Añadir
                    </button>
                  </div>
                  {protectedRoles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {protectedRoles.map(rid => (
                        <span key={rid} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                          🛡️ Rol: {rid}
                          <button type="button" onClick={() => removeProtectedRole(rid)} className="text-slate-500 hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar with Submit & Status */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-400">
              {toastMessage ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {toastMessage}
                </span>
              ) : (
                <span>Los cambios se sincronizan en caliente en el bot de Discord y la API.</span>
              )}
            </div>

            <button
              type="submit"
              id="save-config-btn"
              disabled={saving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar Ajustes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
