import { makeAutoObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import type { W2Income, OptionExercise, InvestmentIncome, QuarterlyData } from '../types'
import { BackupService } from '../utils/BackupService'

export type UserInputData = {
  w2Income: W2Income[]
  optionExercises: OptionExercise[]
  investmentIncome: InvestmentIncome
  hsaContribution: number
  _401kContribution: number
  _403bContribution: number
  propertyTaxes: number
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

  // Investment income fields (quarterly)
  investmentIncome: InvestmentIncome = {
    taxFreeInterest: { q1: 0, q2: 0, q3: 0, q4: 0 },
    taxableInterest: { q1: 0, q2: 0, q3: 0, q4: 0 },
    qualifiedDividends: { q1: 0, q2: 0, q3: 0, q4: 0 },
    nonQualifiedDividends: { q1: 0, q2: 0, q3: 0, q4: 0 },
    longTermCapitalGains: { q1: 0, q2: 0, q3: 0, q4: 0 },
    shortTermCapitalGains: { q1: 0, q2: 0, q3: 0, q4: 0 },
  }

  // income deduction fields
  hsaContribution: number = 0
  _401kContribution: number = 0
  _403bContribution: number = 0
  propertyTaxes: number = 0

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
      investmentIncome: this.investmentIncome,
      hsaContribution: this.hsaContribution,
      _401kContribution: this._401kContribution,
      _403bContribution: this._403bContribution,
      propertyTaxes: this.propertyTaxes,
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
      this.investmentIncome = {
        taxFreeInterest: data.investmentIncome?.taxFreeInterest || { q1: 0, q2: 0, q3: 0, q4: 0 },
        taxableInterest: data.investmentIncome?.taxableInterest || { q1: 0, q2: 0, q3: 0, q4: 0 },
        qualifiedDividends: data.investmentIncome?.qualifiedDividends || { q1: 0, q2: 0, q3: 0, q4: 0 },
        nonQualifiedDividends: data.investmentIncome?.nonQualifiedDividends || { q1: 0, q2: 0, q3: 0, q4: 0 },
        longTermCapitalGains: data.investmentIncome?.longTermCapitalGains || { q1: 0, q2: 0, q3: 0, q4: 0 },
        shortTermCapitalGains: data.investmentIncome?.shortTermCapitalGains || { q1: 0, q2: 0, q3: 0, q4: 0 },
      }
      this.hsaContribution = data.hsaContribution
      this._401kContribution = data._401kContribution
      this._403bContribution = data._403bContribution
      this.propertyTaxes = data.propertyTaxes
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
  addW2Income(name: string = 'New W2', income: number = 0, withholding: number = 0, daysInCA?: number) {
    const id = uuidv4()
    this.w2Income.push({ id, name, income, withholding, daysInCA })
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

  addOptionExercise(date: string = new Date().toISOString().split('T')[0], amount: number = 0, withholding: number = 0, caTaxablePercent?: number) {
    const id = uuidv4()
    this.optionExercises.push({ id, date, amount, withholding, caTaxablePercent })
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

  updateInvestmentIncome(category: keyof InvestmentIncome, quarter: keyof QuarterlyData, value: number) {
    this.investmentIncome[category][quarter] = value
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

  // Helper method to sum quarterly data
  private sumQuarterly(data: QuarterlyData): number {
    return (data?.q1 ?? 0) + (data?.q2 ?? 0) + (data?.q3 ?? 0) + (data?.q4 ?? 0)
  }

  // Computed properties for derived values
  get totalW2Income(): number {
    const w2Total = this.w2Income.reduce((sum, w2) => sum + w2.income, 0)
    const optionTotal = this.optionExercises.reduce((sum, option) => sum + option.amount, 0)
    return w2Total + optionTotal
  }

  // Individual investment income totals
  get taxFreeInterest(): number {
    return this.sumQuarterly(this.investmentIncome.taxFreeInterest)
  }

  get taxableInterest(): number {
    return this.sumQuarterly(this.investmentIncome.taxableInterest)
  }

  get qualifiedDividends(): number {
    return this.sumQuarterly(this.investmentIncome.qualifiedDividends)
  }

  get nonQualifiedDividends(): number {
    return this.sumQuarterly(this.investmentIncome.nonQualifiedDividends)
  }

  get totalDividends(): number {
    return this.qualifiedDividends + this.nonQualifiedDividends
  }

  get longTermCapitalGains(): number {
    return this.sumQuarterly(this.investmentIncome.longTermCapitalGains)
  }

  get shortTermCapitalGains(): number {
    return this.sumQuarterly(this.investmentIncome.shortTermCapitalGains)
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

  // California tax calculations
  get totalCATaxableW2Income(): number {
    return this.w2Income.reduce((sum, w2) => {
      const daysInCA = w2.daysInCA ?? 0
      const caPercentage = daysInCA / 365
      return sum + (w2.income * caPercentage)
    }, 0)
  }

  get totalCATaxableOptionIncome(): number {
    return this.optionExercises.reduce((sum, option) => {
      const caPercent = (option.caTaxablePercent ?? 0) / 100
      return sum + (option.amount * caPercent)
    }, 0)
  }

  get totalCATaxableIncome(): number {
    return this.totalCATaxableW2Income + this.totalCATaxableOptionIncome
  }

  // Total income subject to CA tax calculation (W2 + options - deductions)
  get totalCACalculationBase(): number {
    return this.totalW2Income - this.totalDeductions
  }

  // Weighted ratio of CA taxable portion
  get caTaxableRatio(): number {
    if (this.totalW2Income === 0) return 0
    return this.totalCATaxableIncome / this.totalW2Income
  }

  exportBackup() {
    const userData = this.serialize()
    BackupService.exportToFile(userData)
  }

  async importBackup(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await BackupService.importFromFile()

      if (!result.success) {
        return { success: false, message: result.error || 'Failed to import backup' }
      }

      if (result.data) {
        BackupService.exportToFile(this.serialize())

        this.deserialize(result.data)

        let message = 'Backup restored successfully!'
        if (result.warnings && result.warnings.length > 0) {
          message += `\n\nWarnings:\n${result.warnings.join('\n')}`
        }

        return { success: true, message }
      }

      return { success: false, message: 'No data found in backup file' }
    } catch (error) {
      return {
        success: false,
        message: `Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

}