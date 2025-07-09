import { Form8959, type AdditionalMedicareTaxProvider } from '../8959';
import { ADDITIONAL_MEDICARE_TAX_THRESHOLD } from '../1040';

describe('Form8959', () => {
  const createMockProvider = (medicareWages: number): AdditionalMedicareTaxProvider => ({
    getMedicareWages: () => medicareWages
  });

  describe('additionalMedicareTax', () => {
    it('should return 0 for wages below threshold', () => {
      const form = new Form8959(createMockProvider(200000));
      expect(form.additionalMedicareTax()).toBe(0);
    });

    it('should return 0 for wages at threshold', () => {
      const form = new Form8959(createMockProvider(ADDITIONAL_MEDICARE_TAX_THRESHOLD));
      expect(form.additionalMedicareTax()).toBe(0);
    });

    it('should calculate 0.9% tax on excess wages', () => {
      const form = new Form8959(createMockProvider(300000));
      // $50,000 over threshold * 0.009 = $450
      expect(form.additionalMedicareTax()).toBeCloseTo(450, 2);
    });

    it('should handle zero wages', () => {
      const form = new Form8959(createMockProvider(0));
      expect(form.additionalMedicareTax()).toBe(0);
    });

    it('should calculate correct tax for high income', () => {
      const form = new Form8959(createMockProvider(500000));
      // $250,000 over threshold * 0.009 = $2,250
      expect(form.additionalMedicareTax()).toBe(2250);
    });
  });
});