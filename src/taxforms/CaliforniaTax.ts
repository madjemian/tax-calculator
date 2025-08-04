import type { UserInputStore } from '../stores/UserInputStore'

// California tax brackets for tax year 2025 (married filing jointly)
export const CA_TAX_BRACKETS = [
  { min: 0, max: 20824, rate: 0.01, offset: 0 },
  { min: 20824, max: 49368, rate: 0.02, offset: 208.24 },
  { min: 49368, max: 77918, rate: 0.04, offset: 779.12 },
  { min: 77918, max: 108162, rate: 0.06, offset: 1921.12 },
  { min: 108162, max: 136700, rate: 0.08, offset: 3735.76 },
  { min: 136700, max: 698274, rate: 0.093, offset: 6019.80 },
  { min: 698274, max: 837922, rate: 0.103, offset: 58266.21 },
  { min: 837922, max: 1396542, rate: 0.113, offset: 72641.63 },
  { min: 1396542, max: Infinity, rate: 0.123, offset: 135751.69 }
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