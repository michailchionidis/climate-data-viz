/**
 * useUIState Hook
 * Manages UI-related state (sidebars, modals, loading states)
 * Extracted from App.tsx for better separation of concerns
 */
import { useState, useCallback, useEffect } from 'react'
import { ANIMATION } from '@/shared/constants'

export interface UIState {
  isLoaded: boolean
  isSidebarCollapsed: boolean
  isChatOpen: boolean
  isAIInsightsExpanded: boolean
}

export interface UIActions {
  toggleSidebar: () => void
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  setAIInsightsExpanded: (expanded: boolean) => void
}

export interface UseUIStateReturn extends UIState, UIActions {}

export function useUIState(): UseUIStateReturn {
  // Loading state for entrance animation
  const [isLoaded, setIsLoaded] = useState(false)

  // Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Panel states
  const [isAIInsightsExpanded, setIsAIInsightsExpanded] = useState(false)

  // Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), ANIMATION.ENTRANCE)
    return () => clearTimeout(timer)
  }, [])

  // Actions
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  const openChat = useCallback(() => {
    setIsChatOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setIsChatOpen(false)
  }, [])

  const toggleChat = useCallback(() => {
    setIsChatOpen((prev) => !prev)
  }, [])

  return {
    // State
    isLoaded,
    isSidebarCollapsed,
    isChatOpen,
    isAIInsightsExpanded,

    // Actions
    toggleSidebar,
    openChat,
    closeChat,
    toggleChat,
    setAIInsightsExpanded: setIsAIInsightsExpanded,
  }
}
