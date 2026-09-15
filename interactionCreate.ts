import { Interaction } from 'discord.js';
import { handleScamLockCommand } from '../commands/scamlock';

export async function onInteractionCreate(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'scamlock') {
    try {
      await handleScamLockCommand(interaction);
    } catch (error) {
      console.error('[Scam Lock] Error ejecutando comando:', error);
      const replyPayload = {
        content: '⚠️ Ocurrió un error interno al procesar este comando.',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(replyPayload);
      } else {
        await interaction.reply(replyPayload);
      }
    }
  }
}
