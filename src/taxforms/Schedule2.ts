import { makeAutoObservable } from 'mobx'
import type { UserInputStore } from '../stores/UserInputStore'
import { Form8959 } from './8959'
import { Form8960 } from './8960'

// ADDITIONAL TAXES
// https://www.irs.gov/pub/irs-pdf/f1040s2.pdf
export class Schedule2Store {
  // This class will represent the Schedule 1 tax form
  private store: UserInputStore

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store
    makeAutoObservable(this)
  }

  get tax(): number {
    // AMT form 6251
    const line2 = 0

    // line 3 -  goes to form104 line 17
    return line2
  }

  get otherTaxes(): number {
    // Additional medicare tax (8959)
    // medicare wages from W2 box 5
    const medicareWages = this.store.totalW2Income - this.store.hsaContribution
    const l11 = new Form8959(medicareWages).additionalMedicareTax()
    console.log('Additional Medicare Tax:', l11)

    // Net investment income tax (8960)
    const agi = this.store.totalW2Income + this.store.taxableInterest + this.store.totalDividends - this.store.totalDeductions
    const magi = agi + this.store.taxFreeInterest // Modified Adjusted Gross Income (MAGI) = AGI + tax-exempt interest
    const l12 = new Form8960(
      this.store.taxableInterest,
      this.store.totalDividends,
      this.store.longTermCapitalGains + this.store.shortTermCapitalGains,
      magi
    ).netInvestmentIncomeTax()
    console.log('Net Investment Income Tax:', l12)

    return l11 + l12
  }
}

