import { EmbedBuilder } from 'discord.js';
import { AnalysisResult, SecurityLog } from '../../types/scamlock';

class LogService {
  private logs: SecurityLog[] = [];
  private maxLogs: number = 200;

  constructor() {
    // Seed with realistic demo incident logs
    this.logs = [
      {
        id: 'log-101',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        guildId: 'default',
        guildName: 'Servidor Principal (Comunidad)',
        userId: '839201948291039201',
        userTag: 'FreeNitroBot#9921',
        channelId: 'general-chat',
        channelName: '#general',
        messageContent: '🚨 OMG guys discord is giving FREE 3 MONTHS NITRO for celebration!! Claim here: https://discord-nitro.gift/claim?id=9928',
        detectedUrls: ['https://discord-nitro.gift/claim?id=9928'],
        score: 95,
        level: 'critical',
        reasons: [
          'Promesa fraudulenta de Discord Nitro gratuito o regalo masivo (+35)',
          "Uso no autorizado de marca: El dominio 'discord-nitro.gift' imita a 'discord.com' (+40)",
          'Combinación de ingeniería social con enlace externo activo (+15)',
        ],
        actionTaken: 'deleted_and_alerted',
        messageDeleted: true,
      },
      {
        id: 'log-102',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        guildId: 'default',
        guildName: 'Servidor Principal (Comunidad)',
        userId: '492019482910392019',
        userTag: 'CryptoHunter#1022',
        channelId: 'crypto-talk',
        channelName: '#crypto-talk',
        messageContent: 'Exclusive Solana Airdrop is live! Connect your phantom wallet at http://solana-airdrop.buzz to receive 250 SOL bonus!!',
        detectedUrls: ['http://solana-airdrop.buzz'],
        score: 75,
        level: 'high',
        reasons: [
          'Intento de phishing de billeteras de criptomonedas o drenadores (+35)',
          'TLD de alto riesgo (.buzz) (+20)',
          'Combinación de ingeniería social con enlace externo (+15)',
        ],
        actionTaken: 'alerted',
        messageDeleted: false,
      },
      {
        id: 'log-103',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        guildId: 'default',
        guildName: 'Servidor Principal (Comunidad)',
        userId: '392019482910392018',
        userTag: 'AlexGamer#4412',
        channelId: 'memes',
        channelName: '#memes',
        messageContent: 'Check out this funny clip on bit.ly/funnycat44',
        detectedUrls: ['https://bit.ly/funnycat44'],
        score: 35,
        level: 'suspicious',
        reasons: ['Acortador de enlaces detectado (oculta el destino real) (+15)'],
        actionTaken: 'logged',
        messageDeleted: false,
      },
    ];
  }

  public recordLog(
    guild: { id: string; name: string },
    user: { id: string; tag: string; avatarUrl?: string },
    channel: { id: string; name: string },
    content: string,
    analysis: AnalysisResult,
    messageDeleted: boolean
  ): SecurityLog {
    const newLog: SecurityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      guildId: guild.id,
      guildName: guild.name,
      userId: user.id,
      userTag: user.tag,
      userAvatar: user.avatarUrl,
      channelId: channel.id,
      channelName: channel.name,
      messageContent: content,
      detectedUrls: analysis.detectedUrls,
      score: analysis.score,
      level: analysis.level,
      reasons: analysis.factors.map(f => `${f.description} (+${f.points})`),
      actionTaken: analysis.actionTaken,
      messageDeleted,
    };

    this.logs.unshift(newLog);

    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    return newLog;
  }

  public getLogs(filter?: { guildId?: string; level?: string; limit?: number }): SecurityLog[] {
    let result = [...this.logs];

    if (filter?.guildId && filter.guildId !== 'all') {
      result = result.filter(l => l.guildId === filter.guildId || l.guildId === 'default');
    }

    if (filter?.level && filter.level !== 'all') {
      result = result.filter(l => l.level === filter.level);
    }

    if (filter?.limit) {
      result = result.slice(0, filter.limit);
    }

    return result;
  }

  public createDiscordAlertEmbed(log: SecurityLog): EmbedBuilder {
    const colorMap = {
      low: 0x22c55e,        // green
      suspicious: 0xeab308, // yellow
      high: 0xf97316,       // orange
      critical: 0xef4444,   // red
    };

    const iconMap = {
      low: '🟢',
      suspicious: '🟡',
      high: '🟠',
      critical: '🔴',
    };

    const actionTextMap = {
      none: 'Ninguna (Nivel seguro)',
      logged: 'Registrado en historial',
      alerted: 'Alerta enviada a moderadores',
      deleted_and_alerted: '🚨 MENSAJE ELIMINADO & ALERTA PRIORITARIA ENVIADA',
    };

    const embed = new EmbedBuilder()
      .setTitle(`${iconMap[log.level]} Scam Lock — Detección de Amenaza`)
      .setColor(colorMap[log.level])
      .setTimestamp(new Date(log.timestamp))
      .addFields(
        { name: '👤 Usuario', value: `<@${log.userId}> (\`${log.userTag}\`)`, inline: true },
        { name: '📍 Canal', value: `${log.channelName}`, inline: true },
        { name: '📊 Risk Score', value: `**${log.score} / 100** (${log.level.toUpperCase()})`, inline: true },
        { name: '⚙️ Acción Ejecutada', value: `\`${actionTextMap[log.actionTaken]}\``, inline: false },
        {
          name: '🔍 Razones Identificadas',
          value: log.reasons.length > 0
            ? log.reasons.map(r => `• ${r}`).join('\n')
            : 'Sin factores de riesgo relevantes.',
          inline: false,
        }
      );

    if (log.detectedUrls.length > 0) {
      embed.addFields({
        name: '🌐 URLs Analizadas',
        value: log.detectedUrls.map(u => `\`${u}\``).join('\n'),
        inline: false,
      });
    }

    // Truncate message snippet safely
    const snippet = log.messageContent.length > 300 
      ? log.messageContent.substring(0, 300) + '...'
      : log.messageContent;

    embed.addFields({
      name: '💬 Contenido del Mensaje',
      value: `>>> ${snippet || '*(mensaje vacío)*'}`,
      inline: false,
    });

    embed.setFooter({ text: 'Scam Lock Security Guard • Protección activa contra estafas' });

    return embed;
  }
}

export const logService = new LogService();
