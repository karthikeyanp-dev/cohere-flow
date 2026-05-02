import { getInitials, formatRelativeTime, DEFAULT_WORKFLOW } from '@/lib/utils';

describe('getInitials', () => {
  it('returns two-letter initials for a full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('returns initials for a single word name', () => {
    expect(getInitials('Alice')).toBe('AL');
  });

  it('handles three-word names by using first and second word', () => {
    expect(getInitials('John Paul Doe')).toBe('JP');
  });

  it('handles empty string without throwing', () => {
    expect(() => getInitials('')).not.toThrow();
  });
});

describe('formatRelativeTime', () => {
  it('returns "just now" for timestamps under 1 minute ago', () => {
    expect(formatRelativeTime(Date.now() - 30_000)).toBe('just now');
  });

  it('returns minutes for timestamps 1-59 minutes ago', () => {
    expect(formatRelativeTime(Date.now() - 5 * 60_000)).toBe('5m ago');
  });

  it('returns hours for timestamps 1-23 hours ago', () => {
    expect(formatRelativeTime(Date.now() - 2 * 3_600_000)).toBe('2h ago');
  });

  it('returns days for timestamps 1+ days ago', () => {
    expect(formatRelativeTime(Date.now() - 2 * 86_400_000)).toBe('2d ago');
  });
});

describe('DEFAULT_WORKFLOW', () => {
  it('has exactly 4 stages', () => {
    expect(DEFAULT_WORKFLOW).toHaveLength(4);
  });

  it('stages have sequential order values starting at 0', () => {
    DEFAULT_WORKFLOW.forEach((stage, i) => {
      expect(stage.order).toBe(i);
    });
  });

  it('all stages have required fields', () => {
    DEFAULT_WORKFLOW.forEach(stage => {
      expect(stage).toHaveProperty('id');
      expect(stage).toHaveProperty('label');
      expect(stage).toHaveProperty('color');
      expect(stage).toHaveProperty('order');
    });
  });

  it('stage ids are unique', () => {
    const ids = DEFAULT_WORKFLOW.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
