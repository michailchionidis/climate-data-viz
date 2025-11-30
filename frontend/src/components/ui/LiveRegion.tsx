/**
 * Live Region Component for Screen Reader Announcements
 * Announces dynamic content changes to assistive technologies
 */
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { Box } from '@chakra-ui/react'

interface Announcement {
  message: string
  priority: 'polite' | 'assertive'
}

interface LiveRegionContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void
}

const LiveRegionContext = createContext<LiveRegionContextType | null>(null)

/**
 * Hook to access the live region announcer
 */
export function useAnnounce() {
  const context = useContext(LiveRegionContext)
  if (!context) {
    throw new Error('useAnnounce must be used within a LiveRegionProvider')
  }
  return context.announce
}

/**
 * Provider component that manages screen reader announcements
 */
export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('')
  const [assertiveMessage, setAssertiveMessage] = useState('')

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('')
      // Small delay to ensure the change is detected
      setTimeout(() => setAssertiveMessage(message), 50)
    } else {
      setPoliteMessage('')
      setTimeout(() => setPoliteMessage(message), 50)
    }
  }, [])

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}

      {/* Polite live region - waits for user to finish current task */}
      <Box
        as="div"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        position="absolute"
        width="1px"
        height="1px"
        padding="0"
        margin="-1px"
        overflow="hidden"
        clip="rect(0, 0, 0, 0)"
        whiteSpace="nowrap"
        border="0"
      >
        {politeMessage}
      </Box>

      {/* Assertive live region - interrupts current announcement */}
      <Box
        as="div"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        position="absolute"
        width="1px"
        height="1px"
        padding="0"
        margin="-1px"
        overflow="hidden"
        clip="rect(0, 0, 0, 0)"
        whiteSpace="nowrap"
        border="0"
      >
        {assertiveMessage}
      </Box>
    </LiveRegionContext.Provider>
  )
}
