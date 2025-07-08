import { Form8959 } from './8959'
import { Form8960 } from './8960'
import { TaxForm } from './TaxForm'

// ADDITIONAL TAXES
// https://www.irs.gov/pub/irs-pdf/f1040s2.pdf
export class Schedule2 extends TaxForm {
  private totalW2Income: number
  private hsaContribution: number
  private taxableInterest: number
  private totalDividends: number
  private totalDeductions: number
  private taxFreeInterest: number
  private longTermCapitalGains: number
  private shortTermCapitalGains: number

  constructor(
    totalW2Income: number,
    hsaContribution: number,
    taxableInterest: number,
    totalDividends: number,
    totalDeductions: number,
    taxFreeInterest: number,
    longTermCapitalGains: number,
    shortTermCapitalGains: number
  ) {
    super()
    this.totalW2Income = totalW2Income
    this.hsaContribution = hsaContribution
    this.taxableInterest = taxableInterest
    this.totalDividends = totalDividends
    this.totalDeductions = totalDeductions
    this.taxFreeInterest = taxFreeInterest
    this.longTermCapitalGains = longTermCapitalGains
    this.shortTermCapitalGains = shortTermCapitalGains
    
    this.calculations = {
      line2: () => 0, // TODO: AMT form 6251
      line3: () => this.calculations.line2(),
      // medicare wages from W2 box 5
      medicareWages: () => this.totalW2Income - this.hsaContribution,
      line11: () => new Form8959(this.calculations.medicareWages()).additionalMedicareTax(),
      agi: () => this.totalW2Income + this.taxableInterest + this.totalDividends - this.totalDeductions,
      magi: () => this.calculations.agi() + this.taxFreeInterest, // Modified Adjusted Gross Income (MAGI) = AGI + tax-exempt interest
      line12: () => new Form8960(
                      this.taxableInterest,
                      this.totalDividends,
                      this.longTermCapitalGains + this.shortTermCapitalGains,
                      this.calculations.magi()
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

