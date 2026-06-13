# GEMINI.md

This file provides reference guidance for Gemini when working in this repository.

## Development & Test Commands

**Building and Development:**
- `yarn dev`: Starts the Vite development server on port `5151`
- `yarn build`: Compiles TypeScript and builds the production bundles using Vite
- `yarn preview`: Previews the production build locally
- `yarn lint`: Runs ESLint to check for code style and linting issues

**Testing:**
- `yarn test`: Runs all Jest unit tests
- `yarn test:watch`: Runs tests in watch mode
- `yarn test:coverage`: Runs tests and generates a code coverage report
- `yarn test <filename>`: Runs tests for a specific file
- `yarn test -- --testNamePattern="test name"`: Runs specific tests matching a pattern

---

## Architectural Layout

The application is structured as a **Personal Tax Calculator for Tax Year 2026**, built with React 18, TypeScript, MobX for state management, and Blueprint UI for components.

### 1. Data Flow & Two-Store Pattern
- **`UserInputStore`**:
  - Manages the raw reactive state of all user inputs.
  - Automatically saves/restores state to and from `localStorage` under the key `taxCalculatorData-2026`.
  - Exposes computed properties (e.g., `totalW2Income`, `taxableInterest`) to provide compatibility with tax forms while storing rich data structures internally.
- **`AppStore`**:
  - Orchestrates calculation results by passing the `UserInputStore` down to the tax form engine.
  - Exposes aggregated calculated properties (e.g., AGI, total federal tax, payments, refund, owed, CA state tax) to the UI.

### 2. Tax Form Engine Hierarchy
- **`TaxForm` (base class)**:
  - Abstract base class implementing the Calculations Dictionary pattern.
- **`Form1040` (main coordinator)**:
  - Implements provider interfaces and delegates components of the tax return to schedules and worksheets.
- **Supporting Schedules & Forms**:
  - `Schedule1`: Additional Income and Adjustments to Income.
  - `Schedule2`: Additional Taxes (including Self-Employment tax, Additional Medicare tax, NIIT).
  - `Schedule3`: Non-refundable Credits (e.g., Foreign Tax Credit).
  - `ScheduleA`: Itemized Deductions.
  - `ScheduleD`: Capital Gains and Losses.
  - `ScheduleSE`: Self-Employment Tax.
  - `CaliforniaTax`: Handles state tax calculations using California-specific brackets and a weighted residency/work ratio.
- **Specialized Worksheets**:
  - `Form8959`: Additional Medicare Tax.
  - `Form8960`: Net Investment Income Tax (NIIT).
  - `QualifiedDividendsAndCapitalGainsWorksheet`: Calculates preferential tax rates on qualified dividends and long-term capital gains.

---

## Key Coding Patterns

### Provider Interface Pattern
Schedules and worksheets do not access the MobX stores directly. Instead, they depend on provider interfaces defined in their respective files (e.g., `CalculationProvider`, `CapitalGainsProvider`, `DeductionProvider`, `CreditProvider`, `QualifiedDividendsAndCapitalGainsProvider`). `Form1040` implements these interfaces and passes itself (`this`) to the schedules. This decouples calculations, enabling clean mock-based unit testing.

### Calculations Dictionary
Every tax form defines its calculation steps in a `calculations` dictionary mapping IRS line numbers to reactive function calls:
```typescript
this.calculations = {
  line1a: () => this.store.totalW2Income - this.store.totalDeductions,
  line1z: () => this.calculations.line1a(),
  line2b: () => this.store.taxableInterest,
  line9: () => this.calculations.line1z() + this.calculations.line2b() + ...
}
```

### Auto-Save & Error Recovery
State is reactively saved on change via a MobX `autorun` block. If parsing from `localStorage` fails on startup (e.g., due to schema changes), the corrupt string is saved under `errorUserInputData` in localStorage to prevent data loss, and the app falls back to default empty values safely.

### Rounding Policy
- **Calculations**: Done with floating-point precision on raw user inputs.
- **Display**: Expose calculated values wrapped in `Math.round()` to display clean, rounded whole-dollar amounts in the UI.

---

## Important Constants & Tax Brackets (Tax Year 2026)

### Federal Constants (`src/taxforms/1040.ts`)
- `STANDARD_DEDUCTION` = $32,200 (Married Filing Jointly)
- `ZERO_PERCENT_CAP_GAINS_LIMIT` = $98,900
- `FIFTEEN_PERCENT_CAP_GAINS_LIMIT` = $613,700
- `ADDITIONAL_MEDICARE_TAX_THRESHOLD` = $250,000
- `NIIT_THRESHOLD` = $250,000
- `MAX_CAPITAL_LOSS_DEDUCTION` = -$3,000

### Federal Tax Brackets (`src/taxforms/1040.ts`)
| Min Income | Max Income | Tax Rate | Offset |
|---|---|---|---|
| $0 | $24,800 | 10% | $0 |
| $24,800 | $100,800 | 12% | $2,480 |
| $100,800 | $211,400 | 22% | $11,720 |
| $211,400 | $403,550 | 24% | $36,192 |
| $403,550 | $512,450 | 32% | $82,344 |
| $512,450 | $768,700 | 35% | $117,144 |
| $768,700 | &infin; | 37% | $208,606.50 |

### California Tax Brackets (`src/taxforms/CaliforniaTax.ts`)
| Min Income | Max Income | Tax Rate | Offset |
|---|---|---|---|
| $0 | $21,512 | 1% | $0 |
| $21,512 | $50,998 | 2% | $215.12 |
| $50,998 | $80,490 | 4% | $804.84 |
| $80,490 | $111,732 | 6% | $1,984.52 |
| $111,732 | $141,212 | 8% | $3,859.04 |
| $141,212 | $721,318 | 9.3% | $6,217.44 |
| $721,318 | $865,574 | 10.3% | $60,167.30 |
| $865,574 | $1,442,628 | 11.3% | $75,025.67 |
| $1,442,628 | &infin; | 12.3% | $140,232.77 |