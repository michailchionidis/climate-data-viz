/**
 * Climate Data Explorer - Main Application
 * A Tesla-level dashboard for exploring historical temperature data
 * Features full accessibility support (WCAG 2.1 AA compliant)
 *
 * Architecture:
 * - State management extracted to custom hooks (useFilters, useUIState)
 * - Layout components separated (AppHeader, AppFooter)
 * - Constants centralized in constants/index.ts
 */
import { useCallback } from 'react'
import { Box, Container, Text, Flex, Link } from '@chakra-ui/react'
import { StationSelector } from './components/StationSelector'
import { ControlsPanel } from './components/ControlsPanel'
import { AnalyticsPanel } from './components/AnalyticsPanel'
import { AIInsightsPanel, ChatSidebar } from './components/ai'
import { ChartPanel } from './components/ChartPanel'
import { Sidebar } from './components/Sidebar'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ActivityIcon, SidebarIcon } from './components/ui/Icons'
import { ThemeToggle } from './components/ui/ThemeToggle'
import { CollapsibleSection } from './components/ui/CollapsibleSection'
import { SkipLink } from './components/ui/SkipLink'
import { LiveRegionProvider } from './components/ui/LiveRegion'
import { TourProvider, TourTooltip, WelcomeModal, HelpButton, tourSteps } from './components/tour'
import { useClimateData, useStations, useFilters, useUIState, useKeyboardShortcuts } from './hooks'
import { useTheme } from './context/ThemeContext'
import type { VisualizationMode } from './types'

function AppContent() {
  // Theme
  const { colors, colorMode } = useTheme()
  const cyanAccent = colors.accentCyanText

  // Custom hooks for state management
  const filters = useFilters()
  const ui = useUIState()

  // Fetch stations list
  const { data: stations } = useStations()

  // Fetch data based on current filters
  const { monthlyData, annualData, analytics, isLoading, isAnalyticsLoading } = useClimateData(
    filters.selectedStations,
    filters.yearFrom,
    filters.yearTo,
    filters.mode
  )

  // Handlers
  const handleStationChange = useCallback((stations: string[]) => {
    filters.setSelectedStations(stations)
  }, [filters])

  const handleModeChange = useCallback((newMode: VisualizationMode) => {
    filters.setMode(newMode)
    if (newMode === 'monthly') {
      filters.setShowSigmaBounds(false)
    }
  }, [filters])

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
      {/* Skip Links for Accessibility */}
      <SkipLink targetId="main-content">Skip to main content</SkipLink>
      <SkipLink targetId="station-selector">Skip to station selector</SkipLink>
      <SkipLink targetId="chart-section">Skip to chart</SkipLink>

      {/* Header */}
      <Box
        as="header"
        role="banner"
        bg={`${colors.bg}e6`}
        backdropFilter="blur(20px) saturate(180%)"
        css={{ WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
        flexShrink={0}
        zIndex={100}
        position={{ base: 'sticky', lg: 'relative' }}
        top={0}
        opacity={ui.isLoaded ? 1 : 0}
        transform={ui.isLoaded ? 'translateY(0)' : 'translateY(-10px)'}
        transition="all 0.5s ease-out"
        mx={{ base: 3, md: 4 }}
        borderRadius="xl"
      >
        <Container maxW="1800px" py={2} px={{ base: 3, md: 4 }} mx="auto">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <ActivityIcon size="lg" color={colors.text} />
              <Box>
                <Text
                  as="h1"
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="700"
                  color={colors.text}
                  letterSpacing="-0.02em"
                  fontFamily="'Outfit', sans-serif"
                  lineHeight="1.2"
                  m={0}
                >
                  Climate Data Explorer
                </Text>
                <Text fontSize="2xs" color={colors.textMuted} letterSpacing="0.02em" display={{ base: 'none', md: 'block' }}>
                  Historical temperature data from weather stations worldwide
                </Text>
              </Box>
            </Flex>

            <Flex align="center" gap={2}>
              {/* Sidebar toggle - desktop only */}
              <Box
                id="sidebar-toggle"
                as="button"
                display={{ base: 'none', lg: 'flex' }}
                alignItems="center"
                gap={1.5}
                px={2}
                py={1}
                bg={ui.isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.50' : 'rgba(6, 182, 212, 0.15)') : colors.card}
                borderRadius="md"
                borderWidth="1px"
                borderColor={ui.isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.200' : 'rgba(6, 182, 212, 0.3)') : colors.border}
                cursor="pointer"
                onClick={ui.toggleSidebar}
                _hover={{
                  bg: ui.isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.100' : 'rgba(6, 182, 212, 0.25)') : colors.buttonHover,
                  borderColor: ui.isSidebarCollapsed ? colors.borderActive : colors.borderHover,
                }}
                transition="all 0.15s"
                title={ui.isSidebarCollapsed ? 'Show filters' : 'Hide filters'}
              >
                <SidebarIcon size="sm" color={ui.isSidebarCollapsed ? (colorMode === 'light' ? '#0891b2' : '#06b6d4') : colors.textMuted} />
                <Text fontSize="2xs" color={ui.isSidebarCollapsed ? cyanAccent : colors.textMuted} fontWeight="500">
                  {ui.isSidebarCollapsed ? `Filters (${filters.selectedStations.length}/${stations?.length || 0})` : 'Filters'}
                </Text>
              </Box>

              {/* Keyboard shortcuts hint - desktop only */}
              <Flex gap={1.5} display={{ base: 'none', lg: 'flex' }}>
                {[
                  { key: 'M', label: 'Mode' },
                  { key: 'S', label: '±σ' },
                  { key: 'G', label: 'Grok' },
                  { key: 'R', label: 'Reset' },
                ].map(({ key, label }) => (
                  <Box
                    key={key}
                    px={1.5}
                    py={0.5}
                    bg={colors.card}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={colors.border}
                  >
                    <Text fontSize="2xs" color={colors.textMuted}>
                      <Text as="span" color={colors.textSecondary} fontFamily="mono">{key}</Text> {label}
                    </Text>
                  </Box>
                ))}
              </Flex>

              <HelpButton size="sm" />
              <Box id="theme-toggle">
                <ThemeToggle size="sm" />
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Box>

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
        {/* Mobile Layout */}
        <MobileLayout
          filters={filters}
          stations={stations}
          analytics={analytics}
          monthlyData={monthlyData}
          annualData={annualData}
          isLoading={isLoading}
          isAnalyticsLoading={isAnalyticsLoading}
          onStationChange={handleStationChange}
          onModeChange={handleModeChange}
          colors={colors}
          colorMode={colorMode}
          cyanAccent={cyanAccent}
        />

        {/* Desktop Layout */}
        <DesktopLayout
          filters={filters}
          ui={ui}
          stations={stations}
          analytics={analytics}
          monthlyData={monthlyData}
          annualData={annualData}
          isLoading={isLoading}
          isAnalyticsLoading={isAnalyticsLoading}
          onStationChange={handleStationChange}
          onModeChange={handleModeChange}
          colors={colors}
          colorMode={colorMode}
        />
      </Container>

      {/* Footer */}
      <Box
        as="footer"
        role="contentinfo"
        py={1.5}
        flexShrink={0}
        opacity={ui.isLoaded ? 1 : 0}
        transition="opacity 0.5s ease-out 0.4s"
      >
        <Container maxW="1800px" px={4} mx="auto">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={1.5}>
              <Text fontSize="2xs" color={colors.textMuted}>
                Built with
              </Text>
              <Flex gap={1}>
                {['FastAPI', 'React', 'Plotly.js'].map((tech) => (
                  <Box
                    key={tech}
                    px={1.5}
                    py={0.5}
                    bg={colors.buttonBg}
                    borderRadius="md"
                  >
                    <Text fontSize="2xs" color={colors.textMuted}>{tech}</Text>
                  </Box>
                ))}
              </Flex>
            </Flex>
            <Link
              href="https://mikechionidis.com"
              target="_blank"
              rel="noopener noreferrer"
              display="flex"
              alignItems="center"
              gap={1}
              px={2}
              py={0.5}
              borderRadius="md"
              color={colors.textMuted}
              _hover={{
                color: colors.accentCyan,
                bg: `${colors.accentCyan}08`,
                textDecoration: 'none',
              }}
              transition="all 0.2s"
            >
              <Text fontSize="2xs" letterSpacing="0.02em">
                Crafted by
              </Text>
              <Text
                fontSize="2xs"
                fontWeight="500"
                color={colors.text}
                letterSpacing="-0.01em"
              >
                Mike Chionidis
              </Text>
            </Link>
            <Text fontSize="2xs" color={colors.textMuted} fontFamily="mono">
              Data: 1859–2019 • 10 Stations
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

// Mobile Layout Component
interface LayoutProps {
  filters: ReturnType<typeof useFilters>
  ui: ReturnType<typeof useUIState>
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

function MobileLayout({
  filters,
  stations,
  analytics,
  monthlyData,
  annualData,
  isLoading,
  isAnalyticsLoading,
  onStationChange,
  onModeChange,
  colors,
  colorMode,
  cyanAccent,
}: Omit<LayoutProps, 'ui'>) {
  return (
    <Box
      as="main"
      id="main-content"
      tabIndex={-1}
      role="main"
      aria-label="Climate data visualization"
      display={{ base: 'block', lg: 'none' }}
    >
      <Flex direction="column" gap={3}>
        {/* Station Selector - Mobile */}
        <Box
          id="station-selector"
          p={3}
          bg={colors.card}
          borderRadius="10px"
          borderWidth="1px"
          borderColor={colors.border}
        >
          <CollapsibleSection
            title="Weather Stations"
            badge={`${filters.selectedStations.length}/${stations?.length || 0}`}
            defaultOpen={true}
            action={
              <Text
                fontSize="2xs"
                color={cyanAccent}
                cursor="pointer"
                onClick={() => {
                  if (filters.selectedStations.length === (stations?.length || 0)) {
                    onStationChange([])
                  } else {
                    onStationChange(stations?.map((s) => s.id) || [])
                  }
                }}
                _hover={{ opacity: 0.8 }}
                transition="opacity 0.15s"
                fontWeight="500"
              >
                {filters.selectedStations.length === (stations?.length || 0) ? 'Clear' : 'All'}
              </Text>
            }
          >
            <Box maxH="250px" overflow="auto">
              <StationSelector
                selectedStations={filters.selectedStations}
                onSelectionChange={onStationChange}
                compact
                hideHeader
              />
            </Box>
          </CollapsibleSection>
        </Box>

        {/* Controls - Mobile */}
        <Box
          p={3}
          bg={colors.card}
          borderRadius="10px"
          borderWidth="1px"
          borderColor={colors.border}
        >
          <CollapsibleSection
            title="Visualization Options"
            defaultOpen={false}
          >
            <ControlsPanel
              yearFrom={filters.yearFrom}
              yearTo={filters.yearTo}
              onYearFromChange={filters.setYearFrom}
              onYearToChange={filters.setYearTo}
              mode={filters.mode}
              onModeChange={onModeChange}
              showSigmaBounds={filters.showSigmaBounds}
              onShowSigmaBoundsChange={filters.setShowSigmaBounds}
              zoom={filters.zoom}
              onZoomChange={filters.setZoom}
              compact
            />
          </CollapsibleSection>
        </Box>

        {/* Analytics - Mobile */}
        <ErrorBoundary>
          <AnalyticsPanel
            analytics={analytics}
            isLoading={isAnalyticsLoading}
            selectedStations={filters.selectedStations}
            compact
          />
        </ErrorBoundary>

        {/* AI Insights - Mobile */}
        <ErrorBoundary>
          <AIInsightsPanel
            stations={filters.selectedStations}
            yearFrom={filters.yearFrom}
            yearTo={filters.yearTo}
          />
        </ErrorBoundary>

        {/* Chart - Mobile */}
        <Box minH="350px" id="chart-section" tabIndex={-1}>
          <ErrorBoundary>
            <ChartPanel
              monthlyData={monthlyData}
              annualData={annualData}
              mode={filters.mode}
              showSigmaBounds={filters.showSigmaBounds}
              isLoading={isLoading}
              selectedStations={filters.selectedStations}
              fillHeight
              containerKey={`mobile-${colorMode}-${filters.mode}`}
            />
          </ErrorBoundary>
        </Box>
      </Flex>
    </Box>
  )
}

function DesktopLayout({
  filters,
  ui,
  stations,
  analytics,
  monthlyData,
  annualData,
  isLoading,
  isAnalyticsLoading,
  onStationChange,
  onModeChange,
  colors,
  colorMode,
}: Omit<LayoutProps, 'cyanAccent'>) {
  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      gap={4}
      h="100%"
      position="relative"
      opacity={ui.isLoaded ? 1 : 0}
      transform={ui.isLoaded ? 'translateX(0)' : 'translateX(-20px)'}
      transition="all 0.5s ease-out 0.1s"
    >
      {/* Unified Sidebar */}
      <Sidebar
        selectedStations={filters.selectedStations}
        onStationChange={onStationChange}
        stations={stations}
        yearFrom={filters.yearFrom}
        yearTo={filters.yearTo}
        onYearFromChange={filters.setYearFrom}
        onYearToChange={filters.setYearTo}
        mode={filters.mode}
        onModeChange={onModeChange}
        showSigmaBounds={filters.showSigmaBounds}
        onShowSigmaBoundsChange={filters.setShowSigmaBounds}
        zoom={filters.zoom}
        onZoomChange={filters.setZoom}
        isCollapsed={ui.isSidebarCollapsed}
        onToggle={ui.toggleSidebar}
      />

      {/* Main Content Area */}
      <Flex
        flex={1}
        direction="column"
        overflow="auto"
        opacity={ui.isLoaded ? 1 : 0}
        transform={ui.isLoaded ? 'translateY(0)' : 'translateY(20px)'}
        transition="all 0.5s ease-out 0.2s"
        css={{
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: colors.border, borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb:hover': { background: colors.textMuted },
        }}
      >
        <Flex direction="column" gap={3} flex={1}>
          {/* Analytics Summary */}
          <Box flexShrink={0}>
            <ErrorBoundary>
              <AnalyticsPanel
                analytics={analytics}
                isLoading={isAnalyticsLoading}
                selectedStations={filters.selectedStations}
                compact
              />
            </ErrorBoundary>
          </Box>

          {/* AI Insights */}
          <Box flexShrink={0}>
            <ErrorBoundary>
              <AIInsightsPanel
                stations={filters.selectedStations}
                yearFrom={filters.yearFrom}
                yearTo={filters.yearTo}
                onOpenChat={ui.openChat}
                onExpandChange={ui.setAIInsightsExpanded}
              />
            </ErrorBoundary>
          </Box>

          {/* Chart */}
          <Box flex={1} minH="400px" id="chart-section-desktop" tabIndex={-1}>
            <ErrorBoundary>
              <ChartPanel
                monthlyData={monthlyData}
                annualData={annualData}
                mode={filters.mode}
                showSigmaBounds={filters.showSigmaBounds}
                isLoading={isLoading}
                selectedStations={filters.selectedStations}
                fillHeight
                containerKey={`desktop-${ui.isSidebarCollapsed ? 'collapsed' : 'expanded'}-${ui.isChatOpen ? 'chat' : 'nochat'}-${colorMode}-${filters.mode}-ai${ui.isAIInsightsExpanded ? 'open' : 'closed'}`}
              />
            </ErrorBoundary>
          </Box>
        </Flex>
      </Flex>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={ui.isChatOpen}
        onClose={ui.closeChat}
        stations={filters.selectedStations}
        yearFrom={filters.yearFrom}
        yearTo={filters.yearTo}
      />
    </Flex>
  )
}

// Main App wrapper with Tour Provider and Live Region
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
