import { TaxForm } from './TaxForm'


// https://www.irs.gov/pub/irs-pdf/f1040sd.pdf
export class ScheduleD extends TaxForm {
  private longTermCapitalGains: number
  private shortTermCapitalGains: number

  constructor(longTermCapitalGains: number, shortTermCapitalGains: number) {
    super()
    this.longTermCapitalGains = longTermCapitalGains
    this.shortTermCapitalGains = shortTermCapitalGains

    this.calculations = {
      line15: () => this.longTermCapitalGains, // Long-term capital gains
      line16: () => this.longTermCapitalGains + this.shortTermCapitalGains, // Total capital gains
    }
  }

  get line15(): number {
    return this.calculations.line15()
  }

  get line16(): number {
    return this.calculations.line16()
  }
}