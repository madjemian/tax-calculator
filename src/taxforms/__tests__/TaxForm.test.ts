import { ScheduleD } from '../ScheduleD';

describe('TaxForm.getLineValue', () => {
  it('should return the calculated value for a valid line', () => {
    const schedule = new ScheduleD({
      getLongTermCapitalGains: () => 12000,
      getShortTermCapitalGains: () => 3000,
    });
    expect(schedule.getLineValue('line15')).toBe(12000);
    expect(schedule.getLineValue('line16')).toBe(15000);
  });

  it('should return 0 for an unrecognized line key', () => {
    const schedule = new ScheduleD({
      getLongTermCapitalGains: () => 5000,
      getShortTermCapitalGains: () => 2000,
    });
    expect(schedule.getLineValue('lineDoesNotExist')).toBe(0);
    expect(schedule.getLineValue('')).toBe(0);
  });
});
