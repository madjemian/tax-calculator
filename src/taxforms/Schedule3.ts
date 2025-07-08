import { TaxForm } from './TaxForm'

export interface CreditProvider {
  getForeignTaxCredit(): number
}

// https://www.irs.gov/pub/irs-pdf/f1040s3.pdf
export class Schedule3 extends TaxForm {
  private creditProvider: CreditProvider

  constructor(creditProvider: CreditProvider) {
    super()
    this.creditProvider = creditProvider

    this.calculations = {
      line1: () => this.creditProvider.getForeignTaxCredit(), // Foreign tax credit
    }
  }

  get nonRefundableCredits(): number {
    // TODO energyEfficientHomeCredit?
    return this.calculations.line1()
  }
}