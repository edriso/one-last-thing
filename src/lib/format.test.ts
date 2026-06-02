import { describe, expect, it } from 'vitest';
import { formatClock } from './format';

describe('formatClock', () => {
  it('formats seconds as M:SS', () => {
    expect(formatClock(60)).toBe('1:00');
    expect(formatClock(75)).toBe('1:15');
    expect(formatClock(5)).toBe('0:05');
    expect(formatClock(-3)).toBe('0:00');
  });
});
