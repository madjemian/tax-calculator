import type { UserInputStore } from '../stores/UserInputStore'
import { Schedule1 } from './Schedule1'
import { ScheduleA } from './ScheduleA'
import { ScheduleD } from './ScheduleD'
import { Schedule2 } from './Schedule2'
import { Schedule3 } from './Schedule3'
import { TaxForm } from './TaxForm'
import { QualifiedDividendsAndCapitalGainsWorksheet } from './QualifiedDividendsAndCapitalGainsWorksheet'

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
    this.schedule2 = new Schedule2(
      store.totalW2Income,
      store.hsaContribution,
      store.taxableInterest,
      store.totalDividends,
      store.totalDeductions,
      store.taxFreeInterest,
      store.longTermCapitalGains,
      store.shortTermCapitalGains
    )
    this.schedule3 = new Schedule3(store.foreignTaxCredit)
    this.scheduleA = new ScheduleA(store.propertyTaxes)
    this.scheduleD = new ScheduleD(store.longTermCapitalGains, store.shortTermCapitalGains)

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