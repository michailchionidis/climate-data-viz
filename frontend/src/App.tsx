/**
 * Climate Data Explorer - Main Application
 * A Tesla-level dashboard for exploring historical temperature data
 */
import { useState, useCallback, useEffect } from 'react'
import { Box, Container, Text, Flex, Grid, GridItem } from '@chakra-ui/react'
import { StationSelector } from './components/StationSelector'
import { ControlsPanel } from './components/ControlsPanel'
import { AnalyticsPanel } from './components/AnalyticsPanel'
import { ChartPanel } from './components/ChartPanel'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ActivityIcon } from './components/ui/Icons'
import { useClimateData } from './hooks/useClimateData'
import type { VisualizationMode, ZoomState } from './types'

function App() {
  // State management
  const [selectedStations, setSelectedStations] = useState<string[]>([])
  const [yearFrom, setYearFrom] = useState<number | null>(null)
  const [yearTo, setYearTo] = useState<number | null>(null)
  const [mode, setMode] = useState<VisualizationMode>('annual')
  const [showSigmaBounds, setShowSigmaBounds] = useState(false)
  const [zoom, setZoom] = useState<ZoomState>({ centerYear: null, windowSize: 10 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <Box h="100vh" bg="#0a0a0f" display="flex" flexDirection="column" overflow="hidden">
      {/* Header - Compact */}
      <Box
        borderBottomWidth="1px"
        borderColor="rgba(255, 255, 255, 0.08)"
        bg="rgba(10, 10, 15, 0.85)"
        backdropFilter="blur(12px)"
        flexShrink={0}
        zIndex={100}
        opacity={isLoaded ? 1 : 0}
        transform={isLoaded ? 'translateY(0)' : 'translateY(-10px)'}
        transition="all 0.5s ease-out"
      >
        <Container maxW="1800px" py={2}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={2.5}>
              {/* Logo */}
              <Box
                w="32px"
                h="32px"
                borderRadius="8px"
                bg="linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderWidth="1px"
                borderColor="rgba(6, 182, 212, 0.3)"
              >
                <ActivityIcon size="md" color="#06b6d4" />
              </Box>
              <Box>
                <Text
                  fontSize="md"
                  fontWeight="700"
                  color="white"
                  letterSpacing="-0.02em"
                  fontFamily="'Outfit', sans-serif"
                  lineHeight="1.2"
                >
                  Climate Data Explorer
                </Text>
                <Text fontSize="2xs" color="gray.500" letterSpacing="0.02em" display={{ base: 'none', md: 'block' }}>
                  Historical temperature data from weather stations worldwide
                </Text>
              </Box>
            </Flex>

            <Flex align="center" gap={2}>
              {/* Keyboard shortcuts hint - more compact */}
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
                    bg="rgba(255, 255, 255, 0.05)"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="rgba(255, 255, 255, 0.1)"
                  >
                    <Text fontSize="2xs" color="gray.500">
                      <Text as="span" color="gray.400" fontFamily="mono">{key}</Text> {label}
                    </Text>
                  </Box>
                ))}
              </Flex>

              {/* Station count badge - compact */}
              <Box
                px={2}
                py={1}
                bg={selectedStations.length > 0 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)'}
                borderRadius="full"
                borderWidth="1px"
                borderColor={selectedStations.length > 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.1)'}
                transition="all 0.2s ease"
              >
                <Text
                  fontSize="2xs"
                  fontWeight="600"
                  color={selectedStations.length > 0 ? 'cyan.300' : 'gray.500'}
                >
                  {selectedStations.length} station{selectedStations.length !== 1 ? 's' : ''} selected
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content - Flex grow to fill available space */}
      <Container maxW="1800px" py={3} px={4} flex={1} overflow="hidden">
        <Grid
          templateColumns={{ base: '1fr', lg: '280px 1fr' }}
          gap={4}
          h="100%"
        >
          {/* Left Sidebar - 50/50 split between stations and controls */}
          <GridItem overflow="hidden">
            <Box
              display="flex"
              flexDirection="column"
              gap={3}
              opacity={isLoaded ? 1 : 0}
              transform={isLoaded ? 'translateX(0)' : 'translateX(-20px)'}
              transition="all 0.5s ease-out 0.1s"
              h="100%"
            >
              {/* Station Selector - 50% height */}
              <Box
                p={3}
                bg="rgba(255, 255, 255, 0.03)"
                borderRadius="10px"
                borderWidth="1px"
                borderColor="rgba(255, 255, 255, 0.08)"
                flex={1}
                minH={0}
                overflow="hidden"
                display="flex"
                flexDirection="column"
              >
                <StationSelector
                  selectedStations={selectedStations}
                  onSelectionChange={handleStationChange}
                  compact
                />
              </Box>

              {/* Controls - 50% height */}
              <Box
                p={3}
                bg="rgba(255, 255, 255, 0.03)"
                borderRadius="10px"
                borderWidth="1px"
                borderColor="rgba(255, 255, 255, 0.08)"
                flex={1}
                minH={0}
                overflow="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255,255,255,0.03)',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '2px',
                  },
                }}
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
              </Box>
            </Box>
          </GridItem>

          {/* Main Content Area - Flex layout for dynamic chart height */}
          <GridItem overflow="hidden" display="flex" flexDirection="column">
            <Flex
              direction="column"
              gap={3}
              opacity={isLoaded ? 1 : 0}
              transform={isLoaded ? 'translateY(0)' : 'translateY(20px)'}
              transition="all 0.5s ease-out 0.2s"
              h="100%"
              overflow="hidden"
            >
              {/* Analytics Summary - Compact */}
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

              {/* Chart - Grows to fill remaining space */}
              <Box flex={1} minH={0}>
                <ErrorBoundary>
                  <ChartPanel
                    monthlyData={monthlyData}
                    annualData={annualData}
                    mode={mode}
                    showSigmaBounds={showSigmaBounds}
                    isLoading={isLoading}
                    selectedStations={selectedStations}
                    fillHeight
                  />
                </ErrorBoundary>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Container>

      {/* Footer - Compact */}
      <Box
        borderTopWidth="1px"
        borderColor="rgba(255, 255, 255, 0.06)"
        py={2}
        flexShrink={0}
        opacity={isLoaded ? 1 : 0}
        transition="opacity 0.5s ease-out 0.4s"
      >
        <Container maxW="1800px" px={4}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={1.5}>
              <Text fontSize="2xs" color="gray.600">
                Built with
              </Text>
              <Flex gap={1}>
                {['FastAPI', 'React', 'Plotly.js'].map((tech) => (
                  <Box
                    key={tech}
                    px={1.5}
                    py={0.5}
                    bg="rgba(255, 255, 255, 0.05)"
                    borderRadius="md"
                  >
                    <Text fontSize="2xs" color="gray.500">{tech}</Text>
                  </Box>
                ))}
              </Flex>
            </Flex>
            <Text fontSize="2xs" color="gray.600" fontFamily="mono">
              Data: 1859–2019 • 10 Stations
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default App
