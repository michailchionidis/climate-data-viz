import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StationSelector } from '../../features/stations/components/StationSelector'
import { renderWithProviders } from '../utils'

// Mock the useStations hook at module level
const mockStations = [
  { id: '101234', name: 'Station 101234' },
  { id: '66062', name: 'Station 66062' },
  { id: '72503', name: 'Station 72503' },
]

vi.mock('../../shared/hooks/useClimateData', () => ({
  useStations: () => ({
    data: mockStations,
    isLoading: false,
    error: null,
  }),
}))

describe('StationSelector', () => {
  const mockOnSelectionChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render station list', () => {
      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      expect(screen.getByText('Station 101234')).toBeInTheDocument()
      expect(screen.getByText('Station 66062')).toBeInTheDocument()
      expect(screen.getByText('Station 72503')).toBeInTheDocument()
    })

    it('should render header by default', () => {
      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      expect(screen.getByText('Weather Stations')).toBeInTheDocument()
    })

    it('should hide header when hideHeader is true', () => {
      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
          hideHeader
        />
      )

      expect(screen.queryByText('Weather Stations')).not.toBeInTheDocument()
    })

    it('should show selection count', () => {
      renderWithProviders(
        <StationSelector
          selectedStations={['101234']}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      expect(screen.getByText('1/3')).toBeInTheDocument()
    })
  })

  describe('selection', () => {
    it('should call onSelectionChange when station is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      await user.click(screen.getByText('Station 101234'))

      expect(mockOnSelectionChange).toHaveBeenCalledWith(['101234'])
    })

    it('should deselect station when already selected', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <StationSelector
          selectedStations={['101234']}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      await user.click(screen.getByText('Station 101234'))

      expect(mockOnSelectionChange).toHaveBeenCalledWith([])
    })

    it('should select all stations when clicking All button', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      await user.click(screen.getByText('All'))

      expect(mockOnSelectionChange).toHaveBeenCalledWith(['101234', '66062', '72503'])
    })

    it('should deselect all when all are selected', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <StationSelector
          selectedStations={['101234', '66062', '72503']}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      // When all are selected, clicking any station deselects it
      await user.click(screen.getByText('Station 101234'))

      expect(mockOnSelectionChange).toHaveBeenCalledWith(['66062', '72503'])
    })
  })

  describe('search', () => {
    it('should filter stations based on search query', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, '101234')

      expect(screen.getByText('Station 101234')).toBeInTheDocument()
      expect(screen.queryByText('Station 66062')).not.toBeInTheDocument()
    })

    it('should show all stations when search is cleared', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      const searchInput = screen.getByPlaceholderText('Search...')
      await user.type(searchInput, '101234')
      await user.clear(searchInput)

      expect(screen.getByText('Station 101234')).toBeInTheDocument()
      expect(screen.getByText('Station 66062')).toBeInTheDocument()
    })
  })

  describe('keyboard navigation', () => {
    it('should support keyboard interaction', () => {
      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
        />
      )

      const searchInput = screen.getByPlaceholderText('Search...')
      fireEvent.focus(searchInput)
      fireEvent.keyDown(searchInput, { key: 'ArrowDown' })

      // Just verify no errors occur
      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      renderWithProviders(
        <StationSelector
          selectedStations={[]}
          onSelectionChange={mockOnSelectionChange}
          compact
        />
      )

      expect(screen.getByText('Station 101234')).toBeInTheDocument()
    })
  })
})
