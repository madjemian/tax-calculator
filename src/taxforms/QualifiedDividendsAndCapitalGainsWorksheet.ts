import { FIFTEEN_PERCENT_CAP_GAINS_LIMIT, ZERO_PERCENT_CAP_GAINS_LIMIT, TAX_BRACKETS } from './1040'
import { TaxForm } from './TaxForm'

export class QualifiedDividendsAndCapitalGainsWorksheet extends TaxForm {
  // This class will represent the Qualified Dividends and Capital Gains Tax Worksheet
  // It will calculate the tax based on the taxable income and qualified dividends

  private taxableIncome: number
  private qualifiedDividends: number
  private longTermCapitalGains: number
  private totalCapitalGains: number

  constructor(taxableIncome: number, qualifiedDividends: number, longTermCapitalGains: number, totalCapitalGains: number) {
    super()
    this.taxableIncome = taxableIncome
    this.qualifiedDividends = qualifiedDividends
    this.longTermCapitalGains = longTermCapitalGains
    this.totalCapitalGains = totalCapitalGains

    this.calculations = {
      line1: () => this.taxableIncome,
      line2: () => this.qualifiedDividends,
      line3: () => Math.max(Math.min(this.longTermCapitalGains, this.totalCapitalGains), 0),
      line4: () => this.calculations.line2() + this.calculations.line3(),
      line5: () => Math.max(this.calculations.line1() - this.calculations.line4(), 0),
      line6: () => ZERO_PERCENT_CAP_GAINS_LIMIT,
      line7: () => Math.min(this.calculations.line1(), this.calculations.line6()),
      line8: () => Math.min(this.calculations.line5(), this.calculations.line7()),
      line9: () => this.calculations.line7() - this.calculations.line8(), // 0% taxed
      line10: () => Math.min(this.calculations.line1(), this.calculations.line4()),
      line11: () => this.calculations.line9(),
      line12: () => this.calculations.line10() - this.calculations.line11(),
      line13: () => FIFTEEN_PERCENT_CAP_GAINS_LIMIT,
      line14: () => Math.min(this.calculations.line1(), this.calculations.line13()),
      line15: () => this.calculations.line5() + this.calculations.line9(),
      line16: () => Math.max(this.calculations.line14() - this.calculations.line15(), 0),
      line17: () => Math.min(this.calculations.line12(), this.calculations.line16()),
      line18: () => this.calculations.line17() * 0.15,
      line19: () => this.calculations.line9() + this.calculations.line17(),
      line20: () => this.calculations.line10() - this.calculations.line19(),
      line21: () => this.calculations.line20() * 0.20,
      line22: () => this.taxLookup(this.calculations.line5()),
      line23: () => this.calculations.line18() + this.calculations.line21() + this.calculations.line22(),
      line24: () => this.taxLookup(this.calculations.line1()),
      line25: () => Math.min(this.calculations.line23(), this.calculations.line24())
    }
  }

  calculateTax(): number {
    // Return the final tax amount
    return this.calculations.line25()
  }

  taxLookup(amount: number): number {
    for (const bracket of TAX_BRACKETS) {
      if (amount <= bracket.max) {
        return (amount * bracket.rate) - bracket.offset
      }
    }
    throw new Error(`Unable to find tax bracket for amount: ${amount}`)
  }
}