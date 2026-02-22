> **Note:** This file is now secondary. Please see `GEMINI.md` for the most up-to-date guidance.

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

This is a personal tax calculation application for tax year 2026, built with React 18 + TypeScript + MobX + Blueprint UI.

### Data Flow Architecture

**Two-Store Pattern:**
- `UserInputStore` - MobX store managing all user inputs with enhanced data structures and auto-save to localStorage
- `AppStore` - Orchestrates tax calculations and exposes computed results (tax, refund, owed, etc.)

**Enhanced Input Data Structures:**
- `W2Income[]` - Dynamic array of W2 entries with UUID, name, income, and withholding
- `BusinessIncome[]` - Dynamic array of 1099/business entries with UUID, name, income, and expenses
- `OptionExercise[]` - Dynamic array of option exercise batches with UUID, date, amount, and withholding  
- `InvestmentIncome` - Quarterly data structure with Q1-Q4 values for each investment category
- Computed properties provide backward compatibility for tax forms

**Tax Form Hierarchy:**
- `TaxForm` (base class) - Abstract class with calculations dictionary pattern
- `Form1040` (main form) - Implements provider interfaces, orchestrates all schedules
- Supporting schedules (`Schedule1`, `Schedule2`, `ScheduleA`, `ScheduleD`, `ScheduleSE`, etc.)
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

**Tabbed UI Architecture:**
- `TabbedUserInputs` - Main tabbed interface with 5 sections
- `WorkIncomeTab` - Combined W2, 1099, and option exercise entry with add/remove functionality  
- `InvestmentIncomeTab` - Quarterly grid interface matching user's spreadsheet workflow
- `DeductionsTab` - Simple deduction inputs with totals
- `TaxesPaidTab` - Withholding summaries plus estimated tax payments
- `InputSummary` - Left column reactive summary of all input categories

### Important Constants

Tax year 2026 constants are defined in `1040.ts`:
- `STANDARD_DEDUCTION = 30000`
- `ADDITIONAL_MEDICARE_TAX_THRESHOLD = 250000`
- `ZERO_PERCENT_CAP_GAINS_LIMIT = 96700`
- `FIFTEEN_PERCENT_CAP_GAINS_LIMIT = 600050`

### Key Implementation Patterns

**Computed Properties for Compatibility:**
The `UserInputStore` uses computed properties (e.g., `totalW2Income`, `taxableInterest`) to maintain a stable interface for tax forms while supporting rich data structures underneath. Always use computed properties when tax forms need to access aggregated data.

**UUID-based Dynamic Lists:**
Use `uuid` package for generating IDs for dynamic entries (W2s, option exercises). Each entry should have add/update/remove methods in the store with proper MobX reactivity.

**Quarterly Data Pattern:**
Investment income uses `QuarterlyData` type with q1-q4 fields. Use `sumQuarterly()` helper method with null coalescing for safe aggregation.

**Rounding for Display:**
All calculated display values should use `Math.round()` to show clean dollar amounts. User input values remain unrounded for calculation precision.

**Component Organization:**
- Main tabs in `src/components/tabs/`
- Each tab is self-contained with its own data management
- Use `NumericFormat` for display-only values, `NumberInput` for editable values
- UI components use Blueprint (@blueprintjs/core, @blueprintjs/icons) - import from Blueprint, not Semantic UI

### Refactoring Notes

Enhanced the app from simple flat inputs to rich data structures while maintaining full backward compatibility with tax calculations through computed properties and provider interfaces. The tabbed UI provides better UX matching the user's actual tax preparation workflow.

When adding new functionality:
1. Consider if it needs dynamic lists (follow W2Income pattern) or simple fields
2. Use quarterly structure for investment-like data that varies by quarter  
3. Always provide computed properties for tax form compatibility
4. Add proper null coalescing for localStorage compatibility
5. Ensure all display values are rounded consistently