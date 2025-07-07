import type { UserInputStore } from '../stores/UserInputStore'
import { TaxForm } from './TaxForm'


// https://www.irs.gov/pub/irs-pdf/f1040sd.pdf
export class ScheduleD extends TaxForm {
  private store: UserInputStore

  constructor(store: UserInputStore) {
    super()
    this.store = store

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