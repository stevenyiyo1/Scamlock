import {
  RiskFactor,
  SocialEngineeringReport,
  SocialEngineeringSignal,
  SocialEngineeringSignalType,
} from '../../types/scamlock';

interface SignalRule {
  type: SocialEngineeringSignalType;
  name: string;
  basePoints: number;
  description: string;
  patterns: RegExp[];
}

/**
 * Reglas de detección heurística para la capa de Ingeniería Social (Social Engineering Layer).
 * Diseñado para identificar estafas incluso en ausencia total de enlaces (URLs).
 */
const SOCIAL_ENGINEERING_RULES: SignalRule[] = [
  // 1. PROMESAS DE DINERO FÁCIL
  {
    type: 'easy_money',
    name: 'Promesa de Dinero Fácil',
    basePoints: 15,
    description: 'Promesa de ganancias rápidas, dinero fácil o métodos milagrosos',
    patterns: [
      /\b(encontr[ée]|descubr[íi]|conozco|tengo|hay)\s*(una\s*forma|un\s*m[ée]todo|un\s*truco|un\s*secreto|una\s*manera)\s*(de|para)\s*(hacer|ganar|generar)\s*(dinero|plata|d[oó]lares|cash|ingresos)\b/i,
      /\b(gana|ganar|hacer|generar|make|earn)\s*(\$?\s*\d+[\d,.]*\s*(\$|usd|d[oó]lares|euros|eur|sol|eth|btc|crypto)?)\s*(en|in)\s*(\d+|pocos?|few)?\s*(minutos?|mins?|horas?|hours?|d[íi]as?|days?)\b/i,
      /\b(m[ée]todo|truco|sistema|secreto)\s*(secreto|infalible|f[aá]cil|f[aá]st|quick|m[aá]gico)?\s*(para|de|to)\s*(ganar|hacer|generar|make|earn)\s*(dinero|plata|d[oó]lares|cash)\b/i,
      /\bhaz\s*esto\s*y\s*(ganar[aá]s|recibir[aá]s|har[aá]s)\s*(dinero|plata|d[oó]lares|cash)\b/i,
      /\b(dinero|plata|money|cash)\s*(f[aá]cil|r[aá]pido|easy|quick|gratis)\s*(sin\s*esfuerzo|garantizado|en\s*minutos)?\b/i,
      /\b(ingresos?\s*pasivos?|ganancias?\s*diarias?)\s*(garantizad[ao]s?|en\s*autom[aá]tico|sin\s*hacer\s*nada)\b/i,
      /\b(double\s*your\s*money|duplica\s*tu\s*dinero|duplica\s*tu\s*inversi[oó]n)\b/i,
      /\b(make\s*\$?\d+[\d,.]*\s*(fast|in\s*\d+\s*(mins?|hours?|days?)|easily|daily))\b/i,
    ],
  },

  // 2. PREMIOS Y REGALOS SOSPECHOSOS
  {
    type: 'suspicious_prize',
    name: 'Premios y Regalos Sospechosos',
    basePoints: 15,
    description: 'Cebo de premios ficticios, selecciones fraudulentas o recompensas',
    patterns: [
      /\b(ganaste|has\s*ganado|you('ve)?\s*won|you\s*are\s*the\s*winner|has\s*sido\s*el\s*ganador)\s*(un\s*premio|a\s*prize|\$?\s*\d+|recompensa|tarjeta\s*de\s*regalo|giftcard)\b/i,
      /\b(fuiste|has\s*sido|you\s*(have\s*been)?)\s*(seleccionado|elegido|selected|chosen)\b/i,
      /\b(reclama|claim)\s*(tu\s*|your\s*)?(recompensa|premio|reward|prize|gift|regalo)\b/i,
      /\b(te\s*regalo|te\s*doy|giving\s*away|free|gratis)\s*(un\s*)?(discord\s*)?nitro\b/i,
      /\b(free\s*nitro|nitro\s*gratis|nitro\s*free)\b/i,
      /\b(ganaste|you\s*won)\s*(\$|usd|eur|d[oó]lares)?\s*\d+[\d,.]*\b/i,
      /\b(premio|recompensa)\s*(de\s*\$?\d+|esperando\s*por\s*ti|especial\s*para\s*ti|asignad[ao]\s*a\s*ti)\b/i,
      /\b(felicidades|congratulations),?\s*(has\s*ganado|you\s*won|fuiste\s*elegido)\b/i,
    ],
  },

  // 3. URGENCIA ARTIFICIAL
  {
    type: 'artificial_urgency',
    name: 'Urgencia Artificial',
    basePoints: 15,
    description: 'Presión temporal artificial para forzar una decisión impulsiva',
    patterns: [
      /\b(hazlo\s*(ahora|ya)|act\s*now|do\s*it\s*now)\b/i,
      /\b(solo|s[oó]lo|only)\s*(quedan?|have)\s*(\d+|pocos?|few)?\s*(minutos?|mins?|horas?|hours?|segundos?|seconds?|spots?|cupos?)\b/i,
      /\b([uú]ltima\s*oportunidad|last\s*chance|final\s*call|tiempo\s*l[ií]mite|time\s*limit)\b/i,
      /\b(tu|your)\s*(cuenta|account)\s*(ser[aá]|will\s*be|is\s*being)\s*(eliminada|suspendida|bloqueada|baneada|borrada|deleted|suspended|terminated|banned|disabled)\b/i,
      /\b(act[uú]a|responde|verif[ií]cate)\s*(inmediatamente|urgente|r[aá]pido|immediately|now|urgently)\b/i,
      /\b(ap[uú]rate|hurry\s*up)\s*(antes\s*de\s*que|before)\b/i,
      /\b(expira|expires)\s*(en|in)\s*(\d+|pocos?|few)\s*(minutos?|mins?|horas?)\b/i,
    ],
  },

  // 4. REDIRECCIONES INDIRECTAS
  {
    type: 'indirect_redirect',
    name: 'Redirección Indirecta',
    basePoints: 15,
    description: 'Evasión de filtros mediante redirección al perfil, bio o mensajes directos (DM)',
    patterns: [
      /\b(link|enlace)\s*(est[aá]\s*)?(en|in)\s*(mi|my)\s*(perfil|profile|bio|biograf[ií]a|estado|status)\b/i,
      /\b(mira|revisa|check|ve\s*a|entra\s*a)\s*(mi|my)\s*(bio|perfil|profile|estado|status)\b/i,
      /\b(entra|go\s*to|visit)\s*(a\s*)?(mi|my)\s*(perfil|profile)\b/i,
      /\b(dm|md|mensaje\s*privado|mp|pm)\s*(para|to)\s*(reclamar|claim|obtener|ganar|ver|pedir|participar)\b/i,
      /\b(escr[ií]beme|h[aá]blame|m[aá]ndame|send\s*me|message\s*me)\s*(por|al|a\s*mi)?\s*(privado|dm|md|pm)\b/i,
      /\b(te\s*(paso|mando|env[ií]o)|i('ll)?\s*send\s*(you)?)\s*(el\s*)?(link|enlace|info)\s*(por|al|via|in)?\s*(dm|md|privado|pm)\b/i,
      /\b(dm\s*me\s*for\s*(the\s*)?(link|info|code|prize))\b/i,
      /\b(info|detalles)\s*(en|in)\s*(mi|my)\s*(bio|perfil|profile)\b/i,
    ],
  },

  // 5. SUPLANTACIÓN O AUTORIDAD
  {
    type: 'impersonation',
    name: 'Suplantación de Identidad o Autoridad',
    basePoints: 20,
    description: 'Aparente representación de Discord Staff, moderadores, Steam, soporte o exchanges',
    patterns: [
      /\b(soy|somos|we\s*are|i('m|\s*am))\s*(del?|from)\s*(equipo|team|staff|soporte|support)\s*(de|of)?\s*(discord|steam|valve|roblox|binance|metamask|coinbase|crypto)?\b/i,
      /\b(discord|valve|steam|roblox|binance|metamask|coinbase|phantom)\s*(official|oficial)?\s*(support|staff|security|team|soporte|administraci[oó]n)\b/i,
      /\b(equipo\s*de\s*(moderaci[oó]n|seguridad|administraci[oó]n|soporte))\b/i,
      /\b(moderador|administrador|admin)\s*(oficial|del\s*servidor|de\s*discord)\b/i,
      /\b(soporte\s*t[ée]cnico|tech\s*support|customer\s*support)\b/i,
      /\b(comunicado\s*oficial|aviso\s*oficial|official\s*notice|security\s*alert)\s*(de|from)\s*(la\s*)?(administraci[oó]n|discord|staff)\b/i,
      /\b(tu\s*cuenta\s*ha\s*sido\s*reportada|account\s*was\s*(accidentally\s*)?reported|banned\s*by\s*mistake|reportado\s*por\s*error)\b/i,
      /\b(he\s*sido\s*asignado\s*(como|para)|i\s*have\s*been\s*assigned\s*(as|to))\s*(tu\s*caso|investigar|soporte|moderador)\b/i,
    ],
  },

  // 6. SOLICITUDES DE INFORMACIÓN SENSIBLE
  {
    type: 'sensitive_info',
    name: 'Solicitud de Información Sensible',
    basePoints: 25,
    description: 'Extracción o solicitud de contraseñas, tokens, códigos 2FA, semillas o datos de pago',
    patterns: [
      /\b(pasa|dame|env[ií]a|share|send|provide|give|escribe)\s*(me\s*)?(tu|your)?\s*(contrase[ñn]a|password|clave)\b/i,
      /\b(tu\s*)?(discord\s*)?token(\s*de\s*sesi[oó]n)?\b/i,
      /\b(c[oó]digo|code)\s*(de\s*)?(2fa|verificaci[oó]n|autenticaci[oó]n|auth|verification|seguridad|sms)\b/i,
      /\b(2fa|two[- ]factor)\s*(code|c[oó]digo)\b/i,
      /\b(recovery\s*codes?|c[oó]digos?\s*(de\s*)?recuperaci[oó]n|backup\s*codes?)\b/i,
      /\b(seed\s*phrase|frase\s*semilla|12\s*palabras|24\s*palabras|private\s*key|clave\s*privada)\b/i,
      /\b(tarjeta\s*de\s*cr[ée]dito|credit\s*card|datos\s*bancarios|cvv|n[uú]mero\s*de\s*tarjeta|informaci[oó]n\s*de\s*pago)\b/i,
      /\b(para\s*verificar\s*tu\s*identidad|to\s*verify\s*your\s*identity),?\s*(pasa|dame|send|provide)\b/i,
    ],
  },
];

/**
 * Evalúa las señales de ingeniería social y aplica el motor de correlación multi-señal.
 * Cumple la regla estricta: Una mención aislada nunca clasifica un mensaje como scam;
 * la detección se activa únicamente ante la sinergia de múltiples señales.
 */
export function evaluateSocialEngineering(
  text: string,
  existingFactors: RiskFactor[] = []
): { factors: RiskFactor[]; report: SocialEngineeringReport } {
  const detectedSignals: SocialEngineeringSignal[] = [];

  // 1. Detección individual de cada señal
  for (const rule of SOCIAL_ENGINEERING_RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        detectedSignals.push({
          type: rule.type,
          name: rule.name,
          points: rule.basePoints,
          evidence: match[0],
          description: rule.description,
        });
        break; // Máximo una coincidencia por categoría
      }
    }
  }

  const distinctSignalsCount = detectedSignals.length;
  const factors: RiskFactor[] = [];
  let synergyBonus = 0;
  let correlationLevel: SocialEngineeringReport['correlationLevel'] = 'none';

  // Si no hay señales detectadas
  if (distinctSignalsCount === 0) {
    return {
      factors: [],
      report: {
        detectedSignals: [],
        distinctSignalsCount: 0,
        synergyBonus: 0,
        isMultiSignalScam: false,
        correlationLevel: 'none',
      },
    };
  }

  // 2. CASO 1: Señal aislada única (Previene falsos positivos)
  // Ninguna señal única puede cruzar el umbral de 30 (Nivel Bajo seguro)
  if (distinctSignalsCount === 1) {
    const single = detectedSignals[0];
    correlationLevel = 'single_signal';

    // Puntuación atenuada de advertencia mínima (máx 10-15 pts) para menciones casuales
    const isolatedPoints = single.type === 'sensitive_info' || single.type === 'impersonation' ? 15 : 10;

    // Verificar si ya fue cubierta por heurística base para no duplicar
    const alreadyCovered = existingFactors.some(f =>
      (single.type === 'artificial_urgency' && f.category === 'urgency') ||
      (single.type === 'impersonation' && f.category === 'keyword' && f.description.includes('Suplantación'))
    );

    if (!alreadyCovered) {
      factors.push({
        category: single.type === 'easy_money' ? 'easy_money' :
                  single.type === 'suspicious_prize' ? 'suspicious_prize' :
                  single.type === 'indirect_redirect' ? 'indirect_redirect' :
                  single.type === 'impersonation' ? 'impersonation' :
                  single.type === 'sensitive_info' ? 'sensitive_info' : 'urgency',
        points: isolatedPoints,
        description: `Mención aislada: ${single.name} (Riesgo bajo si no hay otras señales)`,
        evidence: single.evidence,
      });
    }

    return {
      factors,
      report: {
        detectedSignals,
        distinctSignalsCount: 1,
        synergyBonus: 0,
        isMultiSignalScam: false,
        correlationLevel: 'single_signal',
      },
    };
  }

  // 3. CASO 2: Múltiples Señales Correlacionadas (Ingeniería Social Activa)
  // Agregamos los factores base de cada señal detectada
  for (const signal of detectedSignals) {
    const alreadyCovered = existingFactors.some(f =>
      (signal.type === 'artificial_urgency' && f.category === 'urgency') ||
      (signal.type === 'impersonation' && f.category === 'keyword' && f.description.includes('Suplantación'))
    );

    if (!alreadyCovered) {
      factors.push({
        category: signal.type === 'easy_money' ? 'easy_money' :
                  signal.type === 'suspicious_prize' ? 'suspicious_prize' :
                  signal.type === 'indirect_redirect' ? 'indirect_redirect' :
                  signal.type === 'impersonation' ? 'impersonation' :
                  signal.type === 'sensitive_info' ? 'sensitive_info' : 'urgency',
        points: signal.points,
        description: `Señal de ingeniería social: ${signal.name}`,
        evidence: signal.evidence,
      });
    }
  }

  // Identificar señales presentes específicas para combinaciones críticas
  const hasType = (t: SocialEngineeringSignalType) => detectedSignals.some(s => s.type === t);
  const signalNames = detectedSignals.map(s => s.name).join(' + ');

  // Sinergia Caso Crítico: Suplantación de Autoridad + Solicitud de Información Sensible
  // (Ej. "Soy de Discord Staff, dame tu código 2FA o contraseña")
  if (hasType('impersonation') && hasType('sensitive_info')) {
    synergyBonus = 35;
    correlationLevel = 'critical_takeover';
    factors.push({
      category: 'synergy',
      points: synergyBonus,
      description: 'Amenaza Crítica: Intento de suplantación de autoridad solicitando credenciales o autenticación sensible',
      evidence: `${detectedSignals.find(s => s.type === 'impersonation')?.evidence} ➔ ${detectedSignals.find(s => s.type === 'sensitive_info')?.evidence}`,
    });
  }
  // Sinergia Caso 3 o más señales (Ej. Premio/Dinero + Urgencia + Redirección a Bio/DM)
  else if (distinctSignalsCount >= 3) {
    synergyBonus = 25;
    correlationLevel = 'high_risk_combo';
    factors.push({
      category: 'synergy',
      points: synergyBonus,
      description: `Correlación de Alto Riesgo: Embudo completo de estafa detectado (${distinctSignalsCount} señales combinadas)`,
      evidence: signalNames,
    });
  }
  // Sinergia Caso 2 señales (Ej. Promesa de dinero/premio + Redirección indirecta a DM/Perfil)
  else if (distinctSignalsCount === 2) {
    synergyBonus = 15;
    correlationLevel = 'suspicious_combo';
    factors.push({
      category: 'synergy',
      points: synergyBonus,
      description: `Correlación Sospechosa: Combinación de 2 vectores de ingeniería social (${signalNames})`,
      evidence: signalNames,
    });
  }

  return {
    factors,
    report: {
      detectedSignals,
      distinctSignalsCount,
      synergyBonus,
      isMultiSignalScam: distinctSignalsCount >= 2,
      correlationLevel,
    },
  };
}
