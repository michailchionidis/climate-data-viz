import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../../shared/components/ui/ThemeToggle'
import { renderWithProviders } from '../utils'

describe('ThemeToggle', () => {
  describe('rendering', () => {
    it('should render the toggle button', () => {
      renderWithProviders(<ThemeToggle />)

      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    it('should have correct aria-label for dark mode', () => {
      renderWithProviders(<ThemeToggle />)

      expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Switch to light mode')
    })

    it('should contain sun and moon icons', () => {
      const { container } = renderWithProviders(<ThemeToggle />)

      // Should have 2 SVG icons (sun and moon)
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('sizes', () => {
    it('should render with default md size', () => {
      renderWithProviders(<ThemeToggle />)

      const toggle = screen.getByRole('switch')
      expect(toggle).toBeInTheDocument()
    })

    it('should render with sm size', () => {
      renderWithProviders(<ThemeToggle size="sm" />)

      const toggle = screen.getByRole('switch')
      expect(toggle).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('should toggle theme when clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<ThemeToggle />)

      const toggle = screen.getByRole('switch')

      // Initial state should be dark mode (aria-checked true)
      expect(toggle).toHaveAttribute('aria-checked', 'true')

      // Click to toggle
      await user.click(toggle)

      // After click, should be light mode
      expect(toggle).toHaveAttribute('aria-checked', 'false')
      expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode')
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()

      renderWithProviders(<ThemeToggle />)

      const toggle = screen.getByRole('switch')

      // Tab to the toggle
      await user.tab()
      expect(toggle).toHaveFocus()

      // Press Enter to toggle - initial state is dark (true), after toggle should be light (false)
      const initialState = toggle.getAttribute('aria-checked')
      await user.keyboard('{Enter}')

      // Should toggle the theme to the opposite state
      const newState = toggle.getAttribute('aria-checked')
      expect(newState).not.toBe(initialState)
    })
  })

  describe('accessibility', () => {
    it('should have role="switch"', () => {
      renderWithProviders(<ThemeToggle />)

      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    it('should have aria-checked attribute', () => {
      renderWithProviders(<ThemeToggle />)

      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('aria-checked')
    })

    it('should have descriptive aria-label', () => {
      renderWithProviders(<ThemeToggle />)

      const toggle = screen.getByRole('switch')
      expect(toggle.getAttribute('aria-label')).toMatch(/Switch to (light|dark) mode/)
    })
  })
})
