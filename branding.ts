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
  ownerName: '[TU_NOMBRE_O_TITULAR]',
  ownerAlias: '[TU_ALIAS_O_USUARIO]',
  contactEmail: '[TU_EMAIL_DE_CONTACTO@DOMINIO.COM]',
  supportEmail: '[TU_EMAIL_DE_SOPORTE@DOMINIO.COM]',
  securityEmail: '[TU_EMAIL_DE_SEGURIDAD@DOMINIO.COM]',
  discordInviteUrl: 'https://discord.com/oauth2/authorize?client_id=[TU_CLIENT_ID]&permissions=1099511627776&scope=bot%20applications.commands',
  discordSupportServerUrl: 'https://discord.gg/[TU_INVITACION_DE_DISCORD]',
  githubRepoUrl: 'https://github.com/[TU_USUARIO]/scamlock-bot',
  effectiveDate: '15 de septiembre de 2026',
  lastUpdatedDate: '15 de septiembre de 2026',
};
