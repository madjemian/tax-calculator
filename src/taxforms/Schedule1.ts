import { TaxForm } from './TaxForm'
import { ScheduleSE } from './ScheduleSE'

export interface Schedule1Provider {
  getTotalBusinessProfit(): number
  getW2Income(): number
}

// https://www.irs.gov/pub/irs-pdf/f1040s1.pdf
export class Schedule1 extends TaxForm {
  private provider: Schedule1Provider
  private scheduleSE: ScheduleSE

  constructor(provider: Schedule1Provider) {
    super()
    this.provider = provider
    this.scheduleSE = new ScheduleSE(provider)

    this.calculations = {
      // business income, Schedule C
      line3: () => this.provider.getTotalBusinessProfit(),
      // deductible part of self-employment tax
      line15: () => this.scheduleSE.deductibleSelfEmploymentTax,
    }
  }

  get additionalIncome(): number {
    return this.calculations.line3()
  }

  get incomeAdjustments(): number {
    return this.calculations.line15()
  }
}