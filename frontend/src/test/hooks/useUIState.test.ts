/**
 * Tests for useUIState hook
 *
 * Verifies UI state management for:
 * - Loading state
 * - Sidebar collapse
 * - Chat sidebar
 * - AI Insights panel
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUIState } from '@/shared/hooks/useUIState'

describe('useUIState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Loading State', () => {
    it('should initialize with isLoaded false', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isLoaded).toBe(false)
    })

    it('should set isLoaded to true after animation delay', async () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isLoaded).toBe(false)

      // Advance timers past the animation delay
      act(() => {
        vi.advanceTimersByTime(200)
      })

      expect(result.current.isLoaded).toBe(true)
    })
  })

  describe('Sidebar State', () => {
    it('should initialize with sidebar expanded', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isSidebarCollapsed).toBe(false)
    })

    it('should toggle sidebar collapsed state', () => {
      const { result } = renderHook(() => useUIState())

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.isSidebarCollapsed).toBe(true)

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.isSidebarCollapsed).toBe(false)
    })
  })

  describe('Chat State', () => {
    it('should initialize with chat closed', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isChatOpen).toBe(false)
    })

    it('should open chat', () => {
      const { result } = renderHook(() => useUIState())

      act(() => {
        result.current.openChat()
      })

      expect(result.current.isChatOpen).toBe(true)
    })

    it('should close chat', () => {
      const { result } = renderHook(() => useUIState())

      // Open first
      act(() => {
        result.current.openChat()
      })

      // Then close
      act(() => {
        result.current.closeChat()
      })

      expect(result.current.isChatOpen).toBe(false)
    })

    it('should toggle chat', () => {
      const { result } = renderHook(() => useUIState())

      act(() => {
        result.current.toggleChat()
      })

      expect(result.current.isChatOpen).toBe(true)

      act(() => {
        result.current.toggleChat()
      })

      expect(result.current.isChatOpen).toBe(false)
    })
  })

  describe('AI Insights State', () => {
    it('should initialize with AI insights collapsed', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isAIInsightsExpanded).toBe(false)
    })

    it('should set AI insights expanded state', () => {
      const { result } = renderHook(() => useUIState())

      act(() => {
        result.current.setAIInsightsExpanded(true)
      })

      expect(result.current.isAIInsightsExpanded).toBe(true)

      act(() => {
        result.current.setAIInsightsExpanded(false)
      })

      expect(result.current.isAIInsightsExpanded).toBe(false)
    })
  })

  describe('Cleanup', () => {
    it('should clean up timer on unmount', () => {
      const { unmount } = renderHook(() => useUIState())

      unmount()

      // Should not throw or cause issues
      act(() => {
        vi.advanceTimersByTime(200)
      })
    })
  })
})
