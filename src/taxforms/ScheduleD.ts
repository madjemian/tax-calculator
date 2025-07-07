import { makeAutoObservable } from 'mobx'
import type { UserInputStore } from '../stores/UserInputStore'
import type { TaxForm } from '../types'

// https://www.irs.gov/pub/irs-pdf/f1040sd.pdf
export class ScheduleDStore implements TaxForm {
  // This class will represent the Schedule D tax form
  private store: UserInputStore
  calculations: { [key: string]: () => number }

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store
    makeAutoObservable(this)

    this.calculations = {
      line15: () => this.store.longTermCapitalGains, // Long-term capital gains
      line16: () => this.store.longTermCapitalGains + this.store.shortTermCapitalGains, // Total capital gains
    }
  }

  get line15(): number {
    return this.calculations.line15()
  }

  get line16(): number {
    return this.calculations.line16()
  }
}