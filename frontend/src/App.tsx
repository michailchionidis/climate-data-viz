/**
 * Climate Data Explorer - Main Application
 * A Tesla-level dashboard for exploring historical temperature data
 *
 * Architecture:
 * - Feature-based folder structure (DDD-inspired)
 * - State management via custom hooks (useFilters, useUIState)
 * - Layout components in features/layout/
 * - Shared components and utilities in shared/
 *
 * This file is pure orchestration - no UI logic, just composition.
 */
import { useCallback } from 'react'
import { Box, Container } from '@chakra-ui/react'

// Features
import { AppHeader, AppFooter, MobileLayout, DesktopLayout } from '@/features/layout'
import { TourProvider, TourTooltip, WelcomeModal, tourSteps } from '@/features/onboarding'

// Shared
import { SkipLink, LiveRegionProvider } from '@/shared/components/ui'
import { useClimateData, useStations, useFilters, useUIState, useKeyboardShortcuts } from '@/shared/hooks'

// Core
import { useTheme } from '@/context/ThemeContext'
import type { VisualizationMode } from '@/shared/types'

/**
 * Main application content
 * Composes all features together
 */
function AppContent() {
  const { colors, colorMode } = useTheme()
  const cyanAccent = colors.accentCyanText

  // State management via custom hooks
  const filters = useFilters()
  const ui = useUIState()

  // Data fetching
  const { data: stations } = useStations()
  const { monthlyData, annualData, analytics, isLoading, isAnalyticsLoading } = useClimateData(
    filters.selectedStations,
    filters.yearFrom,
    filters.yearTo,
    filters.mode
  )

  // Event handlers
  const handleStationChange = useCallback(
    (stations: string[]) => filters.setSelectedStations(stations),
    [filters]
  )

  const handleModeChange = useCallback(
    (newMode: VisualizationMode) => {
      filters.setMode(newMode)
      if (newMode === 'monthly') {
        filters.setShowSigmaBounds(false)
      }
    },
    [filters]
  )

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      onToggleMode: filters.toggleMode,
      onToggleSigma: filters.toggleSigmaBounds,
      onToggleGrok: ui.toggleChat,
      onResetZoom: filters.resetZoom,
    },
    {
      isSigmaEnabled: filters.mode === 'annual',
      isGrokEnabled: filters.selectedStations.length > 0,
    }
  )

  // Shared props for layout components
  const layoutProps = {
    filters,
    ui,
    stations,
    analytics,
    monthlyData,
    annualData,
    isLoading,
    isAnalyticsLoading,
    onStationChange: handleStationChange,
    onModeChange: handleModeChange,
    colors,
    colorMode,
    cyanAccent,
  }

  return (
    <Box
      minH="100vh"
      h={{ base: 'auto', lg: '100vh' }}
      bg={colors.bg}
      display="flex"
      flexDirection="column"
      overflow={{ base: 'auto', lg: 'hidden' }}
      transition="background-color 0.3s ease"
      pt={{ base: 2, lg: 2 }}
    >
      {/* Accessibility: Skip Links */}
      <SkipLink targetId="main-content">Skip to main content</SkipLink>
      <SkipLink targetId="station-selector">Skip to station selector</SkipLink>
      <SkipLink targetId="chart-section">Skip to chart</SkipLink>

      {/* Header */}
      <AppHeader
        isLoaded={ui.isLoaded}
        isSidebarCollapsed={ui.isSidebarCollapsed}
        onToggleSidebar={ui.toggleSidebar}
        selectedStationsCount={filters.selectedStations.length}
        totalStationsCount={stations?.length || 0}
      />

      {/* Main Content */}
      <Container
        maxW={ui.isSidebarCollapsed ? '100%' : '1800px'}
        pt={0.5}
        pb={{ base: 4, lg: 0 }}
        px={{ base: 3, md: 4 }}
        mx="auto"
        flex={1}
        overflow={{ base: 'visible', lg: 'hidden' }}
        transition="max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        <MobileLayout {...layoutProps} />
        <DesktopLayout {...layoutProps} />
      </Container>

      {/* Footer */}
      <AppFooter isLoaded={ui.isLoaded} />
    </Box>
  )
}

/**
 * App Root
 * Provides global context (Tour, LiveRegion)
 */
function App() {
  return (
    <LiveRegionProvider>
      <TourProvider steps={tourSteps}>
        <AppContent />
        <WelcomeModal />
        <TourTooltip />
      </TourProvider>
    </LiveRegionProvider>
  )
}

export default App
