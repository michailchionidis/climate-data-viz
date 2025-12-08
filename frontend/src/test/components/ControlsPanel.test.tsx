import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ControlsPanel } from '../../features/visualization/components/ControlsPanel'
import { renderWithProviders } from '../utils'
import type { ZoomState } from '../../shared/types'

describe('ControlsPanel', () => {
  const defaultProps = {
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
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render mode toggle', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} />)

      expect(screen.getByRole('radio', { name: /Annual/i })).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: /Monthly/i })).toBeInTheDocument()
    })

    it('should render sigma toggle', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} />)

      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    it('should render year range inputs', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} />)

      expect(screen.getByRole('spinbutton', { name: /Year range start/i })).toBeInTheDocument()
      expect(screen.getByRole('spinbutton', { name: /Year range end/i })).toBeInTheDocument()
    })

    it('should render year presets', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'Last 50y' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '20th C' })).toBeInTheDocument()
      // "All" appears multiple times in the UI, so we check for at least one
      expect(screen.getAllByText('All').length).toBeGreaterThan(0)
    })
  })

  describe('mode toggle', () => {
    it('should show annual mode as selected by default', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} mode="annual" />)

      expect(screen.getByRole('radio', { name: /Annual/i })).toBeChecked()
    })

    it('should show monthly mode when selected', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} mode="monthly" />)

      expect(screen.getByRole('radio', { name: /Monthly/i })).toBeChecked()
    })

    it('should call onModeChange when mode is toggled', async () => {
      const user = userEvent.setup()
      const onModeChange = vi.fn()

      renderWithProviders(
        <ControlsPanel {...defaultProps} mode="annual" onModeChange={onModeChange} />
      )

      await user.click(screen.getByRole('radio', { name: /Monthly/i }))

      expect(onModeChange).toHaveBeenCalledWith('monthly')
    })
  })

  describe('sigma toggle', () => {
    it('should show sigma toggle as unchecked by default', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} showSigmaBounds={false} />)

      expect(screen.getByRole('switch')).not.toBeChecked()
    })

    it('should show sigma toggle as checked when enabled', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} showSigmaBounds={true} />)

      expect(screen.getByRole('switch')).toBeChecked()
    })

    it('should call onShowSigmaBoundsChange when toggled', async () => {
      const user = userEvent.setup()
      const onShowSigmaBoundsChange = vi.fn()

      renderWithProviders(
        <ControlsPanel
          {...defaultProps}
          showSigmaBounds={false}
          onShowSigmaBoundsChange={onShowSigmaBoundsChange}
        />
      )

      await user.click(screen.getByRole('switch'))

      expect(onShowSigmaBoundsChange).toHaveBeenCalledWith(true)
    })

    it('should be disabled in monthly mode', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} mode="monthly" />)

      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('aria-disabled', 'true')
    })

    it('should have tooltip explaining disabled state in monthly mode', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} mode="monthly" />)

      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('title', 'Only available in Annual mode')
    })

    it('should not have tooltip in annual mode', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} mode="annual" />)

      const toggle = screen.getByRole('switch')
      expect(toggle).not.toHaveAttribute('title')
    })

    it('should not respond to clicks in monthly mode', async () => {
      const user = userEvent.setup()
      const onShowSigmaBoundsChange = vi.fn()

      renderWithProviders(
        <ControlsPanel
          {...defaultProps}
          mode="monthly"
          showSigmaBounds={false}
          onShowSigmaBoundsChange={onShowSigmaBoundsChange}
        />
      )

      await user.click(screen.getByRole('switch'))

      expect(onShowSigmaBoundsChange).not.toHaveBeenCalled()
    })

    it('should have reduced opacity in monthly mode', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} mode="monthly" />)

      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveStyle({ opacity: '0.5' })
    })
  })

  describe('year range inputs', () => {
    it('should display year values when set', () => {
      renderWithProviders(
        <ControlsPanel {...defaultProps} yearFrom={1950} yearTo={2000} />
      )

      expect(screen.getByRole('spinbutton', { name: /Year range start/i })).toHaveValue(1950)
      expect(screen.getByRole('spinbutton', { name: /Year range end/i })).toHaveValue(2000)
    })

    it('should call onYearFromChange when from year changes', async () => {
      const user = userEvent.setup()
      const onYearFromChange = vi.fn()

      renderWithProviders(
        <ControlsPanel {...defaultProps} onYearFromChange={onYearFromChange} />
      )

      const input = screen.getByRole('spinbutton', { name: /Year range start/i })
      await user.clear(input)
      await user.type(input, '1900')
      fireEvent.blur(input)

      expect(onYearFromChange).toHaveBeenCalled()
    })

    it('should call onYearToChange when to year changes', async () => {
      const user = userEvent.setup()
      const onYearToChange = vi.fn()

      renderWithProviders(
        <ControlsPanel {...defaultProps} onYearToChange={onYearToChange} />
      )

      const input = screen.getByRole('spinbutton', { name: /Year range end/i })
      await user.clear(input)
      await user.type(input, '2010')
      fireEvent.blur(input)

      expect(onYearToChange).toHaveBeenCalled()
    })
  })

  describe('year presets', () => {
    it('should apply Last 50y preset', async () => {
      const user = userEvent.setup()
      const onYearFromChange = vi.fn()
      const onYearToChange = vi.fn()

      renderWithProviders(
        <ControlsPanel
          {...defaultProps}
          onYearFromChange={onYearFromChange}
          onYearToChange={onYearToChange}
        />
      )

      await user.click(screen.getByRole('button', { name: 'Last 50y' }))

      expect(onYearFromChange).toHaveBeenCalledWith(1970)
      expect(onYearToChange).toHaveBeenCalledWith(2019)
    })

    it('should apply 20th C preset', async () => {
      const user = userEvent.setup()
      const onYearFromChange = vi.fn()
      const onYearToChange = vi.fn()

      renderWithProviders(
        <ControlsPanel
          {...defaultProps}
          onYearFromChange={onYearFromChange}
          onYearToChange={onYearToChange}
        />
      )

      await user.click(screen.getByRole('button', { name: '20th C' }))

      expect(onYearFromChange).toHaveBeenCalledWith(1900)
      expect(onYearToChange).toHaveBeenCalledWith(1999)
    })
  })

  describe('compact mode', () => {
    it('should render in compact mode', () => {
      renderWithProviders(<ControlsPanel {...defaultProps} compact />)

      expect(screen.getByRole('radio', { name: /Annual/i })).toBeInTheDocument()
    })
  })
})
