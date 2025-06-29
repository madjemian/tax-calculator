import { makeAutoObservable } from 'mobx';
import type { UserInputStore } from '../stores/UserInputStore';
import { Schedule1Store } from './Schedule1';
import { ScheduleAStore } from './ScheduleA';
import { ScheduleDStore } from './ScheduleD';
import { Schedule2Store } from './Schedule2';
import { Schedule3Store } from './Schedule3';

// magic numbers for tax year 2025
export const STANDARD_DEDUCTION = 30000
export const ZERO_PERCENT_CAP_GAINS_LIMIT = 94050
export const FIFTEEN_PERCENT_CAP_GAINS_LIMIT = 583750
export const ADDITIONAL_MEDICARE_TAX_THRESHOLD = 250000
export const NIIT_THRESHOLD = 250000

// https://www.irs.gov/pub/irs-pdf/f1040.pdf
export class Form1040Store {
  // This class will represent the 1040 tax form

  private store: UserInputStore

  private schedule1Store: Schedule1Store
  private schedule2Store: Schedule2Store

  private scheduleAStore: ScheduleAStore
  private scheduleDStore: ScheduleDStore

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store

    this.schedule1Store = new Schedule1Store(store)
    this.schedule2Store = new Schedule2Store(store)

    this.scheduleAStore = new ScheduleAStore(store)
    this.scheduleDStore = new ScheduleDStore(store)

    makeAutoObservable(this)
  }

  get tax(): number {
    // 1a W2 box 1
    const line1a = this.store.totalW2Income - this.store.totalDeductions

    // other income lines not used yet
    const line1z = line1a

    // const line2a = this.store.taxFreeInterest
    const line2b = this.store.taxableInterest
    const line3a = this.store.qualifiedDividends
    const line3b = this.store.totalDividends

    // From Schedule D
    const line7 = Math.max(this.scheduleDStore.line16, -3000)

    // From Schedule 1
    const line8 = this.schedule1Store.additionalIncome
    const line10 = this.schedule1Store.incomeAdjustments

    // Total income
    const line9 = line1z + line2b + line3b + line7 + line8
    console.log('Total Income:', line9)

    // Adjusted Gross Income
    const line11 = line9 - line10

    // TODO Deduction from Schedule A
    const line12 = this.scheduleAStore.deduction

    // qualified business income deduction, 8995,8995-A
    const line13 = 0
    const line14 = line12 + line13

    // Taxable income
    const line15 = Math.max(line11 - line14, 0)


    // Qualified dividends and Capital Gains Tax Worksheet
    const line16 = new QualifiedDividendsAndCapitalGainsWorksheet(
      line15, line3a, this.scheduleDStore.line15, this.scheduleDStore.line16
    ).calculateTax()
    console.log('Qualified Dividends and Capital Gains Tax Worksheet:', line16)

    // // TODO Schedule 2 line 3
    const line17 = this.schedule2Store.tax
    console.log('Additional Taxes from Schedule 2:', line17)

    const line18 = line16 + line17

    // child tax credit
    const line19 = 0

    // // TODO schedule 3 line 8
    const line20 = new Schedule3Store(this.store).nonRefundableCredits
    console.log('Non-refundable credits from Schedule 3:', line20)

    const line21 = line19 + line20

    const line22 = line18 - line21

    // Schedule 2 line 21 other taxes
    const line23 = this.schedule2Store.otherTaxes
    console.log('Other Taxes from Schedule 2:', line23)

    // total tax
    const line24 = line22 + line23
    console.log('Total Tax:', line24)

    return Math.round(line24)
  }

  get payments(): number {
    const line25a = this.store.totalWithholding
    const line26 = this.store.totalEstimatedTaxPaid

    // total payments
    const line33 = line25a + line26

    return Math.round(line33)
  }

  get refund(): number {
    // total payments minus total tax
    const line34 = this.payments - this.tax
    // if negative, return 0
    return Math.max(line34, 0)
  }

  get owed(): number {
    // total tax minus total payments
    const line37 = this.tax - this.payments
    // if negative, return 0
    return Math.max(line37, 0)
  }
}

class QualifiedDividendsAndCapitalGainsWorksheet {
  // This class will represent the Qualified Dividends and Capital Gains Tax Worksheet
  // It will calculate the tax based on the taxable income and qualified dividends

  private taxableIncome: number
  private qualifiedDividends: number
  private longTermCapitalGains: number
  private totalCapitalGains: number

  constructor(taxableIncome: number, qualifiedDividends: number, longTermCapitalGains: number, totalCapitalGains: number) {
    this.taxableIncome = taxableIncome
    this.qualifiedDividends = qualifiedDividends
    this.longTermCapitalGains = longTermCapitalGains
    this.totalCapitalGains = totalCapitalGains
  }

  calculateTax(): number {
    const l1 = this.taxableIncome
    const l2 = this.qualifiedDividends
    const l3 = Math.min(this.longTermCapitalGains, this.totalCapitalGains)
    const l4 = l2 + l3
    const l5 = l1 - l4
    const l6 = ZERO_PERCENT_CAP_GAINS_LIMIT
    const l7 = Math.min(l1, l6)
    const l8 = Math.min(l5, l7)
    const l9 = l7 - l8 // 0% taxed
    const l10 = Math.min(l1, l4)
    const l11 = l9
    const l12 = l10 - l11
    const l13 = FIFTEEN_PERCENT_CAP_GAINS_LIMIT
    const l14 = Math.min(l1, l13)
    const l15 = l5+l9
    const l16 = Math.max(l14 - l15, 0)
    const l17 = Math.min(l12, l16)
    const l18 = l17 * 0.15
    const l19 = l9 + l17
    const l20 = l10 - l19
    const l21 = l20 * 0.20
    const l22 = this.taxLookup(l5)
    const l23 = l18 + l21 + l22
    const l24 = this.taxLookup(l1)
    const l25 = Math.min(l23, l24)
    return l25
  }

  // tax brackets
  // TODO FIND A BETTER WAY TO DO THIS
  taxLookup(amount: number): number {
    if (amount < 23850) {
      return amount * 0.1
    } else if (amount < 96950) {
      return (amount * .12) - 477
    } else if (amount < 206700) {
      return (amount * 0.22) - 10172
    } else if (amount < 394600) {
      return (amount * 0.24) - 14306
    } else if (amount < 501050) {
      return (amount * 0.32) - 45874
    } else if (amount < 751600) {
      return (amount * 0.35) - 60905.5
    } else {
      return (amount * 0.37) - 75937.5
    }
  }
}