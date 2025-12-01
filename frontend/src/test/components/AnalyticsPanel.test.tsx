import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { AnalyticsPanel } from '../../features/analytics/components/AnalyticsPanel'
import { renderWithProviders } from '../utils'
import type { AnalyticsResponse, StationAnalytics } from '../../shared/types'

// Mock station analytics data
const mockStationAnalytics: StationAnalytics = {
  station_id: '101234',
  station_name: 'Station 101234',
  min_temp: -15.5,
  min_temp_year: 1917,
  min_temp_month: 1,
  max_temp: 35.2,
  max_temp_year: 2019,
  max_temp_month: 7,
  mean_temp: 12.8,
  std_temp: 8.5,
  coldest_year: 1917,
  coldest_year_temp: -10.2,
  hottest_year: 2019,
  hottest_year_temp: 25.5,
  data_coverage: 0.95,
}

// Mock analytics response
const mockAnalytics: AnalyticsResponse = {
  stations: [mockStationAnalytics],
  year_range: [1859, 2019],
  total_stations: 1,
}

const mockMultiStationAnalytics: AnalyticsResponse = {
  stations: [
    mockStationAnalytics,
    {
      ...mockStationAnalytics,
      station_id: '66062',
      station_name: 'Station 66062',
      min_temp: -12.0,
      max_temp: 38.0,
    },
    {
      ...mockStationAnalytics,
      station_id: '72503',
      station_name: 'Station 72503',
      min_temp: -18.0,
      max_temp: 32.0,
    },
  ],
  year_range: [1859, 2019],
  total_stations: 3,
}

describe('AnalyticsPanel', () => {
  describe('empty state', () => {
    it('should show placeholder when no stations selected', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={undefined}
          isLoading={false}
          selectedStations={[]}
        />
      )

      expect(screen.getByText('Analytics Summary')).toBeInTheDocument()
      // Should show placeholder dashes
      expect(screen.getAllByText('—').length).toBeGreaterThan(0)
    })

    it('should show header when no data', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={undefined}
          isLoading={false}
          selectedStations={[]}
        />
      )

      expect(screen.getByText('Analytics Summary')).toBeInTheDocument()
    })
  })

  describe('loading state', () => {
    it('should show header when loading', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={undefined}
          isLoading={true}
          selectedStations={['101234']}
        />
      )

      expect(screen.getByText('Analytics Summary')).toBeInTheDocument()
    })
  })

  describe('with data', () => {
    it('should display analytics data', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={mockAnalytics}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      expect(screen.getByText('Analytics Summary')).toBeInTheDocument()
      expect(screen.getByText('Min')).toBeInTheDocument()
      expect(screen.getByText('Max')).toBeInTheDocument()
      expect(screen.getByText('Avg')).toBeInTheDocument()
    })

    it('should display temperature values', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={mockAnalytics}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      // Check for formatted temperature values
      expect(screen.getByText('-15.5°C')).toBeInTheDocument()
      expect(screen.getByText('35.2°C')).toBeInTheDocument()
    })

    it('should display hottest and coldest labels', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={mockAnalytics}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      expect(screen.getByText('Hottest')).toBeInTheDocument()
      expect(screen.getByText('Coldest')).toBeInTheDocument()
    })

    it('should display multiple stations data', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={mockMultiStationAnalytics}
          isLoading={false}
          selectedStations={['101234', '66062', '72503']}
        />
      )

      // Should render analytics for multiple stations
      expect(screen.getByText('Analytics Summary')).toBeInTheDocument()
      expect(screen.getByText('Min')).toBeInTheDocument()
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={mockAnalytics}
          isLoading={false}
          selectedStations={['101234']}
          compact
        />
      )

      expect(screen.getByText('Analytics Summary')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('should handle single station', () => {
      renderWithProviders(
        <AnalyticsPanel
          analytics={mockAnalytics}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      // Single station - badge shows "1 station" or similar
      expect(screen.getByText('Analytics Summary')).toBeInTheDocument()
    })

    it('should handle empty stations array in analytics', () => {
      const emptyAnalytics: AnalyticsResponse = {
        stations: [],
        year_range: [1859, 2019],
        total_stations: 0,
      }

      renderWithProviders(
        <AnalyticsPanel
          analytics={emptyAnalytics}
          isLoading={false}
          selectedStations={['101234']}
        />
      )

      // Should show warning message
      expect(screen.getByText(/No data available/)).toBeInTheDocument()
    })
  })
})
