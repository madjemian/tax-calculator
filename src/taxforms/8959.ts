import { ADDITIONAL_MEDICARE_TAX_THRESHOLD } from './1040'
import { TaxForm } from './TaxForm'

export interface AdditionalMedicareTaxProvider {
  getMedicareWages(): number
  getSelfEmploymentIncome(): number
}

export class Form8959 extends TaxForm {
  private provider: AdditionalMedicareTaxProvider

  constructor(provider: AdditionalMedicareTaxProvider) {
    super()
    this.provider = provider

    this.calculations = {
      // Part I: Additional Medicare Tax on Wages
      line4: () => this.provider.getMedicareWages(),
      line5: () => ADDITIONAL_MEDICARE_TAX_THRESHOLD,
      line6: () => Math.max(0, this.calculations.line4() - this.calculations.line5()), // excess wages over threshold
      line7: () => this.calculations.line6() * 0.009, // 0.9% tax on excess wages
      
      // Part II: Additional Medicare Tax on Self-Employment Income
      line9: () => this.provider.getSelfEmploymentIncome(),
      line10: () => ADDITIONAL_MEDICARE_TAX_THRESHOLD,
      line11: () => this.calculations.line4(),
      line12: () => Math.max(0, this.calculations.line10() - this.calculations.line11()),
      line13: () => Math.max(0, this.calculations.line9() - this.calculations.line12()),
      line14: () => this.calculations.line13() * 0.009,

      line18: () => this.calculations.line7() + this.calculations.line14(), // total additional medicare tax
    }
  }

  additionalMedicareTax(): number {
    return this.calculations.line18()
  }
}