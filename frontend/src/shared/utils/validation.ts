/**
 * Validation utilities for Climate Data Explorer
 * Provides input validation with error messages
 *
 * Note: We use soft validation (warnings) for data range bounds
 * to allow flexibility for future data expansion.
 * Hard validation only for: negative years, from > to
 */

import { DATA_RANGE } from '@/shared/constants'

export interface ValidationResult {
  isValid: boolean
  error?: string
  warning?: string // Soft warning, doesn't block input
}

/**
 * Validate a year input value
 * Hard errors: negative years, non-integers
 * Soft warnings: outside known data range
 */
export function validateYear(
  value: number | null,
  _fieldName: 'from' | 'to' = 'from'
): ValidationResult {
  if (value === null) {
    return { isValid: true } // null is allowed (means "no filter")
  }

  if (!Number.isInteger(value)) {
    return { isValid: false, error: 'Year must be a whole number' }
  }

  if (value < 0) {
    return { isValid: false, error: 'Year cannot be negative' }
  }

  // Soft warnings for outside data range (don't block, just inform)
  if (value < DATA_RANGE.MIN_YEAR) {
    return {
      isValid: true,
      warning: `Data starts from ${DATA_RANGE.MIN_YEAR}`,
    }
  }

  if (value > DATA_RANGE.MAX_YEAR) {
    return {
      isValid: true,
      warning: `Data ends at ${DATA_RANGE.MAX_YEAR}`,
    }
  }

  return { isValid: true }
}

/**
 * Validate a year range (from and to years together)
 */
export function validateYearRange(
  yearFrom: number | null,
  yearTo: number | null
): ValidationResult {
  // Validate individual years first
  const fromValidation = validateYear(yearFrom, 'from')
  if (!fromValidation.isValid) {
    return fromValidation
  }

  const toValidation = validateYear(yearTo, 'to')
  if (!toValidation.isValid) {
    return toValidation
  }

  // Check range logic
  if (yearFrom !== null && yearTo !== null && yearFrom > yearTo) {
    return {
      isValid: false,
      error: 'From year cannot be greater than To year',
    }
  }

  return { isValid: true }
}

/**
 * Clamp a year value to valid range
 */
export function clampYear(value: number): number {
  return Math.max(DATA_RANGE.MIN_YEAR, Math.min(DATA_RANGE.MAX_YEAR, value))
}

/**
 * Parse year input with validation
 * Returns null for empty/invalid input, clamped value otherwise
 */
export function parseYearInput(input: string): number | null {
  if (!input || input.trim() === '') {
    return null
  }

  const parsed = parseInt(input, 10)

  if (isNaN(parsed)) {
    return null
  }

  return parsed
}

/**
 * Validate zoom center year
 */
export function validateZoomYear(
  centerYear: number | null,
  yearFrom: number | null,
  yearTo: number | null
): ValidationResult {
  if (centerYear === null) {
    return { isValid: true }
  }

  const minYear = yearFrom ?? DATA_RANGE.MIN_YEAR
  const maxYear = yearTo ?? DATA_RANGE.MAX_YEAR

  if (centerYear < minYear) {
    return {
      isValid: false,
      error: `Center year must be at least ${minYear}`,
    }
  }

  if (centerYear > maxYear) {
    return {
      isValid: false,
      error: `Center year cannot exceed ${maxYear}`,
    }
  }

  return { isValid: true }
}
