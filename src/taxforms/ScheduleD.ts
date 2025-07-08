import { TaxForm } from './TaxForm'

export interface CapitalGainsProvider {
  getLongTermCapitalGains(): number
  getShortTermCapitalGains(): number
}

// https://www.irs.gov/pub/irs-pdf/f1040sd.pdf
export class ScheduleD extends TaxForm {
  private capitalGainsProvider: CapitalGainsProvider

  constructor(capitalGainsProvider: CapitalGainsProvider) {
    super()
    this.capitalGainsProvider = capitalGainsProvider

    this.calculations = {
      line15: () => this.capitalGainsProvider.getLongTermCapitalGains(), // Long-term capital gains
      line16: () => this.capitalGainsProvider.getLongTermCapitalGains() + this.capitalGainsProvider.getShortTermCapitalGains(), // Total capital gains
    }
  }

  get line15(): number {
    return this.calculations.line15()
  }

  get line16(): number {
    return this.calculations.line16()
  }
}