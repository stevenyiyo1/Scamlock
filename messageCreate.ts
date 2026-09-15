import { Message } from 'discord.js';
import { analyzeMessage } from '../analyzer/riskEngine';
import { guildConfigManager } from '../config/guildConfig';
import { handleAnalysisAction } from '../services/actionService';

export async function onMessageCreate(message: Message): Promise<void> {
  // Never analyze bot messages or webhooks to prevent loops
  if (message.author.bot || message.webhookId) return;

  // Only analyze messages inside a guild
  if (!message.guild) return;

  const config = guildConfigManager.getConfig(message.guild.id, message.guild.name);
  if (!config.enabled) return;

  try {
    const analysis = analyzeMessage(message.content, config);

    // If analysis detects any risk (score >= 31 or custom thresholds), run action pipeline
    if (analysis.score >= 31 || analysis.actionTaken !== 'none') {
      await handleAnalysisAction(message, analysis);
    }
  } catch (error) {
    console.error('[Scam Lock] Error analizando mensaje:', error);
  }
}
