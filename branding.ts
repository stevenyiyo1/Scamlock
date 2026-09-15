export interface BrandConfig {
  projectName: string;
  tagline: string;
  version: string;
  // Campos a personalizar por el operador / desarrollador:
  ownerName: string;
  ownerAlias: string;
  contactEmail: string;
  supportEmail: string;
  securityEmail: string;
  discordInviteUrl: string;
  discordSupportServerUrl: string;
  githubRepoUrl: string;
  effectiveDate: string;
  lastUpdatedDate: string;
}

export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  projectName: 'Scam Lock',
  tagline: 'Bot de Ciberseguridad & Detección Heurística de Amenazas para Discord',
  version: 'v1.0.0',
  // =========================================================================
  // ⚠️ CAMPOS A PERSONALIZAR CON TUS DATOS REALES ANTES DE PUBLICAR
  // Reemplaza los siguientes valores con tu información de contacto real:
  // =========================================================================
  ownerName: 'ScamLock Team',
  ownerAlias: 'Stevenyiyo',
  contactEmail: 'Exclusive2149@gmail.com',
  supportEmail: 'Exclusive2149@gmail.com',
  securityEmail: 'Exclusive2149@gmail.com',
  discordInviteUrl: 'https://discord.com/oauth2/authorize?client_id=1502348097370718390&permissions=1101659236358&integration_type=0&scope=bot+applications.commands',
  discordSupportServerUrl: 'https://discord.gg/JV7PkGGpGB',
  githubRepoUrl: 'https://github.com/Stevenyiyo1/scamlock',
  effectiveDate: '15 de septiembre de 2026',
  lastUpdatedDate: '15 de septiembre de 2026',
};
