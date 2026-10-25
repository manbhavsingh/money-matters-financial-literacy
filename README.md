# Money Matters — Financial Literacy Learning Kit

An interactive, student-friendly financial-literacy learning kit for Indian students (approximately ages 14–18). It combines a responsive website, four transparent calculators, five short lesson outlines, a printable worksheet, and a formative knowledge check.

> **Project status:** Independent educational prototype. Not affiliated with or endorsed by Youth Economy Lab, the Reserve Bank of India, or another institution. Not financial, legal, tax, or investment advice.

## Why this project exists

Financial concepts become easier to reason about when learners connect formulas to familiar decisions. Money Matters is designed around a simple learning pattern: explain a concept in plain language, demonstrate a fictional example, let learners experiment, then check understanding with an explanation.

## Explore the project

### Interactive website

Open `index.html` through a local web server or publish the repository with GitHub Pages.

### Learning materials

- `content/lesson-plans.md` — five concise lesson plans with objectives, worked examples, prompts, and exit tickets.
- `content/worksheet.md` — printable student worksheet and facilitator answer guide.
- `content/assessment.md` — quiz-to-learning-outcome mapping and a cautious evaluation plan.
- `content/research-notes.md` — source notes, design rationale, and limitations.

### Interactive tools

1. **Budget planner** — available money, needs, wants, planned saving, and remainder.
2. **Savings growth estimator** — initial deposit plus monthly contributions, with monthly compounding under a user-entered assumed rate.
3. **Inflation scenario** — hypothetical future price and purchasing-power illustration at a constant rate.
4. **Loan EMI estimator** — fixed-rate EMI, total paid, and total interest under simplified assumptions.
5. **Knowledge check** — five multiple-choice questions with explanatory feedback.

## Run locally

No framework, build step, account, or API key is required. With Node.js 18+ installed, test the calculation functions and serve the website:

```bash
npm test
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. (The site uses JavaScript modules, so serving over HTTP is recommended instead of opening the HTML file directly.)

## Publish with GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under the build/deployment settings, choose **Deploy from a branch**.
3. Select the `main` branch and `/ (root)` folder, then save.
4. Wait for GitHub Pages to publish the site. The URL will be shown in the Pages settings.

## Calculation assumptions

- **Budget:** remainder is income minus needs, wants, and planned saving. Negative remainder means the plan exceeds the amount available.
- **Savings:** nominal annual rate divided by 12; monthly contributions are assumed to be made at month-end. No fees, taxes, withdrawals, rate changes, or product-specific conditions are modelled. Actual returns are not guaranteed.
- **Inflation:** one constant annual rate is applied for the specified number of years. This is a hypothetical scenario, not an official inflation series or forecast.
- **Loan EMI:** standard fixed-rate amortising loan formula; nominal annual rate divided by 12. Fees, insurance, taxes, rate changes, penalties, and lender-specific conditions are excluded.

## Testing

Pure calculation functions have unit tests for ordinary cases, zero-rate branches, invalid negative inputs, overspending, and Indian rupee number formatting. The browser interface should also be checked manually on desktop and mobile, including keyboard navigation and form validation.

## Sources and attribution

The project references public educational material from the Reserve Bank of India (RBI):

- [Financial Literacy for School Children](https://www.rbi.org.in/commonman/English/content/01SCHOOL20042018.pdf)
- [Financial Awareness Messages (FAME)](https://www.rbi.org.in/commonman/images/FAME%20Booklet%20second%20edition/FAME%20Booklet%20English/FAME30072020.pdf)
- [National Strategy for Financial Education 2020–2025](https://www.rbi.org.in/commonman/Upload/English/Content/PDFs/English_16042021.pdf)
- [RBI Annual Report 2024–25](https://www.rbi.org.in/Scripts/AnnualReportPublications.aspx?Id=1434)

RBI materials are referenced for background and are not reproduced wholesale; original examples and learning activities are written for this toolkit. The sources do not imply endorsement. See `content/research-notes.md` for more detail.

## Accessibility and privacy

The site uses semantic landmarks, labels, visible focus states, keyboard-operable calculator tabs, explanatory feedback, and reduced-motion preferences. It does not request names, household budgets, bank details, or other personal financial information. It requires no cookies, analytics, or external APIs. The font is fetched from Google Fonts; system fallback fonts are provided.

## Author

**Manbhav Singh** — independent learning project, October 2026.

## License

Released under the MIT License; see `LICENSE`.
