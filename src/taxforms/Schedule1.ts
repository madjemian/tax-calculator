import { TaxForm } from './TaxForm'

// https://www.irs.gov/pub/irs-pdf/f1040s1.pdf
export class Schedule1 extends TaxForm {

  constructor() {
    super()
    this.calculations = {
      // business income, Schedule C
      line3: () => 0,
    }
  }

  get additionalIncome(): number {
    // TODO: Calculate additional income from Schedule 1
    // This includes things like unemployment compensation, prize winnings, etc.
    // For now, we will return 0
    return this.calculations.line3()
  }

  get incomeAdjustments(): number {
    // TODO: Calculate additional deductions from Schedule 1
    // This includes things like educator expenses, student loan interest, etc.
    // For now, we will return 0
    return 0
  }
}