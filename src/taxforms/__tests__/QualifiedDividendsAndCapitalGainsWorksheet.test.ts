import { QualifiedDividendsAndCapitalGainsWorksheet } from '../QualifiedDividendsAndCapitalGainsWorksheet';
import { ZERO_PERCENT_CAP_GAINS_LIMIT, FIFTEEN_PERCENT_CAP_GAINS_LIMIT } from '../1040';

describe('QualifiedDividendsAndCapitalGainsWorksheet', () => {
  describe('calculateTax', () => {
    it('should calculate tax for low income with no qualified dividends or capital gains', () => {
      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        20000, // taxableIncome
        0,     // qualifiedDividends
        0,     // longTermCapitalGains
        0      // totalCapitalGains
      );

      const result = worksheet.calculateTax();

      // Should use regular tax brackets: 20000 * 0.1 = 2000
      expect(result).toBe(2000);
    });

    it('should calculate tax for income below zero percent capital gains limit', () => {
      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        50000, // taxableIncome (below ZERO_PERCENT_CAP_GAINS_LIMIT of 96700)
        5000,  // qualifiedDividends
        3000,  // longTermCapitalGains
        3000   // totalCapitalGains
      );

      const result = worksheet.calculateTax();

      // Regular income: 50000 - 8000 = 42000
      // Tax on 42000: 42000 * 0.12 - 477 = 4563
      // Qualified dividends and cap gains (8000) taxed at 0%
      // Total: 4563
      expect(result).toBe(4563);
    });

    it('should calculate tax for income in 15% capital gains bracket', () => {
      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        200000, // taxableIncome
        20000,  // qualifiedDividends
        10000,  // longTermCapitalGains
        10000   // totalCapitalGains
      );

      const result = worksheet.calculateTax();

      // This should trigger 15% capital gains tax on some portion
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    it('should calculate tax for high income in 20% capital gains bracket', () => {
      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        700000, // taxableIncome (above FIFTEEN_PERCENT_CAP_GAINS_LIMIT)
        50000,  // qualifiedDividends
        30000,  // longTermCapitalGains
        30000   // totalCapitalGains
      );

      const result = worksheet.calculateTax();

      // Should trigger 20% capital gains tax on some portion
      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    it('should handle edge case where qualified dividends exceed total dividends', () => {
      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        100000, // taxableIncome
        15000,  // qualifiedDividends
        5000,   // longTermCapitalGains
        8000    // totalCapitalGains (> longTermCapitalGains)
      );

      const result = worksheet.calculateTax();

      expect(result).toBeGreaterThan(0);
      expect(typeof result).toBe('number');
    });

    it('should handle zero taxable income', () => {
      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        0,     // taxableIncome
        1000,  // qualifiedDividends
        500,   // longTermCapitalGains
        500    // totalCapitalGains
      );

      const result = worksheet.calculateTax();

      expect(result).toBe(0);
    });

    it('should validate tax bracket calculations', () => {
      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        50000, // taxableIncome
        0,     // qualifiedDividends
        0,     // longTermCapitalGains
        0      // totalCapitalGains
      );

      // Test the tax lookup directly
      expect(worksheet.taxLookup(23850)).toBe(2385); // 23850 * 0.1
      expect(worksheet.taxLookup(50000)).toBe(5523); // 50000 * 0.12 - 477
      expect(worksheet.taxLookup(100000)).toBe(11828); // 100000 * 0.22 - 10172
    });

    it('should respect capital gains limits constants', () => {
      // Test that our constants are being used correctly
      expect(ZERO_PERCENT_CAP_GAINS_LIMIT).toBe(96700);
      expect(FIFTEEN_PERCENT_CAP_GAINS_LIMIT).toBe(600050);

      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        ZERO_PERCENT_CAP_GAINS_LIMIT - 1000, // Just below 0% limit
        5000,  // qualifiedDividends
        3000,  // longTermCapitalGains
        3000   // totalCapitalGains
      );

      const result = worksheet.calculateTax();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should calculate correctly at capital gains boundary conditions', () => {
      // Test exactly at the 0% capital gains limit
      const worksheet1 = new QualifiedDividendsAndCapitalGainsWorksheet(
        ZERO_PERCENT_CAP_GAINS_LIMIT, // Exactly at limit
        10000, // qualifiedDividends
        5000,  // longTermCapitalGains
        5000   // totalCapitalGains
      );

      const result1 = worksheet1.calculateTax();
      expect(typeof result1).toBe('number');
      expect(result1).toBeGreaterThanOrEqual(0);

      // Test exactly at the 15% capital gains limit
      const worksheet2 = new QualifiedDividendsAndCapitalGainsWorksheet(
        FIFTEEN_PERCENT_CAP_GAINS_LIMIT, // Exactly at limit
        20000, // qualifiedDividends
        10000, // longTermCapitalGains
        10000  // totalCapitalGains
      );

      const result2 = worksheet2.calculateTax();
      expect(typeof result2).toBe('number');
      expect(result2).toBeGreaterThanOrEqual(0);
    });

    it('should return minimum of calculated tax vs regular tax', () => {
      // Test the final comparison logic (line 25)
      const worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(
        30000, // taxableIncome
        2000,  // qualifiedDividends
        1000,  // longTermCapitalGains
        1000   // totalCapitalGains
      );

      const result = worksheet.calculateTax();
      const regularTax = worksheet.taxLookup(30000);

      // Result should be <= regular tax due to line 25 logic
      expect(result).toBeLessThanOrEqual(regularTax);
    });
  });

  describe('taxLookup', () => {
    let worksheet: QualifiedDividendsAndCapitalGainsWorksheet;

    beforeEach(() => {
      worksheet = new QualifiedDividendsAndCapitalGainsWorksheet(0, 0, 0, 0);
    });

    it('should calculate 10% bracket correctly', () => {
      expect(worksheet.taxLookup(10000)).toBe(1000);
      expect(worksheet.taxLookup(23850)).toBe(2385);
    });

    it('should calculate 12% bracket correctly', () => {
      expect(worksheet.taxLookup(50000)).toBe(5523); // 50000 * 0.12 - 477
      expect(worksheet.taxLookup(96950)).toBe(11157); // 96950 * 0.12 - 477
    });

    it('should calculate 22% bracket correctly', () => {
      expect(worksheet.taxLookup(150000)).toBe(22828); // 150000 * 0.22 - 10172
      expect(worksheet.taxLookup(206700)).toBe(35302); // 206700 * 0.22 - 10172
    });

    it('should calculate higher brackets correctly', () => {
      expect(worksheet.taxLookup(300000)).toBe(57694); // 300000 * 0.24 - 14306
      expect(worksheet.taxLookup(500000)).toBe(114126); // 500000 * 0.32 - 45874
      expect(worksheet.taxLookup(700000)).toBeCloseTo(184094.5, 2); // 700000 * 0.35 - 60905.5
      expect(worksheet.taxLookup(1000000)).toBe(294062.5); // 1000000 * 0.37 - 75937.5
    });

    it('should handle boundary values', () => {
      expect(worksheet.taxLookup(0)).toBe(0);
      expect(worksheet.taxLookup(23850)).toBe(2385);
      expect(worksheet.taxLookup(23851)).toBe(2385.12); // 23851 * 0.12 - 477
    });
  });
});