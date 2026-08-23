import { AppStore } from '../AppStore';
import { UserInputStore } from '../UserInputStore';
import type { UserInputData } from '../UserInputStore';

const makeEmptyStore = (): UserInputStore => {
  const data: UserInputData = {
    w2Income: [],
    businessIncome: [],
    optionExercises: [],
    rothConversions: [],
    investmentIncome: {
      taxFreeInterest: { q1: 0, q2: 0, q3: 0, q4: 0 },
      taxableInterest: { q1: 0, q2: 0, q3: 0, q4: 0 },
      qualifiedDividends: { q1: 0, q2: 0, q3: 0, q4: 0 },
      nonQualifiedDividends: { q1: 0, q2: 0, q3: 0, q4: 0 },
      longTermCapitalGains: { q1: 0, q2: 0, q3: 0, q4: 0 },
      shortTermCapitalGains: { q1: 0, q2: 0, q3: 0, q4: 0 },
    },
    hsaContribution: 0,
    _401kContribution: 0,
    _403bContribution: 0,
    propertyTaxes: 0,
    withholding1: 0,
    withholding2: 0,
    taxPaidQ1: 0,
    taxPaidQ2: 0,
    taxPaidQ3: 0,
    taxPaidQ4: 0,
    optionExerciseWithholding: 0,
    foreignTaxCredit: 0,
  };
  return new UserInputStore(data);
};

describe('AppStore', () => {
  let inputStore: UserInputStore;
  let appStore: AppStore;

  beforeEach(() => {
    inputStore = makeEmptyStore();
    appStore = new AppStore(inputStore);
  });

  describe('tax', () => {
    it('should return 0 when there is no income', () => {
      expect(appStore.tax).toBe(0);
    });

    it('should calculate federal income tax for W2 income', () => {
      inputStore.addW2Income('Test', 100000);
      // Taxable income = 100000 - 32200 = 67800
      // Tax = 2480 + (67800 - 24800) * 0.12 = 7640
      expect(appStore.tax).toBe(7640);
    });

    it('should calculate federal income tax for Roth conversion income', () => {
      inputStore.addRothConversion('Fidelity', 100000);
      // Taxable income = 100000 - 32200 = 67800
      // Tax = 7640
      expect(appStore.tax).toBe(7640);
    });

    it('should include SE tax for self-employed income', () => {
      inputStore.addBusinessIncome('Consulting', 50000, 0);
      expect(appStore.tax).toBeGreaterThan(0);
    });
  });

  describe('selfEmploymentTax', () => {
    it('should return 0 with no business income', () => {
      inputStore.addW2Income('Job', 100000);
      expect(appStore.selfEmploymentTax).toBe(0);
    });

    it('should return SE tax for business income', () => {
      inputStore.addBusinessIncome('Freelance', 50000, 0);
      expect(appStore.selfEmploymentTax).toBeGreaterThan(0);
    });
  });

  describe('payments', () => {
    it('should return 0 with no withholding or estimated payments', () => {
      inputStore.addW2Income('Job', 100000, 0);
      expect(appStore.payments).toBe(0);
    });

    it('should return total of withholding and estimated payments', () => {
      inputStore.addW2Income('Job', 100000, 5000);
      inputStore.taxPaidQ1 = 2000;
      inputStore.taxPaidQ2 = 2000;
      expect(appStore.payments).toBe(9000);
    });
  });

  describe('refund and owed', () => {
    it('should return 0 refund and 0 owed with no income', () => {
      expect(appStore.refund).toBe(0);
      expect(appStore.owed).toBe(0);
    });

    it('should calculate refund when withholding exceeds tax', () => {
      inputStore.addW2Income('Job', 100000, 10000);
      expect(appStore.refund).toBe(2360); // 10000 - 7640
      expect(appStore.owed).toBe(0);
    });

    it('should calculate amount owed when tax exceeds payments', () => {
      inputStore.addW2Income('Job', 100000, 0);
      expect(appStore.owed).toBe(7640);
      expect(appStore.refund).toBe(0);
    });
  });

  describe('totalIncome', () => {
    it('should return 0 with no income', () => {
      expect(appStore.totalIncome).toBe(0);
    });

    it('should sum all income sources', () => {
      inputStore.addW2Income('Job', 100000);
      inputStore.addBusinessIncome('Self', 20000, 5000); // profit = 15000
      expect(appStore.totalIncome).toBe(115000);
    });
  });

  describe('agi and magi', () => {
    it('should return 0 AGI with no income', () => {
      expect(appStore.agi).toBe(0);
    });

    it('should return W2 income as AGI (no adjustments)', () => {
      inputStore.addW2Income('Job', 100000);
      expect(appStore.agi).toBe(100000);
    });

    it('should return MAGI equal to AGI when no tax-free interest', () => {
      inputStore.addW2Income('Job', 100000);
      expect(appStore.magi).toBe(appStore.agi);
    });

    it('should add tax-free interest to AGI to get MAGI', () => {
      inputStore.addW2Income('Job', 100000);
      inputStore.updateInvestmentIncome('taxFreeInterest', 'q1', 2000);
      expect(appStore.magi).toBe(appStore.agi + 2000);
    });
  });

  describe('effectiveTaxRate', () => {
    it('should return 0 when no income', () => {
      expect(appStore.effectiveTaxRate).toBe(0);
    });

    it('should calculate rate as total tax divided by total income', () => {
      inputStore.addW2Income('Job', 100000);
      expect(appStore.effectiveTaxRate).toBeCloseTo(7640 / 100000, 5);
    });
  });

  describe('marginalTaxBracket', () => {
    it('should return a valid tax bracket', () => {
      inputStore.addW2Income('Job', 100000);
      const bracket = appStore.marginalTaxBracket;
      expect(bracket.rate).toBeGreaterThan(0);
      expect(bracket.remaining).toBeGreaterThanOrEqual(0);
    });

    it('should return 10% bracket for low income', () => {
      inputStore.addW2Income('Job', 40000); // taxable = 40000 - 32200 = 7800
      const bracket = appStore.marginalTaxBracket;
      expect(bracket.rate).toBe(0.10);
    });
  });

  describe('California tax', () => {
    it('should return 0 CA tax with no income', () => {
      expect(appStore.caFullTax).toBe(0);
      expect(appStore.caActualTax).toBe(0);
    });

    it('should calculate CA full tax for W2 income', () => {
      inputStore.addW2Income('Job', 100000, 0, 365); // all days in CA
      expect(appStore.caFullTax).toBeGreaterThan(0);
    });

    it('should calculate CA actual tax equal to CA full tax when 100% CA income', () => {
      inputStore.addW2Income('Job', 100000, 0, 365); // 100% in CA
      expect(appStore.caActualTax).toBe(appStore.caFullTax);
    });

    it('should calculate CA actual tax as fraction of full tax for partial CA income', () => {
      inputStore.addW2Income('Job', 100000, 0, 182); // ~50% in CA
      expect(appStore.caActualTax).toBeLessThan(appStore.caFullTax);
      expect(appStore.caActualTax).toBeGreaterThan(0);
    });

    it('should return caRatio of 1.0 for fully CA income', () => {
      inputStore.addW2Income('Job', 100000, 0, 365);
      expect(appStore.caRatio).toBe(1.0);
    });

    it('should return caRatio of 0 when no income is CA-sourced', () => {
      inputStore.addW2Income('Job', 100000, 0, 0);
      expect(appStore.caRatio).toBe(0);
    });

    it('should return caTaxableIncome based on full calculation base', () => {
      inputStore.addW2Income('Job', 100000, 0, 365);
      expect(appStore.caTaxableIncome).toBe(100000 - 11400);
    });

    it('should return caTaxableAmount as CA portion of income', () => {
      inputStore.addW2Income('Job', 100000, 0, 365);
      // With 100% CA days, CA taxable portion = 100000
      expect(appStore.caTaxableAmount).toBe(100000);
    });
  });
});
