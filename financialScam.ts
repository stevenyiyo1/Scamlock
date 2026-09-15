import {
  FinancialScamReport,
  FinancialScamSignal,
  FinancialScamSignalType,
  RiskCategory,
  RiskFactor,
} from '../../types/scamlock';

interface FinancialRule {
  type: FinancialScamSignalType;
  category: RiskCategory;
  name: string;
  basePoints: number;
  description: string;
  patterns: RegExp[];
}

/**
 * FINANCIAL SCAM ANALYZER
 *
 * Analizador generalizado especializado en la detección de fraudes financieros,
 * esquemas de enriquecimiento rápido (get-rich-quick), captación para inversiones falsas,
 * comisiones de ganancias y reclutamiento en privado (DM/solicitudes de amistad)
 * SIN DEPENDER DE LA PRESENCIA DE UNA URL.
 */
const FINANCIAL_SCAM_RULES: FinancialRule[] = [
  // 1. GANANCIAS IRREALISTAS (UNREALISTIC_PROFIT)
  {
    type: 'unrealistic_profit',
    category: 'unrealistic_profit',
    name: 'Ganancia Extremadamente Irrealista',
    basePoints: 25,
    description: 'Promesa de ganancias desproporcionadas, retorno monetario irreal o sumas elevadas en tiempo récord',
    patterns: [
      // e.g. "$7k within 24hours", "earn $10,000 in one day", "make $5000 today", "earn $5,000 daily", "earn $5k this week", "receive $1,000 tomorrow"
      /\b(start\s*)?(earn|earning|make|making|generat(e|ing)|receive|turn|flip|get|gain|ganar?|hacer?|generar?)\s*(\$?\s*\d+[\d,.]*\s*(k|grand|kilos?|usd|d[oó]lares|bucks|€|eur|btc|eth|usdt)?)\s*(within|in|in\s*less\s*than|en|en\s*menos\s*de)?\s*(\d+|a|one|un)?\s*(hours?|horas?|hrs?|24hours?|24hrs?|days?|d[íi]as?|nights?|overnight|daily|diarios?|weekly|semanal|today|hoy|tomorrow|mañana|this\s*week|esta\s*semana)\b/i,
      // e.g. "turn $100 into $1,000", "convert $50 to $500"
      /\b(turn|flip|convert(ir)?|transform(ar)?)\s*(\$?\s*\d+[\d,.]*\w*)\s*(in\s*to|into|to|en|a)\s*(\$?\s*\d+[\d,.]*\w*)\b/i,
      // e.g. "double your money", "duplica tu dinero", "triple your investment"
      /\b(double|triple|duplica(r)?|triplica(r)?)\s*(your|tu)\s*(money|dinero|investment|inversi[oó]n|cash|capital|funds?)\b/i,
      // e.g. "earn thousands overnight", "miles de dólares en una noche"
      /\b(earn|make|ganar)\s*(thousands|hundreds\s*of\s*dollars|millions|miles|millones)\s*(overnight|en\s*una\s*noche|in\s*days?)\b/i,
      // e.g. "guaranteed profit", "ganancias garantizadas", "risk-free return"
      /\b(guaranteed|risk[- ]free|segur[ao]|garantizad[ao]|100%)\s*(profit|returns?|income|gains?|ganancias?|retorno)\b/i,
      // e.g. "earn $7k", "earning $10,000", "make $5k" (mención cuantitativa grande)
      /\b(start\s*)?(earn(ing)?|make|making|gana(r)?)\s*\$?\s*([5-9]\d{2,}|[1-9]\d{3,}|[1-9]\d*k)\b/i,
    ],
  },

  // 2. URGENCIA / TIEMPO LIMITADO / PLAZO DE 24 HORAS
  {
    type: 'limited_time_urgency',
    category: 'urgency',
    name: 'Plazo Artificial / Urgencia de Tiempo',
    basePoints: 15,
    description: 'Ventana de tiempo perentoria (24 horas, un día, hoy) para generar presión psicológica',
    patterns: [
      /\b(within\s*(24\s*hours?|24hours?|24hrs?|a\s*day|one\s*day)|en\s*(24\s*horas?|un\s*d[íi]a))\b/i,
      /\b(within|in|en)\s*(\d+|few|pocos?)\s*(hours?|horas?|hrs?|days?|d[íi]as?|mins?|minutos?)\b/i,
      /\b(today\s*only|s[oó]lo\s*por\s*hoy|solo\s*hoy|this\s*week\s*only|s[oó]lo\s*esta\s*semana)\b/i,
      /\b(in\s*one\s*day|en\s*un\s*solo\s*d[íi]a|in\s*24\s*hours?)\b/i,
      /\b(receive\s*.*tomorrow|recibe\s*.*mañana)\b/i,
    ],
  },

  // 3. ESCASEZ ARTIFICIAL Y RECLUTAMIENTO
  {
    type: 'pyramid_ponzi_referral',
    category: 'recruitment_scam',
    name: 'Escasez Artificial de Cupos',
    basePoints: 15,
    description: 'Técnica de selección falsa limitando a las "primeras N personas" para inducir FOMO',
    patterns: [
      /\b(help\s*the\s*)?(first|primeros?|primeras?)\s*(\d+|few|pocos?)\s*(people|users|personas|members|miembros|interesados?|spots?|cupos?|places?)\b/i,
      /\b(only|solo|s[oó]lo)\s*(\d+|few)\s*(spots?|cupos?|slots?|places?)\s*(left|disponibles?|quedan)\b/i,
      /\b(limited\s*spots?|cupos?\s*limitados?|solo\s*para\s*\d+\s*personas)\b/i,
    ],
  },

  // 4. CAPTACIÓN MEDIANTE DM Y SOLICITUD DE AMISTAD
  {
    type: 'recruitment_funnel',
    category: 'recruitment_scam',
    name: 'Captación Mediante DM / Solicitud Privada',
    basePoints: 15,
    description: 'Desvío intencional de la víctima a mensajes directos o solicitud de amistad para evadir moderación pública',
    patterns: [
      /\b(send\s*(me\s*)?(a\s*)?(friend\s*request|solicitud\s*de\s*amistad)|add\s*me\s*(as\s*a\s*friend)?)\b/i,
      /\b(send\s*(me\s*)?(a\s*)?(dm|pm|message|msg)|dm\s*me|message\s*me|contact\s*me\s*privately)\b/i,
      /\b(m[aá]ndame\s*(un\s*)?(dm|md|mp|mensaje|privado)|escr[ií]beme\s*(al|por|a)?\s*(dm|md|mp|privado))\b/i,
      /\b(ask\s*me\s*how|preg[uú]ntame\s*c[oó]mo|i('ll)?\s*explain\s*how|te\s*explico\s*c[oó]mo)\b/i,
      /\b(only\s*interested\s*(people|users)?\s*(should|can)?\s*(send|dm|message|contact))\b/i,
      /\b(dm\s*me\s*and\s*i('ll)?\s*explain\s*how)\b/i,
      /\b(dm\s*me\s*for\s*(access|link|info|entry))\b/i,
    ],
  },

  // 5. PORCENTAJE DE GANANCIAS / ADVANCE-FEE / REEMBOLSO POSTERIOR
  {
    type: 'profit_percentage_fee',
    category: 'advance_fee',
    name: 'Solicitud de Porcentaje de Ganancias / Advance-Fee',
    basePoints: 15,
    description: 'Condición de reembolso, comisión sobre supuestas ganancias futuras o pago diferido fraudulento',
    patterns: [
      /\b(reimburse|pay|send|give)\s*me\s*(\d+%\s*(of\s*(your\s*)?(profits?|earnings?|money|funds?))|a\s*percentage|a\s*cut)\b/i,
      /\b(\d+%\s*(of\s*(your\s*)?(profits?|earnings?)|de\s*(tus\s*)?(ganancias?|beneficios?)))\b/i,
      /\b(you\s*(will)?\s*reimburse\s*me|me\s*reembolsas?|me\s*pagas?\s*(el)?\s*\d+%)\b/i,
      /\b(pay\s*me\s*when\s*you\s*(receive|get)\s*(it|your\s*money|the\s*funds?))\b/i,
      /\b(no\s*upfront\s*fees?|sin\s*pago\s*previo|pay\s*after\s*you\s*receive)\b/i,
      /\b(advance\s*fee|upfront\s*fee|tarifa\s*anticipada|comisi[oó]n\s*anticipada)\b/i,
    ],
  },

  // 6. ESQUEMA DE OPORTUNIDAD FINANCIERA SOSPECHOSA / GET-RICH-QUICK
  {
    type: 'vague_high_return_scheme',
    category: 'get_rich_quick',
    name: 'Patrón de Oportunidad Financiera Sospechosa',
    basePoints: 15,
    description: 'Esquema vago de dinero fácil, inversión sin riesgo aparente o sistema automatizado de trading',
    patterns: [
      /\b(invest\s*\$?\d+[\d,.]*\s*and\s*(receive|get|earn)\s*\$?\d+[\d,.]*)\b/i,
      /\b(inversi[oó]n\s*segura|inversiones?\s*con\s*retorno\s*diario)\b/i,
      /\b(crypto\s*investment\s*(scheme|opportunity|platform)|trading\s*signals?\s*vip)\b/i,
      /\b(automated\s*trading|algo\s*trading|forex\s*trading|trading\s*bot)\b/i,
      /\b(passive\s*income\s*system|sistema\s*autom[aá]tico\s*de\s*(ganancias|dinero))\b/i,
      /\b(financial\s*freedom\s*system|sistema\s*de\s*libertad\s*financiera)\b/i,
    ],
  },
];

/**
 * Patrones de contexto educativo o de advertencia contra estafas.
 * Si el usuario está advirtiendo ("Scammers often promise...", "This scam promises..."),
 * no se debe sancionar ni considerar scam el mensaje.
 */
const EDUCATIONAL_WARNING_PATTERNS: RegExp[] = [
  /\b(scammers?|estafadores?|fraud(sters?)?|phishers?)\s*(often|usually|always|love\s*to|frecuentemente|suelen|siempre)?\s*(promise|promises|prometen|say|dicen|use|usan|claim|afirman)\b/i,
  /\b(this|este|esta)\s*(scam|estafa|fraude)\s*(promises?|promete|dice|offers?|ofrece|is|es)\b/i,
  /\b(beware\s*of|cuidado\s*con|alerta\s*con|watch\s*out\s*for)\s*(scams?|estafas?|fraudes?|schemes?)\b/i,
  /\b(is\s*a\s*scam|es\s*una\s*estafa|es\s*un\s*fraude|is\s*fake|es\s*falso)\b/i,
  /\b(don't\s*fall\s*for|no\s*caigas\s*en|report\s*(this|these)?\s*scams?)\b/i,
  /\b(example\s*of\s*(a\s*)?scam|ejemplo\s*de\s*estafa|as\s*an\s*example\s*of\s*scam)\b/i,
  /\b(warning\s*about|advertencia\s*sobre)\s*(scam|estafa|fraude)\b/i,
];

/**
 * Evalúa el contenido del mensaje contra el conjunto de heurísticas financieras generalizables.
 * No requiere que exista una URL externa para clasificar como riesgo.
 */
export function evaluateFinancialScam(
  text: string,
  existingFactors: RiskFactor[] = []
): { factors: RiskFactor[]; report: FinancialScamReport } {
  // 1. Detección de contexto educativo / advertencia comunitaria
  for (const pattern of EDUCATIONAL_WARNING_PATTERNS) {
    const eduMatch = text.match(pattern);
    if (eduMatch) {
      return {
        factors: [
          {
            category: 'financial_scam',
            points: 0,
            description: 'Contexto educativo o advertencia legítima contra estafas detectado (riesgo bajo/informativo)',
            evidence: eduMatch[0],
          },
        ],
        report: {
          isFinancialScam: false,
          signalsCount: 0,
          signals: [],
          hasEducationalContext: true,
          educationalEvidence: eduMatch[0],
          synergyBonus: 0,
          confidenceScore: 0,
        },
      };
    }
  }

  // 2. Extraer señales presentes
  const detectedSignals: FinancialScamSignal[] = [];

  for (const rule of FINANCIAL_SCAM_RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        detectedSignals.push({
          type: rule.type,
          category: rule.category,
          name: rule.name,
          points: rule.basePoints,
          evidence: match[0],
          description: rule.description,
        });
        break; // Una coincidencia máxima por categoría de regla
      }
    }
  }

  const signalsCount = detectedSignals.length;

  // Si no hay señales
  if (signalsCount === 0) {
    return {
      factors: [],
      report: {
        isFinancialScam: false,
        signalsCount: 0,
        signals: [],
        hasEducationalContext: false,
        synergyBonus: 0,
        confidenceScore: 0,
      },
    };
  }

  const factors: RiskFactor[] = [];
  let synergyBonus = 0;

  // CASO 1: SEÑAL AISLADA ÚNICA (Previene falsos positivos sobre palabras como "profit" o "make money")
  // Una señal solitaria jamás debe alcanzar un riesgo moderado/alto por sí sola.
  if (signalsCount === 1) {
    const single = detectedSignals[0];

    // Si es solo una mención aislada de reclutamiento ("send me a DM") o promesa vaga sin números:
    // Puntuación leve (10-15 pts), jamás pasa a nivel alto.
    const isolatedPoints = single.type === 'unrealistic_profit' ? 20 : 10;

    factors.push({
      category: single.category,
      points: isolatedPoints,
      description: `Mención aislada: ${single.name} (Requiere señales adicionales para considerarse fraude)`,
      evidence: single.evidence,
    });

    return {
      factors,
      report: {
        isFinancialScam: false,
        signalsCount: 1,
        signals: detectedSignals,
        hasEducationalContext: false,
        synergyBonus: 0,
        confidenceScore: isolatedPoints,
      },
    };
  }

  // CASO 2: MÚLTIPLES SEÑALES COMBINADAS (ESQUEMA DE ENRIQUECIMIENTO RÁPIDO / FRAUDE FINANCIERO)
  for (const signal of detectedSignals) {
    factors.push({
      category: signal.category,
      points: signal.points,
      description: `Factor financiero sospechoso: ${signal.name}`,
      evidence: signal.evidence,
    });
  }

  // Bonificaciones por sinergia de vectores (Synergy Bonus):
  if (signalsCount >= 5) {
    // Cuando ya existen 5 vectores de fraude financiero, la suma de factores alcanza ~85 puntos.
    // No añadimos sinergia extra para no saturar al 100% innecesariamente y mantener el score en rango 70-90.
    synergyBonus = 0;
  } else if (signalsCount === 4) {
    synergyBonus = 10;
    factors.push({
      category: 'financial_scam',
      points: synergyBonus,
      description: `Sinergia de Alto Riesgo: Embudo completo de estafa financiera (${signalsCount} vectores correlacionados)`,
      evidence: detectedSignals.map(s => s.name).join(' + '),
    });
  } else if (signalsCount === 3) {
    synergyBonus = 15;
    factors.push({
      category: 'get_rich_quick',
      points: synergyBonus,
      description: `Sinergia Sospechosa: Esquema de enriquecimiento rápido y captación activa (3 señales combinadas)`,
      evidence: detectedSignals.map(s => s.name).join(' + '),
    });
  } else if (signalsCount === 2) {
    synergyBonus = 15;
    factors.push({
      category: 'financial_scam',
      points: synergyBonus,
      description: `Correlación de Riesgo: Oportunidad monetaria asociada a urgencia o captación privada`,
      evidence: detectedSignals.map(s => s.name).join(' + '),
    });
  }

  const rawSum = detectedSignals.reduce((acc, s) => acc + s.points, 0) + synergyBonus;
  const confidenceScore = Math.min(100, rawSum);

  return {
    factors,
    report: {
      isFinancialScam: signalsCount >= 2,
      signalsCount,
      signals: detectedSignals,
      hasEducationalContext: false,
      synergyBonus,
      confidenceScore,
    },
  };
}
