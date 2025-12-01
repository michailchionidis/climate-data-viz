import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from '../../shared/hooks/useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  const handlers = {
    onToggleMode: vi.fn(),
    onToggleSigma: vi.fn(),
    onToggleGrok: vi.fn(),
    onResetZoom: vi.fn(),
    onHelp: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('mode toggle (M key)', () => {
    it('should call onToggleMode when M is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const event = new KeyboardEvent('keydown', { key: 'm' })
      window.dispatchEvent(event)

      expect(handlers.onToggleMode).toHaveBeenCalled()
    })

    it('should call onToggleMode when uppercase M is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const event = new KeyboardEvent('keydown', { key: 'M' })
      window.dispatchEvent(event)

      expect(handlers.onToggleMode).toHaveBeenCalled()
    })
  })

  describe('sigma toggle (S key)', () => {
    it('should call onToggleSigma when S is pressed and enabled', () => {
      renderHook(() => useKeyboardShortcuts(handlers, { isSigmaEnabled: true }))

      const event = new KeyboardEvent('keydown', { key: 's' })
      window.dispatchEvent(event)

      expect(handlers.onToggleSigma).toHaveBeenCalled()
    })

    it('should not call onToggleSigma when S is pressed but disabled', () => {
      renderHook(() => useKeyboardShortcuts(handlers, { isSigmaEnabled: false }))

      const event = new KeyboardEvent('keydown', { key: 's' })
      window.dispatchEvent(event)

      expect(handlers.onToggleSigma).not.toHaveBeenCalled()
    })
  })

  describe('grok toggle (G key)', () => {
    it('should call onToggleGrok when G is pressed and enabled', () => {
      renderHook(() => useKeyboardShortcuts(handlers, { isGrokEnabled: true }))

      const event = new KeyboardEvent('keydown', { key: 'g' })
      window.dispatchEvent(event)

      expect(handlers.onToggleGrok).toHaveBeenCalled()
    })

    it('should not call onToggleGrok when G is pressed but disabled', () => {
      renderHook(() => useKeyboardShortcuts(handlers, { isGrokEnabled: false }))

      const event = new KeyboardEvent('keydown', { key: 'g' })
      window.dispatchEvent(event)

      expect(handlers.onToggleGrok).not.toHaveBeenCalled()
    })
  })

  describe('reset zoom (R key)', () => {
    it('should call onResetZoom when R is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const event = new KeyboardEvent('keydown', { key: 'r' })
      window.dispatchEvent(event)

      expect(handlers.onResetZoom).toHaveBeenCalled()
    })
  })

  describe('help (? key)', () => {
    it('should call onHelp when ? is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const event = new KeyboardEvent('keydown', { key: '?' })
      window.dispatchEvent(event)

      expect(handlers.onHelp).toHaveBeenCalled()
    })
  })

  describe('input element handling', () => {
    it('should not trigger shortcuts when typing in input', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const input = document.createElement('input')
      document.body.appendChild(input)
      input.focus()

      const event = new KeyboardEvent('keydown', { key: 'm' })
      Object.defineProperty(event, 'target', { value: input })
      window.dispatchEvent(event)

      expect(handlers.onToggleMode).not.toHaveBeenCalled()

      document.body.removeChild(input)
    })

    it('should not trigger shortcuts when typing in textarea', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const textarea = document.createElement('textarea')
      document.body.appendChild(textarea)
      textarea.focus()

      const event = new KeyboardEvent('keydown', { key: 'm' })
      Object.defineProperty(event, 'target', { value: textarea })
      window.dispatchEvent(event)

      expect(handlers.onToggleMode).not.toHaveBeenCalled()

      document.body.removeChild(textarea)
    })
  })

  describe('modifier keys', () => {
    it('should not trigger shortcuts when Ctrl is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const event = new KeyboardEvent('keydown', { key: 'm', ctrlKey: true })
      window.dispatchEvent(event)

      expect(handlers.onToggleMode).not.toHaveBeenCalled()
    })

    it('should not trigger shortcuts when Meta is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const event = new KeyboardEvent('keydown', { key: 'm', metaKey: true })
      window.dispatchEvent(event)

      expect(handlers.onToggleMode).not.toHaveBeenCalled()
    })

    it('should not trigger shortcuts when Alt is pressed', () => {
      renderHook(() => useKeyboardShortcuts(handlers))

      const event = new KeyboardEvent('keydown', { key: 'm', altKey: true })
      window.dispatchEvent(event)

      expect(handlers.onToggleMode).not.toHaveBeenCalled()
    })
  })

  describe('cleanup', () => {
    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const { unmount } = renderHook(() => useKeyboardShortcuts(handlers))

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    })
  })
})
