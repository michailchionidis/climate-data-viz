/**
 * useKeyboardShortcuts Hook
 * Handles global keyboard shortcuts for the application
 */
import { useEffect, useCallback } from 'react'
import { KEYBOARD_SHORTCUTS } from '@/shared/constants'

interface KeyboardShortcutHandlers {
  onToggleMode?: () => void
  onToggleSigma?: () => void
  onToggleGrok?: () => void
  onResetZoom?: () => void
  onHelp?: () => void
}

interface UseKeyboardShortcutsOptions {
  /** Whether sigma toggle is enabled (only in annual mode) */
  isSigmaEnabled?: boolean
  /** Whether Grok toggle is enabled (only when stations selected) */
  isGrokEnabled?: boolean
}

/**
 * Check if the event target is an input element
 */
function isInputElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false

  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable
  )
}

export function useKeyboardShortcuts(
  handlers: KeyboardShortcutHandlers,
  options: UseKeyboardShortcutsOptions = {}
): void {
  const { isSigmaEnabled = true, isGrokEnabled = true } = options

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (isInputElement(e.target)) return

      // Skip if modifier keys are pressed (except for ?)
      if (e.metaKey || e.ctrlKey || e.altKey) return

      const key = e.key.toLowerCase()

      switch (key) {
        case KEYBOARD_SHORTCUTS.TOGGLE_MODE:
          e.preventDefault()
          handlers.onToggleMode?.()
          break

        case KEYBOARD_SHORTCUTS.TOGGLE_SIGMA:
          if (isSigmaEnabled) {
            e.preventDefault()
            handlers.onToggleSigma?.()
          }
          break

        case KEYBOARD_SHORTCUTS.TOGGLE_GROK:
          if (isGrokEnabled) {
            e.preventDefault()
            handlers.onToggleGrok?.()
          }
          break

        case KEYBOARD_SHORTCUTS.RESET_ZOOM:
          e.preventDefault()
          handlers.onResetZoom?.()
          break

        case KEYBOARD_SHORTCUTS.HELP:
          // Don't prevent default for ? as it might be used in search
          handlers.onHelp?.()
          break
      }
    },
    [handlers, isSigmaEnabled, isGrokEnabled]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
