/**
 * Application Constants
 * Centralized configuration values for the Climate Data Explorer
 */

// Data Range Constants
export const DATA_RANGE = {
  MIN_YEAR: 1859,
  MAX_YEAR: 2019,
  TOTAL_YEARS: 161,
  TOTAL_STATIONS: 10,
} as const

// Zoom Configuration
export const ZOOM_CONFIG = {
  MIN_WINDOW: 5,
  MAX_WINDOW: 50,
  DEFAULT_WINDOW: 10,
  STEP: 5,
} as const

// Animation Durations (ms)
export const ANIMATION = {
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  ENTRANCE: 100,
  SIDEBAR_TRANSITION: 300,
  CHART_RESIZE: 350,
} as const

// Layout Constants
export const LAYOUT = {
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 0,
  CHAT_SIDEBAR_WIDTH: 320,
  HEADER_HEIGHT: 56,
  FOOTER_HEIGHT: 40,
  CONTAINER_MAX_WIDTH: 1800,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
} as const

// Chart Configuration
export const CHART_CONFIG = {
  MIN_HEIGHT: 400,
  DEFAULT_HEIGHT: 450,
  LEGEND_POSITION: {
    DESKTOP: { x: 0.02, y: 0.98 },
    MOBILE: { x: 0.5, y: -0.15 },
  },
  HOVER_MODE: 'x unified' as const,
  DRAG_MODE: 'pan' as const,
} as const

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
} as const

// Query Cache Configuration
export const QUERY_CONFIG = {
  STALE_TIME: {
    STATIONS: Infinity, // Stations don't change
    DATA: 5 * 60 * 1000, // 5 minutes
    ANALYTICS: 5 * 60 * 1000,
    AI_INSIGHTS: 10 * 60 * 1000, // 10 minutes
  },
} as const

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  TOGGLE_MODE: 'm',
  TOGGLE_SIGMA: 's',
  TOGGLE_GROK: 'g',
  RESET_ZOOM: 'r',
  HELP: '?',
} as const

// Year Presets for quick selection
export const YEAR_PRESETS = [
  { label: 'Last 50y', from: 1970, to: 2019 },
  { label: '20th C', from: 1900, to: 1999 },
  { label: 'All', from: null, to: null },
] as const

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'climate-explorer-theme',
  TOUR_COMPLETED: 'climate-explorer-tour-completed',
  TOUR_VERSION: '1',
} as const

// Accessibility
export const A11Y = {
  SKIP_LINK_TARGETS: {
    MAIN: 'main-content',
    STATIONS: 'station-selector',
    CHART: 'chart-section',
  },
  LIVE_REGION_DELAY: 50,
} as const
