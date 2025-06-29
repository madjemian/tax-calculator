import { makeAutoObservable } from 'mobx'
import type { UserInputStore } from '../stores/UserInputStore'

// https://www.irs.gov/pub/irs-pdf/f1040s1.pdf
export class Schedule1Store {
  // This class will represent the Schedule 1 tax form
  private store: UserInputStore

  constructor(store: UserInputStore) {
    // Initialize the form with user input data
    this.store = store
    makeAutoObservable(this)
  }

  get additionalIncome(): number {
    // TODO: Calculate additional income from Schedule 1
    // This includes things like unemployment compensation, prize winnings, etc.
    // For now, we will return 0

    // business income, Schedule C
    const line3 = 0

    // line 10
    return line3
  }

  get incomeAdjustments(): number {
    // TODO: Calculate additional deductions from Schedule 1
    // This includes things like educator expenses, student loan interest, etc.
    // For now, we will return 0
    return 0
  }
}