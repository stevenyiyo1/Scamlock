import {
  Client,
  Guild,
  GuildMember,
  Message,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js';
import {
  AnalysisResult,
  SanctionActionExecuted,
  SanctionRecord,
  SanctionType,
  ServerConfig,
} from '../../types/scamlock';
import { guildConfigManager } from '../config/guildConfig';
import { logService } from './logService';

export class SanctionPolicyManager {
  private sanctions: SanctionRecord[] = [];
  // Deduplication cache: key is `guildId:userId`, value is timestamp ms
  private recentSanctionsCache: Map<string, number> = new Map();
  private readonly DEDUP_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutos de protección contra duplicados

  constructor() {
    // Seed initial mock / historical sanction for UI demonstration
    this.sanctions.push({
      id: 'sanc-demo-101',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      guildId: 'default',
      guildName: 'Servidor Principal (Comunidad)',
      userId: '998877665544332211',
      userTag: 'CryptoGiftBot#1337',
      score: 96,
      level: 'critical',
      reasons: [
        'Ingeniería social agresiva (Premio falso de 5000 USDT)',
        'URL con dominio typosquatting (discorcd-gift.ru)',
        'Urgencia artificial («Caduca en 3 minutos»)',
      ],
      factors: [
        { category: 'social_engineering', points: 40, description: 'Señales de estafa con premios falsos' },
        { category: 'typosquat', points: 35, description: 'Dominio imitador de Discord' },
        { category: 'urgency', points: 21, description: 'Presión temporal artificial' },
      ],
      messageContent: 'CLAIM YOUR 5000 USDT AIRDROP ON discorcd-gift.ru/claim QUICK BEFORE EXPIRY!!',
      detectedUrls: ['https://discorcd-gift.ru/claim'],
      actionExecuted: 'timeout',
      sanctionType: 'timeout',
      durationMinutes: 60,
      executor: 'AUTOMATIC_POLICY',
      manualReviewRequired: false,
      status: 'applied',
      reviewed: false,
    });

    this.sanctions.push({
      id: 'sanc-demo-102',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      guildId: 'default',
      guildName: 'Servidor Principal (Comunidad)',
      userId: '776655443322110099',
      userTag: 'NitroFree4All#0001',
      score: 88,
      level: 'high',
      reasons: [
        'Enlace de Nitro gratuito no verificado',
        'Auto-baneo desactivado: Se emitió alerta prioritaria a moderadores',
      ],
      factors: [
        { category: 'nitro', points: 35, description: 'Mención de Nitro gratuito' },
        { category: 'url', points: 30, description: 'Enlace no verificado' },
      ],
      messageContent: 'Guys steam nitro 3 months free here: https://steam-nitro-promo.com',
      detectedUrls: ['https://steam-nitro-promo.com'],
      actionExecuted: 'alert_only',
      sanctionType: 'none',
      executor: 'AUTOMATIC_POLICY',
      manualReviewRequired: true,
      status: 'alert_sent',
      reviewed: false,
    });
  }

  /**
   * Central Evaluation Policy:
   * Analyzers NEVER execute sanctions directly. Everything passes through this policy.
   */
  public async evaluateAndProcessPolicy(
    message: Message,
    analysis: AnalysisResult,
    config: ServerConfig
  ): Promise<SanctionRecord | null> {
    const guild = message.guild;
    const author = message.author;
    if (!guild || !author || author.bot) return null;

    // Regla 3: Un score bajo o moderado (< 75) NUNCA activa una sanción automática
    if (analysis.score < 75) {
      return null;
    }

    // Comprobar si el score alcanza el umbral de sanción configurado (por defecto >= 90)
    const meetsSanctionThreshold = analysis.score >= (config.sanctionThreshold || 90);

    // Si no alcanza el umbral de sanción automática, o si el auto-sanción está desactivado:
    // Regla 8: Si el baneo automático está desactivado o el score no llega al umbral estricto,
    // enviar alerta prioritaria a moderadores en lugar de sancionar automáticamente.
    const shouldAttemptAutoSanction = config.autoSanctionEnabled && meetsSanctionThreshold;

    const sanctionId = `sanc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const dedupKey = `${guild.id}:${author.id}`;

    // Protección de deduplicación (Regla 10): evitar bucles o múltiples sanciones por ráfagas de mensajes
    const lastSanctionTime = this.recentSanctionsCache.get(dedupKey);
    if (lastSanctionTime && Date.now() - lastSanctionTime < this.DEDUP_COOLDOWN_MS) {
      console.log(`[Scam Lock] 🛡️ Deduplicación: el usuario ${author.tag} ya fue procesado recientemente.`);
      return null;
    }

    let member: GuildMember | null = null;
    try {
      member = message.member || (await guild.members.fetch(author.id));
    } catch {
      member = null;
    }

    // Si el baneo automático está DESACTIVADO (Regla 1 & 8): Registrar y alertar a moderadores para revisión manual
    if (!shouldAttemptAutoSanction) {
      const record: SanctionRecord = {
        id: sanctionId,
        timestamp: new Date().toISOString(),
        guildId: guild.id,
        guildName: guild.name,
        userId: author.id,
        userTag: author.tag,
        userAvatar: author.displayAvatarURL(),
        score: analysis.score,
        level: analysis.level,
        reasons: [
          ...analysis.factors.map(f => f.description),
          !config.autoSanctionEnabled
            ? 'Auto-sanción desactivada por configuración del servidor (requiere revisión manual de staff).'
            : `Risk Score (${analysis.score}) no alcanzó el umbral crítico para sanción automática (${config.sanctionThreshold}).`,
        ],
        factors: analysis.factors,
        messageContent: message.content,
        detectedUrls: analysis.detectedUrls,
        actionExecuted: 'alert_only',
        sanctionType: 'none',
        executor: 'AUTOMATIC_POLICY',
        manualReviewRequired: true, // Regla 9: Revisión manual para casos de alto riesgo
        status: 'alert_sent',
        reviewed: false,
      };

      this.sanctions.unshift(record);
      await this.dispatchPriorityModeratorAlert(guild, message, analysis, record, config);
      return record;
    }

    // AUTO-SANCIÓN ACTIVADA: Ejecutar comprobaciones estrictas de seguridad (Reglas 4 y 5)
    const securityCheck = this.validateSanctionPrerequisites(guild, member, author.id, config);
    if (!securityCheck.allowed) {
      console.warn(`[Scam Lock] ⚠️ Sanción automática bloqueada por regla de seguridad: ${securityCheck.reason}`);
      const blockedRecord: SanctionRecord = {
        id: sanctionId,
        timestamp: new Date().toISOString(),
        guildId: guild.id,
        guildName: guild.name,
        userId: author.id,
        userTag: author.tag,
        userAvatar: author.displayAvatarURL(),
        score: analysis.score,
        level: analysis.level,
        reasons: [
          ...analysis.factors.map(f => f.description),
          `Sanción automática bloqueada: ${securityCheck.reason}`,
        ],
        factors: analysis.factors,
        messageContent: message.content,
        detectedUrls: analysis.detectedUrls,
        actionExecuted: securityCheck.actionCode,
        sanctionType: config.sanctionType,
        executor: 'AUTOMATIC_POLICY',
        manualReviewRequired: true,
        status: 'blocked',
        reviewed: false,
      };

      this.sanctions.unshift(blockedRecord);
      await this.dispatchPriorityModeratorAlert(guild, message, analysis, blockedRecord, config, securityCheck.reason);
      return blockedRecord;
    }

    // Regla 4 & 10: Ejecución controlada con manejo de fallos y jerarquía
    const sanctionType = config.sanctionType;
    let actionExecuted: SanctionActionExecuted = sanctionType;
    let durationMinutes = sanctionType === 'timeout' ? config.timeoutDurationMinutes || 60 : undefined;

    try {
      if (sanctionType === 'timeout') {
        const timeoutMs = (durationMinutes || 60) * 60 * 1000;
        await member!.timeout(timeoutMs, `[Scam Lock] Detección de Phishing Crítico (Score ${analysis.score}/100)`);
      } else if (sanctionType === 'ban') {
        await guild.members.ban(author.id, {
          reason: `[Scam Lock] Baneo Automático por Phishing de Riesgo Crítico (Score ${analysis.score}/100)`,
          deleteMessageSeconds: 60 * 60 * 24, // Limpiar mensajes de las últimas 24h
        });
      }

      // Registrar en caché de deduplicación para prevenir bucles
      this.recentSanctionsCache.set(dedupKey, Date.now());

      const record: SanctionRecord = {
        id: sanctionId,
        timestamp: new Date().toISOString(),
        guildId: guild.id,
        guildName: guild.name,
        userId: author.id,
        userTag: author.tag,
        userAvatar: author.displayAvatarURL(),
        score: analysis.score,
        level: analysis.level,
        reasons: [
          ...analysis.factors.map(f => f.description),
          `Sanción automática (${sanctionType}) aplicada tras superar umbral de seguridad (${config.sanctionThreshold}).`,
        ],
        factors: analysis.factors,
        messageContent: message.content,
        detectedUrls: analysis.detectedUrls,
        actionExecuted,
        sanctionType,
        durationMinutes,
        executor: 'AUTOMATIC_POLICY',
        manualReviewRequired: false,
        status: 'applied',
        reviewed: false,
      };

      this.sanctions.unshift(record);
      await this.dispatchSanctionAuditLog(guild, record, config);
      return record;
    } catch (err) {
      console.error(`[Scam Lock] Error al ejecutar sanción en ${author.tag}:`, err);
      // Regla 10: Protección contra fallos de permisos sin causar bucles
      const failedRecord: SanctionRecord = {
        id: sanctionId,
        timestamp: new Date().toISOString(),
        guildId: guild.id,
        guildName: guild.name,
        userId: author.id,
        userTag: author.tag,
        userAvatar: author.displayAvatarURL(),
        score: analysis.score,
        level: analysis.level,
        reasons: [
          ...analysis.factors.map(f => f.description),
          `Fallo de permisos en API de Discord al aplicar ${sanctionType}: ${(err as Error).message}`,
        ],
        factors: analysis.factors,
        messageContent: message.content,
        detectedUrls: analysis.detectedUrls,
        actionExecuted: 'failed_permissions',
        sanctionType,
        executor: 'AUTOMATIC_POLICY',
        manualReviewRequired: true,
        status: 'blocked',
        reviewed: false,
      };

      this.sanctions.unshift(failedRecord);
      this.recentSanctionsCache.set(dedupKey, Date.now()); // Prevenir reintentos automáticos continuos
      await this.dispatchPriorityModeratorAlert(guild, message, analysis, failedRecord, config, 'Fallo de permisos de Discord');
      return failedRecord;
    }
  }

  /**
   * Valida estrictamente todas las reglas de seguridad antes de cualquier acción:
   * - Regla 4: Permisos y jerarquía
   * - Regla 5: Dueño del servidor, el bot mismo, roles protegidos y usuarios protegidos
   */
  public validateSanctionPrerequisites(
    guild: Guild,
    member: GuildMember | null,
    userId: string,
    config: ServerConfig
  ): { allowed: boolean; reason?: string; actionCode: SanctionActionExecuted } {
    const botUser = guild.client.user;

    // Regla 5: El bot NUNCA puede banearse a sí mismo
    if (botUser && userId === botUser.id) {
      return {
        allowed: false,
        reason: 'El bot no puede aplicar sanciones sobre sí mismo.',
        actionCode: 'blocked_is_bot',
      };
    }

    // Regla 5: El bot NUNCA puede banear al Dueño del Servidor (Owner)
    if (guild.ownerId === userId) {
      return {
        allowed: false,
        reason: 'El usuario es el dueño (Owner) del servidor.',
        actionCode: 'blocked_is_owner',
      };
    }

    // Lista de usuarios protegidos configurada
    if (config.protectedUsers && config.protectedUsers.includes(userId)) {
      return {
        allowed: false,
        reason: 'El usuario figura en la lista de usuarios protegidos.',
        actionCode: 'blocked_protected_user',
      };
    }

    if (member) {
      // Comprobar roles protegidos
      if (config.protectedRoles && config.protectedRoles.length > 0) {
        const hasProtectedRole = member.roles.cache.some(r => config.protectedRoles.includes(r.id));
        if (hasProtectedRole) {
          return {
            allowed: false,
            reason: 'El usuario posee un rol protegido contra sanciones automáticas.',
            actionCode: 'blocked_protected_role',
          };
        }
      }

      // Regla 4: Comprobar jerarquía de roles
      const botMember = guild.members.me;
      if (!botMember) {
        return {
          allowed: false,
          reason: 'No se pudo obtener el perfil de permisos del bot en el servidor.',
          actionCode: 'failed_permissions',
        };
      }

      if (config.sanctionType === 'ban') {
        if (!botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
          return {
            allowed: false,
            reason: 'El bot carece del permiso de Discord «Banear miembros» (BanMembers).',
            actionCode: 'failed_permissions',
          };
        }
        if (!member.bannable) {
          return {
            allowed: false,
            reason: 'Jerarquía de roles insuficiente: El usuario tiene un rol igual o superior al del bot.',
            actionCode: 'blocked_hierarchy',
          };
        }
      } else {
        // Timeout
        if (!botMember.permissions.has(PermissionFlagsBits.ModerateMembers)) {
          return {
            allowed: false,
            reason: 'El bot carece del permiso de Discord «Moderar miembros» (ModerateMembers).',
            actionCode: 'failed_permissions',
          };
        }
        if (!member.moderatable) {
          return {
            allowed: false,
            reason: 'Jerarquía de roles insuficiente: El usuario tiene un rol igual o superior al del bot.',
            actionCode: 'blocked_hierarchy',
          };
        }
      }
    }

    return { allowed: true, actionCode: 'ban' };
  }

  /**
   * Ejecución manual de sanción por parte de un moderador humano
   */
  public async executeManualSanction(params: {
    guild: Guild;
    targetMember: GuildMember;
    executor: { id: string; tag: string };
    sanctionType: SanctionType;
    durationMinutes?: number;
    reason: string;
    incidentId?: string;
  }): Promise<{ success: boolean; message: string; record?: SanctionRecord }> {
    const { guild, targetMember, executor, sanctionType, durationMinutes = 60, reason, incidentId } = params;
    const config = guildConfigManager.getConfig(guild.id, guild.name);

    // Validar jerarquía y protecciones básicas
    if (guild.ownerId === targetMember.id) {
      return { success: false, message: 'No es posible sancionar al dueño del servidor.' };
    }
    if (guild.client.user?.id === targetMember.id) {
      return { success: false, message: 'No es posible sancionar al propio bot.' };
    }

    const botMember = guild.members.me;
    if (!botMember) {
      return { success: false, message: 'Error interno: perfil del bot no encontrado.' };
    }

    try {
      if (sanctionType === 'timeout') {
        if (!botMember.permissions.has(PermissionFlagsBits.ModerateMembers) || !targetMember.moderatable) {
          return { success: false, message: 'Permisos o jerarquía de roles insuficiente para aislar (timeout) al usuario.' };
        }
        const timeoutMs = durationMinutes * 60 * 1000;
        await targetMember.timeout(timeoutMs, `[Scam Lock Manual por ${executor.tag}] ${reason}`);
      } else {
        if (!botMember.permissions.has(PermissionFlagsBits.BanMembers) || !targetMember.bannable) {
          return { success: false, message: 'Permisos o jerarquía de roles insuficiente para banear al usuario.' };
        }
        await guild.members.ban(targetMember.id, {
          reason: `[Scam Lock Manual por ${executor.tag}] ${reason}`,
          deleteMessageSeconds: 60 * 60 * 24,
        });
      }

      // Si estaba asociado a un incidente previo, marcar como revisado
      if (incidentId) {
        this.reviewIncident(incidentId, executor.tag, `Sanción manual ejecutada: ${sanctionType}`);
      }

      const record: SanctionRecord = {
        id: `sanc-man-${Date.now()}`,
        timestamp: new Date().toISOString(),
        guildId: guild.id,
        guildName: guild.name,
        userId: targetMember.id,
        userTag: targetMember.user.tag,
        userAvatar: targetMember.user.displayAvatarURL(),
        score: 100,
        level: 'critical',
        reasons: [`Sanción manual aplicada por moderador ${executor.tag}: ${reason}`],
        factors: [{ category: 'social_engineering', points: 100, description: reason }],
        messageContent: reason,
        detectedUrls: [],
        actionExecuted: sanctionType,
        sanctionType,
        durationMinutes: sanctionType === 'timeout' ? durationMinutes : undefined,
        executor: executor.tag,
        manualReviewRequired: false,
        status: 'applied',
        reviewed: true,
        reviewedBy: executor.tag,
        reviewedAt: new Date().toISOString(),
      };

      this.sanctions.unshift(record);
      await this.dispatchSanctionAuditLog(guild, record, config);

      return {
        success: true,
        message: `Sanción (${sanctionType.toUpperCase()}) aplicada con éxito sobre **${targetMember.user.tag}**.`,
        record,
      };
    } catch (err) {
      return {
        success: false,
        message: `Error al comunicar con la API de Discord: ${(err as Error).message}`,
      };
    }
  }

  /**
   * Enviar alerta prioritaria de revisión para moderadores (Regla 8 y 9)
   */
  private async dispatchPriorityModeratorAlert(
    guild: Guild,
    message: Message,
    analysis: AnalysisResult,
    record: SanctionRecord,
    config: ServerConfig,
    blockNote?: string
  ): Promise<void> {
    const targetChannelId = config.alertChannelId || config.logChannelId;
    if (!targetChannelId) return;

    try {
      const channel = await guild.channels.fetch(targetChannelId);
      if (channel && channel.isTextBased()) {
        const alertEmbed = {
          title: '🚨 ALERTA PRIORITARIA DE MODERACIÓN — Scam Lock',
          description: blockNote
            ? `⚠️ **Incidente de alto riesgo detectado**, pero la sanción automática fue prevenida por seguridad:\n\`${blockNote}\``
            : `⚠️ **Incidente sospechoso detectado** (Risk Score: **${analysis.score}/100**).\n*El baneo automático está DESACTIVADO. Requiere revisión manual por el equipo de moderación.*`,
          color: 0xf59e0b, // Amber / Orange
          fields: [
            { name: '👤 Usuario sospechoso', value: `${message.author.tag} (\`${message.author.id}\`)`, inline: true },
            { name: '🎯 Risk Score', value: `**${analysis.score} / 100** (${analysis.levelLabel})`, inline: true },
            { name: '🆔 ID Incidente', value: `\`${record.id}\``, inline: true },
            {
              name: '💬 Mensaje Detectado',
              value: `>>> ${message.content.length > 300 ? message.content.slice(0, 300) + '...' : message.content}`,
              inline: false,
            },
            {
              name: '🔍 Factores de Riesgo',
              value: analysis.factors.map(f => `• ${f.description}`).slice(0, 4).join('\n') || 'Heurística general',
              inline: false,
            },
            {
              name: '🛡️ Acciones de Moderación Recomendadas',
              value: `• Usar \`/scamlock revisar ${record.id}\` para ver el expediente completo.\n• Usar \`/scamlock sancionar\` si confirmas que es un atacante.`,
              inline: false,
            },
          ],
          footer: { text: 'Scam Lock • Política Central de Seguridad' },
          timestamp: new Date().toISOString(),
        };

        await (channel as TextChannel).send({ embeds: [alertEmbed] });
      }
    } catch (err) {
      console.warn(`[Scam Lock] No se pudo enviar alerta prioritaria a canal ${targetChannelId}:`, (err as Error).message);
    }
  }

  /**
   * Enviar log de auditoría formal al canal de logs (Regla 6)
   */
  private async dispatchSanctionAuditLog(guild: Guild, record: SanctionRecord, config: ServerConfig): Promise<void> {
    const channelId = config.logChannelId || config.alertChannelId;
    if (!channelId) return;

    try {
      const channel = await guild.channels.fetch(channelId);
      if (channel && channel.isTextBased()) {
        const embed = {
          title: `🛡️ REGISTRO DE SANCIÓN EJECUTADA [${record.actionExecuted.toUpperCase()}]`,
          color: record.actionExecuted === 'ban' ? 0xef4444 : 0xf97316,
          fields: [
            { name: '👤 Infractor', value: `${record.userTag} (\`${record.userId}\`)`, inline: true },
            { name: '⚖️ Acción', value: `**${record.actionExecuted}** ${record.durationMinutes ? `(${record.durationMinutes}m)` : ''}`, inline: true },
            { name: '🎯 Score', value: `**${record.score}/100**`, inline: true },
            { name: '👮 Ejecutor', value: `\`${record.executor}\``, inline: true },
            { name: '🆔 Expediente', value: `\`${record.id}\``, inline: true },
            {
              name: '📝 Motivo / Evidencia',
              value: record.reasons.slice(0, 3).join('\n') || 'Phishing detectado',
              inline: false,
            },
          ],
          timestamp: record.timestamp,
        };

        await (channel as TextChannel).send({ embeds: [embed] });
      }
    } catch (err) {
      console.warn(`[Scam Lock] Error despachando auditoría de sanción:`, (err as Error).message);
    }
  }

  public getSanctions(filter?: { guildId?: string; userId?: string; limit?: number }): SanctionRecord[] {
    let result = this.sanctions;
    if (filter?.guildId && filter.guildId !== 'all') {
      result = result.filter(s => s.guildId === filter.guildId || s.guildId === 'default');
    }
    if (filter?.userId) {
      result = result.filter(s => s.userId === filter.userId);
    }
    if (filter?.limit) {
      result = result.slice(0, filter.limit);
    }
    return result;
  }

  public getSanctionById(id: string): SanctionRecord | undefined {
    return this.sanctions.find(s => s.id === id);
  }

  public reviewIncident(id: string, reviewer: string, notes: string): SanctionRecord | null {
    const sanction = this.sanctions.find(s => s.id === id);
    if (sanction) {
      sanction.reviewed = true;
      sanction.reviewedBy = reviewer;
      sanction.reviewedAt = new Date().toISOString();
      sanction.reviewNotes = notes;
      sanction.status = 'reviewed';
      return sanction;
    }
    return null;
  }
}

export const sanctionPolicyManager = new SanctionPolicyManager();
