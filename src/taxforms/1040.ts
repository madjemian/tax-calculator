import type { UserInputStore } from '../stores/UserInputStore'
import { Schedule1 } from './Schedule1'
import { ScheduleA, type DeductionProvider } from './ScheduleA'
import { ScheduleD, type CapitalGainsProvider } from './ScheduleD'
import { Schedule2, type CalculationProvider } from './Schedule2'
import { Schedule3, type CreditProvider } from './Schedule3'
import { TaxForm } from './TaxForm'
import { QualifiedDividendsAndCapitalGainsWorksheet, type QualifiedDividendsAndCapitalGainsProvider } from './QualifiedDividendsAndCapitalGainsWorksheet'

// magic numbers for tax year 2025
export const STANDARD_DEDUCTION = 30000
export const ZERO_PERCENT_CAP_GAINS_LIMIT = 96700
export const FIFTEEN_PERCENT_CAP_GAINS_LIMIT = 600050
export const ADDITIONAL_MEDICARE_TAX_THRESHOLD = 250000
export const NIIT_THRESHOLD = 250000
export const MAX_CAPITAL_LOSS_DEDUCTION = -3000

// Tax brackets for tax year 2025
export const TAX_BRACKETS = [
  { min: 0, max: 23850, rate: 0.10, offset: 0 },
  { min: 23850, max: 96950, rate: 0.12, offset: 477 },
  { min: 96950, max: 206700, rate: 0.22, offset: 10172 },
  { min: 206700, max: 394600, rate: 0.24, offset: 14306 },
  { min: 394600, max: 501050, rate: 0.32, offset: 45874 },
  { min: 501050, max: 751600, rate: 0.35, offset: 60905.5 },
  { min: 751600, max: Infinity, rate: 0.37, offset: 75937.5 }
]

// https://www.irs.gov/pub/irs-pdf/f1040.pdf
export class Form1040 extends TaxForm
        implements CalculationProvider,
                   CapitalGainsProvider,
                   DeductionProvider,
                   CreditProvider,
                   QualifiedDividendsAndCapitalGainsProvider {
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
    this.schedule2 = new Schedule2(this)
    this.schedule3 = new Schedule3(this)
    this.scheduleA = new ScheduleA(this)
    this.scheduleD = new ScheduleD(this)

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
      line16: () => new QualifiedDividendsAndCapitalGainsWorksheet(this).calculateTax(), // Qualified Dividends and Capital Gains Tax Worksheet
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

  // CalculationProvider implementation
  getMedicareWages(): number {
    return this.store.totalW2Income - this.store.hsaContribution
  }

  getAgi(): number {
    return this.calculations.line11()
  }

  getMagi(): number {
    return this.getAgi() + this.store.taxFreeInterest
  }

  getTaxableInterest(): number {
    return this.store.taxableInterest
  }

  getTotalDividends(): number {
    return this.store.totalDividends
  }

  getTotalCapitalGains(): number {
    return this.store.longTermCapitalGains + this.store.shortTermCapitalGains
  }

  // CapitalGainsProvider implementation
  getLongTermCapitalGains(): number {
    return this.store.longTermCapitalGains
  }

  getShortTermCapitalGains(): number {
    return this.store.shortTermCapitalGains
  }

  // DeductionProvider implementation
  getPropertyTaxes(): number {
    return this.store.propertyTaxes
  }

  // CreditProvider implementation
  getForeignTaxCredit(): number {
    return this.store.foreignTaxCredit
  }

  // QualifiedDividendsAndCapitalGainsProvider implementation
  getTaxableIncome(): number {
    return this.calculations.line15()
  }

  getQualifiedDividends(): number {
    return this.calculations.line3a()
  }
}