import { Message, TextChannel } from 'discord.js';
import { AnalysisResult } from '../../types/scamlock';
import { guildConfigManager } from '../config/guildConfig';
import { logService } from './logService';
import { sanctionPolicyManager } from './sanctionPolicyManager';

export async function handleAnalysisAction(message: Message, analysis: AnalysisResult): Promise<void> {
  const guild = message.guild;
  if (!guild) return;

  const config = guildConfigManager.getConfig(guild.id, guild.name);
  if (!config.enabled) return;

  let messageDeleted = false;

  // 1. Critical Action: Delete message if eligible and threshold met
  if (analysis.actionTaken === 'deleted_and_alerted') {
    try {
      if (message.deletable) {
        await message.delete();
        messageDeleted = true;
      }
    } catch (err) {
      console.warn(`[Scam Lock] No se pudo eliminar el mensaje en ${guild.name}:`, (err as Error).message);
    }
  }

  // 2. Record to security logs
  const logEntry = logService.recordLog(
    { id: guild.id, name: guild.name },
    {
      id: message.author.id,
      tag: message.author.tag,
      avatarUrl: message.author.displayAvatarURL(),
    },
    { id: message.channel.id, name: `#${(message.channel as TextChannel).name || 'canal'}` },
    message.content,
    analysis,
    messageDeleted
  );

  // 3. Central Sanction Policy Evaluation (Rule 7: Analyzers never sanction directly, only central policy)
  try {
    await sanctionPolicyManager.evaluateAndProcessPolicy(message, analysis, config);
  } catch (err) {
    console.error(`[Scam Lock] Error en política de sanciones:`, err);
  }

  // 4. Dispatch standard Alerts to Discord channel if threshold reached
  if (analysis.actionTaken === 'alerted' || analysis.actionTaken === 'deleted_and_alerted') {
    const targetChannelId = config.alertChannelId || config.logChannelId;

    if (targetChannelId) {
      try {
        const channel = await guild.channels.fetch(targetChannelId);
        if (channel && channel.isTextBased()) {
          const embed = logService.createDiscordAlertEmbed(logEntry);
          await (channel as TextChannel).send({ embeds: [embed] });
        }
      } catch (err) {
        console.warn(`[Scam Lock] Error enviando alerta a canal ${targetChannelId}:`, (err as Error).message);
      }
    }
  } else if (analysis.actionTaken === 'logged' && config.logChannelId) {
    // Send quiet log if logChannelId is configured
    try {
      const logChannel = await guild.channels.fetch(config.logChannelId);
      if (logChannel && logChannel.isTextBased()) {
        const embed = logService.createDiscordAlertEmbed(logEntry);
        await (logChannel as TextChannel).send({ embeds: [embed] });
      }
    } catch (err) {
      console.warn(`[Scam Lock] Error enviando log a canal ${config.logChannelId}:`, (err as Error).message);
    }
  }
}
