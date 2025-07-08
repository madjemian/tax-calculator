import { TaxForm } from './TaxForm'

// https://www.irs.gov/pub/irs-pdf/f1040s3.pdf
export class Schedule3 extends TaxForm {
  private foreignTaxCredit: number

  constructor(foreignTaxCredit: number) {
    super()
    this.foreignTaxCredit = foreignTaxCredit

    this.calculations = {
      line1: () => this.foreignTaxCredit, // Foreign tax credit
    }
  }

  get nonRefundableCredits(): number {
    // TODO energyEfficientHomeCredit?
    return this.calculations.line1()
  }
}