/**
 * Tests for useUIState hook
 *
 * Verifies UI state management for:
 * - Loading state
 * - Sidebar collapse/expand
 * - Chat sidebar visibility
 * - AI Insights expansion
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
    it('should initialize as not loaded', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isLoaded).toBe(false)
    })

    it('should become loaded after animation delay', () => {
      const { result } = renderHook(() => useUIState())

      // Fast-forward past the animation delay
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

    it('should toggle sidebar using toggleSidebar', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isSidebarCollapsed).toBe(false)

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

  describe('Chat Sidebar State', () => {
    it('should initialize with chat closed', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isChatOpen).toBe(false)
    })

    it('should open chat using openChat', () => {
      const { result } = renderHook(() => useUIState())

      act(() => {
        result.current.openChat()
      })

      expect(result.current.isChatOpen).toBe(true)
    })

    it('should close chat using closeChat', () => {
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

    it('should toggle chat using toggleChat', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isChatOpen).toBe(false)

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

  describe('AI Insights Expansion', () => {
    it('should initialize with AI insights collapsed', () => {
      const { result } = renderHook(() => useUIState())

      expect(result.current.isAIInsightsExpanded).toBe(false)
    })

    it('should expand AI insights using setAIInsightsExpanded', () => {
      const { result } = renderHook(() => useUIState())

      act(() => {
        result.current.setAIInsightsExpanded(true)
      })

      expect(result.current.isAIInsightsExpanded).toBe(true)
    })

    it('should collapse AI insights using setAIInsightsExpanded', () => {
      const { result } = renderHook(() => useUIState())

      // Expand first
      act(() => {
        result.current.setAIInsightsExpanded(true)
      })

      // Then collapse
      act(() => {
        result.current.setAIInsightsExpanded(false)
      })

      expect(result.current.isAIInsightsExpanded).toBe(false)
    })
  })
})
