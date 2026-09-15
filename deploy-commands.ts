import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { scamlockCommand } from './commands/scamlock';

dotenv.config();

export async function cleanGuildCommands(token: string, clientId: string, guildId: string): Promise<void> {
  try {
    const rest = new REST({ version: '10' }).setToken(token);
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
  } catch {
    // Ignorar si no tiene permisos
  }
}

export async function deploySlashCommands(token?: string, clientId?: string, guildId?: string): Promise<{ success: boolean; message: string }> {
  const botToken = token || process.env.DISCORD_TOKEN;
  const botClientId = clientId || process.env.DISCORD_CLIENT_ID;
  const targetGuildId = guildId || process.env.DISCORD_GUILD_ID;

  if (!botToken || botToken === 'TU_DISCORD_BOT_TOKEN') {
    return {
      success: false,
      message: 'Falta configurar DISCORD_TOKEN en el archivo .env para registrar los comandos en Discord.',
    };
  }

  if (!botClientId || botClientId === 'TU_DISCORD_CLIENT_ID') {
    return {
      success: false,
      message: 'Falta configurar DISCORD_CLIENT_ID en el archivo .env.',
    };
  }

  const commands = [scamlockCommand.toJSON()];
  const rest = new REST({ version: '10' }).setToken(botToken);

  try {
    if (targetGuildId) {
      console.log(`[Scam Lock] Registrando comandos exclusivamente en servidor (${targetGuildId})...`);
      await rest.put(
        Routes.applicationGuildCommands(botClientId, targetGuildId),
        { body: commands }
      );
      return {
        success: true,
        message: `Comandos registrados con éxito en el servidor ${targetGuildId} (sin duplicados).`,
      };
    } else {
      console.log('[Scam Lock] Registrando comandos globalmente en la API de Discord...');
      await rest.put(
        Routes.applicationCommands(botClientId),
        { body: commands }
      );
      return {
        success: true,
        message: 'Comandos registrados globalmente en Discord (sin duplicados en servidores).',
      };
    }
  } catch (error) {
    console.error('[Scam Lock] Error registrando comandos Slash:', error);
    return {
      success: false,
      message: `Error al registrar comandos: ${(error as Error).message}`,
    };
  }
}

// Standalone execution check
if (process.argv[1]?.endsWith('deploy-commands.ts') || process.argv[1]?.endsWith('deploy-commands.js')) {
  deploySlashCommands().then(res => {
    console.log(res.message);
    process.exit(res.success ? 0 : 1);
  });
}
