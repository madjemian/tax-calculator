import { Form1040, STANDARD_DEDUCTION } from '../1040';
import { UserInputStore } from '../../stores/UserInputStore';

describe('Form1040', () => {
  let store: UserInputStore;
  let form: Form1040;

  beforeEach(() => {
    store = new UserInputStore();
    store.w2Income = [];
    form = new Form1040(store);
  });

  describe('tax calculation with W2 income', () => {
    it('should calculate correct tax for simple W2 income', () => {
      store.addW2Income('Test', 100000);
      // Taxable income = 100000 - 32200 = 67800
      // Tax = 2480 + (67800 - 24800) * 0.12 = 7640
      expect(form.tax).toBe(7640);
    });

    it('should return 0 tax for income at or below standard deduction', () => {
      store.addW2Income('Test', STANDARD_DEDUCTION);
      expect(form.tax).toBe(0);
    });

    it('should return 0 tax and 0 owed with no income', () => {
      expect(form.tax).toBe(0);
      expect(form.owed).toBe(0);
      expect(form.refund).toBe(0);
    });

    it('should calculate tax for high W2 income in upper bracket', () => {
      store.addW2Income('Test', 600000);
      // Taxable income = 600000 - 32200 = 567800 → in 35% bracket (512450 - 768700)
      // Income tax = 117144 + (567800 - 512450) * 0.35 = 136516.5
      // MAGI = 600000 > 250000 threshold, additional Medicare = (600000-250000)*0.009 = 3150
      // Total = 136516.5 + 3150 = 139666.5 → rounded = 139667
      expect(form.tax).toBe(139667);
    });

    it('should reduce taxable income by pre-tax deductions', () => {
      store.addW2Income('Test', 100000);
      store.hsaContribution = 5000;
      store._401kContribution = 10000;
      // line1a = 100000 - 15000 = 85000, taxable = 85000 - 32200 = 52800
      // Tax = 2480 + (52800 - 24800) * 0.12 = 2480 + 3360 = 5840
      expect(form.tax).toBe(5840);
    });
  });

  describe('tax calculation with Roth conversions (1099-R)', () => {
    it('should calculate correct ordinary income tax on Roth conversion', () => {
      store.addRothConversion('401k Rollover', 100000);
      // Taxable income = 100000 - 32200 = 67800
      // Tax = 2480 + (67800 - 24800) * 0.12 = 7640
      expect(form.tax).toBe(7640);
      expect(form.getAgi()).toBe(100000);
    });

    it('should combine W2 income and Roth conversion', () => {
      store.addW2Income('Job', 50000);
      store.addRothConversion('401k Conversion', 50000);
      // Total income = 100000, Taxable = 100000 - 32200 = 67800
      // Tax = 7640
      expect(form.tax).toBe(7640);
      expect(form.getAgi()).toBe(100000);
    });

    it('should not increase Medicare wages or self-employment income', () => {
      store.addRothConversion('401k Conversion', 100000);
      expect(form.getMedicareWages()).toBe(0);
      expect(form.getSelfEmploymentIncome()).toBe(0);
      expect(form.selfEmploymentTax).toBe(0);
    });

    it('should include Roth conversion in MAGI for Form 8960 threshold', () => {
      store.addRothConversion('401k Conversion', 300000);
      // MAGI = 300000 > 250000 NIIT threshold
      expect(form.getModifiedAGI()).toBe(300000);
    });
  });

  describe('refund and owed', () => {
    it('should calculate refund when withholding exceeds tax', () => {
      store.addW2Income('Test', 100000, 10000);
      // tax = 7640, payments = 10000
      expect(form.refund).toBe(2360);
      expect(form.owed).toBe(0);
    });

    it('should calculate owed when tax exceeds withholding', () => {
      store.addW2Income('Test', 100000, 1000);
      // tax = 7640, payments = 1000
      expect(form.owed).toBe(6640);
      expect(form.refund).toBe(0);
    });

    it('should return 0 for both refund and owed when exactly even', () => {
      store.addW2Income('Test', 100000, 7640);
      expect(form.refund).toBe(0);
      expect(form.owed).toBe(0);
    });
  });

  describe('payments', () => {
    it('should sum W2 withholding and estimated payments', () => {
      store.addW2Income('Test', 100000, 5000);
      store.taxPaidQ1 = 1000;
      store.taxPaidQ2 = 1000;
      store.taxPaidQ3 = 1000;
      store.taxPaidQ4 = 1000;
      expect(form.payments).toBe(9000);
    });

    it('should include option exercise withholding in payments', () => {
      store.addOptionExercise('2026-01-01', 50000, 15000);
      expect(form.payments).toBe(15000);
    });

    it('should include Roth conversion withholding in payments', () => {
      store.addRothConversion('Fidelity', 40000, '2026-06-01', 8000);
      expect(form.payments).toBe(8000);
    });
  });

  describe('provider interface methods', () => {
    it('getMedicareWages subtracts HSA from W2 income', () => {
      store.addW2Income('Test', 100000);
      store.hsaContribution = 3000;
      expect(form.getMedicareWages()).toBe(97000);
    });

    it('getMedicareWages returns total W2 when no HSA', () => {
      store.addW2Income('Test', 100000);
      expect(form.getMedicareWages()).toBe(100000);
    });

    it('getAgi returns AGI equal to W2 with no adjustments', () => {
      store.addW2Income('Test', 100000);
      expect(form.getAgi()).toBe(100000);
    });

    it('getAgi subtracts deductible SE tax for self-employed', () => {
      store.addBusinessIncome('Freelance', 50000, 0);
      const agi = form.getAgi();
      // SE deductible = (50000 * 0.9235) * (0.124 * SSCAP + 0.029) * 0.5
      expect(agi).toBeLessThan(50000);
      expect(agi).toBeGreaterThan(0);
    });

    it('getModifiedAGI adds tax-free interest to AGI', () => {
      store.addW2Income('Test', 100000);
      store.updateInvestmentIncome('taxFreeInterest', 'q1', 2000);
      expect(form.getModifiedAGI()).toBe(form.getAgi() + 2000);
    });

    it('getModifiedAGI equals AGI when no tax-free interest', () => {
      store.addW2Income('Test', 100000);
      expect(form.getModifiedAGI()).toBe(form.getAgi());
    });

    it('getTaxableInterest returns sum of quarterly taxable interest', () => {
      store.updateInvestmentIncome('taxableInterest', 'q1', 300);
      store.updateInvestmentIncome('taxableInterest', 'q2', 200);
      expect(form.getTaxableInterest()).toBe(500);
    });

    it('getOrdinaryDividends returns qualified + non-qualified dividends', () => {
      store.updateInvestmentIncome('qualifiedDividends', 'q1', 1000);
      store.updateInvestmentIncome('nonQualifiedDividends', 'q1', 500);
      expect(form.getOrdinaryDividends()).toBe(1500);
    });

    it('getNetCapitalGain returns sum of LTCG and STCG', () => {
      store.updateInvestmentIncome('longTermCapitalGains', 'q1', 5000);
      store.updateInvestmentIncome('shortTermCapitalGains', 'q1', 3000);
      expect(form.getNetCapitalGain()).toBe(8000);
    });

    it('getLongTermCapitalGains returns LTCG from store', () => {
      store.updateInvestmentIncome('longTermCapitalGains', 'q1', 7000);
      expect(form.getLongTermCapitalGains()).toBe(7000);
    });

    it('getShortTermCapitalGains returns STCG from store', () => {
      store.updateInvestmentIncome('shortTermCapitalGains', 'q1', 2500);
      expect(form.getShortTermCapitalGains()).toBe(2500);
    });

    it('getTotalBusinessProfit returns profit (income minus expenses)', () => {
      store.addBusinessIncome('Consulting', 60000, 10000);
      expect(form.getTotalBusinessProfit()).toBe(50000);
    });

    it('getW2Income returns total W2 wages including option exercises', () => {
      store.addW2Income('Job', 80000);
      store.addOptionExercise('2026-01-01', 20000, 0);
      expect(form.getW2Income()).toBe(100000);
    });

    it('getSelfEmploymentIncome returns 92.35% of business profit', () => {
      store.addBusinessIncome('Freelance', 50000, 0);
      expect(form.getSelfEmploymentIncome()).toBeCloseTo(50000 * 0.9235, 5);
    });

    it('getPropertyTaxes returns property taxes from store', () => {
      store.propertyTaxes = 8000;
      expect(form.getPropertyTaxes()).toBe(8000);
    });

    it('getForeignTaxCredit returns foreign tax credit from store', () => {
      store.foreignTaxCredit = 350;
      expect(form.getForeignTaxCredit()).toBe(350);
    });

    it('getTaxableIncome returns line 15 value', () => {
      store.addW2Income('Test', 100000);
      // taxable = 100000 - 32200 = 67800
      expect(form.getTaxableIncome()).toBe(67800);
    });

    it('getQualifiedDividends returns qualified dividends', () => {
      store.updateInvestmentIncome('qualifiedDividends', 'q1', 800);
      store.updateInvestmentIncome('qualifiedDividends', 'q2', 400);
      expect(form.getQualifiedDividends()).toBe(1200);
    });
  });

  describe('self-employment tax', () => {
    it('should calculate SE tax for sole proprietor income', () => {
      store.addBusinessIncome('Freelance', 50000, 0);
      expect(form.selfEmploymentTax).toBeGreaterThan(0);
    });

    it('should return 0 SE tax with no business income', () => {
      store.addW2Income('Job', 100000);
      expect(form.selfEmploymentTax).toBe(0);
    });
  });

  describe('investment income', () => {
    it('should include taxable interest in total income', () => {
      store.addW2Income('Job', 100000);
      store.updateInvestmentIncome('taxableInterest', 'q1', 5000);
      // AGI = 100000 + 5000 = 105000
      expect(form.getAgi()).toBe(105000);
    });

    it('should include capital gains in total income', () => {
      store.addW2Income('Job', 100000);
      store.updateInvestmentIncome('longTermCapitalGains', 'q1', 10000);
      expect(form.getAgi()).toBe(110000);
    });

    it('should cap capital losses at $3000 on total income', () => {
      store.addW2Income('Job', 100000);
      store.updateInvestmentIncome('shortTermCapitalGains', 'q1', -20000);
      // Capital loss is capped at -3000 on 1040 line 7
      // AGI = 100000 + (-3000) = 97000
      expect(form.getAgi()).toBe(97000);
    });
  });

  describe('credits', () => {
    it('should reduce tax by foreign tax credit', () => {
      store.addW2Income('Test', 100000); // tax would be 7640
      store.foreignTaxCredit = 500;
      expect(form.tax).toBe(7140);
    });
  });

  describe('Schedule A deduction', () => {
    it('should use standard deduction when itemized is lower', () => {
      store.addW2Income('Test', 100000);
      store.propertyTaxes = 1000; // well below standard deduction
      // taxable = 100000 - 32200 = 67800 (same as without property taxes)
      expect(form.tax).toBe(7640);
    });

    it('should use itemized deduction when higher than standard', () => {
      store.addW2Income('Test', 500000);
      store.propertyTaxes = 50000; // well above standard deduction
      const taxWithItemized = form.tax;
      store.propertyTaxes = 0;
      const taxWithStandard = form.tax;
      expect(taxWithItemized).toBeLessThan(taxWithStandard);
    });
  });
});
