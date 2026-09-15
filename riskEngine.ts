import { AnalysisResult, RiskFactor, RiskLevel, ServerConfig } from '../../types/scamlock';
import { evaluateFinancialScam } from './financialScam';
import { evaluateTextHeuristics } from './heuristics';
import { evaluateSocialEngineering } from './socialEngineering';
import { evaluateUrls, extractUrls } from './urlDetector';

export function determineRiskLevel(score: number): { level: RiskLevel; label: string } {
  if (score <= 30) {
    return { level: 'low', label: 'Bajo' };
  } else if (score <= 60) {
    return { level: 'suspicious', label: 'Sospechoso' };
  } else if (score <= 80) {
    return { level: 'high', label: 'Alto riesgo' };
  } else {
    return { level: 'critical', label: 'Crítico' };
  }
}

export function analyzeMessage(
  content: string,
  config?: Partial<ServerConfig>
): AnalysisResult {
  const startTime = performance.now();
  const factors: RiskFactor[] = [];

  // 1. URL Analyzer: Extract and evaluate all URLs
  const extractedUrls = extractUrls(content);
  const detectedUrlStrings = extractedUrls.map(u => u.rawUrl);
  const whitelist = config?.whitelist || [];
  const { factors: urlFactors, isAllWhitelisted } = evaluateUrls(extractedUrls, whitelist);
  factors.push(...urlFactors);

  // 2. Text Heuristics Analyzer (general phishing, tokens, giveaways)
  const textFactors = evaluateTextHeuristics(content);
  factors.push(...textFactors);

  // 3. Social Engineering Analyzer (authority impersonation, fake prizes, 2FA theft)
  const { factors: seFactors, report: seReport } = evaluateSocialEngineering(content, factors);
  factors.push(...seFactors);

  // 4. Financial Scam Analyzer (get-rich-quick, fake investment, Ponzi, advance-fee, recruitment)
  const { factors: fsFactors, report: fsReport } = evaluateFinancialScam(content, factors);
  factors.push(...fsFactors);

  // 5. Synergistic Multiplier for external links coupled with scam schemes:
  // If we have scam signals (Nitro, Crypto, Financial Scam, Social Engineering) AND external non-whitelisted URL
  const hasExternalUrls = extractedUrls.length > 0;
  const hasScamSignals = factors.some(f =>
    [
      'nitro',
      'crypto',
      'urgency',
      'keyword',
      'easy_money',
      'suspicious_prize',
      'indirect_redirect',
      'impersonation',
      'sensitive_info',
      'synergy',
      'financial_scam',
      'get_rich_quick',
      'fake_investment',
      'recruitment_scam',
      'advance_fee',
      'unrealistic_profit',
    ].includes(f.category)
  );

  if (fsReport.isFinancialScam && hasExternalUrls && !isAllWhitelisted) {
    factors.push({
      category: 'financial_scam',
      points: 20,
      description: 'Scam financiero / captación con enlace externo no verificado',
      evidence: extractedUrls[0].rawUrl,
    });
  } else if (hasScamSignals && hasExternalUrls && !isAllWhitelisted) {
    factors.push({
      category: 'urgency',
      points: 15,
      description: 'Combinación de ingeniería social / oferta sospechosa con enlace externo activo',
    });
  }

  // 6. Evidence Aggregator & Context Adjustment
  let totalScore = factors.reduce((sum, f) => sum + f.points, 0);

  // Si se detectó contexto educativo o advertencia legítima contra estafas:
  // ("This scam promises...", "Scammers often promise..."), atenuar a riesgo bajo (máx 15)
  if (fsReport.hasEducationalContext) {
    totalScore = Math.min(totalScore, 10);
  }

  // If ALL URLs are whitelisted, dampen score significantly to avoid false positives
  if (isAllWhitelisted && extractedUrls.length > 0) {
    totalScore = Math.min(totalScore, 20);
  }

  // Clamp score strictly between 0 and 100
  const finalScore = Math.min(100, Math.max(0, totalScore));
  const { level, label } = determineRiskLevel(finalScore);

  // Determine action according to thresholds
  const alertThreshold = config?.alertThreshold ?? 61;
  const deleteThreshold = config?.deleteThreshold ?? 81;

  let actionTaken: AnalysisResult['actionTaken'] = 'none';

  if (finalScore >= deleteThreshold) {
    actionTaken = 'deleted_and_alerted';
  } else if (finalScore >= alertThreshold) {
    actionTaken = 'alerted';
  } else if (finalScore >= 31) {
    actionTaken = 'logged';
  } else {
    actionTaken = 'none';
  }

  const analysisTimeMs = Number((performance.now() - startTime).toFixed(2));

  return {
    score: finalScore,
    level,
    levelLabel: label,
    factors,
    detectedUrls: detectedUrlStrings,
    isWhitelisted: isAllWhitelisted,
    actionTaken,
    analysisTimeMs,
    socialEngineering: seReport,
    financialScam: fsReport,
  };
}
