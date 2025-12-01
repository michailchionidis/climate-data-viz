import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import {
  useStations,
  useMonthlyData,
  useAnnualData,
  useAnalytics,
  useClimateData,
  queryKeys,
} from '../../shared/hooks/useClimateData'

// Mock the API client
vi.mock('@/api/client', () => ({
  getStations: vi.fn(() =>
    Promise.resolve([
      { id: '101234', name: 'Station 101234', lat: 40.0, lon: -74.0 },
      { id: '66062', name: 'Station 66062', lat: 35.0, lon: -80.0 },
    ])
  ),
  getMonthlyData: vi.fn(() =>
    Promise.resolve({
      stations: {
        '101234': [
          { year: 2019, month: 1, temperature: 5.5 },
          { year: 2019, month: 2, temperature: 7.2 },
        ],
      },
    })
  ),
  getAnnualData: vi.fn(() =>
    Promise.resolve({
      stations: {
        '101234': [
          { year: 2019, avg_temp: 12.5, std_temp: 5.2 },
          { year: 2018, avg_temp: 11.8, std_temp: 4.9 },
        ],
      },
    })
  ),
  getAnalytics: vi.fn(() =>
    Promise.resolve({
      min_temp: -15.5,
      max_temp: 35.2,
      avg_temp: 12.8,
      std_temp: 8.5,
      total_records: 1200,
      hottest_year: 2019,
      coldest_year: 1917,
      stations_count: 2,
    })
  ),
}))

// Create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('queryKeys', () => {
  it('should generate correct stations key', () => {
    expect(queryKeys.stations).toEqual(['stations'])
  })

  it('should generate correct monthlyData key', () => {
    const params = { stations: ['101234'], yearFrom: 2000, yearTo: 2020 }
    expect(queryKeys.monthlyData(params)).toEqual(['monthlyData', params])
  })

  it('should generate correct annualData key', () => {
    const params = { stations: ['101234'], yearFrom: 2000, yearTo: 2020 }
    expect(queryKeys.annualData(params)).toEqual(['annualData', params])
  })

  it('should generate correct analytics key', () => {
    const params = { stations: ['101234'], yearFrom: 2000, yearTo: 2020 }
    expect(queryKeys.analytics(params)).toEqual(['analytics', params])
  })
})

describe('useStations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch stations successfully', async () => {
    const { result } = renderHook(() => useStations(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0].id).toBe('101234')
  })

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useStations(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
  })
})

describe('useMonthlyData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch monthly data when enabled', async () => {
    const { result } = renderHook(
      () => useMonthlyData(['101234'], 2019, 2019, true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.stations['101234']).toBeDefined()
  })

  it('should not fetch when no stations selected', async () => {
    const { result } = renderHook(
      () => useMonthlyData([], 2019, 2019, true),
      { wrapper: createWrapper() }
    )

    // Should not be loading since query is disabled
    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('should not fetch when disabled', async () => {
    const { result } = renderHook(
      () => useMonthlyData(['101234'], 2019, 2019, false),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})

describe('useAnnualData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch annual data when enabled', async () => {
    const { result } = renderHook(
      () => useAnnualData(['101234'], 2018, 2019, true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.stations['101234']).toBeDefined()
  })

  it('should not fetch when no stations selected', async () => {
    const { result } = renderHook(
      () => useAnnualData([], 2018, 2019, true),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch analytics when enabled', async () => {
    const { result } = renderHook(
      () => useAnalytics(['101234'], 2018, 2019, true),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.avg_temp).toBe(12.8)
    expect(result.current.data?.hottest_year).toBe(2019)
  })

  it('should not fetch when no stations selected', async () => {
    const { result } = renderHook(
      () => useAnalytics([], 2018, 2019, true),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})

describe('useClimateData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch monthly data when mode is monthly', async () => {
    const { result } = renderHook(
      () => useClimateData(['101234'], 2019, 2019, 'monthly'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.monthlyData).toBeDefined()
    expect(result.current.analytics).toBeDefined()
  })

  it('should fetch annual data when mode is annual', async () => {
    const { result } = renderHook(
      () => useClimateData(['101234'], 2018, 2019, 'annual'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.annualData).toBeDefined()
    expect(result.current.analytics).toBeDefined()
  })

  it('should return combined loading state', () => {
    const { result } = renderHook(
      () => useClimateData(['101234'], 2019, 2019, 'monthly'),
      { wrapper: createWrapper() }
    )

    // Initially loading
    expect(result.current.isLoading).toBe(true)
  })

  it('should expose individual loading states', () => {
    const { result } = renderHook(
      () => useClimateData(['101234'], 2019, 2019, 'monthly'),
      { wrapper: createWrapper() }
    )

    expect(result.current).toHaveProperty('isMonthlyLoading')
    expect(result.current).toHaveProperty('isAnnualLoading')
    expect(result.current).toHaveProperty('isAnalyticsLoading')
  })
})
