import { ScheduleSE, type ScheduleSEProvider } from '../ScheduleSE'

describe('ScheduleSE', () => {
  const createMockProvider = (profit: number, w2: number): ScheduleSEProvider => ({
    getTotalBusinessProfit: () => profit,
    getW2Income: () => w2
  })

  test('calculates SE tax correctly for low income', () => {
    const provider = createMockProvider(300, 50000)
    const schedule = new ScheduleSE(provider)
    expect(schedule.selfEmploymentTax).toBe(0)
    expect(schedule.deductibleSelfEmploymentTax).toBe(0)
  })

  test('calculates SE tax correctly for moderate income', () => {
    // Profit = 10000
    // Taxable Profit = 9235
    // SS Tax = 9235 * 0.124 = 1145.14
    // Medicare Tax = 9235 * 0.029 = 267.815
    // Total SE Tax = 1412.955
    const provider = createMockProvider(10000, 50000)
    const schedule = new ScheduleSE(provider)
    expect(schedule.selfEmploymentTax).toBeCloseTo(1412.955, 1)
    expect(schedule.deductibleSelfEmploymentTax).toBeCloseTo(706.4775, 1)
  })

  test('calculates SE tax correctly when SS cap is reached', () => {
    // W2 = 181800 (SS Cap)
    // Profit = 10000
    // Taxable Profit = 9235
    // SS Tax = 0 (since W2 already reached cap)
    // Medicare Tax = 9235 * 0.029 = 267.815
    const provider = createMockProvider(10000, 181800)
    const schedule = new ScheduleSE(provider)
    expect(schedule.selfEmploymentTax).toBeCloseTo(267.815, 1)
  })
})
