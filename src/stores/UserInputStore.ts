import { makeAutoObservable } from 'mobx'

export type UserInputData = {
  salary1: number
  salary2: number
  optionExercise: number
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
  salary1: number = 0
  salary2: number = 0
  optionExercise: number = 0

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
    }
  }

  serialize(): UserInputData {
    return {
      salary1: this.salary1,
      salary2: this.salary2,
      optionExercise: this.optionExercise,
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
      this.salary1 = data.salary1
      this.salary2 = data.salary2
      this.optionExercise = data.optionExercise
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
  setSalary1(value: number) {
    this.salary1 = value
  }
  setSalary2(value: number) {
    this.salary2 = value
  }
  setOptionExercise(value: number) {
    this.optionExercise = value
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
    return this.salary1 + this.salary2 + this.optionExercise
  }

  get totalDeductions(): number {
    return this.hsaContribution + this._401kContribution + this._403bContribution
  }

  get totalWithholding(): number {
    return this.withholding1 + this.withholding2 + this.optionExerciseWithholding
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