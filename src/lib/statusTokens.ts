import type { ApplicationStatus } from '@/types';

/**
 * Canonical status order — used for Kanban column layout, filters, and forms.
 * Mirrors the backend `ApplicationStatus` enum order.
 */
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'WISHLIST',
  'APPLIED',
  'PHONE_SCREEN',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'WITHDRAWN',
];

/**
 * Hex colors for status indicators (donut chart segments, activity row avatar).
 * These are passed to inline `style={{ background }}` and `<svg fill>`, which is why
 * they're hex strings rather than Tailwind classes.
 */
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  WISHLIST:     '#94A3B8',
  APPLIED:      '#3B82F6',
  PHONE_SCREEN: '#EAB308',
  INTERVIEW:    '#A855F7',
  OFFER:        '#22C55E',
  REJECTED:     '#EF4444',
  WITHDRAWN:    '#9CA3AF',
};

/** Human-readable labels for each status. */
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  PHONE_SCREEN: 'Phone Screen',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};
