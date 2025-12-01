import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { LiveRegionProvider, useAnnounce } from '../../shared/components/ui/LiveRegion'
import { renderWithProviders } from '../utils'

describe('LiveRegion', () => {
  describe('LiveRegionProvider', () => {
    it('should render children', () => {
      renderWithProviders(
        <LiveRegionProvider>
          <div>Child content</div>
        </LiveRegionProvider>
      )

      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('should render polite live region', () => {
      renderWithProviders(
        <LiveRegionProvider>
          <div>Content</div>
        </LiveRegionProvider>
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('should render assertive live region', () => {
      renderWithProviders(
        <LiveRegionProvider>
          <div>Content</div>
        </LiveRegionProvider>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  describe('useAnnounce', () => {
    it('should throw error when used outside provider', () => {
      // Test component that uses useAnnounce outside provider
      function TestComponent() {
        const announce = useAnnounce()
        return <button onClick={() => announce('test')}>Announce</button>
      }

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderWithProviders(<TestComponent />)
      }).toThrow('useAnnounce must be used within a LiveRegionProvider')

      consoleSpy.mockRestore()
    })
  })

  describe('accessibility', () => {
    it('should have aria-live="polite" on status region', () => {
      renderWithProviders(
        <LiveRegionProvider>
          <div>Content</div>
        </LiveRegionProvider>
      )

      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })

    it('should have aria-live="assertive" on alert region', () => {
      renderWithProviders(
        <LiveRegionProvider>
          <div>Content</div>
        </LiveRegionProvider>
      )

      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
    })

    it('should have aria-atomic on both regions', () => {
      renderWithProviders(
        <LiveRegionProvider>
          <div>Content</div>
        </LiveRegionProvider>
      )

      expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true')
      expect(screen.getByRole('alert')).toHaveAttribute('aria-atomic', 'true')
    })
  })
})
