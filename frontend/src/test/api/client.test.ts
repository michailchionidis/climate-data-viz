/**
 * Tests for API client
 *
 * Tests API methods and error handling
 */
import { describe, it, expect } from 'vitest'
import {
  getStations,
  getMonthlyData,
  getAnnualData,
  getAnalytics,
  ApiError,
} from '../../api/client'

describe('API Client', () => {
  describe('ApiError', () => {
    it('should create an error with status and detail', () => {
      const error = new ApiError(404, 'Not found')

      expect(error.status).toBe(404)
      expect(error.detail).toBe('Not found')
      expect(error.message).toBe('Not found')
      expect(error.name).toBe('ApiError')
    })

    it('should extend Error', () => {
      const error = new ApiError(500, 'Server error')

      expect(error).toBeInstanceOf(Error)
    })
  })

  describe('getStations', () => {
    it('should be a function', () => {
      expect(typeof getStations).toBe('function')
    })
  })

  describe('getMonthlyData', () => {
    it('should be a function', () => {
      expect(typeof getMonthlyData).toBe('function')
    })
  })

  describe('getAnnualData', () => {
    it('should be a function', () => {
      expect(typeof getAnnualData).toBe('function')
    })
  })

  describe('getAnalytics', () => {
    it('should be a function', () => {
      expect(typeof getAnalytics).toBe('function')
    })
  })
})
