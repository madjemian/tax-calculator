import { UserInputStore } from '../stores/UserInputStore'
import { Form1040 } from './1040'

export const PERIODS = [
  { name: 'Jan 1 - Mar 31', months: 3, factor: 4, label: 'Q1' },
  { name: 'Jan 1 - May 31', months: 5, factor: 2.4, label: 'Q2' },
  { name: 'Jan 1 - Aug 31', months: 8, factor: 1.5, label: 'Q3' },
  { name: 'Jan 1 - Dec 31', months: 12, factor: 1, label: 'Q4' },
] as const

export const INSTALLMENT_RATIOS = [0.225, 0.45, 0.675, 0.90]

export interface ScheduleAICalculationResult {
  periodName: string
  periodW2: number
  periodBusinessProfit: number
  periodInvestment: number
  periodOptions: number
  periodRothConversions: number
  totalPeriodIncome: number
  annualizationFactor: number
  annualizedGross: number
  annualizedAGI: number
  annualizedTax: number
  cumulativeTarget: number
  withholdingDeemedPaid: number
  requiredPayment: number
}

/**
 * Calculates the required estimated tax payments for each period using the
 * Annualized Income Installment Method (Schedule AI).
 */
export function calculateScheduleAI(
  store: UserInputStore,
  targetPercentage: number
): ScheduleAICalculationResult[] {
  const results: ScheduleAICalculationResult[] = []
  let priorRequiredPayments = 0

  const totalQuarterlyW2 =
    store.w2IncomeQuarterly.q1 +
    store.w2IncomeQuarterly.q2 +
    store.w2IncomeQuarterly.q3 +
    store.w2IncomeQuarterly.q4

  const totalQuarterlyBusinessProfit =
    store.businessProfitQuarterly.q1 +
    store.businessProfitQuarterly.q2 +
    store.businessProfitQuarterly.q3 +
    store.businessProfitQuarterly.q4

  const totalQuarterlyWithholding =
    store.withholdingQuarterly.q1 +
    store.withholdingQuarterly.q2 +
    store.withholdingQuarterly.q3 +
    store.withholdingQuarterly.q4

  // Clone base data to avoid mutating original store during serialization
  const baseData = store.serialize()

  for (let i = 0; i < 4; i++) {
    const period = PERIODS[i]
    const installmentRatio = INSTALLMENT_RATIOS[i]

    // 1. Calculate Period Income
    
    // W2:
    let periodW2 = 0
    if (i === 0) periodW2 = store.w2IncomeQuarterly.q1
    else if (i === 1) periodW2 = store.w2IncomeQuarterly.q1 + (store.w2IncomeQuarterly.q2 * 2 / 3)
    else if (i === 2) periodW2 = store.w2IncomeQuarterly.q1 + store.w2IncomeQuarterly.q2 + (store.w2IncomeQuarterly.q3 * 2 / 3)
    else periodW2 = totalQuarterlyW2

    // Business Profit:
    let periodBusinessProfit = 0
    if (i === 0) periodBusinessProfit = store.businessProfitQuarterly.q1
    else if (i === 1) periodBusinessProfit = store.businessProfitQuarterly.q1 + (store.businessProfitQuarterly.q2 * 2 / 3)
    else if (i === 2) periodBusinessProfit = store.businessProfitQuarterly.q1 + store.businessProfitQuarterly.q2 + (store.businessProfitQuarterly.q3 * 2 / 3)
    else periodBusinessProfit = totalQuarterlyBusinessProfit

    // Calculate Withholding for the period
    let periodWithholding = 0
    if (i === 0) periodWithholding = store.withholdingQuarterly.q1
    else if (i === 1) periodWithholding = store.withholdingQuarterly.q1 + (store.withholdingQuarterly.q2 * 2 / 3)
    else if (i === 2) periodWithholding = store.withholdingQuarterly.q1 + store.withholdingQuarterly.q2 + (store.withholdingQuarterly.q3 * 2 / 3)
    else periodWithholding = totalQuarterlyWithholding

    // Investment Income:
    const getPeriodAmount = (qData: { q1: number; q2: number; q3: number; q4: number }) => {
      if (i === 0) return qData.q1
      if (i === 1) return qData.q1 + (qData.q2 * 2 / 3)
      if (i === 2) return qData.q1 + qData.q2 + (qData.q3 * 2 / 3)
      return qData.q1 + qData.q2 + qData.q3 + qData.q4
    }

    const periodTaxableInterest = getPeriodAmount(store.investmentIncome.taxableInterest)
    const periodQualifiedDividends = getPeriodAmount(store.investmentIncome.qualifiedDividends)
    const periodNonQualifiedDividends = getPeriodAmount(store.investmentIncome.nonQualifiedDividends)
    const periodLTG = getPeriodAmount(store.investmentIncome.longTermCapitalGains)
    const periodSTG = getPeriodAmount(store.investmentIncome.shortTermCapitalGains)
    const periodInvestment = periodTaxableInterest + periodQualifiedDividends + periodNonQualifiedDividends + periodLTG + periodSTG

    // Options:
    const periodOptions = store.optionExercises.filter(opt => {
      const parts = opt.date.split('-')
      if (parts.length < 2) return false
      const month = parseInt(parts[1], 10)
      if (isNaN(month)) return false
      if (i === 0) return month <= 3
      if (i === 1) return month <= 5
      if (i === 2) return month <= 8
      return true
    }).reduce((sum, opt) => sum + opt.amount, 0)

    // Roth Conversions:
    const periodRothConversions = (store.rothConversions || []).filter(conv => {
      const parts = conv.date.split('-')
      if (parts.length < 2) return false
      const month = parseInt(parts[1], 10)
      if (isNaN(month)) return false
      if (i === 0) return month <= 3
      if (i === 1) return month <= 5
      if (i === 2) return month <= 8
      return true
    }).reduce((sum, conv) => sum + conv.amount, 0)

    const totalPeriodIncome = periodW2 + periodBusinessProfit + periodInvestment + periodOptions + periodRothConversions

    // 2. Annualize
    const factor = period.factor
    const annualizedW2 = periodW2 * factor
    const annualizedBusinessProfit = periodBusinessProfit * factor
    const annualizedOptions = periodOptions * factor
    const annualizedRothConversions = periodRothConversions * factor
    
    // Create Mock Store
    const mockStore = new UserInputStore()
    
    // Copy Deductions (Assumed annual)
    mockStore.hsaContribution = baseData.hsaContribution
    mockStore._401kContribution = baseData._401kContribution
    mockStore._403bContribution = baseData._403bContribution
    mockStore.propertyTaxes = baseData.propertyTaxes
    mockStore.foreignTaxCredit = baseData.foreignTaxCredit

    // Set Annualized Income
    mockStore.w2Income = []
    mockStore.addW2Income('Annualized W2', annualizedW2)

    mockStore.businessIncome = []
    if (annualizedBusinessProfit !== 0) {
      mockStore.addBusinessIncome('Annualized Business', annualizedBusinessProfit, 0)
    }
    
    mockStore.optionExercises = []
    if (annualizedOptions > 0) {
      mockStore.addOptionExercise('2026-12-31', annualizedOptions)
    }

    mockStore.rothConversions = []
    if (annualizedRothConversions > 0) {
      mockStore.addRothConversion('Annualized Conversion', annualizedRothConversions, '2026-12-31')
    }

    // Set Annualized Investment Income
    mockStore.investmentIncome.taxableInterest.q1 = periodTaxableInterest * factor
    mockStore.investmentIncome.taxFreeInterest.q1 = getPeriodAmount(store.investmentIncome.taxFreeInterest) * factor
    mockStore.investmentIncome.qualifiedDividends.q1 = periodQualifiedDividends * factor
    mockStore.investmentIncome.nonQualifiedDividends.q1 = periodNonQualifiedDividends * factor
    mockStore.investmentIncome.longTermCapitalGains.q1 = periodLTG * factor
    mockStore.investmentIncome.shortTermCapitalGains.q1 = periodSTG * factor

    // Calculate Tax
    const form1040 = new Form1040(mockStore)
    const annualizedTax = form1040.tax
    const annualizedAGI = form1040.getAgi()
    
    // 3. Calculate Required Installment
    const targetAnnualPayment = annualizedTax * targetPercentage
    const cumulativeTarget = targetAnnualPayment * installmentRatio
    
    const withholdingDeemedPaid = periodWithholding
    
    const neededTotal = Math.max(0, cumulativeTarget - withholdingDeemedPaid)
    const requiredPayment = Math.max(0, neededTotal - priorRequiredPayments)
    
    const annualizedGross = totalPeriodIncome * factor

    results.push({
      periodName: period.name,
      periodW2,
      periodBusinessProfit,
      periodInvestment,
      periodOptions,
      periodRothConversions,
      totalPeriodIncome,
      annualizationFactor: factor,
      annualizedGross,
      annualizedAGI,
      annualizedTax,
      cumulativeTarget,
      withholdingDeemedPaid,
      requiredPayment
    })

    priorRequiredPayments += requiredPayment
  }

  return results
}
