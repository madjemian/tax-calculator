import { TaxForm } from './TaxForm'

export interface ScheduleSEProvider {
  getTotalBusinessProfit(): number
  getW2Income(): number
}

// https://www.irs.gov/pub/irs-pdf/f1040sse.pdf
export class ScheduleSE extends TaxForm {
  private provider: ScheduleSEProvider
  
  // Social Security wage base for 2026 (estimated)
  public static readonly SS_WAGE_BASE = 181800

  constructor(provider: ScheduleSEProvider) {
    super()
    this.provider = provider

    this.calculations = {
      // Net profit from Schedule C
      line2: () => this.provider.getTotalBusinessProfit(),
      // Multiply line 2 by 92.35%
      line4: () => this.calculations.line2() * 0.9235,
      // If line 4 is less than $400, no SE tax
      line4a: () => this.calculations.line4() < 400 ? 0 : this.calculations.line4(),
      
      // Social Security Tax calculation
      line7: () => ScheduleSE.SS_WAGE_BASE,
      line8a: () => this.provider.getW2Income(),
      line9: () => Math.max(0, this.calculations.line7() - this.calculations.line8a()),
      line10: () => Math.min(this.calculations.line4a(), this.calculations.line9()) * 0.124,
      
      // Medicare Tax calculation
      line11: () => this.calculations.line4a() * 0.029,
      
      // Total Self-employment tax
      line12: () => this.calculations.line10() + this.calculations.line11(),
      
      // Deductible part of self-employment tax
      line13: () => this.calculations.line12() * 0.5,
    }
  }

  get selfEmploymentTax(): number {
    return this.calculations.line12()
  }

  get deductibleSelfEmploymentTax(): number {
    return this.calculations.line13()
  }
}
