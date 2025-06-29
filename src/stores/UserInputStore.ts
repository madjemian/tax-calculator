import { makeAutoObservable } from 'mobx'

export type UserInputData = {
  salary1: number;
  salary2: number;
  optionExercise: number;
  hsaContribution: number;
  _401kContribution: number;
  _403bContribution: number;
  taxFreeInterest: number;
  taxableInterest: number;
  totalDividends: number;
  qualifiedDividends: number;
  longTermCapitalGains: number;
  shortTermCapitalGains: number;
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

  // investment income fields
  taxFreeInterest: number = 0
  taxableInterest: number = 0
  totalDividends: number = 0
  qualifiedDividends: number = 0
  longTermCapitalGains: number = 0
  shortTermCapitalGains: number = 0

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
      taxFreeInterest: this.taxFreeInterest,
      taxableInterest: this.taxableInterest,
      totalDividends: this.totalDividends,
      qualifiedDividends: this.qualifiedDividends,
      longTermCapitalGains: this.longTermCapitalGains,
      shortTermCapitalGains: this.shortTermCapitalGains,
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
      this.taxFreeInterest = data.taxFreeInterest
      this.taxableInterest = data.taxableInterest
      this.totalDividends = data.totalDividends
      this.qualifiedDividends = data.qualifiedDividends
      this.longTermCapitalGains = data.longTermCapitalGains
      this.shortTermCapitalGains = data.shortTermCapitalGains
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
}