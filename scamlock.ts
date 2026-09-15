import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from 'discord.js';
import { analyzeMessage } from '../analyzer/riskEngine';
import { guildConfigManager } from '../config/guildConfig';
import { logService } from '../services/logService';
import { sanctionPolicyManager } from '../services/sanctionPolicyManager';

export const scamlockCommand = new SlashCommandBuilder()
  .setName('scamlock')
  .setDescription('Sistema de seguridad y protección anti-scam y phishing')
  // Subcommand: status
  .addSubcommand(sub =>
    sub
      .setName('status')
      .setDescription('Muestra el estado del sistema Scam Lock, latencia y estadísticas de seguridad')
  )
  // Subcommand: test
  .addSubcommand(sub =>
    sub
      .setName('test')
      .setDescription('Analiza un mensaje sospechoso en tiempo real y muestra su Risk Score detallado')
      .addStringOption(opt =>
        opt
          .setName('mensaje')
          .setDescription('El texto o enlace a examinar')
          .setRequired(true)
      )
  )
  // Subcommand: logs
  .addSubcommand(sub =>
    sub
      .setName('logs')
      .setDescription('Consulta los últimos incidentes de seguridad registrados en este servidor')
      .addIntegerOption(opt =>
        opt
          .setName('limite')
          .setDescription('Número de logs a mostrar (1 - 10)')
          .setMinValue(1)
          .setMaxValue(10)
      )
  )
  // Subcommand: config
  .addSubcommand(sub =>
    sub
      .setName('config')
      .setDescription('Visualiza o actualiza la configuración de Scam Lock para este servidor')
      .addBooleanOption(opt =>
        opt
          .setName('activo')
          .setDescription('Activar o pausar la protección en este servidor')
      )
      .addChannelOption(opt =>
        opt
          .setName('canal-alertas')
          .setDescription('Canal de texto donde se enviarán las alertas para el staff')
      )
      .addChannelOption(opt =>
        opt
          .setName('canal-logs')
          .setDescription('Canal de texto para el registro de auditoría')
      )
      .addIntegerOption(opt =>
        opt
          .setName('umbral-alerta')
          .setDescription('Risk score a partir del cual se alerta a moderadores (ej. 61)')
          .setMinValue(10)
          .setMaxValue(100)
      )
      .addIntegerOption(opt =>
        opt
          .setName('umbral-eliminar')
          .setDescription('Risk score a partir del cual se elimina automáticamente (ej. 81)')
          .setMinValue(30)
          .setMaxValue(100)
      )
      .addBooleanOption(opt =>
        opt
          .setName('auto-sancion')
          .setDescription('Activar/desactivar sanción automática (Baneo/Timeout). Desactivado por defecto')
      )
      .addStringOption(opt =>
        opt
          .setName('tipo-sancion')
          .setDescription('Tipo de sanción automática a aplicar')
          .addChoices(
            { name: '⏳ Aislamiento temporal (Timeout)', value: 'timeout' },
            { name: '🔨 Baneo permanente (Ban)', value: 'ban' }
          )
      )
      .addIntegerOption(opt =>
        opt
          .setName('umbral-sancion')
          .setDescription('Umbral mínimo de Risk Score para sanción automática (mínimo 75, por defecto 90)')
          .setMinValue(75)
          .setMaxValue(100)
      )
      .addIntegerOption(opt =>
        opt
          .setName('duracion-timeout')
          .setDescription('Duración del timeout en minutos (ej: 60)')
          .setMinValue(5)
          .setMaxValue(10080)
      )
      .addUserOption(opt =>
        opt
          .setName('proteger-usuario')
          .setDescription('Añadir a un usuario a la lista protegida contra sanciones automáticas')
      )
      .addRoleOption(opt =>
        opt
          .setName('proteger-rol')
          .setDescription('Añadir un rol a la lista protegida contra sanciones automáticas')
      )
  )
  // Subcommand: whitelist
  .addSubcommand(sub =>
    sub
      .setName('whitelist')
      .setDescription('Administra la lista de dominios confiables del servidor')
      .addStringOption(opt =>
        opt
          .setName('accion')
          .setDescription('Acción a realizar')
          .setRequired(true)
          .addChoices(
            { name: '📋 Listar dominios autorizados', value: 'list' },
            { name: '➕ Añadir dominio', value: 'add' },
            { name: '➖ Eliminar dominio', value: 'remove' }
          )
      )
      .addStringOption(opt =>
        opt
          .setName('dominio')
          .setDescription('Nombre del dominio (ej: miempresa.com)')
          .setRequired(false)
      )
  )
  // Subcommand: incidentes
  .addSubcommand(sub =>
    sub
      .setName('incidentes')
      .setDescription('Consulta incidentes de alto riesgo, sanciones aplicadas y casos pendientes de revisión')
      .addBooleanOption(opt =>
        opt
          .setName('solo-pendientes')
          .setDescription('Filtrar sólo casos que requieren revisión manual del staff')
      )
      .addIntegerOption(opt =>
        opt
          .setName('limite')
          .setDescription('Cantidad de expedientes a listar (1 - 10)')
          .setMinValue(1)
          .setMaxValue(10)
      )
  )
  // Subcommand: revisar
  .addSubcommand(sub =>
    sub
      .setName('revisar')
      .setDescription('Examina la evidencia completa de un incidente y opcionalmente añade notas')
      .addStringOption(opt =>
        opt
          .setName('id')
          .setDescription('ID del incidente (ej: sanc-123456789)')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt
          .setName('nota-resolucion')
          .setDescription('Nota del moderador para marcar el expediente como resuelto')
      )
  )
  // Subcommand: sancionar
  .addSubcommand(sub =>
    sub
      .setName('sancionar')
      .setDescription('Aplica una sanción manual (timeout o ban) tras revisar la evidencia de un usuario')
      .addUserOption(opt =>
        opt
          .setName('usuario')
          .setDescription('Usuario a sancionar')
          .setRequired(true)
      )
      .addStringOption(opt =>
        opt
          .setName('tipo')
          .setDescription('Tipo de sanción a ejecutar')
          .setRequired(true)
          .addChoices(
            { name: '⏳ Aislamiento temporal (Timeout)', value: 'timeout' },
            { name: '🔨 Baneo permanente (Ban)', value: 'ban' }
          )
      )
      .addStringOption(opt =>
        opt
          .setName('motivo')
          .setDescription('Motivo o expediente de la sanción')
          .setRequired(true)
      )
      .addIntegerOption(opt =>
        opt
          .setName('duracion-minutos')
          .setDescription('Duración si es timeout (en minutos, ej: 60)')
          .setMinValue(5)
          .setMaxValue(10080)
      )
      .addStringOption(opt =>
        opt
          .setName('incidente-id')
          .setDescription('ID del expediente asociado (opcional)')
      )
  );

export async function handleScamLockCommand(interaction: ChatInputCommandInteraction): Promise<void> {
  const subcommand = interaction.options.getSubcommand();
  const guild = interaction.guild;

  if (!guild) {
    await interaction.reply({
      content: '❌ Este comando sólo puede utilizarse dentro de un servidor de Discord.',
      ephemeral: true,
    });
    return;
  }

  const config = guildConfigManager.getConfig(guild.id, guild.name);

  // 1. /scamlock status
  if (subcommand === 'status') {
    const recentLogs = logService.getLogs({ guildId: guild.id, limit: 100 });
    const blockedCount = recentLogs.filter(l => l.actionTaken === 'deleted_and_alerted').length;
    const alertCount = recentLogs.filter(l => l.actionTaken === 'alerted').length;

    const embed = new EmbedBuilder()
      .setTitle('🛡️ Scam Lock — Estado Operativo del Sistema')
      .setColor(config.enabled ? 0x22c55e : 0xef4444)
      .addFields(
        {
          name: '⚙️ Estado en este servidor',
          value: config.enabled ? '🟢 **Activo & Protegiendo**' : '🔴 **Pausado**',
          inline: true,
        },
        {
          name: '📡 Latencia WebSocket',
          value: `\`${interaction.client.ws.ping}ms\``,
          inline: true,
        },
        {
          name: '📊 Umbrales de Seguridad',
          value: `• Alerta Moderación: **Score ≥ ${config.alertThreshold}**\n• Eliminación Auto: **Score ≥ ${config.deleteThreshold}**`,
          inline: false,
        },
        {
          name: '📍 Canales Configurados',
          value: `• Alertas: ${config.alertChannelId ? `<#${config.alertChannelId}>` : '*No configurado*'}\n• Logs: ${config.logChannelId ? `<#${config.logChannelId}>` : '*No configurado*'}`,
          inline: false,
        },
        {
          name: '📈 Métricas Recientes',
          value: `• Mensajes de alto riesgo alertados: **${alertCount}**\n• Mensajes críticos bloqueados: **${blockedCount}**\n• Dominios en Whitelist: **${config.whitelist.length}**`,
          inline: false,
        }
      )
      .setFooter({ text: 'Scam Lock v1.0.0 • Heurística y Prevención de Phishing' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    return;
  }

  // 2. /scamlock test
  if (subcommand === 'test') {
    const inputMessage = interaction.options.getString('mensaje', true);
    const analysis = analyzeMessage(inputMessage, config);

    const levelColors = {
      low: 0x22c55e,
      suspicious: 0xeab308,
      high: 0xf97316,
      critical: 0xef4444,
    };

    const levelIcons = {
      low: '🟢 Bajo',
      suspicious: '🟡 Sospechoso',
      high: '🟠 Alto Riesgo',
      critical: '🔴 Crítico',
    };

    const actionNames = {
      none: 'Ninguna acción requerida (Permitido)',
      logged: 'Registrar en auditoría silenciosa',
      alerted: 'Registrar y alertar a moderadores',
      deleted_and_alerted: 'Eliminar mensaje y alertar inmediatamente al staff',
    };

    const embed = new EmbedBuilder()
      .setTitle('🧪 Scam Lock — Diagnóstico de Riesgo en Vivo')
      .setColor(levelColors[analysis.level])
      .addFields(
        {
          name: '🎯 Risk Score',
          value: `### ${analysis.score} / 100 — ${levelIcons[analysis.level]}`,
          inline: false,
        },
        {
          name: '⚡ Acción que se aplicaría',
          value: `\`${actionNames[analysis.actionTaken]}\``,
          inline: false,
        },
        {
          name: '📝 Mensaje Evaluado',
          value: `>>> ${inputMessage.length > 250 ? inputMessage.slice(0, 250) + '...' : inputMessage}`,
          inline: false,
        },
        {
          name: '🔬 Desglose de Factores Detectados',
          value: analysis.factors.length > 0
            ? analysis.factors.map(f => `• **[+${f.points} pts]** ${f.description}${f.evidence ? ` (\`${f.evidence}\`)` : ''}`).join('\n')
            : '✅ No se detectaron patrones sospechosos ni señales de phishing.',
          inline: false,
        }
      );

    if (analysis.socialEngineering && analysis.socialEngineering.detectedSignals.length > 0) {
      const se = analysis.socialEngineering;
      const signalList = se.detectedSignals.map(s => `• **${s.name}** (\`${s.evidence || 'coincidencia'}\`)`).join('\n');
      embed.addFields({
        name: `🧠 Ingeniería Social (${se.isMultiSignalScam ? `Sinergia +${se.synergyBonus} pts` : 'Señal Aislada'})`,
        value: `${signalList}\n*${analysis.detectedUrls.length === 0 ? 'ℹ️ Amenaza identificada sin requerir enlaces URL.' : 'Vinculado a enlaces externos.'}*`,
        inline: false,
      });
    }

    if (analysis.detectedUrls.length > 0) {
      embed.addFields({
        name: '🌐 URLs Analizadas',
        value: analysis.detectedUrls.map(u => `\`${u}\``).join('\n'),
        inline: false,
      });
    }

    if (analysis.isWhitelisted) {
      embed.addFields({
        name: '🛡️ Whitelist',
        value: 'Dominio verificado en la lista blanca de este servidor (Riesgo neutralizado).',
        inline: false,
      });
    }

    embed.setFooter({ text: `Tiempo de análisis: ${analysis.analysisTimeMs}ms` });

    await interaction.reply({ embeds: [embed] });
    return;
  }

  // Check administrative permissions for config and whitelist
  const member = interaction.member;
  const hasAdminPerm = interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild) ||
                       interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);

  // 3. /scamlock config
  if (subcommand === 'config') {
    const activo = interaction.options.getBoolean('activo');
    const canalAlertas = interaction.options.getChannel('canal-alertas');
    const canalLogs = interaction.options.getChannel('canal-logs');
    const umbralAlerta = interaction.options.getInteger('umbral-alerta');
    const umbralEliminar = interaction.options.getInteger('umbral-eliminar');
    const autoSancion = interaction.options.getBoolean('auto-sancion');
    const tipoSancion = interaction.options.getString('tipo-sancion') as 'timeout' | 'ban' | null;
    const umbralSancion = interaction.options.getInteger('umbral-sancion');
    const duracionTimeout = interaction.options.getInteger('duracion-timeout');
    const protegerUsuario = interaction.options.getUser('proteger-usuario');
    const protegerRol = interaction.options.getRole('proteger-rol');

    const hasAnyParam =
      activo !== null ||
      canalAlertas !== null ||
      canalLogs !== null ||
      umbralAlerta !== null ||
      umbralEliminar !== null ||
      autoSancion !== null ||
      tipoSancion !== null ||
      umbralSancion !== null ||
      duracionTimeout !== null ||
      protegerUsuario !== null ||
      protegerRol !== null;

    if (hasAnyParam) {
      if (!hasAdminPerm) {
        await interaction.reply({
          content: '❌ Necesitas permisos de **Gestionar Servidor** o **Administrador** para cambiar la configuración.',
          ephemeral: true,
        });
        return;
      }

      const updates: Record<string, unknown> = {};
      if (activo !== null) updates.enabled = activo;
      if (canalAlertas !== null) {
        updates.alertChannelId = canalAlertas.id;
        updates.alertChannelName = canalAlertas.name;
      }
      if (canalLogs !== null) {
        updates.logChannelId = canalLogs.id;
        updates.logChannelName = canalLogs.name;
      }
      if (umbralAlerta !== null) updates.alertThreshold = umbralAlerta;
      if (umbralEliminar !== null) updates.deleteThreshold = umbralEliminar;
      if (autoSancion !== null) updates.autoSanctionEnabled = autoSancion;
      if (tipoSancion !== null) updates.sanctionType = tipoSancion;
      if (umbralSancion !== null) updates.sanctionThreshold = umbralSancion;
      if (duracionTimeout !== null) updates.timeoutDurationMinutes = duracionTimeout;

      let updated = guildConfigManager.updateConfig(guild.id, updates);

      if (protegerUsuario) {
        guildConfigManager.addProtectedUser(guild.id, protegerUsuario.id);
        updated = guildConfigManager.getConfig(guild.id);
      }
      if (protegerRol) {
        guildConfigManager.addProtectedRole(guild.id, protegerRol.id);
        updated = guildConfigManager.getConfig(guild.id);
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ Configuración Actualizada — Scam Lock')
        .setColor(0x22c55e)
        .setDescription('Los ajustes de protección y sanciones han sido guardados correctamente.')
        .addFields(
          { name: 'Protección', value: updated.enabled ? '🟢 Activa' : '🔴 Desactivada', inline: true },
          { name: 'Sanción Automática', value: updated.autoSanctionEnabled ? '🔴 **ACTIVADA**' : '⚪ **DESACTIVADA (Por defecto)**', inline: true },
          { name: 'Tipo de Sanción', value: updated.sanctionType === 'ban' ? '🔨 Baneo permanente' : `⏳ Timeout (${updated.timeoutDurationMinutes}m)`, inline: true },
          { name: 'Umbral Sanción Auto', value: `Score ≥ **${updated.sanctionThreshold}/100**`, inline: true },
          { name: 'Umbral Alerta Staff', value: `Score ≥ **${updated.alertThreshold}**`, inline: true },
          { name: 'Umbral Auto-Delete', value: `Score ≥ **${updated.deleteThreshold}**`, inline: true },
          { name: 'Canal de Alertas', value: updated.alertChannelId ? `<#${updated.alertChannelId}>` : '*Sin asignar*', inline: true },
          { name: 'Canal de Logs', value: updated.logChannelId ? `<#${updated.logChannelId}>` : '*Sin asignar*', inline: true },
          { name: 'Protegidos', value: `• Usuarios: ${updated.protectedUsers.length}\n• Roles: ${updated.protectedRoles.length}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }

    // Just display current configuration
    const embed = new EmbedBuilder()
      .setTitle('⚙️ Configuración Actual — Scam Lock')
      .setColor(0x3b82f6)
      .setDescription('Ajustes de detección, canales y política de sanciones para este servidor:')
      .addFields(
        { name: 'Estado del Bot', value: config.enabled ? '🟢 Activo' : '🔴 Desactivado', inline: true },
        { name: 'Sanciones Automáticas', value: config.autoSanctionEnabled ? '⚠️ **Activadas**' : '🛡️ **Desactivadas (Modo Seguro)**', inline: true },
        { name: 'Tipo de Sanción', value: config.sanctionType === 'ban' ? '🔨 Baneo' : `⏳ Timeout (${config.timeoutDurationMinutes || 60} min)`, inline: true },
        { name: 'Umbrales de Riesgo', value: `• Alerta: **Score ≥ ${config.alertThreshold}**\n• Eliminar: **Score ≥ ${config.deleteThreshold}**\n• Sanción Auto: **Score ≥ ${config.sanctionThreshold || 90}**`, inline: false },
        { name: '📍 Canales', value: `• Alertas: ${config.alertChannelId ? `<#${config.alertChannelId}>` : '*No configurado*'}\n• Logs: ${config.logChannelId ? `<#${config.logChannelId}>` : '*No configurado*'}`, inline: true },
        { name: '🛡️ Excepciones Protegidas', value: `• Usuarios protegidos: **${config.protectedUsers?.length || 0}**\n• Roles protegidos: **${config.protectedRoles?.length || 0}**\n• Dominios Whitelist: **${config.whitelist.length}**`, inline: true }
      )
      .setFooter({ text: 'Usa /scamlock config [opciones] para actualizar parámetros' });

    await interaction.reply({ embeds: [embed] });
    return;
  }

  // 4. /scamlock whitelist
  if (subcommand === 'whitelist') {
    const action = interaction.options.getString('accion', true);
    const domain = interaction.options.getString('dominio');

    if (action === 'list') {
      const listText = config.whitelist.length > 0
        ? config.whitelist.map(d => `• \`${d}\``).join('\n')
        : 'La lista blanca está vacía.';

      const embed = new EmbedBuilder()
        .setTitle('🛡️ Whitelist de Dominios Confiables')
        .setColor(0x3b82f6)
        .setDescription(`Estos dominios están autorizados y no activarán alertas falsas de phishing:\n\n${listText}`)
        .setFooter({ text: `Total: ${config.whitelist.length} dominios autorizados` });

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!hasAdminPerm) {
      await interaction.reply({
        content: '❌ Necesitas permisos de **Gestionar Servidor** o **Administrador** para modificar la whitelist.',
        ephemeral: true,
      });
      return;
    }

    if (!domain) {
      await interaction.reply({
        content: '❌ Debes especificar un dominio para añadir o eliminar (ejemplo: `miempresa.com`).',
        ephemeral: true,
      });
      return;
    }

    if (action === 'add') {
      guildConfigManager.addWhitelistDomain(guild.id, domain);
      await interaction.reply({
        content: `✅ El dominio \`${domain.toLowerCase()}\` ha sido **añadido** a la whitelist de este servidor.`,
      });
      return;
    }

    if (action === 'remove') {
      guildConfigManager.removeWhitelistDomain(guild.id, domain);
      await interaction.reply({
        content: `🗑️ El dominio \`${domain.toLowerCase()}\` ha sido **removido** de la whitelist.`,
      });
      return;
    }
  }

  // 5. /scamlock logs
  if (subcommand === 'logs') {
    const limit = interaction.options.getInteger('limite') || 5;
    const logs = logService.getLogs({ guildId: guild.id, limit });

    if (logs.length === 0) {
      await interaction.reply({
        content: '📋 No hay incidentes registrados recientemente en este servidor.',
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`📋 Registros de Seguridad Recientes (${logs.length})`)
      .setColor(0x3b82f6)
      .setDescription('Historial de mensajes analizados con sospecha o alto riesgo:')
      .setTimestamp();

    for (const item of logs) {
      const icon = item.level === 'critical' ? '🔴' : item.level === 'high' ? '🟠' : item.level === 'suspicious' ? '🟡' : '🟢';
      const timeStr = new Date(item.timestamp).toLocaleTimeString();
      const reasonsSnippet = item.reasons.slice(0, 2).join('; ');

      embed.addFields({
        name: `${icon} [${item.score}/100] ${item.userTag} a las ${timeStr}`,
        value: `**Acción:** \`${item.actionTaken}\`\n**Mensaje:** ${item.messageContent.length > 90 ? item.messageContent.substring(0, 90) + '...' : item.messageContent}\n**Motivos:** ${reasonsSnippet || 'Heurística estándar'}`,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // Permissions check for moderation operations
  const hasModPerm =
    interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers) ||
    interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers) ||
    interaction.memberPermissions?.has(PermissionFlagsBits.ManageMessages) ||
    interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild) ||
    interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);

  // 6. /scamlock incidentes
  if (subcommand === 'incidentes') {
    if (!hasModPerm) {
      await interaction.reply({
        content: '❌ Necesitas permisos de moderación para consultar los incidentes.',
        ephemeral: true,
      });
      return;
    }

    const soloPendientes = interaction.options.getBoolean('solo-pendientes') ?? false;
    const limit = interaction.options.getInteger('limite') || 6;
    let records = sanctionPolicyManager.getSanctions({ guildId: guild.id });

    if (soloPendientes) {
      records = records.filter(r => r.manualReviewRequired && !r.reviewed);
    }
    records = records.slice(0, limit);

    if (records.length === 0) {
      await interaction.reply({
        content: soloPendientes
          ? '✅ No hay expedientes pendientes de revisión manual.'
          : '📋 No hay incidentes ni sanciones registradas en este servidor.',
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`🛡️ Expedientes e Incidentes de Seguridad (${records.length})`)
      .setColor(soloPendientes ? 0xf59e0b : 0x3b82f6)
      .setDescription(
        soloPendientes
          ? '⚠️ Casos de alto riesgo que requieren inspección manual por parte de moderadores:'
          : 'Historial de sanciones automáticas, alertas prioritarias y revisiones:'
      )
      .setTimestamp();

    for (const rec of records) {
      const icon = rec.actionExecuted === 'ban' ? '🔨' : rec.actionExecuted === 'timeout' ? '⏳' : rec.actionExecuted === 'alert_only' ? '⚠️' : '🛡️';
      const statusBadge = rec.reviewed ? '✅ Revisado' : rec.manualReviewRequired ? '🔴 Requiere Revisión' : '⚙️ Auto';

      embed.addFields({
        name: `${icon} \`[${rec.score}/100]\` ${rec.userTag} • ${statusBadge}`,
        value: `**Acción:** \`${rec.actionExecuted}\` | **ID:** \`${rec.id}\`\n**Motivo:** ${rec.reasons[0] || 'Phishing detectado'}\n**Mensaje:** ${rec.messageContent.length > 80 ? rec.messageContent.slice(0, 80) + '...' : rec.messageContent}`,
        inline: false,
      });
    }

    embed.setFooter({ text: 'Usa /scamlock revisar id:<ID> para inspeccionar la evidencia completa' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // 7. /scamlock revisar
  if (subcommand === 'revisar') {
    if (!hasModPerm) {
      await interaction.reply({
        content: '❌ Necesitas permisos de moderación para revisar expedientes.',
        ephemeral: true,
      });
      return;
    }

    const id = interaction.options.getString('id', true).trim();
    const notaResolucion = interaction.options.getString('nota-resolucion');
    const record = sanctionPolicyManager.getSanctionById(id);

    if (!record) {
      await interaction.reply({
        content: `❌ No se encontró ningún expediente con el ID \`${id}\`.`,
        ephemeral: true,
      });
      return;
    }

    if (notaResolucion) {
      sanctionPolicyManager.reviewIncident(id, interaction.user.tag, notaResolucion);
    }

    const color = record.score >= 90 ? 0xef4444 : record.score >= 70 ? 0xf97316 : 0xeab308;
    const embed = new EmbedBuilder()
      .setTitle(`🔍 Expediente Forense de Incidente: ${record.id}`)
      .setColor(color)
      .addFields(
        { name: '👤 Usuario Evaluado', value: `${record.userTag} (\`${record.userId}\`)`, inline: true },
        { name: '🎯 Risk Score', value: `**${record.score} / 100** (${record.level.toUpperCase()})`, inline: true },
        { name: '⚡ Acción Registrada', value: `\`${record.actionExecuted}\``, inline: true },
        { name: '👮 Ejecutor / Origen', value: `\`${record.executor}\``, inline: true },
        { name: '📅 Fecha y Hora', value: new Date(record.timestamp).toLocaleString(), inline: true },
        { name: '📌 Estado de Revisión', value: record.reviewed ? `✅ Revisado por ${record.reviewedBy}` : record.manualReviewRequired ? '⚠️ **Pendiente de confirmación manual**' : 'Procesado', inline: true },
        {
          name: '💬 Mensaje Original Detectado',
          value: `>>> ${record.messageContent.length > 500 ? record.messageContent.slice(0, 500) + '...' : record.messageContent}`,
          inline: false,
        },
        {
          name: '🔬 Desglose de Factores y Motivos',
          value: record.reasons.map(r => `• ${r}`).join('\n') || 'Heurística estándar',
          inline: false,
        }
      );

    if (record.detectedUrls.length > 0) {
      embed.addFields({
        name: '🌐 URLs Involucradas',
        value: record.detectedUrls.map(u => `\`${u}\``).join('\n'),
        inline: false,
      });
    }

    if (record.reviewNotes) {
      embed.addFields({
        name: '📝 Notas de Moderación',
        value: `*«${record.reviewNotes}»* — por ${record.reviewedBy || 'Staff'}`,
        inline: false,
      });
    }

    embed.setFooter({ text: 'Scam Lock • Auditoría de Seguridad' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  // 8. /scamlock sancionar
  if (subcommand === 'sancionar') {
    if (!hasModPerm) {
      await interaction.reply({
        content: '❌ Necesitas permisos de **Moderar Miembros** o **Banear Miembros** para aplicar sanciones manuales.',
        ephemeral: true,
      });
      return;
    }

    const targetUser = interaction.options.getUser('usuario', true);
    const tipo = interaction.options.getString('tipo', true) as 'timeout' | 'ban';
    const motivo = interaction.options.getString('motivo', true);
    const duracionMinutos = interaction.options.getInteger('duracion-minutos') || 60;
    const incidenteId = interaction.options.getString('incidente-id') || undefined;

    let targetMember: GuildMember | null = null;
    try {
      targetMember = await guild.members.fetch(targetUser.id);
    } catch {
      targetMember = null;
    }

    if (!targetMember) {
      await interaction.reply({
        content: `❌ El usuario <@${targetUser.id}> no se encuentra actualmente en este servidor.`,
        ephemeral: true,
      });
      return;
    }

    const result = await sanctionPolicyManager.executeManualSanction({
      guild,
      targetMember,
      executor: { id: interaction.user.id, tag: interaction.user.tag },
      sanctionType: tipo,
      durationMinutes: duracionMinutos,
      reason: motivo,
      incidentId: incidenteId,
    });

    if (!result.success) {
      await interaction.reply({
        content: `❌ **No se pudo aplicar la sanción:** ${result.message}`,
        ephemeral: true,
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚖️ Sanción Manual Aplicada — [${tipo.toUpperCase()}]`)
      .setColor(tipo === 'ban' ? 0xef4444 : 0xf97316)
      .setDescription(result.message)
      .addFields(
        { name: '👤 Usuario Sancionado', value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true },
        { name: '👮 Moderador', value: `${interaction.user.tag}`, inline: true },
        { name: '⏱️ Duración', value: tipo === 'timeout' ? `${duracionMinutos} minutos` : 'Permanente', inline: true },
        { name: '📝 Motivo', value: `>>> ${motivo}`, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
    return;
  }
}
