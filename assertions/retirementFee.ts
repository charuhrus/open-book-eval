// Passes if the output states a fee of exactly 0.05 USD, in any common format.

// Same shape as Promptfoo's GradingResult; declared locally so we don't need promptfoo installed as a dependency
type GradingResult = { pass: boolean; score: number; reason: string };
type Amount = { text: string; usd: number };

const WORDS: Record<string, number> = {
  'twenty five': 25,
  'twenty-five': 25,
  twenty: 20,
  fifty: 50,
  ten: 10,
  five: 5,
  four: 4,
  three: 3,
  two: 2,
  one: 1,
};

const EXPECTED_USD = 0.05;
// Fee figures from the document. Any other amount in a retirement-fee answer is invented or miscalculated.
const DOCUMENT_USD = [0.05, 500];

const sameUsd = (x: number, y: number) => Math.abs(x - y) < 1e-9;
const isInDocument = (usd: number) => DOCUMENT_USD.some((d) => sameUsd(usd, d));
const listTexts = (list: Amount[]) => [...new Set(list.map((a) => `"${a.text}"`))].join(', ');

export default function retirementFee(output: string): GradingResult {
  const wordAlt = Object.keys(WORDS).join('|');
  const re = new RegExp(
    `(?<prefix>\\$|usd\\s*)?(?<rawNum>\\d*\\.\\d+|\\d+|\\b(?:${wordAlt})\\b)\\s*(?<unit>usd|us dollars?|dollars?|cents?|¢)?`,
    'gi',
  );

  const amounts: Amount[] = [];
  for (const m of output.matchAll(re)) {
    const g = m.groups;
    if (!g) continue; // only undefined if the regex had no named groups
    const { prefix, rawNum, unit } = g;
    if (rawNum === undefined) continue; // the number group always matches, but TS can't know that
    if (!prefix && !unit) continue; // a bare number ("rule 2") is not money
    let usd = WORDS[rawNum.toLowerCase()] ?? parseFloat(rawNum);
    if (unit && /cent|¢/i.test(unit)) usd /= 100;
    amounts.push({ text: m[0].trim(), usd });
  }

  const hasExpected = amounts.some((a) => sameUsd(a.usd, EXPECTED_USD));
  const unexpected = amounts.filter((a) => !isInDocument(a.usd));
  const allFromDocument = unexpected.length === 0;
  const correct = hasExpected && allFromDocument;

  let reason: string;
  if (unexpected.length > 0) {
    reason = `Unexpected amount(s): ${listTexts(unexpected)}; expected only $${EXPECTED_USD}`;
  } else if (amounts.length === 0) {
    reason = 'No money amount found in output';
  } else if (!hasExpected) {
    reason = `Expected $${EXPECTED_USD} not found; only found ${listTexts(amounts)}`;
  } else {
    reason = `Found ${listTexts(amounts)}; all amounts match the document`;
  }

  return {
    pass: correct,
    score: correct ? 1 : 0,
    reason,
  };
}
