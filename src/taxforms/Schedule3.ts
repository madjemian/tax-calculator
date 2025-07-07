import { makeAutoObservable } from 'mobx'
import type { UserInputStore } from '../stores/UserInputStore'
import type { TaxForm } from '../types'

// https://www.irs.gov/pub/irs-pdf/f1040s1.pdf
export class Schedule3Store implements TaxForm {
  // This class will represent the Schedule 1 tax form
  private store: UserInputStore

  calculations: { [key: string]: () => number }

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store
    makeAutoObservable(this)

    this.calculations = {
      line1: () => this.store.foreignTaxCredit, // Foreign tax credit
    }
  }

  get nonRefundableCredits(): number {
    // TODO energyEfficientHomeCredit?
    return this.calculations.line1()
  }
}