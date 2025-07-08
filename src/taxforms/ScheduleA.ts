import { STANDARD_DEDUCTION } from './1040'
import { TaxForm } from './TaxForm'

export interface DeductionProvider {
  getPropertyTaxes(): number
}

// https://www.irs.gov/pub/irs-pdf/f1040sa.pdf
export class ScheduleA extends TaxForm {
  private deductionProvider: DeductionProvider

  constructor(deductionProvider: DeductionProvider) {
    super()

    this.deductionProvider = deductionProvider

    this.calculations = {
      line5b: () => this.deductionProvider.getPropertyTaxes() || 0, // Property taxes
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