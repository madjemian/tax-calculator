import { makeAutoObservable } from 'mobx'
import type { UserInputStore } from '../stores/UserInputStore'

// https://www.irs.gov/pub/irs-pdf/f1040sd.pdf
export class ScheduleDStore {
  // This class will represent the Schedule D tax form
  private store: UserInputStore

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store
    makeAutoObservable(this)
  }

  get line15(): number {
    return this.store.longTermCapitalGains
  }

  get line16(): number {
    return this.store.longTermCapitalGains + this.store.shortTermCapitalGains
  }
}