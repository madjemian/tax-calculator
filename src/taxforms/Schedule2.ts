import { Form8959 } from './8959'
import { Form8960 } from './8960'
import { TaxForm } from './TaxForm'
import { ScheduleSE } from './ScheduleSE'

export interface CalculationProvider {
  getMedicareWages(): number
  getAgi(): number
  getModifiedAGI(): number
  getTaxableInterest(): number
  getOrdinaryDividends(): number
  getNetCapitalGain(): number
  getTotalBusinessProfit(): number
  getW2Income(): number
  getSelfEmploymentIncome(): number
}

// ADDITIONAL TAXES
// https://www.irs.gov/pub/irs-pdf/f1040s2.pdf
export class Schedule2 extends TaxForm {
  private calculationProvider: CalculationProvider
  private scheduleSE: ScheduleSE

  constructor(calculationProvider: CalculationProvider) {
    super()
    this.calculationProvider = calculationProvider
    this.scheduleSE = new ScheduleSE(calculationProvider)
    
    this.calculations = {
      line2: () => 0, // TODO: AMT form 6251
      line3: () => this.calculations.line2(),
      line4: () => this.scheduleSE.selfEmploymentTax,
      line11: () => new Form8959(this.calculationProvider).additionalMedicareTax(),
      line12: () => new Form8960(this.calculationProvider).netInvestmentIncomeTax(),
    }
  }

  get tax(): number {
    return this.calculations.line3() + this.calculations.line4()
  }

  get selfEmploymentTax(): number {
    return this.calculations.line4()
  }

  get otherTaxes(): number {
    return this.calculations.line11() + this.calculations.line12()
  }
}

