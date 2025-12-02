import type { UserInputStore } from '../stores/UserInputStore'

// California tax brackets for tax year 2025 (married filing jointly)
export const CA_TAX_BRACKETS = [
  { min: 0, max: 21512, rate: 0.01, offset: 0 },
  { min: 21512, max: 50998, rate: 0.02, offset: 215.12 },
  { min: 50998, max: 80490, rate: 0.04, offset: 804.84 },
  { min: 80490, max: 111732, rate: 0.06, offset: 1984.52 },
  { min: 111732, max: 141212, rate: 0.08, offset: 3859.04 },
  { min: 141212, max: 721318, rate: 0.093, offset: 6217.44 },
  { min: 721318, max: 865574, rate: 0.103, offset: 60167.30 },
  { min: 865574, max: 1442628, rate: 0.113, offset: 75025.67 },
  { min: 1442628, max: Infinity, rate: 0.123, offset: 140232.77 }
]

export class CaliforniaTax {
  private store: UserInputStore

  constructor(store: UserInputStore) {
    this.store = store
  }

  // Calculate CA tax on the full taxable income (W2 + options - deductions)
  calculateFullCATax(): number {
    const taxableIncome = Math.max(this.store.totalCACalculationBase, 0)
    return this.calculateTaxFromBrackets(taxableIncome)
  }

  // Apply the weighted ratio to get actual CA tax owed
  calculateActualCATax(): number {
    const fullTax = this.calculateFullCATax()
    const ratio = this.store.caTaxableRatio
    return fullTax * ratio
  }

  private calculateTaxFromBrackets(income: number): number {
    if (income <= 0) return 0

    for (const bracket of CA_TAX_BRACKETS) {
      if (income <= bracket.max) {
        const taxableAtThisBracket = income - bracket.min
        return bracket.offset + (taxableAtThisBracket * bracket.rate)
      }
    }
    
    // Should never reach here due to infinity bracket, but fallback
    const topBracket = CA_TAX_BRACKETS[CA_TAX_BRACKETS.length - 1]
    const taxableAtTopBracket = income - topBracket.min
    return topBracket.offset + (taxableAtTopBracket * topBracket.rate)
  }

  // Debugging/display methods
  get fullTaxableIncome(): number {
    return Math.max(this.store.totalCACalculationBase, 0)
  }

  get caTaxableAmount(): number {
    return this.store.totalCATaxableIncome
  }

  get caRatio(): number {
    return this.store.caTaxableRatio
  }
}