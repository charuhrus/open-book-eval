import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculateFees, formatUsd } from './feeCalculator.ts';

test('first year with 1,000 retirements costs 550.00 USD', () => {
  const fees = calculateFees({ retirements: 1000, years: 1 });
  assert.deepEqual(fees, { maintenanceCents: 50_000, retirementCents: 5_000, totalCents: 55_000 });
  assert.equal(formatUsd(fees.totalCents), '550.00 USD');
});

test('zero retirements costs only the maintenance fee', () => {
  assert.equal(calculateFees({ retirements: 0, years: 1 }).totalCents, 50_000);
});

test('rejects invalid input instead of guessing', () => {
  assert.throws(() => calculateFees({ retirements: -5, years: 1 }), RangeError);
  assert.throws(() => calculateFees({ retirements: 2.5, years: 1 }), RangeError);
  assert.throws(() => calculateFees({ retirements: 10, years: 0 }), RangeError);
});
