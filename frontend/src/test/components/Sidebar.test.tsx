import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '../../features/stations/components/Sidebar'
import { renderWithProviders } from '../utils'
import type { ZoomState, Station } from '../../shared/types'

// Mock the useStations hook
vi.mock('../../shared/hooks/useClimateData', () => ({
  useStations: () => ({
    data: [
      { id: '101234', name: 'Station 101234', lat: 40.0, lon: -74.0 },
      { id: '66062', name: 'Station 66062', lat: 35.0, lon: -80.0 },
    ],
    isLoading: false,
    error: null,
  }),
}))

const mockStations: Station[] = [
  { id: '101234', name: 'Station 101234', lat: 40.0, lon: -74.0 },
  { id: '66062', name: 'Station 66062', lat: 35.0, lon: -80.0 },
]

describe('Sidebar', () => {
  const defaultProps = {
    selectedStations: [] as string[],
    onStationChange: vi.fn(),
    stations: mockStations,
    yearFrom: null as number | null,
    yearTo: null as number | null,
    onYearFromChange: vi.fn(),
    onYearToChange: vi.fn(),
    mode: 'annual' as const,
    onModeChange: vi.fn(),
    showSigmaBounds: false,
    onShowSigmaBoundsChange: vi.fn(),
    zoom: { centerYear: null, windowSize: 10 } as ZoomState,
    onZoomChange: vi.fn(),
    isCollapsed: false,
    onToggle: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render when not collapsed', () => {
      renderWithProviders(<Sidebar {...defaultProps} isCollapsed={false} />)

      expect(screen.getByText('Weather Stations')).toBeInTheDocument()
    })

    it('should render station selector', () => {
      renderWithProviders(<Sidebar {...defaultProps} />)

      expect(screen.getByText('Station 101234')).toBeInTheDocument()
      expect(screen.getByText('Station 66062')).toBeInTheDocument()
    })

    it('should render collapse button', () => {
      renderWithProviders(<Sidebar {...defaultProps} />)

      expect(screen.getByRole('button', { name: /Collapse sidebar/i })).toBeInTheDocument()
    })
  })

  describe('collapse/expand', () => {
    it('should be visible when not collapsed', () => {
      renderWithProviders(<Sidebar {...defaultProps} isCollapsed={false} />)

      // Just verify the sidebar is rendered
      expect(screen.getByText('Weather Stations')).toBeInTheDocument()
    })

    it('should call onToggle when collapse button is clicked', async () => {
      const user = userEvent.setup()
      const onToggle = vi.fn()

      renderWithProviders(<Sidebar {...defaultProps} onToggle={onToggle} />)

      await user.click(screen.getByRole('button', { name: /Collapse sidebar/i }))

      expect(onToggle).toHaveBeenCalled()
    })
  })

  describe('station selection', () => {
    it('should show selection count', () => {
      renderWithProviders(
        <Sidebar {...defaultProps} selectedStations={['101234']} />
      )

      expect(screen.getByText('1/2')).toBeInTheDocument()
    })

    it('should call onStationChange when station is clicked', async () => {
      const user = userEvent.setup()
      const onStationChange = vi.fn()

      renderWithProviders(
        <Sidebar {...defaultProps} onStationChange={onStationChange} />
      )

      await user.click(screen.getByText('Station 101234'))

      expect(onStationChange).toHaveBeenCalledWith(['101234'])
    })

    it('should show All/Clear toggle based on selection', () => {
      const { rerender } = renderWithProviders(<Sidebar {...defaultProps} selectedStations={[]} />)

      // When no stations selected, "All" should be visible
      expect(screen.getAllByText('All').length).toBeGreaterThan(0)

      // When all stations selected, "Clear" should be visible
      rerender(<Sidebar {...defaultProps} selectedStations={['101234', '66062']} />)
      expect(screen.getByText('Clear')).toBeInTheDocument()
    })
  })

  describe('with no stations', () => {
    it('should render empty state when no stations provided', () => {
      renderWithProviders(<Sidebar {...defaultProps} stations={undefined} />)

      // Should still render the sidebar structure
      expect(screen.getByText('Weather Stations')).toBeInTheDocument()
    })
  })
})
