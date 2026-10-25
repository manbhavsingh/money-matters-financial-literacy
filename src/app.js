import { budgetSummary, savingsFutureValue, inflationScenario, loanEmi, formatINR } from './calculations.js';

const byId = (id) => document.getElementById(id);
function readNumber(id, label) {
  const input = byId(id);
  const number = Number(input.value);
  if (!input.checkValidity() || !Number.isFinite(number)) {
    input.focus();
    throw new Error('Please enter a valid value for ' + label + '.');
  }
  return number;
}
function connectForm(formId, handler) {
  byId(formId).addEventListener('submit', (event) => {
    event.preventDefault();
    try { handler(); } catch (error) { window.alert(error.message || 'Please check the values and try again.'); }
  });
}

const tabButtons = Array.from(document.querySelectorAll('[data-tab]'));
const panels = Array.from(document.querySelectorAll('.panel'));
function setTab(name, shouldFocus) {
  tabButtons.forEach((button) => {
    const active = button.dataset.tab === name;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && shouldFocus) button.focus();
  });
  panels.forEach((panel) => {
    const active = panel.id === 'panel-' + name;
    panel.classList.toggle('active', active);
    panel.hidden = !active;
  });
}
tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => setTab(button.dataset.tab, false));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabButtons.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabButtons.length - 1;
    setTab(tabButtons[next].dataset.tab, true);
  });
});
setTab('budget', false);

function updateBudget() {
  const summary = budgetSummary({
    income: readNumber('budget-income', 'monthly money available'),
    needs: readNumber('budget-needs', 'needs'),
    wants: readNumber('budget-wants', 'wants'),
    savings: readNumber('budget-saving', 'planned saving')
  });
  byId('budget-result').textContent = formatINR(summary.remaining);
  if (summary.remaining < 0) {
    byId('budget-message').textContent = 'Your plan exceeds the available amount by ' + formatINR(Math.abs(summary.remaining)) + '. Revisit the categories in light of your circumstances.';
  } else if (summary.remaining === 0) {
    byId('budget-message').textContent = 'Every rupee has been allocated. Leave flexibility for unexpected costs when you can.';
  } else {
    byId('budget-message').textContent = 'You have ' + formatINR(summary.remaining) + ' not yet assigned a job. Your planned saving rate is ' + summary.savingsRate.toFixed(1) + '%.';
  }
  const keys = ['needs', 'wants', 'savings', 'remaining'];
  const ids = { needs: 'budget-bar-needs', wants: 'budget-bar-wants', savings: 'budget-bar-saving', remaining: 'budget-bar-left' };
  const positive = keys.reduce((total, key) => total + Math.max(0, summary.percentages[key]), 0);
  keys.forEach((key) => {
    byId(ids[key]).style.width = (positive > 0 ? Math.max(0, summary.percentages[key]) / positive * 100 : 0) + '%';
  });
}
connectForm('budget-form', updateBudget);
updateBudget();

function updateSavings() {
  const rate = readNumber('savings-rate', 'annual rate');
  const data = savingsFutureValue({
    initial: readNumber('savings-initial', 'starting amount'),
    monthly: readNumber('savings-monthly', 'monthly contribution'),
    annualRate: rate,
    years: readNumber('savings-years', 'duration')
  });
  byId('savings-result').textContent = formatINR(data.futureValue);
  byId('savings-contributions').textContent = formatINR(data.totalContributed);
  byId('savings-growth').textContent = formatINR(data.estimatedGrowth);
  byId('savings-message').textContent = 'Based on ' + data.months + ' monthly periods at an assumed ' + rate + '% annual rate. Contributions occur at month-end; taxes, fees, and rate changes are excluded. Actual returns are not guaranteed.';
}
connectForm('savings-form', updateSavings);
updateSavings();

function updateInflation() {
  const rate = readNumber('inflation-rate', 'annual inflation rate');
  const years = readNumber('inflation-years', 'duration');
  const data = inflationScenario({ price: readNumber('inflation-price', 'price'), annualRate: rate, years });
  byId('inflation-result').textContent = formatINR(data.futurePrice, 2);
  byId('inflation-increase').textContent = formatINR(data.increase, 2);
  byId('inflation-power').textContent = formatINR(data.purchasingPowerOf100, 2);
  byId('inflation-message').textContent = 'If the assumed rate stayed at ' + rate + '% for ' + years + ' year(s), the price would reach this estimate. Actual inflation varies across time and goods.';
}
connectForm('inflation-form', updateInflation);
updateInflation();

function updateLoan() {
  const rate = readNumber('loan-rate', 'annual interest rate');
  const years = readNumber('loan-years', 'loan term');
  const data = loanEmi({ principal: readNumber('loan-principal', 'loan principal'), annualRate: rate, years });
  byId('loan-result').textContent = formatINR(data.emi);
  byId('loan-total').textContent = formatINR(data.totalPaid);
  byId('loan-interest').textContent = formatINR(data.totalInterest);
  byId('loan-message').textContent = 'Illustrative total over ' + data.months + ' payments at a fixed ' + rate + '% rate. Fees, insurance, taxes, penalties, and rate changes are excluded.';
}
connectForm('loan-form', updateLoan);
updateLoan();

const questions = Array.from(document.querySelectorAll('.question'));
const answers = [
  { key: 'b', explanation: 'A budget makes expected essentials, savings goals, and flexible spending visible before money is spent. The balance depends on each person’s circumstances.' },
  { key: 'b', explanation: '₹100 × 1.05 = ₹105. One item’s price change does not establish the inflation rate for the whole economy.' },
  { key: 'a', explanation: 'Compound interest can be calculated on the original amount plus interest already earned. It does not guarantee a product will be profitable or safe.' },
  { key: 'b', explanation: 'A lower EMI can reflect a longer term and higher total interest. Check the rate, term, fees, and total repayment.' },
  { key: 'c', explanation: 'Guaranteed high returns with no risk are a warning sign. Do not share OTPs, PINs, or passwords; verify independently and seek trusted help.' }
];
let current = 0;
let checked = false;
let score = 0;
const selected = new Array(questions.length).fill(null);
function feedbackForCurrent() {
  const correct = selected[current] === answers[current].key;
  return (correct ? 'Correct. ' : 'Not quite. The best answer is ' + answers[current].key.toUpperCase() + '. ') + answers[current].explanation;
}
function renderQuiz() {
  questions.forEach((question, index) => {
    question.hidden = index !== current;
    question.querySelectorAll('input').forEach((input) => {
      input.checked = selected[index] === input.value;
      input.disabled = index === current && checked;
    });
  });
  byId('quiz-progress').textContent = 'QUESTION ' + (current + 1) + ' OF ' + questions.length;
  byId('quiz-track').style.width = ((current + 1) / questions.length * 100) + '%';
  byId('quiz-check').hidden = checked;
  byId('quiz-next').disabled = !checked;
  byId('quiz-next').textContent = current === questions.length - 1 ? 'See results →' : 'Next question →';
  byId('quiz-restart').hidden = !(checked && current === questions.length - 1);
  byId('quiz-feedback').textContent = checked ? feedbackForCurrent() : 'Choose one answer to continue.';
}
byId('quiz-form').addEventListener('change', (event) => {
  if (event.target.matches('input[type="radio"]') && !checked) selected[current] = event.target.value;
});
byId('quiz-check').addEventListener('click', () => {
  if (!selected[current]) {
    byId('quiz-feedback').textContent = 'Choose an answer before checking it.';
    return;
  }
  checked = true;
  if (selected[current] === answers[current].key) score += 1;
  renderQuiz();
});
function restartQuiz() {
  current = 0; checked = false; score = 0; selected.fill(null);
  byId('quiz-form').hidden = false;
  byId('quiz-summary').hidden = true;
  renderQuiz();
}
byId('quiz-next').addEventListener('click', () => {
  if (!checked) return;
  if (current === questions.length - 1) {
    byId('quiz-form').hidden = true;
    byId('quiz-summary').hidden = false;
    byId('quiz-score').textContent = score + '/' + questions.length;
    byId('quiz-summary-text').textContent = score === questions.length
      ? 'Excellent. You identified the key principles in all five scenarios. Try explaining each concept in your own words.'
      : 'You answered ' + score + ' out of ' + questions.length + ' correctly. Review the explanations, revisit the lessons, and try again. The goal is understanding, not memorising a score.';
    return;
  }
  current += 1; checked = false; renderQuiz();
});
byId('quiz-restart').addEventListener('click', restartQuiz);
byId('quiz-summary-restart').addEventListener('click', restartQuiz);
renderQuiz();
window.moneyMatters = { budgetSummary, savingsFutureValue, inflationScenario, loanEmi, formatINR };
