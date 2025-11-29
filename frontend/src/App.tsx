/**
 * Main application component
 */
import { useState, useCallback } from 'react'
import { Box, Container, Text, Flex, Grid, GridItem } from '@chakra-ui/react'
import { StationSelector } from './components/StationSelector'
import { ControlsPanel } from './components/ControlsPanel'
import { AnalyticsPanel } from './components/AnalyticsPanel'
import { ChartPanel } from './components/ChartPanel'
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
    // Reset sigma bounds when switching modes
    if (newMode === 'monthly') {
      setShowSigmaBounds(false)
    }
  }, [])

  return (
    <Box minH="100vh" bg="#0a0a0f">
      {/* Header */}
      <Box
        borderBottomWidth="1px"
        borderColor="whiteAlpha.100"
        bg="rgba(10, 10, 15, 0.8)"
        backdropFilter="blur(10px)"
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Container maxW="container.2xl" py={4}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <Text fontSize="2xl">🌡️</Text>
              <Box>
                <Text fontSize="xl" fontWeight="700" color="white" letterSpacing="tight">
                  Climate Data Explorer
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Historical temperature data from weather stations worldwide
                </Text>
              </Box>
            </Flex>
            <Flex align="center" gap={4}>
              <Box
                px={3}
                py={1}
                bg={selectedStations.length > 0 ? 'cyan.900/40' : 'whiteAlpha.100'}
                borderRadius="full"
                borderWidth="1px"
                borderColor={selectedStations.length > 0 ? 'cyan.500/40' : 'whiteAlpha.100'}
              >
                <Text fontSize="xs" color={selectedStations.length > 0 ? 'cyan.300' : 'gray.500'}>
                  {selectedStations.length} station{selectedStations.length !== 1 ? 's' : ''} selected
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.2xl" py={6}>
        <Grid
          templateColumns={{ base: '1fr', lg: '320px 1fr' }}
          gap={6}
        >
          {/* Left Sidebar */}
          <GridItem>
            <Box
              position="sticky"
              top="80px"
              display="flex"
              flexDirection="column"
              gap={6}
            >
              {/* Station Selector */}
              <Box
                p={4}
                bg="whiteAlpha.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
              >
                <StationSelector
                  selectedStations={selectedStations}
                  onSelectionChange={handleStationChange}
                />
              </Box>

              {/* Controls */}
              <Box
                p={4}
                bg="whiteAlpha.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
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
            <Flex direction="column" gap={6}>
              {/* Analytics Summary */}
              <Box
                p={4}
                bg="whiteAlpha.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
              >
                <AnalyticsPanel
                  analytics={analytics}
                  isLoading={isAnalyticsLoading}
                  selectedStations={selectedStations}
                />
              </Box>

              {/* Chart */}
              <ChartPanel
                monthlyData={monthlyData}
                annualData={annualData}
                mode={mode}
                showSigmaBounds={showSigmaBounds}
                isLoading={isLoading}
                selectedStations={selectedStations}
              />
            </Flex>
          </GridItem>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        borderTopWidth="1px"
        borderColor="whiteAlpha.100"
        py={6}
        mt={10}
      >
        <Container maxW="container.2xl">
          <Flex justify="space-between" align="center">
            <Text fontSize="xs" color="gray.600">
              Built with FastAPI + React + Plotly.js
            </Text>
            <Text fontSize="xs" color="gray.600">
              Data: 1859-2019 • 10 Weather Stations
            </Text>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default App

