import { ServerConfig } from '../../types/scamlock';

// Default global whitelist of high-authority safe domains
export const DEFAULT_SAFE_DOMAINS = [
  'discord.com',
  'discord.gg',
  'discordapp.com',
  'discordstatus.com',
  'youtube.com',
  'youtu.be',
  'github.com',
  'google.com',
  'store.steampowered.com',
  'steamcommunity.com',
  'twitter.com',
  'x.com',
  'twitch.tv',
  'reddit.com',
  'wikipedia.org',
];

class GuildConfigManager {
  private configs: Map<string, ServerConfig> = new Map();

  constructor() {
    // Seed with a default demonstration guild
    this.configs.set('default', {
      guildId: 'default',
      guildName: 'Servidor Principal (Comunidad)',
      enabled: true,
      logChannelId: '123456789012345678',
      logChannelName: 'scamlock-logs',
      alertChannelId: '987654321098765432',
      alertChannelName: 'alertas-moderación',
      alertThreshold: 61,
      deleteThreshold: 81,
      whitelist: [...DEFAULT_SAFE_DOMAINS],
      autoSanctionEnabled: false, // Rule 1: Disabled by default
      sanctionThreshold: 90, // Rule 3: High critical threshold, min 75
      sanctionType: 'timeout',
      timeoutDurationMinutes: 60,
      protectedUsers: [],
      protectedRoles: [],
    });
  }

  public getConfig(guildId: string, guildName?: string): ServerConfig {
    if (!this.configs.has(guildId)) {
      this.configs.set(guildId, {
        guildId,
        guildName: guildName || `Servidor ${guildId}`,
        enabled: true,
        logChannelId: '',
        logChannelName: 'scamlock-logs',
        alertChannelId: '',
        alertChannelName: 'alertas-staff',
        alertThreshold: 61,
        deleteThreshold: 81,
        whitelist: [...DEFAULT_SAFE_DOMAINS],
        autoSanctionEnabled: false, // Rule 1: Disabled by default
        sanctionThreshold: 90, // Rule 3: Must be >= 75
        sanctionType: 'timeout',
        timeoutDurationMinutes: 60,
        protectedUsers: [],
        protectedRoles: [],
      });
    }
    return this.configs.get(guildId)!;
  }

  public updateConfig(guildId: string, updates: Partial<ServerConfig>): ServerConfig {
    const existing = this.getConfig(guildId);

    // Rule 3: Do not allow automatic sanction thresholds below 75 (low/moderate scores cannot auto-ban)
    if (typeof updates.sanctionThreshold === 'number' && updates.sanctionThreshold < 75) {
      throw new Error('Por seguridad, el umbral de sanción automática no puede ser inferior a 75.');
    }

    const updated = {
      ...existing,
      ...updates,
      guildId: existing.guildId, // preserve ID
    };
    this.configs.set(guildId, updated);
    return updated;
  }

  public addProtectedUser(guildId: string, userId: string): string[] {
    const config = this.getConfig(guildId);
    if (!config.protectedUsers.includes(userId)) {
      config.protectedUsers.push(userId);
    }
    return config.protectedUsers;
  }

  public removeProtectedUser(guildId: string, userId: string): string[] {
    const config = this.getConfig(guildId);
    config.protectedUsers = config.protectedUsers.filter(id => id !== userId);
    return config.protectedUsers;
  }

  public addProtectedRole(guildId: string, roleId: string): string[] {
    const config = this.getConfig(guildId);
    if (!config.protectedRoles.includes(roleId)) {
      config.protectedRoles.push(roleId);
    }
    return config.protectedRoles;
  }

  public removeProtectedRole(guildId: string, roleId: string): string[] {
    const config = this.getConfig(guildId);
    config.protectedRoles = config.protectedRoles.filter(id => id !== roleId);
    return config.protectedRoles;
  }

  public addWhitelistDomain(guildId: string, domain: string): string[] {
    const config = this.getConfig(guildId);
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

    if (cleanDomain && !config.whitelist.includes(cleanDomain)) {
      config.whitelist.push(cleanDomain);
    }
    return config.whitelist;
  }

  public removeWhitelistDomain(guildId: string, domain: string): string[] {
    const config = this.getConfig(guildId);
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    config.whitelist = config.whitelist.filter(d => d !== cleanDomain);
    return config.whitelist;
  }

  public getAllConfigs(): ServerConfig[] {
    return Array.from(this.configs.values());
  }
}

export const guildConfigManager = new GuildConfigManager();
