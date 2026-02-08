import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get an array of dates between start and end (inclusive)
 */
export function getDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get a human-readable room type label
 */
export function getRoomTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    SINGLE: 'Single',
    DOUBLE: 'Double',
    SUITE: 'Suite',
    FAMILY: 'Family',
  };
  return labels[type] || type;
}

/**
 * Get status color class
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-300',
    CHECKED_IN: 'bg-green-100 text-green-800 border-green-300',
    CHECKED_OUT: 'bg-gray-100 text-gray-800 border-gray-300',
    CANCELLED: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
