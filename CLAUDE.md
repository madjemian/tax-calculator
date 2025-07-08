# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Building and Development:**
```bash
yarn dev          # Start development server on port 5151
yarn build        # TypeScript compile + Vite build
yarn preview      # Preview production build
yarn lint         # Run ESLint
```

**Testing:**
```bash
yarn test         # Run all tests
yarn test:watch   # Run tests in watch mode
yarn test:coverage # Run tests with coverage report
yarn test <filename>  # Run specific test file
yarn test -- --testNamePattern="test name"  # Run specific test
```

## Architecture Overview

This is a personal tax calculation application for tax year 2025, built with React + TypeScript + MobX.

### Data Flow Architecture

**Two-Store Pattern:**
- `UserInputStore` - MobX store managing all user inputs (income, deductions, payments) with auto-save to localStorage
- `AppStore` - Orchestrates tax calculations and exposes computed results (tax, refund, owed, etc.)

**Tax Form Hierarchy:**
- `TaxForm` (base class) - Abstract class with calculations dictionary pattern
- `Form1040` (main form) - Implements provider interfaces, orchestrates all schedules
- Supporting schedules (`Schedule1`, `Schedule2`, `ScheduleA`, `ScheduleD`, etc.)
- Specialized forms (`Form8959`, `Form8960`, `QualifiedDividendsAndCapitalGainsWorksheet`)

### Key Patterns

**Provider Interface Pattern:** Tax forms depend on provider interfaces (e.g., `CalculationProvider`, `CapitalGainsProvider`) rather than direct store access. `Form1040` implements these interfaces and passes itself to schedules.

**Calculations Dictionary:** Each tax form uses a `calculations` object mapping IRS line numbers to functions:
```typescript
this.calculations = {
  line1: () => this.someCalculation(),
  line2: () => this.calculations.line1() + 1000,
  // ...
}
```

**Reactive State:** MobX observers provide automatic UI updates when calculations change. User inputs auto-save to localStorage with tax year-specific keys.

### Important Constants

Tax year 2025 constants are defined in `1040.ts`:
- `STANDARD_DEDUCTION = 30000`
- `ADDITIONAL_MEDICARE_TAX_THRESHOLD = 250000`
- `ZERO_PERCENT_CAP_GAINS_LIMIT = 96700`
- `FIFTEEN_PERCENT_CAP_GAINS_LIMIT = 600050`

### Refactoring Notes

Recent refactoring removed direct `UserInputStore` dependencies from tax form classes in favor of provider interfaces. Forms now receive data through dependency injection rather than direct store access, improving testability and modularity.

When adding new tax forms or schedules, follow the established pattern:
1. Extend `TaxForm` base class
2. Define provider interface if needed
3. Implement calculations dictionary with IRS line numbers
4. Add provider interface to `Form1040` if required
5. Write focused unit tests covering key calculations