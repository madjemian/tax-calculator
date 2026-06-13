import { UserInputStore } from '../../stores/UserInputStore'
import { calculateScheduleAI } from '../ScheduleAI'

describe('calculateScheduleAI', () => {
  let store: UserInputStore

  beforeEach(() => {
    store = new UserInputStore()
    // Clear initial W2 entries added by default constructor for pure test control
    store.w2Income = []
  })

  it('should return zero required payments if there is no income', () => {
    const results = calculateScheduleAI(store, 0.9)
    expect(results).toHaveLength(4)
    results.forEach((row) => {
      expect(row.requiredPayment).toBe(0)
    })
  })

  it('should calculate even quarterly payments for even quarterly W2 income', () => {
    // Add W2 Income
    store.addW2Income('Matt', 120000)
    
    // Distribute evenly
    store.updateW2IncomeQuarterly('q1', 30000)
    store.updateW2IncomeQuarterly('q2', 30000)
    store.updateW2IncomeQuarterly('q3', 30000)
    store.updateW2IncomeQuarterly('q4', 30000)

    // Withholding distributed evenly
    store.updateWithholdingQuarterly('q1', 2500)
    store.updateWithholdingQuarterly('q2', 2500)
    store.updateWithholdingQuarterly('q3', 2500)
    store.updateWithholdingQuarterly('q4', 2500)
    
    // Set matching W2 withholding in the list
    store.w2Income[0].withholding = 10000

    const results = calculateScheduleAI(store, 0.9)
    expect(results).toHaveLength(4)

    // With even income and even withholding, the installment payments should be symmetrical
    // Let's assert that the required payments are positive or consistent
    results.forEach((row) => {
      expect(row.totalPeriodIncome).toBeGreaterThan(0)
      expect(row.requiredPayment).toBeCloseTo(results[0].requiredPayment, 0)
    })
  })

  it('should defer required payments if income is only received in Q4', () => {
    store.addW2Income('Matt', 100000)
    
    // Income loaded entirely in Q4
    store.updateW2IncomeQuarterly('q1', 0)
    store.updateW2IncomeQuarterly('q2', 0)
    store.updateW2IncomeQuarterly('q3', 0)
    store.updateW2IncomeQuarterly('q4', 100000)

    // No withholding
    store.updateWithholdingQuarterly('q1', 0)
    store.updateWithholdingQuarterly('q2', 0)
    store.updateWithholdingQuarterly('q3', 0)
    store.updateWithholdingQuarterly('q4', 0)

    const results = calculateScheduleAI(store, 0.9)
    
    // Q1, Q2, Q3 should have zero required payment since there was no period income
    expect(results[0].requiredPayment).toBe(0)
    expect(results[1].requiredPayment).toBe(0)
    expect(results[2].requiredPayment).toBe(0)
    
    // Q4 should have a positive required payment
    expect(results[3].requiredPayment).toBeGreaterThan(0)
  })

  it('should adjust cumulative target based on safe harbor target percentage', () => {
    store.addW2Income('Matt', 120000)
    store.updateW2IncomeQuarterly('q1', 30000)
    store.updateW2IncomeQuarterly('q2', 30000)
    store.updateW2IncomeQuarterly('q3', 30000)
    store.updateW2IncomeQuarterly('q4', 30000)

    const results90 = calculateScheduleAI(store, 0.9)
    const results100 = calculateScheduleAI(store, 1.0)
    const results110 = calculateScheduleAI(store, 1.1)

    // Q4 cumulative target (which represents the final required tax paid) should scale proportionally
    expect(results100[3].cumulativeTarget).toBeCloseTo(results90[3].cumulativeTarget * (1.0 / 0.9), 0)
    expect(results110[3].cumulativeTarget).toBeCloseTo(results90[3].cumulativeTarget * (1.1 / 0.9), 0)
  })
})
