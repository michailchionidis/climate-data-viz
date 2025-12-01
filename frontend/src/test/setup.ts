/**
 * Test setup file for Vitest
 */
import '@testing-library/jest-dom'

// Mock Plotly
global.URL.createObjectURL = () => 'mock-url'

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = () => {}

// Mock window.matchMedia for theme detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Suppress CSS parsing errors from jsdom (Chakra UI v3 uses @layer and color-mix)
// which are not supported by jsdom's CSS parser
const originalConsoleError = console.error
console.error = (...args: unknown[]) => {
  const message = args[0]
  if (
    typeof message === 'string' &&
    message.includes('Could not parse CSS stylesheet')
  ) {
    return // Suppress this specific error
  }
  originalConsoleError.apply(console, args)
}

// Mock CSSStyleSheet.insertRule for jsdom compatibility
if (typeof CSSStyleSheet !== 'undefined') {
  const originalInsertRule = CSSStyleSheet.prototype.insertRule
  CSSStyleSheet.prototype.insertRule = function (rule: string, index?: number) {
    try {
      return originalInsertRule.call(this, rule, index)
    } catch {
      // Silently ignore CSS parsing errors
      return 0
    }
  }
}
