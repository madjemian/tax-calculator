import { makeAutoObservable } from 'mobx'
import { v4 as uuidv4 } from 'uuid'
import type { W2Income, OptionExercise, InvestmentIncome, QuarterlyData, BusinessIncome, RothConversion } from '../types'
import { BackupService } from '../utils/BackupService'
import { CA_STANDARD_DEDUCTION } from '../taxforms/CaliforniaTax'

export type UserInputData = {
  w2Income: W2Income[]
  businessIncome: BusinessIncome[]
  optionExercises: OptionExercise[]
  rothConversions: RothConversion[]
  w2IncomeQuarterly?: QuarterlyData
  businessProfitQuarterly?: QuarterlyData
  withholdingQuarterly?: QuarterlyData
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

  // Work income fields
  w2Income: W2Income[] = []
  businessIncome: BusinessIncome[] = []
  optionExercises: OptionExercise[] = []
  rothConversions: RothConversion[] = []
  
  // W2 income quarterly distribution (for Schedule AI)
  w2IncomeQuarterly: QuarterlyData = { q1: 0, q2: 0, q3: 0, q4: 0 }

  // Business profit quarterly distribution (for Schedule AI)
  businessProfitQuarterly: QuarterlyData = { q1: 0, q2: 0, q3: 0, q4: 0 }
  
  // Withholding quarterly distribution (for Schedule AI)
  withholdingQuarterly: QuarterlyData = { q1: 0, q2: 0, q3: 0, q4: 0 }

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
      businessIncome: this.businessIncome,
      optionExercises: this.optionExercises,
      rothConversions: this.rothConversions,
      w2IncomeQuarterly: this.w2IncomeQuarterly,
      businessProfitQuarterly: this.businessProfitQuarterly,
      withholdingQuarterly: this.withholdingQuarterly,
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
      this.businessIncome = data.businessIncome || []
      this.optionExercises = data.optionExercises || []
      this.rothConversions = data.rothConversions || []
      this.w2IncomeQuarterly = data.w2IncomeQuarterly || { q1: 0, q2: 0, q3: 0, q4: 0 }
      this.businessProfitQuarterly = data.businessProfitQuarterly || { q1: 0, q2: 0, q3: 0, q4: 0 }
      this.withholdingQuarterly = data.withholdingQuarterly || { q1: 0, q2: 0, q3: 0, q4: 0 }
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

  addBusinessIncome(name: string = 'New 1099', income: number = 0, expenses: number = 0) {
    const id = uuidv4()
    this.businessIncome.push({ id, name, income, expenses })
  }

  updateBusinessIncome(id: string, updates: Partial<Omit<BusinessIncome, 'id'>>) {
    const business = this.businessIncome.find(b => b.id === id)
    if (business) {
      Object.assign(business, updates)
    }
  }

  removeBusinessIncome(id: string) {
    this.businessIncome = this.businessIncome.filter(b => b.id !== id)
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

  addRothConversion(name: string = 'Roth Conversion', amount: number = 0, date: string = new Date().toISOString().split('T')[0], withholding: number = 0, caTaxablePercent: number = 0) {
    const id = uuidv4()
    this.rothConversions.push({ id, name, date, amount, withholding, caTaxablePercent })
  }

  updateRothConversion(id: string, updates: Partial<Omit<RothConversion, 'id'>>) {
    const conversion = this.rothConversions.find(r => r.id === id)
    if (conversion) {
      Object.assign(conversion, updates)
    }
  }

  removeRothConversion(id: string) {
    this.rothConversions = this.rothConversions.filter(r => r.id !== id)
  }

  updateW2IncomeQuarterly(quarter: keyof QuarterlyData, value: number) {
    this.w2IncomeQuarterly[quarter] = value
  }

  updateBusinessProfitQuarterly(quarter: keyof QuarterlyData, value: number) {
    this.businessProfitQuarterly[quarter] = value
  }

  updateWithholdingQuarterly(quarter: keyof QuarterlyData, value: number) {
    this.withholdingQuarterly[quarter] = value
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

  get totalBusinessProfit(): number {
    return this.businessIncome.reduce((sum, b) => sum + (b.income - b.expenses), 0)
  }

  get totalOptionWithholding(): number {
    return this.optionExercises.reduce((sum, option) => sum + option.withholding, 0)
  }

  get totalRothConversions(): number {
    return this.rothConversions.reduce((sum, r) => sum + r.amount, 0)
  }

  get totalRothConversionWithholding(): number {
    return this.rothConversions.reduce((sum, r) => sum + r.withholding, 0)
  }

  get totalWithholding(): number {
    return this.totalW2Withholding + this.totalOptionWithholding + this.totalRothConversionWithholding
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
      this.totalBusinessProfit +
      this.totalRothConversions +
      this.taxableInterest +
      this.totalDividends +
      this.longTermCapitalGains +
      this.shortTermCapitalGains +
      this.taxFreeInterest
    )
  }

  // California pre-tax deductions (401k and 403b are allowed; HSA is NOT deductible in CA)
  get totalCAPreTaxDeductions(): number {
    return this._401kContribution + this._403bContribution
  }

  // California standard deduction or itemized deductions (property taxes without federal SALT cap)
  get totalCADeductions(): number {
    return Math.max(this.propertyTaxes, CA_STANDARD_DEDUCTION)
  }

  // Worldwide AGI for California tax purposes (includes out-of-state tax-free interest as CA taxable)
  get totalCAWorldwideAGI(): number {
    const netW2 = Math.max(this.totalW2Income - this.totalCAPreTaxDeductions, 0)
    return (
      netW2 +
      this.totalBusinessProfit +
      this.totalRothConversions +
      this.taxableInterest +
      this.totalDividends +
      this.longTermCapitalGains +
      this.shortTermCapitalGains +
      this.taxFreeInterest
    )
  }

  // California tax calculations
  get totalCATaxableW2Income(): number {
    const totalW2 = this.w2Income.reduce((sum, w2) => sum + w2.income, 0)
    if (totalW2 === 0) return 0

    // Net W2 after CA pre-tax deductions (401k/403b)
    const netW2Total = Math.max(totalW2 - this.totalCAPreTaxDeductions, 0)

    return this.w2Income.reduce((sum, w2) => {
      const daysInCA = w2.daysInCA ?? 0
      const caPercentage = daysInCA / 365
      const w2Share = w2.income / totalW2
      const netW2Entry = netW2Total * w2Share
      return sum + (netW2Entry * caPercentage)
    }, 0)
  }

  get totalCATaxableOptionIncome(): number {
    return this.optionExercises.reduce((sum, option) => {
      const caPercent = (option.caTaxablePercent ?? 0) / 100
      return sum + (option.amount * caPercent)
    }, 0)
  }

  get totalCATaxableRothConversionIncome(): number {
    return this.rothConversions.reduce((sum, conv) => {
      const caPercent = (conv.caTaxablePercent ?? 0) / 100
      return sum + (conv.amount * caPercent)
    }, 0)
  }

  // CA Source AGI
  get totalCATaxableIncome(): number {
    return (
      this.totalCATaxableW2Income +
      this.totalCATaxableOptionIncome +
      this.totalCATaxableRothConversionIncome
    )
  }

  // Total taxable income base subject to CA tax bracket calculation (Worldwide AGI - CA Deductions)
  get totalCACalculationBase(): number {
    return Math.max(this.totalCAWorldwideAGI - this.totalCADeductions, 0)
  }

  // CA Apportionment Ratio (CA Source AGI / Worldwide AGI)
  get caTaxableRatio(): number {
    const worldwideAGI = this.totalCAWorldwideAGI
    if (worldwideAGI <= 0) return 0
    return Math.min(this.totalCATaxableIncome / worldwideAGI, 1.0)
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