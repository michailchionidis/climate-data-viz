/**
 * useFilters Hook
 * Manages all filter state for the Climate Data Explorer
 * Extracted from App.tsx for better separation of concerns
 */
import { useState, useCallback, useMemo } from 'react'
import type { VisualizationMode, ZoomState } from '@/shared/types'
import { DATA_RANGE, ZOOM_CONFIG } from '@/shared/constants'

export interface FiltersState {
  selectedStations: string[]
  yearFrom: number | null
  yearTo: number | null
  mode: VisualizationMode
  showSigmaBounds: boolean
  zoom: ZoomState
}

export interface FiltersActions {
  setSelectedStations: (stations: string[]) => void
  setYearFrom: (year: number | null) => void
  setYearTo: (year: number | null) => void
  setMode: (mode: VisualizationMode) => void
  setShowSigmaBounds: (show: boolean) => void
  setZoom: (zoom: ZoomState) => void
  toggleMode: () => void
  toggleSigmaBounds: () => void
  resetZoom: () => void
  applyZoom: () => void
  applyYearPreset: (from: number | null, to: number | null) => void
}

export interface UseFiltersReturn extends FiltersState, FiltersActions {
  // Computed values
  hasActiveFilters: boolean
  yearRange: { min: number; max: number }
  hasUnappliedZoom: boolean
}

const initialZoom: ZoomState = {
  centerYear: null,
  windowSize: ZOOM_CONFIG.DEFAULT_WINDOW,
}

export function useFilters(): UseFiltersReturn {
  // Core filter state
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [yearFrom, setYearFrom] = useState<number | null>(null)
  const [yearTo, setYearTo] = useState<number | null>(null)
  const [mode, setMode] = useState<VisualizationMode>('annual')
  const [showSigmaBounds, setShowSigmaBounds] = useState(false)
  const [zoom, setZoom] = useState<ZoomState>(initialZoom)

  // Track applied zoom for comparison
  const [appliedZoom, setAppliedZoom] = useState<ZoomState>(initialZoom)

  // Actions
  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const newMode = prev === 'monthly' ? 'annual' : 'monthly'
      // Disable sigma bounds when switching to monthly
      if (newMode === 'monthly') {
        setShowSigmaBounds(false)
      }
      return newMode
    })
  }, [])

  const toggleSigmaBounds = useCallback(() => {
    // Only allow toggling in annual mode
    if (mode === 'annual') {
      setShowSigmaBounds((prev) => !prev)
    }
  }, [mode])

  const resetZoom = useCallback(() => {
    setYearFrom(null)
    setYearTo(null)
    setZoom(initialZoom)
    setAppliedZoom(initialZoom)
  }, [])

  const applyZoom = useCallback(() => {
    if (zoom.centerYear) {
      const from = Math.max(DATA_RANGE.MIN_YEAR, zoom.centerYear - zoom.windowSize)
      const to = Math.min(DATA_RANGE.MAX_YEAR, zoom.centerYear + zoom.windowSize)
      setYearFrom(from)
      setYearTo(to)
      setAppliedZoom({ ...zoom })
    }
  }, [zoom])

  const applyYearPreset = useCallback((from: number | null, to: number | null) => {
    setYearFrom(from)
    setYearTo(to)
  }, [])

  // Computed values
  const hasActiveFilters = useMemo(() => {
    return (
      selectedStations.length > 0 ||
      yearFrom !== null ||
      yearTo !== null ||
      mode !== 'annual' ||
      showSigmaBounds
    )
  }, [selectedStations, yearFrom, yearTo, mode, showSigmaBounds])

  const yearRange = useMemo(() => ({
    min: yearFrom ?? DATA_RANGE.MIN_YEAR,
    max: yearTo ?? DATA_RANGE.MAX_YEAR,
  }), [yearFrom, yearTo])

  const hasUnappliedZoom = useMemo(() => {
    return zoom.centerYear !== null && (
      zoom.centerYear !== appliedZoom.centerYear ||
      zoom.windowSize !== appliedZoom.windowSize
    )
  }, [zoom, appliedZoom])

  return {
    // State
    selectedStations,
    yearFrom,
    yearTo,
    mode,
    showSigmaBounds,
    zoom,

    // Actions
    setSelectedStations,
    setYearFrom,
    setYearTo,
    setMode,
    setShowSigmaBounds,
    setZoom,
    toggleMode,
    toggleSigmaBounds,
    resetZoom,
    applyZoom,
    applyYearPreset,

    // Computed
    hasActiveFilters,
    yearRange,
    hasUnappliedZoom,
  }
}
