import { Form8960, type NetInvestmentIncomeTaxProvider } from '../8960';
import { NIIT_THRESHOLD } from '../1040';

describe('Form8960', () => {
  const createMockProvider = (
    taxableInterest: number, 
    ordinaryDividends: number, 
    netCapitalGain: number, 
    modifiedAGI: number
  ): NetInvestmentIncomeTaxProvider => ({
    getTaxableInterest: () => taxableInterest,
    getOrdinaryDividends: () => ordinaryDividends,
    getNetCapitalGain: () => netCapitalGain,
    getModifiedAGI: () => modifiedAGI
  });

  describe('netInvestmentIncomeTax', () => {
    it('should return 0 when MAGI is below threshold', () => {
      const form = new Form8960(createMockProvider(1000, 2000, 3000, 200000));
      expect(form.netInvestmentIncomeTax()).toBe(0);
    });

    it('should calculate 3.8% tax on net investment income', () => {
      const form = new Form8960(createMockProvider(1000, 2000, 3000, 300000));
      // NII = 6000, excess MAGI = 50000, tax = 6000 * 0.038 = 228
      expect(form.netInvestmentIncomeTax()).toBeCloseTo(228, 2);
    });

    it('should limit tax to excess MAGI when NII is higher', () => {
      const form = new Form8960(createMockProvider(100000, 50000, 25000, 275000));
      // NII = 175000, excess MAGI = 25000, tax = 25000 * 0.038 = 950
      expect(form.netInvestmentIncomeTax()).toBeCloseTo(950, 2);
    });

    it('should return 0 when no net investment income', () => {
      const form = new Form8960(createMockProvider(0, 0, 0, 300000));
      expect(form.netInvestmentIncomeTax()).toBe(0);
    });
  });
});