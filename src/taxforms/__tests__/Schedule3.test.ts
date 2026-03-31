import { Schedule3, type CreditProvider } from '../Schedule3';

const createProvider = (foreignTaxCredit: number): CreditProvider => ({
  getForeignTaxCredit: () => foreignTaxCredit,
});

describe('Schedule3', () => {
  describe('nonRefundableCredits', () => {
    it('should return 0 when there are no credits', () => {
      const s = new Schedule3(createProvider(0));
      expect(s.nonRefundableCredits).toBe(0);
    });

    it('should return the foreign tax credit amount', () => {
      const s = new Schedule3(createProvider(500));
      expect(s.nonRefundableCredits).toBe(500);
    });

    it('should handle large foreign tax credit amounts', () => {
      const s = new Schedule3(createProvider(10000));
      expect(s.nonRefundableCredits).toBe(10000);
    });
  });
});
