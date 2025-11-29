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
    <Box minH="100vh" bg="#0a0a0f">
      {/* Header */}
      <Box
        borderBottomWidth="1px"
        borderColor="rgba(255, 255, 255, 0.08)"
        bg="rgba(10, 10, 15, 0.85)"
        backdropFilter="blur(12px)"
        position="sticky"
        top={0}
        zIndex={100}
        opacity={isLoaded ? 1 : 0}
        transform={isLoaded ? 'translateY(0)' : 'translateY(-10px)'}
        transition="all 0.5s ease-out"
      >
        <Container maxW="1800px" py={4}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              {/* Logo */}
              <Box
                w="40px"
                h="40px"
                borderRadius="10px"
                bg="linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderWidth="1px"
                borderColor="rgba(6, 182, 212, 0.3)"
              >
                <ActivityIcon size="lg" color="#06b6d4" />
              </Box>
              <Box>
                <Text
                  fontSize="lg"
                  fontWeight="700"
                  color="white"
                  letterSpacing="-0.02em"
                  fontFamily="'Outfit', sans-serif"
                >
                  Climate Data Explorer
                </Text>
                <Text fontSize="xs" color="gray.500" letterSpacing="0.02em">
                  Historical temperature data from weather stations worldwide
                </Text>
              </Box>
            </Flex>

            <Flex align="center" gap={4}>
              {/* Keyboard shortcuts hint */}
              <Flex gap={2} display={{ base: 'none', lg: 'flex' }}>
                <Box
                  px={2}
                  py={1}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="rgba(255, 255, 255, 0.1)"
                >
                  <Text fontSize="xs" color="gray.500">
                    <Text as="span" color="gray.400" fontFamily="mono">M</Text> Mode
                  </Text>
                </Box>
                <Box
                  px={2}
                  py={1}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="rgba(255, 255, 255, 0.1)"
                >
                  <Text fontSize="xs" color="gray.500">
                    <Text as="span" color="gray.400" fontFamily="mono">S</Text> ±σ
                  </Text>
                </Box>
                <Box
                  px={2}
                  py={1}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="rgba(255, 255, 255, 0.1)"
                >
                  <Text fontSize="xs" color="gray.500">
                    <Text as="span" color="gray.400" fontFamily="mono">R</Text> Reset
                  </Text>
                </Box>
              </Flex>

              {/* Station count badge */}
              <Box
                px={3}
                py={1.5}
                bg={selectedStations.length > 0 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)'}
                borderRadius="full"
                borderWidth="1px"
                borderColor={selectedStations.length > 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.1)'}
                transition="all 0.2s ease"
              >
                <Text
                  fontSize="xs"
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

      {/* Main Content */}
      <Container maxW="1800px" py={6}>
        <Grid
          templateColumns={{ base: '1fr', lg: '300px 1fr' }}
          gap={6}
        >
          {/* Left Sidebar */}
          <GridItem>
            <Box
              position="sticky"
              top="80px"
              display="flex"
              flexDirection="column"
              gap={5}
              opacity={isLoaded ? 1 : 0}
              transform={isLoaded ? 'translateX(0)' : 'translateX(-20px)'}
              transition="all 0.5s ease-out 0.1s"
            >
              {/* Station Selector */}
              <Box
                p={4}
                bg="rgba(255, 255, 255, 0.03)"
                borderRadius="12px"
                borderWidth="1px"
                borderColor="rgba(255, 255, 255, 0.08)"
              >
                <StationSelector
                  selectedStations={selectedStations}
                  onSelectionChange={handleStationChange}
                />
              </Box>

              {/* Controls */}
              <Box
                p={4}
                bg="rgba(255, 255, 255, 0.03)"
                borderRadius="12px"
                borderWidth="1px"
                borderColor="rgba(255, 255, 255, 0.08)"
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
                />
              </Box>
            </Box>
          </GridItem>

          {/* Main Content Area */}
          <GridItem>
            <Flex
              direction="column"
              gap={5}
              opacity={isLoaded ? 1 : 0}
              transform={isLoaded ? 'translateY(0)' : 'translateY(20px)'}
              transition="all 0.5s ease-out 0.2s"
            >
              {/* Analytics Summary */}
              <ErrorBoundary>
                <AnalyticsPanel
                  analytics={analytics}
                  isLoading={isAnalyticsLoading}
                  selectedStations={selectedStations}
                />
              </ErrorBoundary>

              {/* Chart */}
              <ErrorBoundary>
                <ChartPanel
                  monthlyData={monthlyData}
                  annualData={annualData}
                  mode={mode}
                  showSigmaBounds={showSigmaBounds}
                  isLoading={isLoading}
                  selectedStations={selectedStations}
                />
              </ErrorBoundary>
            </Flex>
          </GridItem>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        borderTopWidth="1px"
        borderColor="rgba(255, 255, 255, 0.06)"
        py={6}
        mt={10}
        opacity={isLoaded ? 1 : 0}
        transition="opacity 0.5s ease-out 0.4s"
      >
        <Container maxW="1800px">
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={2}>
              <Text fontSize="xs" color="gray.600">
                Built with
              </Text>
              <Flex gap={1}>
                <Box
                  px={1.5}
                  py={0.5}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="md"
                >
                  <Text fontSize="xs" color="gray.500">FastAPI</Text>
                </Box>
                <Box
                  px={1.5}
                  py={0.5}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="md"
                >
                  <Text fontSize="xs" color="gray.500">React</Text>
                </Box>
                <Box
                  px={1.5}
                  py={0.5}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="md"
                >
                  <Text fontSize="xs" color="gray.500">Plotly.js</Text>
                </Box>
              </Flex>
            </Flex>
            <Text fontSize="xs" color="gray.600" fontFamily="mono">
              Data: 1859–2019 • 10 Weather Stations
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default App
