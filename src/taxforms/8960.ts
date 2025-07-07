import { NIIT_THRESHOLD } from './1040'
import { TaxForm } from './TaxForm'

export class Form8960 extends TaxForm {

  // https://www.irs.gov/pub/irs-pdf/f8960.pdf

  private taxableInterest: number
  private ordinaryDividends: number
  private netCapitalGain: number
  private modifiedAGI: number

  constructor(taxableInterest: number, ordinaryDividends: number, netCapitalGain: number, modifiedAGI: number) {
    super()
    // Initialize the form with user input data
    this.taxableInterest = taxableInterest
    this.ordinaryDividends = ordinaryDividends
    this.netCapitalGain = netCapitalGain
    this.modifiedAGI = modifiedAGI // Modified Adjusted Gross Income (MAGI) = AGI + tax-exempt interest

    this.calculations = {
      line1: () => this.taxableInterest,
      line2: () => this.ordinaryDividends,
      line5d: () => this.netCapitalGain,
      line8: () => this.calculations.line1() + this.calculations.line2() + this.calculations.line5d(), // total net investment income
      line12: () => this.calculations.line8(), // Net investment Income (NII)
      line13: () => this.modifiedAGI, // Modified Adjusted Gross Income (MAGI)
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