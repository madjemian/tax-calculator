import { ScheduleD, type CapitalGainsProvider } from '../ScheduleD';

const createProvider = (ltcg: number, stcg: number): CapitalGainsProvider => ({
  getLongTermCapitalGains: () => ltcg,
  getShortTermCapitalGains: () => stcg,
});

describe('ScheduleD', () => {
  describe('line15 (long-term capital gains)', () => {
    it('should return 0 with no capital gains', () => {
      const s = new ScheduleD(createProvider(0, 0));
      expect(s.line15).toBe(0);
    });

    it('should return long-term capital gains', () => {
      const s = new ScheduleD(createProvider(10000, 5000));
      expect(s.line15).toBe(10000);
    });

    it('should return negative value for long-term capital losses', () => {
      const s = new ScheduleD(createProvider(-8000, 0));
      expect(s.line15).toBe(-8000);
    });
  });

  describe('line16 (total capital gains / losses)', () => {
    it('should return 0 with no capital gains', () => {
      const s = new ScheduleD(createProvider(0, 0));
      expect(s.line16).toBe(0);
    });

    it('should sum long-term and short-term capital gains', () => {
      const s = new ScheduleD(createProvider(10000, 5000));
      expect(s.line16).toBe(15000);
    });

    it('should compute net loss when losses exceed gains', () => {
      const s = new ScheduleD(createProvider(-5000, -8000));
      expect(s.line16).toBe(-13000);
    });

    it('should allow gains and losses to offset each other', () => {
      const s = new ScheduleD(createProvider(10000, -4000));
      expect(s.line16).toBe(6000);
    });
  });
});
