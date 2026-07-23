# Multi-Year Tax Architecture Design Plan

## Overview
This architectural plan outlines how to transition the Tax Calculator from a single-year (2026) hardcoded engine into an extensible, multi-year platform. The system will support switching between **2026**, **2027**, and future tax years seamlessly, preserving historical calculations, supporting side-by-side comparisons, and enabling data import from prior years.

---

## Key Architectural Principles

1. **Separation of Tax Parameters from Calculation Rules**:
   - Extract magic numbers, bracket tables, and statutory limits out of form code into typed configuration objects per tax year.
2. **Factory & Strategy Design Patterns**:
   - Tax forms (`Form1040`, `CaliforniaTax`, worksheets) consume tax year configurations via dependency injection.
   - If form rules change significantly in a future year, year-specific class extensions override base calculations cleanly.
3. **Isolated Multi-Year Persistence**:
   - Store user inputs independently per year (e.g., `taxCalculatorData-2026`, `taxCalculatorData-2027`).
   - Provide migration/copy utilities to clone structural inputs (e.g., W-2 employer profiles, interest accounts) from prior years into new tax years.
4. **Reactive Year Context**:
   - UI and state management components reactively adapt when the user switches the active tax year selector.

---

## Architecture Blueprint

```mermaid
flowchart TD
    subgraph UI Layer
        YS[Year Selector (2026 | 2027)]
        AppUI[React UI Components]
    end

    subgraph State Layer
        AppStore[AppStore (Active Year Manager)]
        UIS[UserInputStore (Per-Year Data)]
    end

    subgraph Configuration Layer
        Registry[TaxYearRegistry]
        Config2026[2026 Tax Config]
        Config2027[2027 Tax Config]
    end

    subgraph Tax Form Engine
        Factory[TaxFormFactory]
        Form1040[Form1040 Engine]
        CATax[CaliforniaTax Engine]
    end

    YS -->|Selects Year| AppStore
    AppStore -->|Loads Data| UIS
    AppStore -->|Requests Engine| Factory
    Factory -->|Fetches Parameters| Registry
    Registry --> Config2026
    Registry --> Config2027
    Factory -->|Instantiates| Form1040
    Factory -->|Instantiates| CATax
    Form1040 -->|Exposes Results| AppStore
    CATax -->|Exposes Results| AppStore
    AppStore -->|Renders| AppUI
```

---

## 1. Tax Parameters Configuration Layer (`src/config/taxYears/`)

Currently, tax parameters are hardcoded as exports in files like [1040.ts](file:///Users/madjemian/Desktop/projects/taxes/src/taxforms/1040.ts#L12-L28) and [CaliforniaTax.ts](file:///Users/madjemian/Desktop/projects/taxes/src/taxforms/CaliforniaTax.ts#L4-L16).

### Structure:
```text
src/
└── config/
    └── taxYears/
        ├── types.ts          # TaxYearConfig interface definition
        ├── 2026.ts           # 2026 parameter values
        ├── 2027.ts           # 2027 parameter values (projected / official)
        └── index.ts          # Registry mapping year string to config
```

### Typed Configuration Interface (`types.ts`):
```typescript
export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  offset: number;
}

export interface TaxYearConfig {
  year: number;
  federal: {
    standardDeduction: number;
    zeroPercentCapGainsLimit: number;
    fifteenPercentCapGainsLimit: number;
    additionalMedicareThreshold: number;
    niitThreshold: number;
    maxCapitalLossDeduction: number;
    brackets: TaxBracket[];
  };
  california: {
    standardDeduction: number;
    brackets: TaxBracket[];
  };
}
```

---

## 2. Form Engine Dependency Injection

Update tax form engines to accept `TaxYearConfig` via constructor injection rather than relying on global constants.

### Refactored Form1040 Snippet:
```typescript
export class Form1040 extends TaxForm {
  private store: UserInputStore;
  private config: TaxYearConfig;

  constructor(store: UserInputStore, config: TaxYearConfig) {
    super();
    this.store = store;
    this.config = config;

    this.calculations = {
      line12: () => this.config.federal.standardDeduction,
      line16: () => this.calculateTaxFromBrackets(this.calculations.line15(), this.config.federal.brackets),
      // ...
    };
  }
}
```

---

## 3. Storage & State Management (`src/stores/`)

### Multi-Year Data Storage Strategy:
1. **Keys**:
   - `taxCalculatorData-2026`
   - `taxCalculatorData-2027`
   - `taxCalculatorActiveYear` (stores currently selected year, e.g. `'2026'` or `'2027'`)
2. **Prior Year Data Import**:
   - Add a button in the UI: **"Rollover from 2026"**.
   - Copies static fields (e.g. W2 employer details, deduction selections, residency ratios) while resetting year-specific income values if desired.

### `AppStore` Dynamic Engine Switching:
```typescript
export class AppStore {
  selectedYear: string = '2026';
  private userStores: Map<string, UserInputStore> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  setTaxYear(year: string) {
    this.selectedYear = year;
  }

  get currentForm1040(): Form1040 {
    const config = getTaxYearConfig(this.selectedYear);
    const store = this.getUserInputStore(this.selectedYear);
    return new Form1040(store, config);
  }
}
```

---

## 4. Proposed Implementation Roadmap

| Phase | Tasks | Risk Level |
|---|---|---|
| **Phase 1: Config Extraction** | Define `TaxYearConfig` interface. Extract 2026 constants into `src/config/taxYears/2026.ts`. Update [1040.ts](file:///Users/madjemian/Desktop/projects/taxes/src/taxforms/1040.ts) and [CaliforniaTax.ts](file:///Users/madjemian/Desktop/projects/taxes/src/taxforms/CaliforniaTax.ts) to use config. | Low |
| **Phase 2: 2027 Config Addition** | Add `src/config/taxYears/2027.ts` with updated/inflation-adjusted tax brackets and standard deductions. | Low |
| **Phase 3: Store & Year Switcher** | Update [stores.ts](file:///Users/madjemian/Desktop/projects/taxes/src/stores/stores.ts) and [AppStore.ts](file:///Users/madjemian/Desktop/projects/taxes/src/stores/AppStore.ts) to support dynamic year selection and multi-key `localStorage`. | Medium |
| **Phase 4: UI Enhancements** | Add a Tax Year Dropdown/Segmented Control in the header + Year-over-Year Tax Delta comparison view. | Low |
| **Phase 5: Automated Matrix Tests** | Add unit test suites verifying calculations for both 2026 and 2027 inputs. | Low |

---

## Summary of Benefits
- **Zero Code Branching**: Single codebase handles present and past/future years without git branch clutter.
- **Inflation & Tax Law Updates**: Adding 2028 or 2029 requires only adding a single config file (unless IRS completely redesigns form structure).
- **Comparison & Planning**: Users can toggle between 2026 and 2027 instantly to see how tax law changes or income growth impacts tax liability.
