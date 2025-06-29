import { makeAutoObservable } from 'mobx'
import type { UserInputStore } from '../stores/UserInputStore'
import { STANDARD_DEDUCTION } from './1040'

// https://www.irs.gov/pub/irs-pdf/f1040sa.pdf
export class ScheduleAStore {
  // This class will represent the Schedule A tax form
  private store: UserInputStore

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store
    makeAutoObservable(this)
  }

  get deduction(): number {
    // TODO mortgage interest from pub 963

    // line 5b
    const propertyTaxes = this.store.propertyTaxes

    // line17
    const itemizedDeductions = propertyTaxes || 0 // + mortgageInterest + charitableContributions + medicalExpenses + otherDeductions
    return Math.max(itemizedDeductions, STANDARD_DEDUCTION)
  }
}