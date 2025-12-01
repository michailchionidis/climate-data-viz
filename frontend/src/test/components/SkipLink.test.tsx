import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { SkipLink, VisuallyHidden } from '../../shared/components/ui/SkipLink'
import { renderWithProviders } from '../utils'

describe('SkipLink', () => {
  describe('rendering', () => {
    it('should render the skip link', () => {
      renderWithProviders(<SkipLink targetId="main-content">Skip to main content</SkipLink>)

      expect(screen.getByText('Skip to main content')).toBeInTheDocument()
    })

    it('should have correct href', () => {
      renderWithProviders(<SkipLink targetId="main-content">Skip to main content</SkipLink>)

      const link = screen.getByText('Skip to main content')
      expect(link).toHaveAttribute('href', '#main-content')
    })

    it('should be visually hidden by default', () => {
      renderWithProviders(<SkipLink targetId="main-content">Skip to main content</SkipLink>)

      const link = screen.getByText('Skip to main content')
      expect(link).toHaveStyle({ position: 'absolute' })
    })
  })

  describe('interaction', () => {
    it('should focus target element when clicked', () => {
      // Create a target element
      const targetElement = document.createElement('div')
      targetElement.id = 'main-content'
      targetElement.tabIndex = -1
      // Mock scrollIntoView
      targetElement.scrollIntoView = vi.fn()
      document.body.appendChild(targetElement)

      const focusSpy = vi.spyOn(targetElement, 'focus')
      const scrollSpy = vi.spyOn(targetElement, 'scrollIntoView')

      renderWithProviders(<SkipLink targetId="main-content">Skip to main content</SkipLink>)

      const link = screen.getByText('Skip to main content')
      fireEvent.click(link)

      expect(focusSpy).toHaveBeenCalled()
      expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' })

      // Cleanup
      document.body.removeChild(targetElement)
    })

    it('should not throw when target element does not exist', () => {
      renderWithProviders(<SkipLink targetId="non-existent">Skip to main content</SkipLink>)

      const link = screen.getByText('Skip to main content')

      // Should not throw
      expect(() => fireEvent.click(link)).not.toThrow()
    })
  })

  describe('accessibility', () => {
    it('should be a link element', () => {
      renderWithProviders(<SkipLink targetId="main-content">Skip to main content</SkipLink>)

      expect(screen.getByRole('link', { name: 'Skip to main content' })).toBeInTheDocument()
    })
  })
})

describe('VisuallyHidden', () => {
  describe('rendering', () => {
    it('should render children', () => {
      renderWithProviders(<VisuallyHidden>Hidden text</VisuallyHidden>)

      expect(screen.getByText('Hidden text')).toBeInTheDocument()
    })

    it('should be visually hidden', () => {
      renderWithProviders(<VisuallyHidden>Hidden text</VisuallyHidden>)

      const element = screen.getByText('Hidden text')
      expect(element).toHaveStyle({
        position: 'absolute',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      })
    })

    it('should still be accessible to screen readers', () => {
      renderWithProviders(<VisuallyHidden>Screen reader text</VisuallyHidden>)

      // Element should exist in the DOM
      expect(screen.getByText('Screen reader text')).toBeInTheDocument()
    })
  })
})
