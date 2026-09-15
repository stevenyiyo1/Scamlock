import { analyzeMessage } from './analyzer/riskEngine';

const TEST_CASES = [
  {
    name: 'CASO USUARIO (Falso Negativo Original)',
    message: 'help the first 15 people interested on how to start earning $7k within 24hours, but you will reimburse me 10% of your profits when you receive it. Note: only interested people should send a friend request or send me a dm! ask me HOW!',
    expectedRange: [70, 95],
  },
  {
    name: '1. Promesa 10k en un día + DM',
    message: 'Earn $10,000 in one day! DM me!',
    expectedRange: [65, 85],
  },
  {
    name: '2. Multiplicador de inversión rápido',
    message: 'Invest $100 and receive $1,000 tomorrow!',
    expectedRange: [60, 85],
  },
  {
    name: '3. Escasez + Ganancia semanal',
    message: 'First 20 people can make $5k this week.',
    expectedRange: [45, 75],
  },
  {
    name: '4. Reclutamiento por DM aislado (Sin dinero cuantificado)',
    message: "Send me a DM and I'll explain how.",
    expectedRange: [0, 30],
  },
  {
    name: '5. Experiencia personal legítima de negocios',
    message: 'I made money from this legitimate business.',
    expectedRange: [0, 15],
  },
  {
    name: '6. Contexto educativo / advertencia contra estafa',
    message: 'This scam promises $10k in 24 hours.',
    expectedRange: [0, 20],
  },
  {
    name: '7. Mensaje normal sin relación con dinero',
    message: 'Hey guys, are we playing Valorant tonight on Discord?',
    expectedRange: [0, 10],
  },
  {
    name: '8. Scam financiero + Enlace sospechoso externo',
    message: 'Earn $5,000 daily with automated trading! Sign up now at http://fast-profit-crypto.xyz and DM me for access',
    expectedRange: [80, 100],
  },
  {
    name: '9. Palabra aislada: "profit"',
    message: 'profit',
    expectedRange: [0, 5],
  },
  {
    name: '10. Mención genérica: "earn money"',
    message: 'earn money',
    expectedRange: [0, 15],
  },
  {
    name: '11. Ganancia cuantificada aislada: "earn $7k"',
    message: 'earn $7k',
    expectedRange: [20, 35],
  },
  {
    name: '12. Ganancia + Plazo: "earn $7k in 24 hours"',
    message: 'earn $7k in 24 hours',
    expectedRange: [50, 75],
  },
];

console.log('='.repeat(80));
console.log('SCAM LOCK • FINANCIAL SCAM ANALYZER SUITE DE VALIDACIÓN');
console.log('='.repeat(80));

let passed = 0;

for (const test of TEST_CASES) {
  const result = analyzeMessage(test.message);
  const isWithin = result.score >= test.expectedRange[0] && result.score <= test.expectedRange[1];

  if (isWithin) passed++;

  console.log(`\n[${isWithin ? 'PASS' : 'FAIL'}] ${test.name}`);
  console.log(`  Mensaje: "${test.message}"`);
  console.log(`  Score: ${result.score}/100 [${result.level.toUpperCase()}] (Esperado: ${test.expectedRange[0]}-${test.expectedRange[1]})`);
  console.log(`  Factores detectados (${result.factors.length}):`);
  for (const f of result.factors) {
    console.log(`    +${f.points} [${f.category}] ${f.description} ${f.evidence ? `(Evidencia: "${f.evidence}")` : ''}`);
  }
}

console.log('\n' + '='.repeat(80));
console.log(`RESUMEN: ${passed}/${TEST_CASES.length} pruebas superadas exitosamente.`);
console.log('='.repeat(80));
