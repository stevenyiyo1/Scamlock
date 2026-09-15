import {
  AlertCircle,
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  FileCheck,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Trash2,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { RiskLevel, SanctionRecord, SecurityLog } from '../types/scamlock';

export const LogsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'sanctions'>('messages');
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [sanctions, setSanctions] = useState<SanctionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  const [selectedSanction, setSelectedSanction] = useState<SanctionRecord | null>(null);

  // Review note modal state
  const [reviewNote, setReviewNote] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url = selectedLevel === 'all' ? '/api/logs' : `/api/logs?level=${selectedLevel}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSanctions = async () => {
    try {
      const res = await fetch('/api/sanctions');
      if (res.ok) {
        const data = await res.json();
        setSanctions(data);
      }
    } catch (err) {
      console.error('Error fetching sanctions:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchSanctions();
  }, [selectedLevel]);

  const handleReviewSubmit = async (id: string) => {
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/sanctions/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          reviewer: 'Staff Dashboard',
          notes: reviewNote || 'Incidente verificado y resuelto por moderador.',
        }),
      });
      if (res.ok) {
        const result = await res.json();
        setSanctions(sanctions.map(s => s.id === id ? result.record : s));
        if (selectedSanction?.id === id) {
          setSelectedSanction(result.record);
        }
        setReviewNote('');
      }
    } catch (err) {
      console.error('Error reviewing sanction:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.userTag.toLowerCase().includes(q) ||
      log.messageContent.toLowerCase().includes(q) ||
      log.channelName.toLowerCase().includes(q) ||
      log.detectedUrls.some((u) => u.toLowerCase().includes(q)) ||
      log.reasons.some((r) => r.toLowerCase().includes(q))
    );
  });

  const filteredSanctions = sanctions.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.userTag.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.messageContent.toLowerCase().includes(q) ||
      s.reasons.some((r) => r.toLowerCase().includes(q))
    );
  });

  const getBadgeForLevel = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            🔴 Crítico ({score})
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            🟠 Alto ({score})
          </span>
        );
      case 'suspicious':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            🟡 Sospechoso ({score})
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            🟢 Bajo ({score})
          </span>
        );
    }
  };

  const getActionBadge = (action: SecurityLog['actionTaken']) => {
    switch (action) {
      case 'deleted_and_alerted':
        return (
          <span className="text-[11px] font-semibold text-red-300 bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
            Eliminado & Alerta
          </span>
        );
      case 'alerted':
        return (
          <span className="text-[11px] font-semibold text-orange-300 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded">
            Alerta a Staff
          </span>
        );
      case 'logged':
        return (
          <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
            Auditado
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            Permitido
          </span>
        );
    }
  };

  const criticalCount = logs.filter((l) => l.level === 'critical').length;
  const highCount = logs.filter((l) => l.level === 'high').length;
  const suspiciousCount = logs.filter((l) => l.level === 'suspicious').length;

  return (
    <div className="space-y-6">
      {/* Top View Selector Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'messages'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Auditoría de Mensajes ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab('sanctions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'sanctions'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Expedientes de Sanción & Revisión ({sanctions.length})
          </button>
        </div>

        <button
          onClick={() => {
            fetchLogs();
            fetchSanctions();
          }}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          Sincronizar
        </button>
      </div>

      {activeTab === 'messages' ? (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 uppercase font-medium">Total Incidentes</span>
              <p className="text-2xl font-bold text-white mt-1">{logs.length}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-red-400 uppercase font-medium">Mensajes Críticos</span>
              <p className="text-2xl font-bold text-red-400 mt-1">{criticalCount}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-orange-400 uppercase font-medium">Alto Riesgo Alertados</span>
              <p className="text-2xl font-bold text-orange-400 mt-1">{highCount}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-amber-400 uppercase font-medium">Sospechosos Auditados</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{suspiciousCount}</p>
            </div>
          </div>

          {/* Control bar: Filter & Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 whitespace-nowrap">
                <Filter className="w-3.5 h-3.5" /> Filtrar:
              </span>
              {['all', 'critical', 'high', 'suspicious', 'low'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lvl === 'all' && 'Todos'}
                  {lvl === 'critical' && 'Críticos'}
                  {lvl === 'high' && 'Alto'}
                  {lvl === 'suspicious' && 'Sospechosos'}
                  {lvl === 'low' && 'Bajos'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar por usuario, url, texto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            {loading && logs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Cargando registros de auditoría...
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm space-y-2">
                <Shield className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-300">No se encontraron incidentes registrados</p>
                <p className="text-xs text-slate-500">
                  {searchQuery ? 'Prueba cambiando los términos de búsqueda o filtros.' : 'El servidor se encuentra protegido y sin amenazas recientes.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Fecha & Hora</th>
                      <th className="py-3 px-4">Usuario</th>
                      <th className="py-3 px-4">Canal</th>
                      <th className="py-3 px-4">Risk Score</th>
                      <th className="py-3 px-4">Mensaje Analizado</th>
                      <th className="py-3 px-4">Acción</th>
                      <th className="py-3 px-4 text-right">Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-slate-400 font-mono whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          <span className="block text-[10px] text-slate-500">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-200">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono">{log.userTag}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {log.channelName}
                        </td>
                        <td className="py-3 px-4">
                          {getBadgeForLevel(log.level, log.score)}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate font-sans text-slate-300">
                          {log.messageContent}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getActionBadge(log.actionTaken)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded border border-slate-700 text-xs transition-colors"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Sanctions and Cases Tab */
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Expedientes de Sanciones y Casos de Alto Riesgo
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Auditoría centralizada con evidencia forense, estado de sanciones automáticas y cola de revisión manual.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {sanctions.length} casos registrados
            </span>
          </div>

          {filteredSanctions.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-300">No hay sanciones ni expedientes registrados</p>
              <p className="text-xs text-slate-500">
                Las sanciones automáticas o casos que superen el umbral de riesgo aparecerán aquí de forma auditada.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredSanctions.map((sanc) => (
                <div
                  key={sanc.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {sanc.id}
                      </span>
                      <span className="font-bold text-white text-xs flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {sanc.userTag}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        sanc.score >= 90 ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                      }`}>
                        Score: {sanc.score}/100
                      </span>

                      {sanc.actionExecuted === 'ban' && (
                        <span className="text-[10px] font-semibold bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded">
                          🔨 Baneo Ejecutado
                        </span>
                      )}
                      {sanc.actionExecuted === 'timeout' && (
                        <span className="text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                          ⏳ Timeout ({sanc.durationMinutes}m)
                        </span>
                      )}
                      {sanc.actionExecuted === 'alert_only' && (
                        <span className="text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                          ⚠️ Alerta Prioritaria (Auto-Sanción OFF)
                        </span>
                      )}
                      {sanc.actionExecuted === 'none' && (
                        <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          🛡️ Bloqueado por Jerarquía / Protegido
                        </span>
                      )}

                      {sanc.reviewed ? (
                        <span className="text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Revisado
                        </span>
                      ) : sanc.manualReviewRequired ? (
                        <span className="text-[10px] font-semibold bg-red-950/60 text-red-400 border border-red-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Requiere Revisión Manual
                        </span>
                      ) : null}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 font-sans bg-slate-950 p-2 rounded border border-slate-800/60">
                      «{sanc.messageContent}»
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>📅 {new Date(sanc.timestamp).toLocaleString()}</span>
                      <span>👮 {sanc.executor}</span>
                      {sanc.reasons[0] && (
                        <span className="text-slate-300 font-sans">
                          • {sanc.reasons[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedSanction(sanc);
                      setReviewNote(sanc.reviewNotes || '');
                    }}
                    className="px-3 py-1.5 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspeccionar Evidencia
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sanction Dossier Inspection Modal */}
      {selectedSanction && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="font-bold text-white text-base">
                    Expediente Forense: {selectedSanction.id}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Registrado el {new Date(selectedSanction.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSanction(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Usuario Auditado</span>
                <span className="font-mono text-white">{selectedSanction.userTag}</span>
                <span className="text-[10px] text-slate-500 block font-mono">ID: {selectedSanction.userId}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Risk Score de Incidente</span>
                <span className="text-sm font-bold text-red-400">{selectedSanction.score} / 100</span>
                <span className="text-[10px] text-slate-500 block">Nivel: {selectedSanction.level.toUpperCase()}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Acción Ejecutada</span>
                <span className="font-mono font-bold text-indigo-300">{selectedSanction.actionExecuted}</span>
                <span className="text-[10px] text-slate-500 block font-mono">Origen: {selectedSanction.executor}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Estado de Revisión</span>
                <span className={selectedSanction.reviewed ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {selectedSanction.reviewed ? `✅ Revisado por ${selectedSanction.reviewedBy || 'Staff'}` : '⚠️ Requiere Confirmación'}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold mb-1">Mensaje Original Capturado</span>
              <p className="text-slate-200 font-mono bg-slate-900 p-2.5 rounded border border-slate-800 break-all whitespace-pre-wrap">
                {selectedSanction.messageContent}
              </p>
            </div>

            {selectedSanction.detectedUrls.length > 0 && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block font-semibold mb-1">URLs Sospechosas Extraídas</span>
                <ul className="space-y-1">
                  {selectedSanction.detectedUrls.map((u, i) => (
                    <li key={i} className="font-mono text-amber-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 break-all">
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold mb-1">Factores de Riesgo e Indicadores Forenses</span>
              <ul className="space-y-1.5">
                {selectedSanction.reasons.map((r, i) => (
                  <li key={i} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-red-400">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Moderator Resolution Section */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <label htmlFor="review-notes-input" className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Resolución del Moderador & Notas de Auditoría
              </label>
              <textarea
                id="review-notes-input"
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Escribe aquí las conclusiones de la revisión o justificación..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={submittingReview}
                  onClick={() => handleReviewSubmit(selectedSanction.id)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {submittingReview ? 'Guardando...' : 'Marcar Caso como Revisado'}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSanction(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
              >
                Cerrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Detalle del Incidente de Seguridad</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Usuario</span>
                <span className="font-mono text-white">{selectedLog.userTag}</span>
                <span className="text-[10px] text-slate-500 block font-mono">ID: {selectedLog.userId}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Servidor & Canal</span>
                <span className="text-white">{selectedLog.guildName}</span>
                <span className="text-[10px] text-slate-500 block font-mono">{selectedLog.channelName}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Risk Score Calculado</span>
                <div className="mt-1">{getBadgeForLevel(selectedLog.level, selectedLog.score)}</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block font-semibold mb-0.5">Acción Ejecutada</span>
                <div className="mt-1">{getActionBadge(selectedLog.actionTaken)}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold mb-1">Contenido Completo del Mensaje</span>
              <p className="text-slate-200 font-mono bg-slate-900 p-2.5 rounded border border-slate-800 break-all whitespace-pre-wrap">
                {selectedLog.messageContent}
              </p>
            </div>

            {selectedLog.detectedUrls.length > 0 && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 block font-semibold mb-1">URLs Extraídas</span>
                <ul className="space-y-1">
                  {selectedLog.detectedUrls.map((u, i) => (
                    <li key={i} className="font-mono text-amber-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 break-all">
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold mb-1">Razones & Factores del Análisis</span>
              <ul className="space-y-1.5">
                {selectedLog.reasons.map((r, i) => (
                  <li key={i} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-red-400">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
