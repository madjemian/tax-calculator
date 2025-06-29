import { NIIT_THRESHOLD } from './1040'

export class Form8960 {

  // https://www.irs.gov/pub/irs-pdf/f8960.pdf

  private taxableInterest: number
  private ordinaryDividends: number
  private netCapitalGain: number
  private modifiedAGI: number

  constructor(taxableInterest: number, ordinaryDividends: number, netCapitalGain: number, modifiedAGI: number) {
    // Initialize the form with user input data
    this.taxableInterest = taxableInterest
    this.ordinaryDividends = ordinaryDividends
    this.netCapitalGain = netCapitalGain
    this.modifiedAGI = modifiedAGI // Modified Adjusted Gross Income (MAGI) = AGI + tax-exempt interest
  }

  // Add methods to calculate the tax based on user inputs
  netInvestmentIncomeTax(): number {
    const l1 = this.taxableInterest
    const l2 = this.ordinaryDividends
    const l5d = this.netCapitalGain
    const l8 = l1 + l2 + l5d // total net investment income

    const l12 = l8 // Net investment Income (NII)
    const l13 = this.modifiedAGI // Modified Adjusted Gross Income (MAGI)
    const l14 = NIIT_THRESHOLD
    const l15 = Math.max(0, l13 - l14) // Excess MAGI over threshold
    const l16 = Math.min(l12, l15)
    const l17 = l16 * 0.038 // 3.8% tax on excess MAGI over threshold
    return l17 // Total Net Investment Income Tax (NIIT)
  }
}