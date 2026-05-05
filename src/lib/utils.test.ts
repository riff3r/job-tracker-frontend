import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
  formatDate,
  timeAgo,
  formatFileSize,
  todayISO,
  getApiErrorMessage,
} from './utils';

describe('formatDate', () => {
  it('returns em-dash for nullish', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });

  it('formats ISO date in en-US shape', () => {
    const out = formatDate('2026-01-15T10:00:00.000Z');
    expect(out).toMatch(/Jan/);
    expect(out).toMatch(/2026/);
  });
});

describe('timeAgo', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-04T12:00:00.000Z'));
  });
  afterAll(() => vi.useRealTimers());

  it('returns "just now" within a minute', () => {
    expect(timeAgo('2026-05-04T11:59:30.000Z')).toBe('just now');
  });
  it('returns minutes for <1h ago', () => {
    expect(timeAgo('2026-05-04T11:30:00.000Z')).toBe('30m ago');
  });
  it('returns hours for <1d ago', () => {
    expect(timeAgo('2026-05-04T08:00:00.000Z')).toBe('4h ago');
  });
  it('returns days for <1w ago', () => {
    expect(timeAgo('2026-05-02T12:00:00.000Z')).toBe('2d ago');
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });
  it('formats KB', () => {
    expect(formatFileSize(2048)).toBe('2.0 KB');
  });
  it('formats MB', () => {
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });
});

describe('todayISO', () => {
  it('returns YYYY-MM-DD shape', () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('getApiErrorMessage', () => {
  it('returns fallback when no response', () => {
    expect(getApiErrorMessage(null, 'fallback')).toBe('fallback');
    expect(getApiErrorMessage(undefined, 'fallback')).toBe('fallback');
  });

  it('extracts message from axios error response', () => {
    const err = { response: { data: { message: 'Bad request' } } };
    expect(getApiErrorMessage(err, 'fallback')).toBe('Bad request');
  });

  it('falls back when message is empty string', () => {
    const err = { response: { data: { message: '' } } };
    expect(getApiErrorMessage(err, 'fallback')).toBe('fallback');
  });
});
