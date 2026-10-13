import { question, rubric } from './bufferPool.js';

// One echo case: the "model output" is exactly `answer`, graded with the real rubric
const check = (description: string, answer: string) => ({
  description,
  vars: { question, answer },
  assert: [{ type: 'llm-rubric', value: rubric }],
});

export default [
  check('SHOULD PASS - bare 15%', '15%'),
  check(
    'SHOULD PASS - full sentence',
    'A nature-based project must deposit 15% of every issuance into the buffer pool.',
  ),
  check('SHOULD FAIL - wrong percentage', '20%'),
  check('SHOULD FAIL - refusal', "I don't know."),
  check(
    'SHOULD FAIL - 15% attached to the wrong thing',
    '15% of each retirement goes to the registry as a fee.',
  ),
];
