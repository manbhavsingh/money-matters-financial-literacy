/** Pure, deterministic calculations used by the learning tools. All rates are decimals. */
export function budgetSummary({ income, needs, wants, savings }) {
  for (const [name, value] of Object.entries({ income, needs, wants, savings })) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be a non-negative number`);
  }
  const allocated = needs + wants + savings;
  const remaining = income - allocated;
  return {
    allocated,
    remaining,
    savingsRate: income > 0 ? (savings / income) * 100 : 0,
    percentages: income > 0
      ? { needs: needs / income * 100, wants: wants / income * 100, savings: savings / income * 100, remaining: remaining / income * 100 }
      : { needs: 0, wants: 0, savings: 0, remaining: 0 },
  };
}

/** Future value with monthly compounding and end-of-month contributions. */
export function savingsFutureValue({ initial, monthly, annualRate, years }) {
  for (const [name, value] of Object.entries({ initial, monthly, annualRate, years })) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be a non-negative number`);
  }
  if (years <= 0) throw new RangeError('years must be greater than zero');
  const months = Math.round(years * 12);
  const r = annualRate / 100 / 12;
  const initialGrowth = initial * Math.pow(1 + r, months);
  const contributionsGrowth = r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r);
  const totalContributed = initial + monthly * months;
  const futureValue = initialGrowth + contributionsGrowth;
  return { futureValue, totalContributed, estimatedGrowth: futureValue - totalContributed, months };
}

/** Hypothetical future price at a constant annual inflation rate. */
export function inflationScenario({ price, annualRate, years }) {
  for (const [name, value] of Object.entries({ price, annualRate, years })) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be a non-negative number`);
  }
  const futurePrice = price * Math.pow(1 + annualRate / 100, years);
  const purchasingPowerOf100 = 100 / Math.pow(1 + annualRate / 100, years);
  return { futurePrice, increase: futurePrice - price, purchasingPowerOf100 };
}

/** Fixed-rate monthly EMI, using nominal annual rate divided by 12. */
export function loanEmi({ principal, annualRate, years }) {
  for (const [name, value] of Object.entries({ principal, annualRate, years })) {
    if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be a non-negative number`);
  }
  if (principal <= 0 || years <= 0) throw new RangeError('principal and years must be greater than zero');
  const months = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;
  const emi = monthlyRate === 0
    ? principal / months
    : principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPaid = emi * months;
  return { emi, totalPaid, totalInterest: totalPaid - principal, months };
}

export function formatINR(value, decimals = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}
