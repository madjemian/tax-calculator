import { Form8959 } from './8959'
import { Form8960 } from './8960'
import { TaxForm } from './TaxForm'

export interface CalculationProvider {
  getMedicareWages(): number
  getAgi(): number
  getMagi(): number
  getTaxableInterest(): number
  getTotalDividends(): number
  getTotalCapitalGains(): number
}

// ADDITIONAL TAXES
// https://www.irs.gov/pub/irs-pdf/f1040s2.pdf
export class Schedule2 extends TaxForm {
  private calculationProvider: CalculationProvider

  constructor(calculationProvider: CalculationProvider) {
    super()
    this.calculationProvider = calculationProvider
    
    this.calculations = {
      line2: () => 0, // TODO: AMT form 6251
      line3: () => this.calculations.line2(),
      line11: () => new Form8959(this.calculationProvider.getMedicareWages()).additionalMedicareTax(),
      line12: () => new Form8960(
                      this.calculationProvider.getTaxableInterest(),
                      this.calculationProvider.getTotalDividends(),
                      this.calculationProvider.getTotalCapitalGains(),
                      this.calculationProvider.getMagi()
                    ).netInvestmentIncomeTax(),
    }
  }

  get tax(): number {
    return this.calculations.line3()
  }

  get otherTaxes(): number {
    return this.calculations.line11() + this.calculations.line12()
  }
}

