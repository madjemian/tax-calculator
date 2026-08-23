import { UserInputStore } from '../UserInputStore';
import type { UserInputData } from '../UserInputStore';

const makeEmptyInvestmentIncome = () => ({
  taxFreeInterest: { q1: 0, q2: 0, q3: 0, q4: 0 },
  taxableInterest: { q1: 0, q2: 0, q3: 0, q4: 0 },
  qualifiedDividends: { q1: 0, q2: 0, q3: 0, q4: 0 },
  nonQualifiedDividends: { q1: 0, q2: 0, q3: 0, q4: 0 },
  longTermCapitalGains: { q1: 0, q2: 0, q3: 0, q4: 0 },
  shortTermCapitalGains: { q1: 0, q2: 0, q3: 0, q4: 0 },
});

const makeTestData = (overrides: Partial<UserInputData> = {}): UserInputData => ({
  w2Income: [],
  businessIncome: [],
  optionExercises: [],
  rothConversions: [],
  investmentIncome: makeEmptyInvestmentIncome(),
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
  ...overrides,
});

describe('UserInputStore', () => {
  describe('initialization', () => {
    it('should create two default W2 entries when initialized without data', () => {
      const store = new UserInputStore();
      expect(store.w2Income.length).toBe(2);
      expect(store.w2Income[0].name).toBe('Matt');
      expect(store.w2Income[1].name).toBe('Megan');
    });

    it('should initialize with provided data', () => {
      const data = makeTestData({
        w2Income: [{ id: 'abc', name: 'Alice', income: 75000, withholding: 8000 }],
        rothConversions: [{ id: 'rc1', name: '401k Conversion', amount: 20000, date: '2026-06-01', withholding: 4000, caTaxablePercent: 0 }],
        hsaContribution: 3000,
        _401kContribution: 10000,
        foreignTaxCredit: 250,
        taxPaidQ1: 1500,
      });
      const store = new UserInputStore(data);
      expect(store.w2Income.length).toBe(1);
      expect(store.w2Income[0].income).toBe(75000);
      expect(store.rothConversions.length).toBe(1);
      expect(store.rothConversions[0].amount).toBe(20000);
      expect(store.hsaContribution).toBe(3000);
      expect(store._401kContribution).toBe(10000);
      expect(store.foreignTaxCredit).toBe(250);
      expect(store.taxPaidQ1).toBe(1500);
    });

    it('should use empty arrays when provided data has missing list fields', () => {
      const data = makeTestData();
      const store = new UserInputStore(data);
      expect(store.w2Income).toEqual([]);
      expect(store.businessIncome).toEqual([]);
      expect(store.optionExercises).toEqual([]);
      expect(store.rothConversions).toEqual([]);
    });
  });

  describe('W2 income management', () => {
    let store: UserInputStore;

    beforeEach(() => {
      store = new UserInputStore();
      store.w2Income = [];
    });

    it('should add a new W2 entry with default withholding of 0', () => {
      store.addW2Income('Employer A', 80000);
      expect(store.w2Income.length).toBe(1);
      expect(store.w2Income[0].name).toBe('Employer A');
      expect(store.w2Income[0].income).toBe(80000);
      expect(store.w2Income[0].withholding).toBe(0);
    });

    it('should add a W2 entry with withholding and daysInCA', () => {
      store.addW2Income('Employer B', 120000, 15000, 200);
      expect(store.w2Income[0].withholding).toBe(15000);
      expect(store.w2Income[0].daysInCA).toBe(200);
    });

    it('should update a W2 entry by id', () => {
      store.addW2Income('Employer', 80000, 8000);
      const id = store.w2Income[0].id;
      store.updateW2Income(id, { income: 90000 });
      expect(store.w2Income[0].income).toBe(90000);
      expect(store.w2Income[0].withholding).toBe(8000); // unchanged
    });

    it('should not change anything when updating with a non-existent id', () => {
      store.addW2Income('Employer', 80000);
      store.updateW2Income('nonexistent-id', { income: 99999 });
      expect(store.w2Income[0].income).toBe(80000);
    });

    it('should remove a W2 entry by id', () => {
      store.addW2Income('Employer A', 80000);
      store.addW2Income('Employer B', 40000);
      const idToRemove = store.w2Income[0].id;
      store.removeW2Income(idToRemove);
      expect(store.w2Income.length).toBe(1);
      expect(store.w2Income[0].name).toBe('Employer B');
    });

    it('should add multiple W2 entries with unique ids', () => {
      store.addW2Income('A', 50000);
      store.addW2Income('B', 60000);
      expect(store.w2Income[0].id).not.toBe(store.w2Income[1].id);
    });
  });

  describe('business income management', () => {
    let store: UserInputStore;

    beforeEach(() => {
      store = new UserInputStore(makeTestData());
    });

    it('should add a business income entry', () => {
      store.addBusinessIncome('Freelance', 40000, 5000);
      expect(store.businessIncome.length).toBe(1);
      expect(store.businessIncome[0].name).toBe('Freelance');
      expect(store.businessIncome[0].income).toBe(40000);
      expect(store.businessIncome[0].expenses).toBe(5000);
    });

    it('should update a business income entry', () => {
      store.addBusinessIncome('Freelance', 40000, 5000);
      const id = store.businessIncome[0].id;
      store.updateBusinessIncome(id, { expenses: 8000 });
      expect(store.businessIncome[0].expenses).toBe(8000);
      expect(store.businessIncome[0].income).toBe(40000); // unchanged
    });

    it('should ignore update for non-existent business income id', () => {
      store.addBusinessIncome('Freelance', 40000, 5000);
      store.updateBusinessIncome('bad-id', { income: 99999 });
      expect(store.businessIncome[0].income).toBe(40000);
    });

    it('should remove a business income entry', () => {
      store.addBusinessIncome('A', 30000, 0);
      store.addBusinessIncome('B', 20000, 0);
      const idToRemove = store.businessIncome[0].id;
      store.removeBusinessIncome(idToRemove);
      expect(store.businessIncome.length).toBe(1);
      expect(store.businessIncome[0].name).toBe('B');
    });
  });

  describe('option exercise management', () => {
    let store: UserInputStore;

    beforeEach(() => {
      store = new UserInputStore(makeTestData());
    });

    it('should add an option exercise entry', () => {
      store.addOptionExercise('2026-03-15', 50000, 15000, 80);
      expect(store.optionExercises.length).toBe(1);
      expect(store.optionExercises[0].amount).toBe(50000);
      expect(store.optionExercises[0].withholding).toBe(15000);
      expect(store.optionExercises[0].caTaxablePercent).toBe(80);
    });

    it('should add an option exercise with default caTaxablePercent', () => {
      store.addOptionExercise('2026-01-01', 30000, 9000);
      expect(store.optionExercises[0].caTaxablePercent).toBeUndefined();
    });

    it('should update an option exercise entry', () => {
      store.addOptionExercise('2026-03-15', 50000, 15000, 80);
      const id = store.optionExercises[0].id;
      store.updateOptionExercise(id, { amount: 60000 });
      expect(store.optionExercises[0].amount).toBe(60000);
      expect(store.optionExercises[0].withholding).toBe(15000); // unchanged
    });

    it('should ignore update for non-existent option exercise id', () => {
      store.addOptionExercise('2026-03-15', 50000, 15000);
      store.updateOptionExercise('bad-id', { amount: 99999 });
      expect(store.optionExercises[0].amount).toBe(50000);
    });

    it('should remove an option exercise entry', () => {
      store.addOptionExercise('2026-01-01', 30000, 0);
      store.addOptionExercise('2026-06-01', 20000, 0);
      const idToRemove = store.optionExercises[0].id;
      store.removeOptionExercise(idToRemove);
      expect(store.optionExercises.length).toBe(1);
      expect(store.optionExercises[0].amount).toBe(20000);
    });
  });

  describe('Roth conversion management', () => {
    let store: UserInputStore;

    beforeEach(() => {
      store = new UserInputStore(makeTestData());
    });

    it('should add a Roth conversion entry with default caTaxablePercent of 0', () => {
      store.addRothConversion('Fidelity 401k', 50000, '2026-06-15', 10000);
      expect(store.rothConversions.length).toBe(1);
      expect(store.rothConversions[0].name).toBe('Fidelity 401k');
      expect(store.rothConversions[0].amount).toBe(50000);
      expect(store.rothConversions[0].date).toBe('2026-06-15');
      expect(store.rothConversions[0].withholding).toBe(10000);
      expect(store.rothConversions[0].caTaxablePercent).toBe(0);
    });

    it('should add a Roth conversion with custom caTaxablePercent', () => {
      store.addRothConversion('Vanguard IRA', 30000, '2026-04-01', 6000, 50);
      expect(store.rothConversions[0].caTaxablePercent).toBe(50);
    });

    it('should update a Roth conversion entry', () => {
      store.addRothConversion('Fidelity 401k', 50000, '2026-06-15', 10000);
      const id = store.rothConversions[0].id;
      store.updateRothConversion(id, { amount: 60000, withholding: 12000 });
      expect(store.rothConversions[0].amount).toBe(60000);
      expect(store.rothConversions[0].withholding).toBe(12000);
      expect(store.rothConversions[0].name).toBe('Fidelity 401k'); // unchanged
    });

    it('should ignore update for non-existent Roth conversion id', () => {
      store.addRothConversion('Fidelity 401k', 50000);
      store.updateRothConversion('bad-id', { amount: 99999 });
      expect(store.rothConversions[0].amount).toBe(50000);
    });

    it('should remove a Roth conversion entry', () => {
      store.addRothConversion('401k Conv 1', 30000);
      store.addRothConversion('401k Conv 2', 20000);
      const idToRemove = store.rothConversions[0].id;
      store.removeRothConversion(idToRemove);
      expect(store.rothConversions.length).toBe(1);
      expect(store.rothConversions[0].name).toBe('401k Conv 2');
    });
  });

  describe('quarterly data updates', () => {
    let store: UserInputStore;

    beforeEach(() => {
      store = new UserInputStore(makeTestData());
    });

    it('should update w2IncomeQuarterly', () => {
      store.updateW2IncomeQuarterly('q1', 25000);
      store.updateW2IncomeQuarterly('q4', 30000);
      expect(store.w2IncomeQuarterly.q1).toBe(25000);
      expect(store.w2IncomeQuarterly.q4).toBe(30000);
    });

    it('should update businessProfitQuarterly', () => {
      store.updateBusinessProfitQuarterly('q2', 5000);
      expect(store.businessProfitQuarterly.q2).toBe(5000);
    });

    it('should update withholdingQuarterly', () => {
      store.updateWithholdingQuarterly('q3', 3500);
      expect(store.withholdingQuarterly.q3).toBe(3500);
    });

    it('should update investment income by category and quarter', () => {
      store.updateInvestmentIncome('taxableInterest', 'q1', 500);
      store.updateInvestmentIncome('taxableInterest', 'q2', 300);
      expect(store.investmentIncome.taxableInterest.q1).toBe(500);
      expect(store.investmentIncome.taxableInterest.q2).toBe(300);
    });
  });

  describe('setter methods', () => {
    let store: UserInputStore;

    beforeEach(() => {
      store = new UserInputStore(makeTestData());
    });

    it('should set HSA contribution', () => {
      store.setHsaContribution(4000);
      expect(store.hsaContribution).toBe(4000);
    });

    it('should set 401k contribution', () => {
      store.set401kContribution(20000);
      expect(store._401kContribution).toBe(20000);
    });

    it('should set 403b contribution', () => {
      store.set403bContribution(15000);
      expect(store._403bContribution).toBe(15000);
    });

    it('should set withholding1 and withholding2', () => {
      store.setWithholding1(5000);
      store.setWithholding2(3000);
      expect(store.withholding1).toBe(5000);
      expect(store.withholding2).toBe(3000);
    });

    it('should set quarterly estimated tax payments', () => {
      store.setTaxPaidQ1(1000);
      store.setTaxPaidQ2(2000);
      store.setTaxPaidQ3(3000);
      store.setTaxPaidQ4(4000);
      expect(store.totalEstimatedTaxPaid).toBe(10000);
    });

    it('should set option exercise withholding', () => {
      store.setOptionExerciseWithholding(8000);
      expect(store.optionExerciseWithholding).toBe(8000);
    });

    it('should set foreign tax credit', () => {
      store.setForeignTaxCredit(750);
      expect(store.foreignTaxCredit).toBe(750);
    });
  });

  describe('computed properties', () => {
    let store: UserInputStore;

    beforeEach(() => {
      store = new UserInputStore(makeTestData());
    });

    it('totalW2Income includes W2 wages and option exercise amounts', () => {
      store.addW2Income('Job', 100000);
      store.addOptionExercise('2026-01-01', 25000, 0);
      expect(store.totalW2Income).toBe(125000);
    });

    it('totalDeductions sums HSA, 401k, and 403b', () => {
      store.hsaContribution = 4000;
      store._401kContribution = 20000;
      store._403bContribution = 5000;
      expect(store.totalDeductions).toBe(29000);
    });

    it('totalW2Withholding sums withholding across all W2 entries', () => {
      store.addW2Income('A', 100000, 10000);
      store.addW2Income('B', 50000, 5000);
      expect(store.totalW2Withholding).toBe(15000);
    });

    it('totalOptionWithholding sums withholding across option exercises', () => {
      store.addOptionExercise('2026-01-01', 30000, 9000);
      store.addOptionExercise('2026-06-01', 20000, 6000);
      expect(store.totalOptionWithholding).toBe(15000);
    });

    it('totalRothConversions sums amounts across Roth conversions', () => {
      store.addRothConversion('Fidelity', 40000);
      store.addRothConversion('Vanguard', 10000);
      expect(store.totalRothConversions).toBe(50000);
    });

    it('totalRothConversionWithholding sums withholding across Roth conversions', () => {
      store.addRothConversion('Fidelity', 40000, '2026-06-01', 8000);
      store.addRothConversion('Vanguard', 10000, '2026-08-01', 2000);
      expect(store.totalRothConversionWithholding).toBe(10000);
    });

    it('totalWithholding combines W2, option, and Roth conversion withholding', () => {
      store.addW2Income('Job', 100000, 12000);
      store.addOptionExercise('2026-01-01', 50000, 15000);
      store.addRothConversion('Fidelity', 40000, '2026-06-01', 8000);
      expect(store.totalWithholding).toBe(35000);
    });

    it('totalEstimatedTaxPaid sums all four quarterly payments', () => {
      store.taxPaidQ1 = 2000;
      store.taxPaidQ2 = 2000;
      store.taxPaidQ3 = 2000;
      store.taxPaidQ4 = 2000;
      expect(store.totalEstimatedTaxPaid).toBe(8000);
    });

    it('totalBusinessProfit sums income minus expenses across entries', () => {
      store.addBusinessIncome('A', 60000, 10000);
      store.addBusinessIncome('B', 30000, 5000);
      expect(store.totalBusinessProfit).toBe(75000);
    });

    it('taxableInterest sums all quarters', () => {
      store.updateInvestmentIncome('taxableInterest', 'q1', 250);
      store.updateInvestmentIncome('taxableInterest', 'q2', 250);
      store.updateInvestmentIncome('taxableInterest', 'q3', 250);
      store.updateInvestmentIncome('taxableInterest', 'q4', 250);
      expect(store.taxableInterest).toBe(1000);
    });

    it('taxFreeInterest sums all quarters', () => {
      store.updateInvestmentIncome('taxFreeInterest', 'q1', 500);
      store.updateInvestmentIncome('taxFreeInterest', 'q3', 500);
      expect(store.taxFreeInterest).toBe(1000);
    });

    it('qualifiedDividends and nonQualifiedDividends sum independently', () => {
      store.updateInvestmentIncome('qualifiedDividends', 'q1', 600);
      store.updateInvestmentIncome('nonQualifiedDividends', 'q1', 400);
      expect(store.qualifiedDividends).toBe(600);
      expect(store.nonQualifiedDividends).toBe(400);
    });

    it('totalDividends is qualifiedDividends plus nonQualifiedDividends', () => {
      store.updateInvestmentIncome('qualifiedDividends', 'q1', 600);
      store.updateInvestmentIncome('nonQualifiedDividends', 'q1', 400);
      expect(store.totalDividends).toBe(1000);
    });

    it('longTermCapitalGains and shortTermCapitalGains sum independently', () => {
      store.updateInvestmentIncome('longTermCapitalGains', 'q1', 4000);
      store.updateInvestmentIncome('shortTermCapitalGains', 'q1', 2000);
      expect(store.longTermCapitalGains).toBe(4000);
      expect(store.shortTermCapitalGains).toBe(2000);
    });

    it('totalRealIncome sums all income sources including Roth conversions', () => {
      store.addW2Income('Job', 100000);
      store.addBusinessIncome('Self', 30000, 5000); // profit = 25000
      store.addRothConversion('Fidelity', 40000);
      store.updateInvestmentIncome('taxableInterest', 'q1', 500);
      store.updateInvestmentIncome('qualifiedDividends', 'q1', 300);
      store.updateInvestmentIncome('longTermCapitalGains', 'q1', 2000);
      store.updateInvestmentIncome('taxFreeInterest', 'q1', 1000);
      expect(store.totalRealIncome).toBe(100000 + 25000 + 40000 + 500 + 300 + 2000 + 1000);
    });

    it('totalTaxCredit equals the foreign tax credit', () => {
      store.foreignTaxCredit = 400;
      expect(store.totalTaxCredit).toBe(400);
    });
  });

  describe('California tax computed properties', () => {
    let store: UserInputStore;

    beforeEach(() => {
      store = new UserInputStore(makeTestData());
    });

    it('totalCATaxableW2Income is proportional to days worked in CA', () => {
      store.addW2Income('Job', 100000, 0, 182); // ~half year in CA
      expect(store.totalCATaxableW2Income).toBeCloseTo(100000 * (182 / 365), 2);
    });

    it('totalCATaxableW2Income is 0 when daysInCA is not set', () => {
      store.addW2Income('Job', 100000);
      expect(store.totalCATaxableW2Income).toBe(0);
    });

    it('totalCATaxableW2Income is 0 when daysInCA is 0', () => {
      store.addW2Income('Job', 100000, 0, 0);
      expect(store.totalCATaxableW2Income).toBe(0);
    });

    it('totalCATaxableOptionIncome applies caTaxablePercent', () => {
      store.addOptionExercise('2026-01-01', 50000, 0, 80); // 80% CA taxable
      expect(store.totalCATaxableOptionIncome).toBe(40000);
    });

    it('totalCATaxableOptionIncome is 0 when caTaxablePercent is not set', () => {
      store.addOptionExercise('2026-01-01', 50000, 0);
      expect(store.totalCATaxableOptionIncome).toBe(0);
    });

    it('totalCATaxableRothConversionIncome defaults to 0% for non-residents (e.g. FL)', () => {
      store.addRothConversion('Fidelity', 50000);
      expect(store.totalCATaxableRothConversionIncome).toBe(0);
    });

    it('totalCATaxableRothConversionIncome applies caTaxablePercent if specified', () => {
      store.addRothConversion('Fidelity', 50000, '2026-06-01', 0, 100);
      expect(store.totalCATaxableRothConversionIncome).toBe(50000);
    });

    it('totalCATaxableIncome includes W2, options, and CA-taxable Roth conversions', () => {
      store.addW2Income('Job', 100000, 0, 365); // 100% CA
      store.addOptionExercise('2026-01-01', 50000, 0, 100); // 100% CA
      store.addRothConversion('FL Conversion', 40000, '2026-06-01', 0, 0); // 0% CA (living in FL)
      store.addBusinessIncome('Self', 20000, 5000); // profit = 15000 (not CA taxable)
      expect(store.totalCATaxableIncome).toBe(100000 + 50000 + 0);
    });

    it('caTaxableRatio is 1.0 when all income is earned in CA', () => {
      store.addW2Income('Job', 100000, 0, 365);
      expect(store.caTaxableRatio).toBe(1.0);
    });

    it('caTaxableRatio is 0 when no W2/business income at all', () => {
      expect(store.caTaxableRatio).toBe(0);
    });

    it('caTaxableRatio is partial when some income is out-of-state', () => {
      store.addW2Income('Job', 100000, 0, 182); // ~half year in CA
      const ratio = store.caTaxableRatio;
      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(1);
    });

    it('totalCACalculationBase includes W2, business, options, investment income, and Roth conversions minus CA deductions', () => {
      store.addW2Income('Job', 100000);
      store.addBusinessIncome('Self', 20000, 5000); // profit = 15000
      store.addRothConversion('Roth Conv', 30000);
      store.updateInvestmentIncome('taxableInterest', 'q1', 2000);
      store.hsaContribution = 3000; // Not deductible for CA
      store._401kContribution = 5000; // Deductible pre-tax for CA
      // Net W2 (100k - 5k 401k) + 15k profit + 30k conversion + 2k interest = 142000 CA Worldwide AGI
      // Minus CA Standard Deduction 11400 = 130600
      expect(store.totalCACalculationBase).toBe(130600);
    });

    it('caTaxableRatio is CA taxable income divided by full calculation base', () => {
      store.addW2Income('Job', 100000, 0, 182.5); // ~50000 CA taxable W2
      store.addBusinessIncome('Self', 50000, 0); // 50000 business (not CA taxable)
      // totalCACalculationBase = 150000
      // totalCATaxableIncome = 50000
      // caTaxableRatio = 50000 / 150000 = 1/3
      expect(store.caTaxableRatio).toBeCloseTo(1 / 3, 4);
    });
  });

  describe('serialize and deserialize', () => {
    it('should serialize all fields to a plain object', () => {
      const store = new UserInputStore(makeTestData());
      store.addW2Income('Test', 50000, 5000);
      store.addRothConversion('Conversion', 25000, '2026-06-01', 5000);
      store.hsaContribution = 3000;
      store.taxPaidQ1 = 2000;

      const data = store.serialize();
      expect(data.w2Income[0].income).toBe(50000);
      expect(data.rothConversions[0].amount).toBe(25000);
      expect(data.rothConversions[0].withholding).toBe(5000);
      expect(data.hsaContribution).toBe(3000);
      expect(data.taxPaidQ1).toBe(2000);
    });

    it('should round-trip correctly through serialize and deserialize', () => {
      const store = new UserInputStore(makeTestData());
      store.addW2Income('Alice', 80000, 8000);
      store.addBusinessIncome('Consulting', 40000, 5000);
      store.addRothConversion('Fidelity Rollover', 35000, '2026-05-15', 7000, 0);
      store.hsaContribution = 4000;
      store.taxPaidQ2 = 1500;
      store.foreignTaxCredit = 200;

      const serialized = store.serialize();
      const store2 = new UserInputStore(serialized);

      expect(store2.w2Income[0].name).toBe('Alice');
      expect(store2.w2Income[0].income).toBe(80000);
      expect(store2.businessIncome[0].income).toBe(40000);
      expect(store2.rothConversions[0].name).toBe('Fidelity Rollover');
      expect(store2.rothConversions[0].amount).toBe(35000);
      expect(store2.rothConversions[0].withholding).toBe(7000);
      expect(store2.rothConversions[0].caTaxablePercent).toBe(0);
      expect(store2.hsaContribution).toBe(4000);
      expect(store2.taxPaidQ2).toBe(1500);
      expect(store2.foreignTaxCredit).toBe(200);
    });

    it('should handle deserialization with missing investment income fields gracefully', () => {
      const partialData = makeTestData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (partialData.investmentIncome as any).taxFreeInterest = undefined;
      const store = new UserInputStore(partialData);
      expect(store.taxFreeInterest).toBe(0);
    });
  });
});
