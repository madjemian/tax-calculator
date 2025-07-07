import type { UserInputStore } from '../stores/UserInputStore'
import { Form8959 } from './8959'
import { Form8960 } from './8960'
import { TaxForm } from './TaxForm'

// ADDITIONAL TAXES
// https://www.irs.gov/pub/irs-pdf/f1040s2.pdf
export class Schedule2 extends TaxForm {
  private store: UserInputStore

  constructor(store: UserInputStore) {
    super()
    this.store = store
    this.calculations = {
      line2: () => 0, // TODO: AMT form 6251
      line3: () => this.calculations.line2(),
      // medicare wages from W2 box 5
      medicareWages: () => this.store.totalW2Income - this.store.hsaContribution,
      line11: () => new Form8959(this.calculations.medicareWages()).additionalMedicareTax(),
      agi: () => this.store.totalW2Income + this.store.taxableInterest + this.store.totalDividends - this.store.totalDeductions,
      magi: () => this.calculations.agi() + this.store.taxFreeInterest, // Modified Adjusted Gross Income (MAGI) = AGI + tax-exempt interest
      line12: () => new Form8960(
                      this.store.taxableInterest,
                      this.store.totalDividends,
                      this.store.longTermCapitalGains + this.store.shortTermCapitalGains,
                      this.calculations.magi()
                    ).netInvestmentIncomeTax(),
    }
  }

  get tax(): number {
    return this.calculations.line3()
  }

  get otherTaxes(): number {
    return this.calculations.line11() + this.calculations.line12()
  }
}

