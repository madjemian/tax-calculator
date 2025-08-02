import { makeAutoObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import type { W2Income, OptionExercise } from '../types'

export type UserInputData = {
  w2Income: W2Income[]
  optionExercises: OptionExercise[]
  hsaContribution: number
  _401kContribution: number
  _403bContribution: number
  propertyTaxes: number
  taxFreeInterest: number
  taxableInterest: number
  totalDividends: number
  qualifiedDividends: number
  longTermCapitalGains: number
  shortTermCapitalGains: number
  withholding1: number
  withholding2: number
  taxPaidQ1: number
  taxPaidQ2: number
  taxPaidQ3: number
  taxPaidQ4: number
  optionExerciseWithholding: number
  foreignTaxCredit: number
}

export class UserInputStore implements UserInputData {
  // This class will handle user inputs for the tax calculator
  // It will manage the state of user inputs and provide methods to update them

  // W2 income fields
  w2Income: W2Income[] = []
  optionExercises: OptionExercise[] = []

  // income deduction fields
  hsaContribution: number = 0
  _401kContribution: number = 0
  _403bContribution: number = 0
  propertyTaxes: number = 0

  // investment income fields
  taxFreeInterest: number = 0
  taxableInterest: number = 0
  totalDividends: number = 0
  qualifiedDividends: number = 0
  longTermCapitalGains: number = 0
  shortTermCapitalGains: number = 0

  // taxes paid
  withholding1: number = 0
  withholding2: number = 0
  taxPaidQ1: number = 0
  taxPaidQ2: number = 0
  taxPaidQ3: number = 0
  taxPaidQ4: number = 0
  optionExerciseWithholding: number = 0
  foreignTaxCredit: number = 0

  constructor(initialData?: UserInputData) {
    // Initialize any necessary state or properties here
    makeAutoObservable(this)
    if (initialData) {
      this.deserialize(initialData)
    } else {
      // Initialize with default W2 entries if no data
      this.addW2Income('Matt', 0)
      this.addW2Income('Megan', 0)
    }
  }

  serialize(): UserInputData {
    return {
      w2Income: this.w2Income,
      optionExercises: this.optionExercises,
      hsaContribution: this.hsaContribution,
      _401kContribution: this._401kContribution,
      _403bContribution: this._403bContribution,
      propertyTaxes: this.propertyTaxes,
      taxFreeInterest: this.taxFreeInterest,
      taxableInterest: this.taxableInterest,
      totalDividends: this.totalDividends,
      qualifiedDividends: this.qualifiedDividends,
      longTermCapitalGains: this.longTermCapitalGains,
      shortTermCapitalGains: this.shortTermCapitalGains,
      withholding1: this.withholding1,
      withholding2: this.withholding2,
      taxPaidQ1: this.taxPaidQ1,
      taxPaidQ2: this.taxPaidQ2,
      taxPaidQ3: this.taxPaidQ3,
      taxPaidQ4: this.taxPaidQ4,
      optionExerciseWithholding: this.optionExerciseWithholding,
      foreignTaxCredit: this.foreignTaxCredit,
    }
  }

  deserialize(data: UserInputData) {
    if (data) {
      this.w2Income = data.w2Income || []
      this.optionExercises = data.optionExercises || []
      this.hsaContribution = data.hsaContribution
      this._401kContribution = data._401kContribution
      this._403bContribution = data._403bContribution
      this.propertyTaxes = data.propertyTaxes
      this.taxFreeInterest = data.taxFreeInterest
      this.taxableInterest = data.taxableInterest
      this.totalDividends = data.totalDividends
      this.qualifiedDividends = data.qualifiedDividends
      this.longTermCapitalGains = data.longTermCapitalGains
      this.shortTermCapitalGains = data.shortTermCapitalGains
      this.withholding1 = data.withholding1
      this.withholding2 = data.withholding2
      this.taxPaidQ1 = data.taxPaidQ1
      this.taxPaidQ2 = data.taxPaidQ2
      this.taxPaidQ3 = data.taxPaidQ3
      this.taxPaidQ4 = data.taxPaidQ4
      this.optionExerciseWithholding = data.optionExerciseWithholding
      this.foreignTaxCredit = data.foreignTaxCredit
    }
  }

  // Methods to update the state
  addW2Income(name: string = 'New W2', income: number = 0, withholding: number = 0) {
    const id = uuidv4()
    this.w2Income.push({ id, name, income, withholding })
  }

  updateW2Income(id: string, updates: Partial<Omit<W2Income, 'id'>>) {
    const w2 = this.w2Income.find(w => w.id === id)
    if (w2) {
      Object.assign(w2, updates)
    }
  }

  removeW2Income(id: string) {
    this.w2Income = this.w2Income.filter(w => w.id !== id)
  }

  addOptionExercise(date: string = new Date().toISOString().split('T')[0], amount: number = 0, withholding: number = 0) {
    const id = uuidv4()
    this.optionExercises.push({ id, date, amount, withholding })
  }

  updateOptionExercise(id: string, updates: Partial<Omit<OptionExercise, 'id'>>) {
    const option = this.optionExercises.find(o => o.id === id)
    if (option) {
      Object.assign(option, updates)
    }
  }

  removeOptionExercise(id: string) {
    this.optionExercises = this.optionExercises.filter(o => o.id !== id)
  }
  setHsaContribution(value: number) {
    this.hsaContribution = value
  }
  set401kContribution(value: number) {
    this._401kContribution = value
  }
  set403bContribution(value: number) {
    this._403bContribution = value
  }
  setTaxFreeInterest(value: number) {
    this.taxFreeInterest = value
  }
  setTaxableInterest(value: number) {
    this.taxableInterest = value
  }
  setTotalDividends(value: number) {
    this.totalDividends = value
  }
  setQualifiedDividends(value: number) {
    this.qualifiedDividends = value
  }
  setLongTermCapitalGains(value: number) {
    this.longTermCapitalGains = value
  }
  setShortTermCapitalGains(value: number) {
    this.shortTermCapitalGains = value
  }

  setWithholding1(value: number) {
    this.withholding1 = value
  }
  setWithholding2(value: number) {
    this.withholding2 = value
  }
  setTaxPaidQ1(value: number) {
    this.taxPaidQ1 = value
  }
  setTaxPaidQ2(value: number) {
    this.taxPaidQ2 = value
  }
  setTaxPaidQ3(value: number) {
    this.taxPaidQ3 = value
  }
  setTaxPaidQ4(value: number) {
    this.taxPaidQ4 = value
  }
  setOptionExerciseWithholding(value: number) {
    this.optionExerciseWithholding = value
  }
  setForeignTaxCredit(value: number) {
    this.foreignTaxCredit = value
  }

  // Computed properties for derived values
  get totalW2Income(): number {
    const w2Total = this.w2Income.reduce((sum, w2) => sum + w2.income, 0)
    const optionTotal = this.optionExercises.reduce((sum, option) => sum + option.amount, 0)
    return w2Total + optionTotal
  }

  get totalDeductions(): number {
    return this.hsaContribution + this._401kContribution + this._403bContribution
  }

  get totalW2Withholding(): number {
    return this.w2Income.reduce((sum, w2) => sum + w2.withholding, 0)
  }

  get totalOptionWithholding(): number {
    return this.optionExercises.reduce((sum, option) => sum + option.withholding, 0)
  }

  get totalWithholding(): number {
    return this.totalW2Withholding + this.totalOptionWithholding
  }

  get totalEstimatedTaxPaid(): number {
    return this.taxPaidQ1 + this.taxPaidQ2 + this.taxPaidQ3 + this.taxPaidQ4
  }

  get totalTaxCredit(): number {
    return this.foreignTaxCredit
  }

  get totalRealIncome(): number {
    return (
      this.totalW2Income +
      this.taxableInterest +
      this.totalDividends +
      this.longTermCapitalGains +
      this.shortTermCapitalGains +
      this.taxFreeInterest
    )
  }

}