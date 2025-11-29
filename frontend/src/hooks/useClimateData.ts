/**
 * React Query hooks for climate data fetching
 */
import { useQuery } from '@tanstack/react-query'
import {
  getStations,
  getMonthlyData,
  getAnnualData,
  getAnalytics,
  type DataQueryParams,
} from '../api/client'
import type {
  Station,
  MonthlyDataResponse,
  AnnualDataResponse,
  AnalyticsResponse,
  VisualizationMode,
} from '../types'

// Query key factories for cache management
export const queryKeys = {
  stations: ['stations'] as const,
  monthlyData: (params: DataQueryParams) => ['monthlyData', params] as const,
  annualData: (params: DataQueryParams) => ['annualData', params] as const,
  analytics: (params: DataQueryParams) => ['analytics', params] as const,
}

/**
 * Hook to fetch available weather stations
 */
export function useStations() {
  return useQuery<Station[], Error>({
    queryKey: queryKeys.stations,
    queryFn: getStations,
    staleTime: Infinity, // Stations don't change
  })
}

/**
 * Hook to fetch monthly temperature data
 */
export function useMonthlyData(
  stations: string[],
  yearFrom: number | null,
  yearTo: number | null,
  enabled: boolean = true
) {
  const params: DataQueryParams = {
    stations,
    yearFrom,
    yearTo,
  }

  return useQuery<MonthlyDataResponse, Error>({
    queryKey: queryKeys.monthlyData(params),
    queryFn: () => getMonthlyData(params),
    enabled: enabled && stations.length > 0,
  })
}

/**
 * Hook to fetch annual temperature statistics
 */
export function useAnnualData(
  stations: string[],
  yearFrom: number | null,
  yearTo: number | null,
  enabled: boolean = true
) {
  const params: DataQueryParams = {
    stations,
    yearFrom,
    yearTo,
  }

  return useQuery<AnnualDataResponse, Error>({
    queryKey: queryKeys.annualData(params),
    queryFn: () => getAnnualData(params),
    enabled: enabled && stations.length > 0,
  })
}

/**
 * Hook to fetch analytics summary
 */
export function useAnalytics(
  stations: string[],
  yearFrom: number | null,
  yearTo: number | null,
  enabled: boolean = true
) {
  const params: DataQueryParams = {
    stations,
    yearFrom,
    yearTo,
  }

  return useQuery<AnalyticsResponse, Error>({
    queryKey: queryKeys.analytics(params),
    queryFn: () => getAnalytics(params),
    enabled: enabled && stations.length > 0,
  })
}

/**
 * Hook to fetch climate data based on visualization mode
 */
export function useClimateData(
  stations: string[],
  yearFrom: number | null,
  yearTo: number | null,
  mode: VisualizationMode
) {
  const monthlyQuery = useMonthlyData(
    stations,
    yearFrom,
    yearTo,
    mode === 'monthly'
  )

  const annualQuery = useAnnualData(
    stations,
    yearFrom,
    yearTo,
    mode === 'annual'
  )

  const analyticsQuery = useAnalytics(stations, yearFrom, yearTo)

  return {
    monthlyData: monthlyQuery.data,
    annualData: annualQuery.data,
    analytics: analyticsQuery.data,
    isLoading:
      (mode === 'monthly' ? monthlyQuery.isLoading : annualQuery.isLoading) ||
      analyticsQuery.isLoading,
    error:
      (mode === 'monthly' ? monthlyQuery.error : annualQuery.error) ||
      analyticsQuery.error,
    isMonthlyLoading: monthlyQuery.isLoading,
    isAnnualLoading: annualQuery.isLoading,
    isAnalyticsLoading: analyticsQuery.isLoading,
  }
}
