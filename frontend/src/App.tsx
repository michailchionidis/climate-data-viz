/**
 * Climate Data Explorer - Main Application
 * A Tesla-level dashboard for exploring historical temperature data
 * Features full accessibility support (WCAG 2.1 AA compliant)
 */
import { useState, useCallback, useEffect } from 'react'
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
import { TourProvider, TourTooltip, WelcomeModal, HelpButton, tourSteps } from './components/tour'
import { useClimateData, useStations } from './hooks/useClimateData'
import { useTheme } from './context/ThemeContext'
import type { VisualizationMode, ZoomState } from './types'

function AppContent() {
  // Theme
  const { colors, colorMode } = useTheme()
  // Use accessible accent colors from theme (WCAG AA compliant)
  const cyanAccent = colors.accentCyanText

  // State management
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [yearFrom, setYearFrom] = useState<number | null>(null)
  const [yearTo, setYearTo] = useState<number | null>(null)
  const [mode, setMode] = useState<VisualizationMode>('annual')
  const [showSigmaBounds, setShowSigmaBounds] = useState(false)
  const [zoom, setZoom] = useState<ZoomState>({ centerYear: null, windowSize: 10 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  // Toggle chat sidebar
  const openChat = useCallback(() => {
    setIsChatOpen(true)
  }, [])

  const closeChat = useCallback(() => {
    setIsChatOpen(false)
  }, [])

  // Track AI Insights expansion state for chart re-render
  const [isAIInsightsExpanded, setIsAIInsightsExpanded] = useState(false)

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Fetch stations list
  const { data: stations } = useStations()

  // Fetch data based on current filters
  const { monthlyData, annualData, analytics, isLoading, isAnalyticsLoading } = useClimateData(
    selectedStations,
    yearFrom,
    yearTo,
    mode
  )

  // Handlers
  const handleStationChange = useCallback((stations: string[]) => {
    setSelectedStations(stations)
  }, [])

  const handleModeChange = useCallback((newMode: VisualizationMode) => {
    setMode(newMode)
    if (newMode === 'monthly') {
      setShowSigmaBounds(false)
    }
  }, [])

  // Keyboard shortcuts - only when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Toggle mode with 'M' key
      if (e.key === 'm' && !e.metaKey && !e.ctrlKey) {
        setMode((prev) => (prev === 'monthly' ? 'annual' : 'monthly'))
      }
      // Toggle sigma bounds with 'S' key
      if (e.key === 's' && !e.metaKey && !e.ctrlKey && mode === 'annual') {
        setShowSigmaBounds((prev) => !prev)
      }
      // Reset zoom with 'R' key
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey) {
        setYearFrom(null)
        setYearTo(null)
        setZoom({ centerYear: null, windowSize: 10 })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode])

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

      {/* Header - Compact with glossy blur effect on scroll */}
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
        opacity={isLoaded ? 1 : 0}
        transform={isLoaded ? 'translateY(0)' : 'translateY(-10px)'}
        transition="all 0.5s ease-out"
        mx={{ base: 3, md: 4 }}
        borderRadius="xl"
      >
        <Container maxW="1800px" py={2} px={{ base: 3, md: 4 }} mx="auto">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              {/* Logo - minimal x.ai style */}
              <ActivityIcon size="lg" color={colors.text} />
              <Box>
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="700"
                  color={colors.text}
                  letterSpacing="-0.02em"
                  fontFamily="'Outfit', sans-serif"
                  lineHeight="1.2"
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
                bg={isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.50' : 'rgba(6, 182, 212, 0.15)') : colors.card}
                borderRadius="md"
                borderWidth="1px"
                borderColor={isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.200' : 'rgba(6, 182, 212, 0.3)') : colors.border}
                cursor="pointer"
                onClick={toggleSidebar}
                _hover={{
                  bg: isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.100' : 'rgba(6, 182, 212, 0.25)') : colors.buttonHover,
                  borderColor: isSidebarCollapsed ? colors.borderActive : colors.borderHover,
                }}
                transition="all 0.15s"
                title={isSidebarCollapsed ? 'Show filters' : 'Hide filters'}
              >
                <SidebarIcon size="sm" color={isSidebarCollapsed ? (colorMode === 'light' ? '#0891b2' : '#06b6d4') : colors.textMuted} />
                <Text fontSize="2xs" color={isSidebarCollapsed ? cyanAccent : colors.textMuted} fontWeight="500">
                  {isSidebarCollapsed ? `Filters (${selectedStations.length}/${stations?.length || 0})` : 'Filters'}
                </Text>
              </Box>

              {/* Keyboard shortcuts hint - desktop only */}
              <Flex gap={1.5} display={{ base: 'none', lg: 'flex' }}>
                {[
                  { key: 'M', label: 'Mode' },
                  { key: 'S', label: '±σ' },
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

              {/* Help button - restart tour */}
              <HelpButton size="sm" />

              {/* Theme toggle */}
              <Box id="theme-toggle">
                <ThemeToggle size="sm" />
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content - Responsive layout */}
      <Container
        maxW={isSidebarCollapsed ? '100%' : '1800px'}
        pt={0.5}
        pb={{ base: 4, lg: 0 }}
        px={{ base: 3, md: 4 }}
        mx="auto"
        flex={1}
        overflow={{ base: 'visible', lg: 'hidden' }}
        transition="max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {/* Mobile Layout - Stacked sections */}
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
                badge={`${selectedStations.length}/${stations?.length || 0}`}
                defaultOpen={true}
                action={
                  <Text
                    fontSize="2xs"
                    color={cyanAccent}
                    cursor="pointer"
                    onClick={() => {
                      if (selectedStations.length === (stations?.length || 0)) {
                        handleStationChange([])
                      } else {
                        handleStationChange(stations?.map((s) => s.id) || [])
                      }
                    }}
                    _hover={{ opacity: 0.8 }}
                    transition="opacity 0.15s"
                    fontWeight="500"
                  >
                    {selectedStations.length === (stations?.length || 0) ? 'Clear' : 'All'}
                  </Text>
                }
              >
                <Box maxH="250px" overflow="auto">
                  <StationSelector
                    selectedStations={selectedStations}
                    onSelectionChange={handleStationChange}
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
                  yearFrom={yearFrom}
                  yearTo={yearTo}
                  onYearFromChange={setYearFrom}
                  onYearToChange={setYearTo}
                  mode={mode}
                  onModeChange={handleModeChange}
                  showSigmaBounds={showSigmaBounds}
                  onShowSigmaBoundsChange={setShowSigmaBounds}
                  zoom={zoom}
                  onZoomChange={setZoom}
                  compact
                />
              </CollapsibleSection>
            </Box>

            {/* Analytics - Mobile */}
            <ErrorBoundary>
              <AnalyticsPanel
                analytics={analytics}
                isLoading={isAnalyticsLoading}
                selectedStations={selectedStations}
                compact
              />
            </ErrorBoundary>

            {/* AI Insights - Mobile */}
            <ErrorBoundary>
              <AIInsightsPanel
                stations={selectedStations}
                yearFrom={yearFrom}
                yearTo={yearTo}
              />
            </ErrorBoundary>

            {/* Chart - Mobile */}
            <Box minH="350px" id="chart-section" tabIndex={-1}>
              <ErrorBoundary>
                <ChartPanel
                  monthlyData={monthlyData}
                  annualData={annualData}
                  mode={mode}
                  showSigmaBounds={showSigmaBounds}
                  isLoading={isLoading}
                  selectedStations={selectedStations}
                  fillHeight
                  containerKey={`mobile-${colorMode}-${mode}`}
                />
              </ErrorBoundary>
            </Box>
          </Flex>
        </Box>

        {/* Desktop Layout - Collapsible Sidebar */}
        <Flex
          display={{ base: 'none', lg: 'flex' }}
          gap={4}
          h="100%"
          position="relative"
          opacity={isLoaded ? 1 : 0}
          transform={isLoaded ? 'translateX(0)' : 'translateX(-20px)'}
          transition="all 0.5s ease-out 0.1s"
        >
          {/* Unified Sidebar */}
          <Sidebar
            selectedStations={selectedStations}
            onStationChange={handleStationChange}
            stations={stations}
            yearFrom={yearFrom}
            yearTo={yearTo}
            onYearFromChange={setYearFrom}
            onYearToChange={setYearTo}
            mode={mode}
            onModeChange={handleModeChange}
            showSigmaBounds={showSigmaBounds}
            onShowSigmaBoundsChange={setShowSigmaBounds}
            zoom={zoom}
            onZoomChange={setZoom}
            isCollapsed={isSidebarCollapsed}
            onToggle={toggleSidebar}
          />

          {/* Main Content Area - Scrollable */}
          <Flex
            flex={1}
            direction="column"
            overflow="auto"
            opacity={isLoaded ? 1 : 0}
            transform={isLoaded ? 'translateY(0)' : 'translateY(20px)'}
            transition="all 0.5s ease-out 0.2s"
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: colors.border,
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: colors.textMuted,
              },
            }}
          >
            <Flex direction="column" gap={3} flex={1}>
              {/* Analytics Summary */}
              <Box flexShrink={0}>
                <ErrorBoundary>
                  <AnalyticsPanel
                    analytics={analytics}
                    isLoading={isAnalyticsLoading}
                    selectedStations={selectedStations}
                    compact
                  />
                </ErrorBoundary>
              </Box>

              {/* AI Insights - Desktop */}
              <Box flexShrink={0}>
                <ErrorBoundary>
                  <AIInsightsPanel
                    stations={selectedStations}
                    yearFrom={yearFrom}
                    yearTo={yearTo}
                    onOpenChat={openChat}
                    onExpandChange={setIsAIInsightsExpanded}
                  />
                </ErrorBoundary>
              </Box>

              {/* Chart - Expands to fill available space */}
              <Box flex={1} minH="400px" id="chart-section-desktop" tabIndex={-1}>
                <ErrorBoundary>
                  <ChartPanel
                    monthlyData={monthlyData}
                    annualData={annualData}
                    mode={mode}
                    showSigmaBounds={showSigmaBounds}
                    isLoading={isLoading}
                    selectedStations={selectedStations}
                    fillHeight
                    containerKey={`desktop-${isSidebarCollapsed ? 'collapsed' : 'expanded'}-${isChatOpen ? 'chat' : 'nochat'}-${colorMode}-${mode}-ai${isAIInsightsExpanded ? 'open' : 'closed'}`}
                  />
                </ErrorBoundary>
              </Box>
            </Flex>
          </Flex>

          {/* Chat Sidebar - Right side */}
          <ChatSidebar
            isOpen={isChatOpen}
            onClose={closeChat}
            stations={selectedStations}
            yearFrom={yearFrom}
            yearTo={yearTo}
          />
        </Flex>
      </Container>

      {/* Footer - Compact */}
      <Box
        py={1.5}
        flexShrink={0}
        opacity={isLoaded ? 1 : 0}
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

// Main App wrapper with Tour Provider
function App() {
  return (
    <TourProvider steps={tourSteps}>
      <AppContent />
      <WelcomeModal />
      <TourTooltip />
    </TourProvider>
  )
}

export default App
