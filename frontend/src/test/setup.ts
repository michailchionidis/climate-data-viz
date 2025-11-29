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
