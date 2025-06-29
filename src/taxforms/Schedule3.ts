import { makeAutoObservable } from 'mobx'
import type { UserInputStore } from '../stores/UserInputStore'

// https://www.irs.gov/pub/irs-pdf/f1040s1.pdf
export class Schedule3Store {
  // This class will represent the Schedule 1 tax form
  private store: UserInputStore

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store
    makeAutoObservable(this)
  }

  get nonRefundableCredits(): number {
    const l1 = this.store.foreignTaxCredit // Foreign tax credit
    // TODO energyEfficientHomeCredit?
    return l1
  }
}