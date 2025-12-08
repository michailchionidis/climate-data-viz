import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { ChartPanel } from '../../features/visualization/components/ChartPanel'
import { renderWithProviders } from '../utils'
import type { AnnualDataResponse, MonthlyDataResponse } from '../../shared/types'

// Mock Plotly with revision tracking - must be defined inline due to hoisting
vi.mock('react-plotly.js', () => ({
  default: vi.fn(({ data, revision }: { data?: Array<{ name?: string }>; revision?: number }) => (
    <div
      data-testid="plotly-chart"
      data-traces={data?.length || 0}
      data-revision={revision}
      data-station-ids={data?.filter((d) => d.name && !d.name.includes('σ')).map((d) => d.name).join(',')}
    >
      Mock Plotly Chart
    </div>
  )),
}))

// Mock data - single station
const mockAnnualData: AnnualDataResponse = {
  stations: [
    {
      station_id: '101234',
      station_name: 'Station 101234',
      data: [
        { year: 2017, mean: 11.5, std: 5.2, min_temp: 3.2, max_temp: 22.1, lower_bound: 6.3, upper_bound: 16.7 },
        { year: 2018, mean: 12.0, std: 5.0, min_temp: 3.5, max_temp: 22.5, lower_bound: 7.0, upper_bound: 17.0 },
        { year: 2019, mean: 12.5, std: 4.8, min_temp: 4.0, max_temp: 23.0, lower_bound: 7.7, upper_bound: 17.3 },
      ],
    },
  ],
  total_years: 3,
}

// Mock data - multiple stations
const mockAnnualDataMultiple: AnnualDataResponse = {
  stations: [
    {
      station_id: '101234',
      station_name: 'Station 101234',
      data: [
        { year: 2017, mean: 11.5, std: 5.2, min_temp: 3.2, max_temp: 22.1, lower_bound: 6.3, upper_bound: 16.7 },
      ],
    },
    {
      station_id: '105678',
      station_name: 'Station 105678',
      data: [
        { year: 2017, mean: 13.5, std: 4.8, min_temp: 5.2, max_temp: 24.1, lower_bound: 8.7, upper_bound: 18.3 },
      ],
    },
  ],
  total_years: 1,
}

// Mock data - after removing one station
const mockAnnualDataAfterRemoval: AnnualDataResponse = {
  stations: [
    {
      station_id: '105678',
      station_name: 'Station 105678',
      data: [
        { year: 2017, mean: 13.5, std: 4.8, min_temp: 5.2, max_temp: 24.1, lower_bound: 8.7, upper_bound: 18.3 },
      ],
    },
  ],
  total_years: 1,
}

// Mock monthly data
const mockMonthlyData: MonthlyDataResponse = {
  stations: [
    {
      station_id: '101234',
      station_name: 'Station 101234',
      data: [
        { year: 2017, month: 1, temperature: 5.2 },
        { year: 2017, month: 2, temperature: 6.1 },
      ],
    },
  ],
  total_points: 2,
}

describe('ChartPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('empty state', () => {
    it('should show empty state when no stations selected', () => {
      renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={undefined}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={[]}
        />
      )

      expect(screen.getByText('Annual Averages')).toBeInTheDocument()
      expect(screen.getByText(/Choose weather stations/)).toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('should show loading indicator when loading', () => {
      renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={undefined}
          mode="annual"
          showSigmaBounds={false}
          isLoading={true}
          selectedStations={['101234']}
        />
      )

      expect(screen.getByText(/Loading/)).toBeInTheDocument()
    })
  })

  describe('with data', () => {
    it('should render chart with annual data', () => {
      renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
      expect(screen.getByText('Annual Averages')).toBeInTheDocument()
    })
  })

  describe('expand/collapse', () => {
    it('should toggle expanded state when header is clicked', () => {
      renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      // Find the header and click it
      const header = screen.getByText('Annual Averages')
      fireEvent.click(header)

      // Component should still render (collapsed state)
      expect(screen.getByText('Annual Averages')).toBeInTheDocument()
    })
  })

  describe('fillHeight prop', () => {
    it('should render with fillHeight', () => {
      renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234']}
          fillHeight
        />
      )

      expect(screen.getByTestId('plotly-chart')).toBeInTheDocument()
    })
  })

  describe('chart updates when data changes', () => {
    it('should update chart when stations are added', () => {
      const { rerender } = renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      const chartBefore = screen.getByTestId('plotly-chart')
      expect(chartBefore.getAttribute('data-traces')).toBe('1')

      // Add another station
      rerender(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualDataMultiple}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234', '105678']}
        />
      )

      const chartAfter = screen.getByTestId('plotly-chart')
      expect(chartAfter.getAttribute('data-traces')).toBe('2')
    })

    it('should update chart when stations are removed', () => {
      const { rerender } = renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualDataMultiple}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234', '105678']}
        />
      )

      const chartBefore = screen.getByTestId('plotly-chart')
      expect(chartBefore.getAttribute('data-traces')).toBe('2')

      // Remove one station
      rerender(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualDataAfterRemoval}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['105678']}
        />
      )

      const chartAfter = screen.getByTestId('plotly-chart')
      expect(chartAfter.getAttribute('data-traces')).toBe('1')
    })

    it('should update chart when switching between annual and monthly mode', () => {
      const { rerender } = renderWithProviders(
        <ChartPanel
          monthlyData={mockMonthlyData}
          annualData={mockAnnualData}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      expect(screen.getByText('Annual Averages')).toBeInTheDocument()

      // Switch to monthly mode
      rerender(
        <ChartPanel
          monthlyData={mockMonthlyData}
          annualData={mockAnnualData}
          mode="monthly"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      expect(screen.getByText('Monthly Temperature Data')).toBeInTheDocument()
    })

    it('should update chart when sigma bounds is toggled', () => {
      const { rerender } = renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      // Without sigma bounds: 1 trace (just the mean line)
      const chartBefore = screen.getByTestId('plotly-chart')
      expect(chartBefore.getAttribute('data-traces')).toBe('1')

      // Enable sigma bounds
      rerender(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
          showSigmaBounds={true}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      // With sigma bounds: 3 traces (upper bound, lower bound fill, mean line)
      const chartAfter = screen.getByTestId('plotly-chart')
      expect(chartAfter.getAttribute('data-traces')).toBe('3')
    })
  })

  describe('multiple stations', () => {
    it('should render multiple station traces', () => {
      renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualDataMultiple}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234', '105678']}
        />
      )

      const chart = screen.getByTestId('plotly-chart')
      expect(chart.getAttribute('data-traces')).toBe('2')
    })

    it('should render legend toggle hint when multiple stations selected', () => {
      renderWithProviders(
        <ChartPanel
          monthlyData={undefined}
          annualData={mockAnnualDataMultiple}
          mode="annual"
          showSigmaBounds={false}
          isLoading={false}
          selectedStations={['101234', '105678']}
        />
      )

      expect(screen.getByText('Click legend to toggle')).toBeInTheDocument()
    })
  })
})
