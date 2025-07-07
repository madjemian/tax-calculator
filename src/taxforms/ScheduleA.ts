import { makeAutoObservable } from 'mobx'
import type { UserInputStore } from '../stores/UserInputStore'
import { STANDARD_DEDUCTION } from './1040'
import type { TaxForm } from '../types'

// https://www.irs.gov/pub/irs-pdf/f1040sa.pdf
export class ScheduleAStore implements TaxForm {
  // This class will represent the Schedule A tax form
  private store: UserInputStore

  calculations: { [key: string]: () => number }

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store
    makeAutoObservable(this)

    this.calculations = {
      line5b: () => this.store.propertyTaxes || 0, // Property taxes
      line17: () => this.calculations.line5b(), // Itemized deductions
    }
  }

  get deduction(): number {
    // TODO mortgage interest from pub 963
    // TODO charitable contributions from pub 526
    // TODO medical expenses from pub 502
    // TODO other deductions from pub 17
    return Math.max(this.calculations.line17(), STANDARD_DEDUCTION)
  }
}