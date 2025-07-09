import { NIIT_THRESHOLD } from './1040'
import { TaxForm } from './TaxForm'

export interface NetInvestmentIncomeTaxProvider {
  getTaxableInterest(): number
  getOrdinaryDividends(): number
  getNetCapitalGain(): number
  getModifiedAGI(): number
}

export class Form8960 extends TaxForm {
  // https://www.irs.gov/pub/irs-pdf/f8960.pdf

  private provider: NetInvestmentIncomeTaxProvider

  constructor(provider: NetInvestmentIncomeTaxProvider) {
    super()
    this.provider = provider

    this.calculations = {
      line1: () => this.provider.getTaxableInterest(),
      line2: () => this.provider.getOrdinaryDividends(),
      line5d: () => this.provider.getNetCapitalGain(),
      line8: () => this.calculations.line1() + this.calculations.line2() + this.calculations.line5d(), // total net investment income
      line12: () => this.calculations.line8(), // Net investment Income (NII)
      line13: () => this.provider.getModifiedAGI(), // Modified Adjusted Gross Income (MAGI)
      line14: () => NIIT_THRESHOLD,
      line15: () => Math.max(0, this.calculations.line13() - this.calculations.line14()), // Excess MAGI over threshold
      line16: () => Math.min(this.calculations.line12(), this.calculations.line15()), // Lesser of NII or excess MAGI
      line17: () => this.calculations.line16() * 0.038, // 3.8% tax
    }
  }

  // Add methods to calculate the tax based on user inputs
  netInvestmentIncomeTax(): number {
    return this.calculations.line17() // Total Net Investment Income Tax (NIIT)
  }
}