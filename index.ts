import dotenv from 'dotenv';
import { initDiscordBot } from './botClient';

dotenv.config();

console.log('==============================================');
console.log('  🛡️ SCAM LOCK — DISCORD ANTI-SCAM BOT');
console.log('==============================================');

initDiscordBot().then((started) => {
  if (started) {
    console.log('[Scam Lock] Servicio activo escuchando eventos de Discord.');
  } else {
    console.log('[Scam Lock] Por favor, define DISCORD_TOKEN en tu archivo .env para conectar el bot a Discord.');
    console.log('[Scam Lock] Ejemplo en .env: DISCORD_TOKEN="tu_token_aqui"');
  }
});
