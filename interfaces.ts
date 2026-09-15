import { AnalysisResult, RiskFactor } from '../../types/scamlock';

/**
 * Interface for future AI / Machine Learning analysis plugins (e.g. Gemini, local NLP)
 */
export interface IAIService {
  analyzeContext(content: string, authorHistory?: string[]): Promise<{
    aiConfidence: number;
    aiNotes: string[];
    isIntentDeceptive: boolean;
  }>;
}

/**
 * Interface for external malicious domain databases (e.g., PhishTank, URLhaus, Google Safe Browsing)
 */
export interface IMaliciousDomainDatabase {
  isBlacklisted(domain: string): Promise<{
    blacklisted: boolean;
    threatCategory?: string;
    source?: string;
  }>;
  reportMaliciousUrl(url: string, reason: string): Promise<boolean>;
}

/**
 * Interface for URL reputation scoring engines
 */
export interface IUrlReputationService {
  getDomainReputation(domain: string): Promise<{
    domainAgeDays: number;
    reputationScore: number; // 0 to 100
    isDisposableHost: boolean;
  }>;
}

/**
 * Interface for account trust / suspicious account detection (new accounts, default avatars, mass joiners)
 */
export interface IAccountTrustAnalyzer {
  evaluateAccount(user: { id: string; createdTimestamp: number; joinedTimestamp?: number }): {
    isNewAccount: boolean;
    trustPenalty: number;
    factors: RiskFactor[];
  };
}

/**
 * Interface for anti-raid and coordinated scam wave mitigations
 */
export interface IRaidProtectionService {
  registerMessage(guildId: string, messageHash: string, authorId: string): {
    isWaveDetected: boolean;
    duplicateCount: number;
    triggerSlowmode: boolean;
  };
}
