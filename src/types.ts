export type W2Income = {
  id: string
  name: string
  income: number
  withholding: number
}

export type OptionExercise = {
  id: string
  date: string
  amount: number
  withholding: number
}

export type QuarterlyData = {
  q1: number
  q2: number
  q3: number
  q4: number
}

export type InvestmentIncome = {
  taxFreeInterest: QuarterlyData
  taxableInterest: QuarterlyData
  qualifiedDividends: QuarterlyData
  nonQualifiedDividends: QuarterlyData
  longTermCapitalGains: QuarterlyData
  shortTermCapitalGains: QuarterlyData
}