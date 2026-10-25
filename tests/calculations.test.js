import test from 'node:test';
import assert from 'node:assert/strict';
import { budgetSummary, savingsFutureValue, inflationScenario, loanEmi, formatINR } from '../src/calculations.js';

test('budget summary calculates money left and savings rate', () => {
  const result = budgetSummary({ income: 5000, needs: 2600, wants: 1200, savings: 700 });
  assert.equal(result.allocated, 4500);
  assert.equal(result.remaining, 500);
  assert.ok(Math.abs(result.savingsRate - 14) < 1e-10);
});

test('budget summary allows overspending to be shown as negative remaining', () => {
  const result = budgetSummary({ income: 1000, needs: 800, wants: 300, savings: 0 });
  assert.equal(result.remaining, -100);
});

test('savings future value has a zero-interest branch', () => {
  const result = savingsFutureValue({ initial: 1000, monthly: 100, annualRate: 0, years: 2 });
  assert.equal(result.futureValue, 3400);
  assert.equal(result.totalContributed, 3400);
  assert.equal(result.estimatedGrowth, 0);
});

test('savings future value adds monthly deposits and growth', () => {
  const result = savingsFutureValue({ initial: 5000, monthly: 1000, annualRate: 6, years: 5 });
  assert.equal(result.months, 60);
  assert.ok(result.futureValue > result.totalContributed);
});

test('inflation scenario calculates compounded price growth', () => {
  const result = inflationScenario({ price: 100, annualRate: 5, years: 5 });
  assert.ok(Math.abs(result.futurePrice - 127.62815625) < 1e-8);
  assert.ok(Math.abs(result.purchasingPowerOf100 - 78.35261665) < 1e-7);
});

test('loan EMI handles zero interest', () => {
  const result = loanEmi({ principal: 12000, annualRate: 0, years: 1 });
  assert.equal(result.emi, 1000);
  assert.equal(result.totalPaid, 12000);
  assert.equal(result.totalInterest, 0);
});

test('loan EMI calculates positive interest for a positive rate', () => {
  const result = loanEmi({ principal: 100000, annualRate: 10, years: 3 });
  assert.ok(result.emi > 0);
  assert.ok(result.totalPaid > 100000);
  assert.ok(result.totalInterest > 0);
});

test('calculators reject negative inputs', () => {
  assert.throws(() => budgetSummary({ income: -1, needs: 0, wants: 0, savings: 0 }), RangeError);
  assert.throws(() => savingsFutureValue({ initial: 0, monthly: -1, annualRate: 2, years: 1 }), RangeError);
  assert.throws(() => inflationScenario({ price: 10, annualRate: -1, years: 1 }), RangeError);
  assert.throws(() => loanEmi({ principal: 1000, annualRate: 10, years: -1 }), RangeError);
});

test('INR formatter uses Indian number grouping', () => {
  assert.equal(formatINR(1234567).includes('12,34,567'), true);
});
