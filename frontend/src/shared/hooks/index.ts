/**
 * Shared Hooks
 * Reusable hooks used across features
 */

export {
  useClimateData,
  useStations,
  useMonthlyData,
  useAnnualData,
  useAnalytics,
  queryKeys,
} from './useClimateData'

export {
  useFilters,
  type UseFiltersReturn,
  type FiltersState,
  type FiltersActions,
} from './useFilters'

export {
  useUIState,
  type UseUIStateReturn,
  type UIState,
  type UIActions,
} from './useUIState'

export { useKeyboardShortcuts } from './useKeyboardShortcuts'
