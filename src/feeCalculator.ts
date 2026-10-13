// Fee rules from Verdant Ledger Registry Operating Rules v2.1.
// All money is in integer cents, so there are no floating-point rounding errors.
export const ANNUAL_MAINTENANCE_CENTS = 50_000; // 500 USD per account per year
export const RETIREMENT_FEE_CENTS = 5; // 0.05 USD per credit

export type FeeInput = { retirements: number; years: number };
export type FeeBreakdown = {
  maintenanceCents: number;
  retirementCents: number;
  totalCents: number;
};

// Invalid input throws instead of being clamped: a fee calculator should never guess.
function assertWholeNumber(name: string, value: number, min: number): void {
  if (!Number.isInteger(value) || value < min) {
    throw new RangeError(`${name} must be a whole number >= ${min}, got ${value}`);
  }
}

export function calculateFees({ retirements, years }: FeeInput): FeeBreakdown {
  assertWholeNumber('retirements', retirements, 0);
  assertWholeNumber('years', years, 1);

  const maintenanceCents = years * ANNUAL_MAINTENANCE_CENTS;
  const retirementCents = retirements * RETIREMENT_FEE_CENTS;
  return { maintenanceCents, retirementCents, totalCents: maintenanceCents + retirementCents };
}

export const formatUsd = (cents: number): string => `${(cents / 100).toFixed(2)} USD`;
