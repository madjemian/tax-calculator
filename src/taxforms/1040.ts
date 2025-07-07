import type { UserInputStore } from '../stores/UserInputStore'
import { Schedule1 } from './Schedule1'
import { ScheduleA } from './ScheduleA'
import { ScheduleD } from './ScheduleD'
import { Schedule2 } from './Schedule2'
import { Schedule3 } from './Schedule3'
import { TaxForm } from './TaxForm'

// magic numbers for tax year 2025
export const STANDARD_DEDUCTION = 30000
export const ZERO_PERCENT_CAP_GAINS_LIMIT = 96700
export const FIFTEEN_PERCENT_CAP_GAINS_LIMIT = 600050
export const ADDITIONAL_MEDICARE_TAX_THRESHOLD = 250000
export const NIIT_THRESHOLD = 250000
export const MAX_CAPITAL_LOSS_DEDUCTION = -3000

// https://www.irs.gov/pub/irs-pdf/f1040.pdf
export class Form1040 extends TaxForm {
  // This class will represent the 1040 tax form

  private store: UserInputStore

  private schedule1: Schedule1
  private schedule2: Schedule2
  private schedule3: Schedule3
  private scheduleA: ScheduleA
  private scheduleD: ScheduleD

  constructor(store: UserInputStore) {
    super()
    this.store = store
    this.schedule1 = new Schedule1()
    this.schedule2 = new Schedule2(store)
    this.schedule3 = new Schedule3(store)
    this.scheduleA = new ScheduleA(store)
    this.scheduleD = new ScheduleD(store)

    this.calculations = {
      line1a: () => this.store.totalW2Income - this.store.totalDeductions, // W2 box 1
      line1z: () => this.calculations.line1a(),
      line2a: () => this.store.taxFreeInterest, // not used yet
      line2b: () => this.store.taxableInterest,
      line3a: () => this.store.qualifiedDividends,
      line3b: () => this.store.totalDividends,
      line7: () => Math.max(this.scheduleD.line16, MAX_CAPITAL_LOSS_DEDUCTION), // From Schedule D
      line8: () => this.schedule1.additionalIncome, // From Schedule 1
      line10: () => this.schedule1.incomeAdjustments, // From Schedule 1
      line9: () => this.calculations.line1z() + this.calculations.line2b() + this.calculations.line3b() + this.calculations.line7() + this.calculations.line8(), // Total income
      line11: () => this.calculations.line9() - this.calculations.line10(), // Adjusted Gross Income
      line12: () => this.scheduleA.deduction, // Deduction from Schedule A
      line13: () => 0, // qualified business income deduction, 8995,8995-A
      line14: () => this.calculations.line12() + this.calculations.line13(), // Total deduction
      line15: () => Math.max(this.calculations.line11() - this.calculations.line14(), 0), // Taxable Income
      line16: () => new QualifiedDividendsAndCapitalGainsWorksheet(
                      this.calculations.line15(),
                      this.calculations.line3a(),
                      this.scheduleD.line15,
                      this.scheduleD.line16
                    ).calculateTax(), // Qualified Dividends and Capital Gains Tax Worksheet
      line17: () => this.schedule2.tax, // Additional Taxes from Schedule 2
      line18: () => this.calculations.line16() + this.calculations.line17(), // Total Tax
      line19: () => 0, // child tax credit
      line20: () => this.schedule3.nonRefundableCredits, // Non-refundable credits from Schedule 3
      line21: () => this.calculations.line19() + this.calculations.line20(), // Total credits
      line22: () => this.calculations.line18() - this.calculations.line21(), // Total tax after credits
      line23: () => this.schedule2.otherTaxes, // Other Taxes from Schedule 2
      line24: () => this.calculations.line22() + this.calculations.line23(), // Total Tax
      line25a: () => this.store.totalWithholding, // Total withholding from W2
      line26: () => this.store.totalEstimatedTaxPaid, // Total estimated tax paid
      line33: () => this.calculations.line25a() + this.calculations.line26(), // Total payments
      line34: () => Math.round(Math.max(this.calculations.line33() - this.calculations.line24(), 0)), // Refund
      line37: () => Math.round(Math.max(this.calculations.line24() - this.calculations.line33(), 0)) // Amount owed
    }
  }

  get tax(): number {
    // Total income
    console.log('Total Income:', this.calculations.line9())

    // Qualified dividends and Capital Gains Tax Worksheet
    console.log('Qualified Dividends and Capital Gains Tax Worksheet:', this.calculations.line16())

    // TODO Schedule 2 line 3
    console.log('Additional Taxes from Schedule 2:', this.calculations.line17())

    // // TODO schedule 3 line 8
    console.log('Non-refundable credits from Schedule 3:', this.calculations.line20())

    // Schedule 2 line 21 other taxes
    console.log('Other Taxes from Schedule 2:', this.calculations.line23())

    // total tax
    console.log('Total Tax:', this.calculations.line24())

    return Math.round(this.calculations.line24())
  }

  get payments(): number {
    return Math.round(this.calculations.line33())
  }

  get refund(): number {
    // if negative, return 0
    return Math.max(this.calculations.line34(), 0)
  }

  get owed(): number {
    // if negative, return 0
    return Math.max(this.calculations.line37(), 0)
  }
}

class QualifiedDividendsAndCapitalGainsWorksheet extends TaxForm {
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
      line3: () => Math.min(this.longTermCapitalGains, this.totalCapitalGains),
      line4: () => this.calculations.line2() + this.calculations.line3(),
      line5: () => this.calculations.line1() - this.calculations.line4(),
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

  // tax brackets
  // TODO FIND A BETTER WAY TO DO THIS
  taxLookup(amount: number): number {
    if (amount <= 23850) {
      return amount * 0.1
    } else if (amount <= 96950) {
      return (amount * .12) - 477
    } else if (amount <= 206700) {
      return (amount * 0.22) - 10172
    } else if (amount <= 394600) {
      return (amount * 0.24) - 14306
    } else if (amount <= 501050) {
      return (amount * 0.32) - 45874
    } else if (amount <= 751600) {
      return (amount * 0.35) - 60905.5
    } else {
      return (amount * 0.37) - 75937.5
    }
  }
}