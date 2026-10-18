import { useState, useEffect } from 'react';

export const TIMEZONE = 'Asia/Kolkata';

/**
 * Formats an ISO timestamp or Date into Indian local time (e.g. "10:42 AM").
 */
export function formatTime(dateInput: string | number | Date | undefined | null): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch {
    return '—';
  }
}

/**
 * Formats an ISO timestamp into a human-readable date (e.g. "18 Oct 2026").
 */
export function formatDate(dateInput: string | number | Date | undefined | null): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: TIMEZONE,
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return '—';
  }
}

/**
 * Formats an ISO timestamp into full date and time (e.g. "18 Oct 2026, 10:42 AM").
 */
export function formatDateTime(dateInput: string | number | Date | undefined | null): string {
  if (!dateInput) return '—';
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: TIMEZONE,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch {
    return '—';
  }
}

/**
 * Generates an authentic relative time description (e.g., "just now", "2 mins ago", "in 8 mins").
 */
export function getRelativeTimeString(
  dateInput: string | number | Date | undefined | null,
  nowMs: number = Date.now()
): string {
  if (!dateInput) return '';
  try {
    const targetMs = new Date(dateInput).getTime();
    if (isNaN(targetMs)) return '';

    const diffSeconds = Math.round((nowMs - targetMs) / 1000);

    // Past events
    if (diffSeconds >= 0) {
      if (diffSeconds < 15) return 'just now';
      if (diffSeconds < 60) return `${diffSeconds}s ago`;
      const mins = Math.floor(diffSeconds / 60);
      if (mins === 1) return '1 min ago';
      if (mins < 60) return `${mins} mins ago`;
      const hours = Math.floor(mins / 60);
      if (hours === 1) return '1 hour ago';
      if (hours < 24) return `${hours} hours ago`;
      return formatDate(dateInput);
    }

    // Future events
    const absSeconds = Math.abs(diffSeconds);
    if (absSeconds < 30) return 'in moments';
    const mins = Math.ceil(absSeconds / 60);
    if (mins === 1) return 'in 1 min';
    if (mins < 60) return `in ${mins} mins`;
    const hours = Math.floor(mins / 60);
    return `in ${hours} hr ${mins % 60}m`;
  } catch {
    return '';
  }
}

/**
 * Calculates preparation duration in minutes for an order based on items ordered.
 * Takes the highest prep time item + a slight increment for additional unique items.
 */
export function calculateOrderPrepDuration(
  itemPrepTimes: number[],
  fallbackMins: number = 10
): number {
  if (!itemPrepTimes.length) return fallbackMins;
  const maxPrep = Math.max(...itemPrepTimes);
  // Add 1.5 mins for each extra dish to account for assembly
  const additionalDishes = Math.max(0, itemPrepTimes.length - 1);
  return Math.min(25, Math.max(5, Math.round(maxPrep + additionalDishes * 1.5)));
}

/**
 * Generates a standard CampusBite Order ID formatted as CB-YYYYMMDD-XXXX
 * (e.g. CB-20261018-0042).
 */
export function generateOrderId(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = String(Math.floor(10 + Math.random() * 990)).padStart(4, '0');
  return `CB-${y}${m}${d}-${rand}`;
}

/**
 * React hook that returns an automatically updating live relative time string.
 * Rerenders periodically and immediately updates when the tab regains focus or visibility.
 */
export function useLiveRelativeTime(
  dateInput: string | number | Date | undefined | null,
  updateIntervalMs: number = 10000
): string {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!dateInput) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, updateIntervalMs);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setNow(Date.now());
      }
    };

    const handleFocus = () => setNow(Date.now());

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [dateInput, updateIntervalMs]);

  return getRelativeTimeString(dateInput, now);
}

/**
 * React hook that provides the current live time, updating every second or minute.
 */
export function useCurrentClock(updateIntervalMs: number = 30000): Date {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, updateIntervalMs);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setCurrentTime(new Date());
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [updateIntervalMs]);

  return currentTime;
}
