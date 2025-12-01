import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../../context/ThemeContext'
import type { ReactNode } from 'react'

// Helper wrapper for testing hooks
const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('ThemeProvider', () => {
    it('should provide default dark theme when no preference is set', () => {
      // Mock matchMedia to return dark preference
      vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.colorMode).toBe('dark')
      expect(result.current.colors).toBeDefined()
      expect(result.current.colors.bg).toBeDefined()
    })

    it('should use light theme when system prefers light', () => {
      // Mock matchMedia to return light preference
      vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: light)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.colorMode).toBe('light')
    })

    it('should restore theme from localStorage', () => {
      localStorage.setItem('climate-explorer-theme', 'light')

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.colorMode).toBe('light')
    })

    it('should persist theme to localStorage when changed', async () => {
      const { result, rerender } = renderHook(() => useTheme(), { wrapper })

      // Get initial mode
      const initialMode = result.current.colorMode

      act(() => {
        result.current.toggleColorMode()
      })

      // Wait for effect to run
      rerender()

      // Should be the opposite of initial
      const expectedMode = initialMode === 'dark' ? 'light' : 'dark'
      expect(localStorage.getItem('climate-explorer-theme')).toBe(expectedMode)
    })
  })

  describe('toggleColorMode', () => {
    it('should toggle from dark to light', () => {
      localStorage.setItem('climate-explorer-theme', 'dark')

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.colorMode).toBe('dark')

      act(() => {
        result.current.toggleColorMode()
      })

      expect(result.current.colorMode).toBe('light')
    })

    it('should toggle from light to dark', () => {
      localStorage.setItem('climate-explorer-theme', 'light')

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.colorMode).toBe('light')

      act(() => {
        result.current.toggleColorMode()
      })

      expect(result.current.colorMode).toBe('dark')
    })

    it('should update colors when toggling', () => {
      localStorage.setItem('climate-explorer-theme', 'dark')

      const { result } = renderHook(() => useTheme(), { wrapper })

      const darkBg = result.current.colors.bg

      act(() => {
        result.current.toggleColorMode()
      })

      const lightBg = result.current.colors.bg
      expect(darkBg).not.toBe(lightBg)
    })
  })

  describe('useTheme hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        renderHook(() => useTheme())
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleSpy.mockRestore()
    })

    it('should return colorMode, toggleColorMode, and colors', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current).toHaveProperty('colorMode')
      expect(result.current).toHaveProperty('toggleColorMode')
      expect(result.current).toHaveProperty('colors')
      expect(typeof result.current.toggleColorMode).toBe('function')
    })
  })

  describe('colors object', () => {
    it('should have all required color properties', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })

      const { colors } = result.current
      expect(colors.bg).toBeDefined()
      expect(colors.card).toBeDefined()
      expect(colors.text).toBeDefined()
      expect(colors.textMuted).toBeDefined()
      expect(colors.border).toBeDefined()
    })
  })
})
