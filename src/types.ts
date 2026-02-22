export type W2Income = {
  id: string
  name: string
  income: number
  withholding: number
  daysInCA?: number // Days worked in California (out of 365)
}

export type BusinessIncome = {
  id: string
  name: string
  income: number
  expenses: number
}

export type OptionExercise = {
  id: string
  date: string
  amount: number
  withholding: number
  caTaxablePercent?: number // Percentage of option exercise that is CA taxable (0-100)
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