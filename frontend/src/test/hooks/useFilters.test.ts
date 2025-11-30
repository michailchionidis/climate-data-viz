/**
 * Tests for useFilters hook
 *
 * Verifies filter state management for:
 * - Station selection
 * - Year range filtering
 * - Visualization mode
 * - Sigma bounds toggle
 * - Zoom controls
 */
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFilters } from '@/shared/hooks/useFilters'

describe('useFilters', () => {
  describe('Station Selection', () => {
    it('should initialize with empty station selection', () => {
      const { result } = renderHook(() => useFilters())

      expect(result.current.selectedStations).toEqual([])
    })

    it('should update selected stations', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.setSelectedStations(['station1', 'station2'])
      })

      expect(result.current.selectedStations).toEqual(['station1', 'station2'])
    })
  })

  describe('Year Range', () => {
    it('should initialize with null year range', () => {
      const { result } = renderHook(() => useFilters())

      expect(result.current.yearFrom).toBeNull()
      expect(result.current.yearTo).toBeNull()
    })

    it('should update year from', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.setYearFrom(1950)
      })

      expect(result.current.yearFrom).toBe(1950)
    })

    it('should update year to', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.setYearTo(2000)
      })

      expect(result.current.yearTo).toBe(2000)
    })

    it('should apply year preset', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.applyYearPreset(1970, 2019)
      })

      expect(result.current.yearFrom).toBe(1970)
      expect(result.current.yearTo).toBe(2019)
    })
  })

  describe('Visualization Mode', () => {
    it('should initialize with annual mode', () => {
      const { result } = renderHook(() => useFilters())

      expect(result.current.mode).toBe('annual')
    })

    it('should toggle to monthly mode', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.toggleMode()
      })

      expect(result.current.mode).toBe('monthly')
    })

    it('should set mode directly', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.setMode('monthly')
      })

      expect(result.current.mode).toBe('monthly')
    })

    it('should disable sigma bounds when toggling to monthly', () => {
      const { result } = renderHook(() => useFilters())

      // Enable sigma bounds first
      act(() => {
        result.current.setShowSigmaBounds(true)
      })
      expect(result.current.showSigmaBounds).toBe(true)

      // Toggle to monthly - sigma bounds should be disabled
      act(() => {
        result.current.toggleMode()
      })

      expect(result.current.mode).toBe('monthly')
      expect(result.current.showSigmaBounds).toBe(false)
    })
  })

  describe('Sigma Bounds', () => {
    it('should initialize with sigma bounds disabled', () => {
      const { result } = renderHook(() => useFilters())

      expect(result.current.showSigmaBounds).toBe(false)
    })

    it('should toggle sigma bounds in annual mode', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.toggleSigmaBounds()
      })

      expect(result.current.showSigmaBounds).toBe(true)
    })

    it('should not toggle sigma bounds in monthly mode', () => {
      const { result } = renderHook(() => useFilters())

      // Switch to monthly first
      act(() => {
        result.current.setMode('monthly')
      })

      // Try to toggle sigma bounds
      act(() => {
        result.current.toggleSigmaBounds()
      })

      expect(result.current.showSigmaBounds).toBe(false)
    })
  })

  describe('Zoom Controls', () => {
    it('should initialize with default zoom state', () => {
      const { result } = renderHook(() => useFilters())

      expect(result.current.zoom.centerYear).toBeNull()
      expect(result.current.zoom.windowSize).toBe(10)
    })

    it('should update zoom state', () => {
      const { result } = renderHook(() => useFilters())

      act(() => {
        result.current.setZoom({ centerYear: 1990, windowSize: 20 })
      })

      expect(result.current.zoom.centerYear).toBe(1990)
      expect(result.current.zoom.windowSize).toBe(20)
    })

    it('should apply zoom to year range', () => {
      const { result } = renderHook(() => useFilters())

      // Set zoom first
      act(() => {
        result.current.setZoom({ centerYear: 1990, windowSize: 10 })
      })

      // Apply zoom
      act(() => {
        result.current.applyZoom()
      })

      expect(result.current.yearFrom).toBe(1980)
      expect(result.current.yearTo).toBe(2000)
    })

    it('should reset zoom', () => {
      const { result } = renderHook(() => useFilters())

      // Set and apply zoom
      act(() => {
        result.current.setZoom({ centerYear: 1990, windowSize: 10 })
        result.current.applyZoom()
      })

      // Reset
      act(() => {
        result.current.resetZoom()
      })

      expect(result.current.zoom.centerYear).toBeNull()
      expect(result.current.yearFrom).toBeNull()
      expect(result.current.yearTo).toBeNull()
    })

    it('should track unapplied zoom changes', () => {
      const { result } = renderHook(() => useFilters())

      // Initially no unapplied changes
      expect(result.current.hasUnappliedZoom).toBe(false)

      // Set zoom without applying
      act(() => {
        result.current.setZoom({ centerYear: 1990, windowSize: 10 })
      })

      expect(result.current.hasUnappliedZoom).toBe(true)

      // Apply zoom
      act(() => {
        result.current.applyZoom()
      })

      expect(result.current.hasUnappliedZoom).toBe(false)
    })
  })

  describe('Computed Values', () => {
    it('should compute hasActiveFilters correctly', () => {
      const { result } = renderHook(() => useFilters())

      // Initially no active filters
      expect(result.current.hasActiveFilters).toBe(false)

      // Add station selection
      act(() => {
        result.current.setSelectedStations(['station1'])
      })

      expect(result.current.hasActiveFilters).toBe(true)
    })

    it('should compute yearRange correctly', () => {
      const { result } = renderHook(() => useFilters())

      // Default range
      expect(result.current.yearRange.min).toBe(1859)
      expect(result.current.yearRange.max).toBe(2019)

      // Set custom range
      act(() => {
        result.current.setYearFrom(1950)
        result.current.setYearTo(2000)
      })

      expect(result.current.yearRange.min).toBe(1950)
      expect(result.current.yearRange.max).toBe(2000)
    })
  })
})
