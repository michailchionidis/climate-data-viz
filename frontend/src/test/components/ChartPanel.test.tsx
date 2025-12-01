import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { ChartPanel } from '../../features/visualization/components/ChartPanel'
import { renderWithProviders } from '../utils'
import type { AnnualDataResponse } from '../../shared/types'

// Mock Plotly
vi.mock('react-plotly.js', () => ({
  default: vi.fn(({ data }) => (
    <div data-testid="plotly-chart" data-traces={data?.length || 0}>
      Mock Plotly Chart
    </div>
  )),
}))

// Mock data
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
})
