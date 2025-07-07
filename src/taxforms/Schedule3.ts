import type { UserInputStore } from '../stores/UserInputStore'
import { TaxForm } from './TaxForm'

// https://www.irs.gov/pub/irs-pdf/f1040s3.pdf
export class Schedule3 extends TaxForm {
  private store: UserInputStore

  constructor(store: UserInputStore) {
    super()
    this.store = store

    this.calculations = {
      line1: () => this.store.foreignTaxCredit, // Foreign tax credit
    }
  }

  get nonRefundableCredits(): number {
    // TODO energyEfficientHomeCredit?
    return this.calculations.line1()
  }
}