import { ActivityType, Client } from 'discord.js';
import { cleanGuildCommands, deploySlashCommands } from '../deploy-commands';

export async function onReady(client: Client): Promise<void> {
  console.log(`[Scam Lock] 🚀 Bot iniciado y autenticado con éxito como ${client.user?.tag}!`);
  console.log(`[Scam Lock] 🛡️ Protegiendo ${client.guilds.cache.size} servidores de Discord.`);

  client.user?.setPresence({
    activities: [
      {
        name: '🛡️ /scamlock | Anti-Phishing Guard',
        type: ActivityType.Custom,
      },
    ],
    status: 'online',
  });

  // Auto-registrar comandos Slash de forma única (elimina duplicados)
  if (client.user?.id && process.env.DISCORD_TOKEN) {
    try {
      const devGuildId = process.env.DISCORD_GUILD_ID;
      if (devGuildId) {
        console.log(`[Scam Lock] ⚡ Modo Dev: registrando comandos exclusivamente en servidor ${devGuildId}...`);
        await deploySlashCommands(process.env.DISCORD_TOKEN, client.user.id, devGuildId);
      } else {
        console.log('[Scam Lock] ⚡ Registrando comandos Slash globalmente (sin duplicados)...');
        await deploySlashCommands(process.env.DISCORD_TOKEN, client.user.id);

        // Limpiar comandos residuales por guild para evitar que aparezcan 2 veces en el menú de Discord
        for (const [guildId, guild] of client.guilds.cache) {
          try {
            await cleanGuildCommands(process.env.DISCORD_TOKEN, client.user.id, guildId);
          } catch {
            // Ignorar errores menores en guilds sin permisos
          }
        }
      }
      console.log('[Scam Lock] ✅ Comandos Slash sincronizados limpiamente sin duplicados.');
    } catch (err) {
      console.warn('[Scam Lock] No se pudieron registrar automáticamente los comandos:', (err as Error).message);
    }
  }
}
