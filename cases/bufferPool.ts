// Single source of truth for the buffer-pool case: the question, and the rubric that grades answers to it
export const question =
  'What percentage of each issuance must a nature-based project put into the buffer pool?';

export const rubric = [
  `Question asked: ${question}`,
  'The answer gives 15% as the buffer-pool percentage. A bare "15%" is a complete, correct answer.',
  'FAIL if the answer gives a different percentage, says it does not know,',
  'or applies 15% to something other than the buffer pool.',
].join('\n');

// The test case the main eval (promptfooconfig.yaml) runs
export default [
  {
    description: 'Answerable - buffer pool',
    vars: { question },
    assert: [
      { type: 'contains', value: '15%' },
      { type: 'llm-rubric', value: rubric },
    ],
  },
];
