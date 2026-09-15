import { RiskFactor } from '../../types/scamlock';

// High-profile target domains commonly impersonated in phishing attacks
export const TARGET_BRANDS = [
  'discord.com',
  'discordapp.com',
  'discord.gg',
  'steamcommunity.com',
  'steampowered.com',
  'roblox.com',
  'telegram.org',
  'metamask.io',
  'github.com',
  'google.com',
  'youtube.com',
  'twitch.tv',
];

// High-risk disposable TLDs frequently used in automated phishing waves
export const SUSPICIOUS_TLDS = [
  '.top',
  '.xyz',
  '.quest',
  '.click',
  '.ru',
  '.fit',
  '.buzz',
  '.cfd',
  '.monster',
  '.rest',
  '.gq',
  '.cf',
  '.tk',
  '.ml',
];

// Common URL shorteners (increases suspicion slightly when combined with other signals)
export const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  'cutt.ly',
  't.co',
  'is.gd',
  'ow.ly',
  'rb.gy',
];

/**
 * Standard Levenshtein distance calculation for string similarity
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export interface ExtractedUrlInfo {
  rawUrl: string;
  domain: string;
  hostname: string;
  path: string;
  isMarkdownSpoofed?: boolean;
  spoofedText?: string;
}

/**
 * Extracts all URLs from text, parsing normal URLs and Markdown-embedded links
 */
export function extractUrls(text: string): ExtractedUrlInfo[] {
  const results: ExtractedUrlInfo[] = [];

  // 1. Detect Markdown link spoofing: [https://discord.com](http://malicious-site.com)
  const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;
  let mdMatch: RegExpExecArray | null;

  while ((mdMatch = markdownRegex.exec(text)) !== null) {
    const linkText = mdMatch[1].trim();
    const targetUrl = mdMatch[2].trim();

    try {
      const parsed = new URL(targetUrl);
      const isTargetingDomain = /https?:\/\/|www\./i.test(linkText);

      let isSpoofed = false;
      if (isTargetingDomain) {
        try {
          const textUrl = linkText.startsWith('http') ? linkText : `https://${linkText}`;
          const parsedTextUrl = new URL(textUrl);
          if (parsedTextUrl.hostname.toLowerCase() !== parsed.hostname.toLowerCase()) {
            isSpoofed = true;
          }
        } catch {
          isSpoofed = true;
        }
      }

      results.push({
        rawUrl: targetUrl,
        domain: parsed.hostname.toLowerCase(),
        hostname: parsed.hostname.toLowerCase(),
        path: parsed.pathname,
        isMarkdownSpoofed: isSpoofed,
        spoofedText: isSpoofed ? linkText : undefined,
      });
    } catch {
      // ignore malformed URLs
    }
  }

  // 2. Detect standard URLs
  const urlRegex = /(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    const rawUrl = match[0].replace(/[.,;:!?)]+$/, ''); // clean trailing punctuation
    const fullUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

    try {
      const parsed = new URL(fullUrl);
      const hostname = parsed.hostname.toLowerCase();

      // Avoid duplicates from markdown
      if (!results.some(r => r.rawUrl === rawUrl || r.rawUrl === fullUrl)) {
        results.push({
          rawUrl,
          domain: hostname,
          hostname,
          path: parsed.pathname,
        });
      }
    } catch {
      // ignore invalid
    }
  }

  return results;
}

/**
 * Evaluates URLs for phishing indicators without falsely flagging benign unknown links
 */
export function evaluateUrls(
  urls: ExtractedUrlInfo[],
  serverWhitelist: string[] = []
): { factors: RiskFactor[]; isAllWhitelisted: boolean } {
  const factors: RiskFactor[] = [];
  const normalizedWhitelist = serverWhitelist.map(w => w.toLowerCase().trim());

  if (urls.length === 0) {
    return { factors, isAllWhitelisted: false };
  }

  let whitelistedCount = 0;

  for (const urlInfo of urls) {
    const host = urlInfo.hostname;

    // Check if domain is in server whitelist
    const isWhitelisted = normalizedWhitelist.some(trusted => 
      host === trusted || host.endsWith(`.${trusted}`)
    );

    if (isWhitelisted) {
      whitelistedCount++;
      continue;
    }

    // 1. Markdown link spoofing (critical deception)
    if (urlInfo.isMarkdownSpoofed) {
      factors.push({
        category: 'spoofing',
        points: 45,
        description: `Enlace Markdown engañoso: Muestra '${urlInfo.spoofedText}' pero redirige a '${urlInfo.hostname}'`,
        evidence: urlInfo.rawUrl,
      });
    }

    // 2. Direct IP Address host (e.g. http://192.168.1.1 or http://45.33.2.1/steal)
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
    if (isIpAddress) {
      factors.push({
        category: 'url',
        points: 30,
        description: 'Enlace apunta directamente a una dirección IP en lugar de un nombre de dominio legítimo',
        evidence: host,
      });
    }

    // 3. Typosquatting / Homoglyphs against major brands
    let matchedBrandTyposquat = false;
    for (const brand of TARGET_BRANDS) {
      // Skip if it's the exact legitimate brand
      if (host === brand || host.endsWith(`.${brand}`)) {
        continue;
      }

      // Check if domain contains the brand name fraudulently (e.g. discord-nitro-free.com or steamcommunity-trade.top)
      const brandRoot = brand.split('.')[0];
      if (host.includes(brandRoot)) {
        factors.push({
          category: 'typosquat',
          points: 40,
          description: `Uso no autorizado de marca: El dominio '${host}' imita a '${brand}'`,
          evidence: host,
        });
        matchedBrandTyposquat = true;
        break;
      }

      // Levenshtein check on domain root
      const hostRoot = host.split('.')[0];
      const dist = levenshteinDistance(hostRoot, brandRoot);
      if (dist === 1 || (dist === 2 && hostRoot.length > 5)) {
        factors.push({
          category: 'typosquat',
          points: 45,
          description: `Typosquatting detectado: '${host}' tiene gran similitud visual con '${brand}'`,
          evidence: `${host} ➔ ${brand} (distancia: ${dist})`,
        });
        matchedBrandTyposquat = true;
        break;
      }
    }

    // 4. Suspicious TLD check (only flags if not matched with brand to avoid double penalty, or adds moderate points)
    const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => host.endsWith(tld));
    if (hasSuspiciousTld && !matchedBrandTyposquat) {
      factors.push({
        category: 'tld',
        points: 20,
        description: `TLD de alto riesgo asociado comúnmente a campañas desechables de spam/phishing (${host.slice(host.lastIndexOf('.'))})`,
        evidence: host,
      });
    }

    // 5. URL shorteners
    const isShortener = URL_SHORTENERS.some(short => host === short || host.endsWith(`.${short}`));
    if (isShortener) {
      factors.push({
        category: 'url',
        points: 15,
        description: 'Acortador de enlaces detectado (oculta el destino real)',
        evidence: host,
      });
    }
  }

  const isAllWhitelisted = urls.length > 0 && whitelistedCount === urls.length;
  return { factors, isAllWhitelisted };
}
