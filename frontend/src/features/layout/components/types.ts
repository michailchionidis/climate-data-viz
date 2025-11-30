/**
 * Layout component types
 */
import type { UseFiltersReturn } from '@/shared/hooks/useFilters'
import type { UseUIStateReturn } from '@/shared/hooks/useUIState'
import type { VisualizationMode } from '@/shared/types'

export interface LayoutProps {
  filters: UseFiltersReturn
  ui: UseUIStateReturn
  stations: { id: string; name: string }[] | undefined
  analytics: any
  monthlyData: any
  annualData: any
  isLoading: boolean
  isAnalyticsLoading: boolean
  onStationChange: (stations: string[]) => void
  onModeChange: (mode: VisualizationMode) => void
  colors: any
  colorMode: string
  cyanAccent?: string
}
