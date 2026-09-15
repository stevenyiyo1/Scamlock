import { RiskFactor } from '../../types/scamlock';

export interface KeywordRule {
  id: string;
  category: RiskFactor['category'];
  points: number;
  description: string;
  patterns: RegExp[];
}

export const SCAM_RULES: KeywordRule[] = [
  {
    id: 'nitro-freebies',
    category: 'nitro',
    points: 35,
    description: 'Promesa fraudulenta de Discord Nitro gratuito o regalo masivo',
    patterns: [
      /\b(free|gratis|regalo)\s*(discord)?\s*nitro\b/i,
      /\bnitro\s*(for\s*free|gratis|giveaway|airdrop|generator|generador)\b/i,
      /\bclaim\s*(your\s*)?(nitro|gift|free\s*sub)\b/i,
      /\b(steam|epic)\s*(gives|regala|offers)\s*(free\s*)?nitro\b/i,
      /\bdiscord\.gift\b/i, // evaluated with URL check too
    ],
  },
  {
    id: 'steam-trading-scam',
    category: 'keyword',
    points: 30,
    description: 'Estafa de intercambio falso o torneo de Steam / CS:GO',
    patterns: [
      /\b(vote|vota)\s*(for|por)\s*(my|mi)\s*(team|equipo)\b/i,
      /\b(free|gratis)\s*(steam|csgo|cs2|knife|skins)\b/i,
      /\bsteamcommunity\b/i,
      /\bclaim\s*\$?(50|100)\s*(steam|giftcard)\b/i,
      /\btrade\s*offer\s*(from|accepted|pending)\b/i,
    ],
  },
  {
    id: 'crypto-drainer-phishing',
    category: 'crypto',
    points: 35,
    description: 'Intento de phishing de billeteras de criptomonedas o drenadores',
    patterns: [
      /\b(airdrop|claim)\s*(free\s*)?(sol|eth|btc|usdt|crypto|tokens)\b/i,
      /\bconnect\s*(your\s*)?(wallet|phantom|metamask)\b/i,
      /\b(seed\s*phrase|frase\s*semilla|private\s*key)\b/i,
      /\bmint\s*(is\s*live|now|free)\b/i,
      /\bpresale\s*bonus\b/i,
    ],
  },
  {
    id: 'artificial-urgency',
    category: 'urgency',
    points: 20,
    description: 'Técnica de ingeniería social mediante urgencia artificial',
    patterns: [
      /\b(only|solo)\s*(\d+|few)\s*(hours|horas|minutes|minutos|spots|cupos)\s*(left|quedan)\b/i,
      /\b(hurry|apúrate|corre|act\s*now|hazlo\s*ya)\b/i,
      /\b(limited\s*time|tiempo\s*limitado|expires\s*in|expira\s*en)\b/i,
      /\b(first\s*\d+|primeros\s*\d+)\s*(users|personas|claims)\b/i,
    ],
  },
  {
    id: 'fake-staff-impersonation',
    category: 'keyword',
    points: 30,
    description: 'Suplantación de identidad de moderador o soporte oficial',
    patterns: [
      /\b(discord|valve|steam)\s*(support|staff|security|team|soporte|equipo)\b/i,
      /\b(accidental\s*ban|banned\s*by\s*mistake|reportado\s*por\s*error)\b/i,
      /\b(verify\s*your\s*identity|verifica\s*tu\s*cuenta|evita\s*el\s*baneo)\b/i,
    ],
  },
  {
    id: 'suspicious-executables',
    category: 'keyword',
    points: 35,
    description: 'Intento de distribución de ejecutables, malware o token grabbers',
    patterns: [
      /\b(test\s*my\s*game|prueba\s*mi\s*juego)\b/i,
      /\b(download\s*this|descarga\s*esto|run\s*the\s*file)\b/i,
      /\.(exe|scr|bat|cmd|vbs|jar|pif)\b/i,
      /\b(token\s*grabber|discord\s*nitro\s*generator\.exe)\b/i,
    ],
  },
  {
    id: 'generic-giveaways',
    category: 'keyword',
    points: 15,
    description: 'Sorteo genérico o tarjetas de regalo no verificadas',
    patterns: [
      /\b(free|gratis)\s*(robux|v-bucks|vbucks|psn|xbox|amazon)\s*(card|giftcard|código)\b/i,
      /\b(click\s*here\s*to\s*win|haz\s*clic\s*para\s*ganar)\b/i,
    ],
  },
];

export function evaluateTextHeuristics(text: string): RiskFactor[] {
  const factors: RiskFactor[] = [];
  const normalized = text.toLowerCase();

  for (const rule of SCAM_RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        factors.push({
          category: rule.category,
          points: rule.points,
          description: rule.description,
          evidence: match[0],
        });
        // One hit per rule family to avoid redundant inflation
        break;
      }
    }
  }

  // Excessive uppercase + exclamation check (high pressure bait)
  const letters = text.replace(/[^a-zA-Z]/g, '');
  if (letters.length > 20) {
    const uppercaseCount = letters.replace(/[^A-Z]/g, '').length;
    const uppercaseRatio = uppercaseCount / letters.length;
    if (uppercaseRatio > 0.65 && (text.includes('!') || text.includes('?'))) {
      factors.push({
        category: 'urgency',
        points: 10,
        description: 'Texto en mayúsculas sostenidas y signos de exclamación para forzar atención',
        evidence: `${Math.round(uppercaseRatio * 100)}% mayúsculas`,
      });
    }
  }

  // Obfuscated characters or zero-width spaces
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF]/;
  if (zeroWidthRegex.test(text)) {
    factors.push({
      category: 'spoofing',
      points: 25,
      description: 'Caracteres invisibles o de ancho cero detectados (ofuscación intencional)',
    });
  }

  return factors;
}
