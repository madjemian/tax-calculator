import { Schedule2, type CalculationProvider } from '../Schedule2';

const createProvider = (overrides: Partial<CalculationProvider> = {}): CalculationProvider => ({
  getMedicareWages: () => 0,
  getAgi: () => 0,
  getModifiedAGI: () => 0,
  getTaxableInterest: () => 0,
  getOrdinaryDividends: () => 0,
  getNetCapitalGain: () => 0,
  getTotalBusinessProfit: () => 0,
  getW2Income: () => 0,
  getSelfEmploymentIncome: () => 0,
  ...overrides,
});

describe('Schedule2', () => {
  describe('tax', () => {
    it('should return 0 when no income', () => {
      const s = new Schedule2(createProvider());
      expect(s.tax).toBe(0);
    });

    it('should equal SE tax with self-employment income', () => {
      const provider = createProvider({
        getTotalBusinessProfit: () => 10000,
        getW2Income: () => 0,
      });
      const s = new Schedule2(provider);
      expect(s.tax).toBe(s.selfEmploymentTax);
      expect(s.tax).toBeGreaterThan(0);
    });
  });

  describe('selfEmploymentTax', () => {
    it('should return 0 with no business income', () => {
      const s = new Schedule2(createProvider());
      expect(s.selfEmploymentTax).toBe(0);
    });

    it('should calculate SE tax for moderate business profit', () => {
      const provider = createProvider({
        getTotalBusinessProfit: () => 10000,
        getW2Income: () => 0,
      });
      const s = new Schedule2(provider);
      // SE taxable = 9235, SS tax = 9235 * 0.124 = 1145.14, Medicare = 9235 * 0.029 = 267.815
      // Total = 1412.955
      expect(s.selfEmploymentTax).toBeCloseTo(1412.955, 1);
    });

    it('should cap SS portion when W2 wages reach SS wage base', () => {
      const provider = createProvider({
        getTotalBusinessProfit: () => 10000,
        getW2Income: () => 181800, // At SS wage base
      });
      const s = new Schedule2(provider);
      // Only Medicare tax applies: 9235 * 0.029 = 267.815
      expect(s.selfEmploymentTax).toBeCloseTo(267.815, 1);
    });
  });

  describe('otherTaxes', () => {
    it('should return 0 below Medicare and NIIT thresholds', () => {
      const provider = createProvider({
        getMedicareWages: () => 200000,
        getModifiedAGI: () => 200000,
      });
      const s = new Schedule2(provider);
      expect(s.otherTaxes).toBe(0);
    });

    it('should include additional Medicare tax for high wage earners', () => {
      const provider = createProvider({
        getMedicareWages: () => 300000, // $50k above $250k threshold
        getModifiedAGI: () => 300000,
      });
      const s = new Schedule2(provider);
      // Additional Medicare = 50000 * 0.009 = 450
      expect(s.otherTaxes).toBeCloseTo(450, 1);
    });

    it('should include NIIT for high MAGI with investment income', () => {
      const provider = createProvider({
        getModifiedAGI: () => 300000,
        getTaxableInterest: () => 5000,
        getOrdinaryDividends: () => 3000,
        getNetCapitalGain: () => 2000,
      });
      const s = new Schedule2(provider);
      // NII = 10000, excess MAGI = 50000, tax = 10000 * 0.038 = 380
      expect(s.otherTaxes).toBeGreaterThan(0);
    });

    it('should combine additional Medicare tax and NIIT', () => {
      // High wages triggering both taxes
      const provider = createProvider({
        getMedicareWages: () => 350000,
        getModifiedAGI: () => 350000,
        getTaxableInterest: () => 10000,
        getOrdinaryDividends: () => 5000,
        getNetCapitalGain: () => 5000,
      });
      const s = new Schedule2(provider);
      expect(s.otherTaxes).toBeGreaterThan(0);
    });
  });
});
