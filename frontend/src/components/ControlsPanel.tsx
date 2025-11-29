/**
 * Controls panel for visualization settings
 */
import { Box, Text, Flex, Input, Button, HStack, VStack } from '@chakra-ui/react'
import type { VisualizationMode, ZoomState } from '../types'

interface ControlsPanelProps {
  yearFrom: number | null
  yearTo: number | null
  onYearFromChange: (year: number | null) => void
  onYearToChange: (year: number | null) => void
  mode: VisualizationMode
  onModeChange: (mode: VisualizationMode) => void
  showSigmaBounds: boolean
  onShowSigmaBoundsChange: (show: boolean) => void
  zoom: ZoomState
  onZoomChange: (zoom: ZoomState) => void
  minYear?: number
  maxYear?: number
}

export function ControlsPanel({
  yearFrom,
  yearTo,
  onYearFromChange,
  onYearToChange,
  mode,
  onModeChange,
  showSigmaBounds,
  onShowSigmaBoundsChange,
  zoom,
  onZoomChange,
  minYear = 1859,
  maxYear = 2019,
}: ControlsPanelProps) {
  const handleZoomToYear = () => {
    if (zoom.centerYear) {
      const from = Math.max(minYear, zoom.centerYear - zoom.windowSize)
      const to = Math.min(maxYear, zoom.centerYear + zoom.windowSize)
      onYearFromChange(from)
      onYearToChange(to)
    }
  }

  const handleResetZoom = () => {
    onYearFromChange(null)
    onYearToChange(null)
    onZoomChange({ centerYear: null, windowSize: 10 })
  }

  return (
    <VStack gap={6} align="stretch">
      {/* Visualization Mode */}
      <Box>
        <Text fontSize="sm" fontWeight="600" color="gray.300" textTransform="uppercase" letterSpacing="wide" mb={3}>
          Visualization Mode
        </Text>
        <Flex gap={2}>
          <Button
            flex={1}
            size="sm"
            variant={mode === 'monthly' ? 'solid' : 'outline'}
            colorPalette={mode === 'monthly' ? 'cyan' : 'gray'}
            onClick={() => onModeChange('monthly')}
            borderColor="gray.600"
            _hover={{ bg: mode === 'monthly' ? 'cyan.600' : 'whiteAlpha.100' }}
          >
            Monthly
          </Button>
          <Button
            flex={1}
            size="sm"
            variant={mode === 'annual' ? 'solid' : 'outline'}
            colorPalette={mode === 'annual' ? 'cyan' : 'gray'}
            onClick={() => onModeChange('annual')}
            borderColor="gray.600"
            _hover={{ bg: mode === 'annual' ? 'cyan.600' : 'whiteAlpha.100' }}
          >
            Annual Avg
          </Button>
        </Flex>

        {/* Sigma bounds toggle - only for annual mode */}
        {mode === 'annual' && (
          <Flex
            mt={3}
            p={2}
            borderRadius="md"
            bg={showSigmaBounds ? 'purple.900/30' : 'transparent'}
            borderWidth="1px"
            borderColor={showSigmaBounds ? 'purple.500/40' : 'gray.700'}
            cursor="pointer"
            onClick={() => onShowSigmaBoundsChange(!showSigmaBounds)}
            _hover={{ bg: showSigmaBounds ? 'purple.900/40' : 'whiteAlpha.100' }}
            transition="all 0.15s"
          >
            <Box
              w={4}
              h={4}
              borderRadius="sm"
              borderWidth="2px"
              borderColor={showSigmaBounds ? 'purple.400' : 'gray.600'}
              bg={showSigmaBounds ? 'purple.500' : 'transparent'}
              mr={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {showSigmaBounds && <Text fontSize="xs" color="white">✓</Text>}
            </Box>
            <Text fontSize="sm" color={showSigmaBounds ? 'purple.200' : 'gray.400'}>
              Show ±1σ Overlay
            </Text>
          </Flex>
        )}
      </Box>

      {/* Year Range */}
      <Box>
        <Text fontSize="sm" fontWeight="600" color="gray.300" textTransform="uppercase" letterSpacing="wide" mb={3}>
          Year Range
        </Text>
        <HStack>
          <Box flex={1}>
            <Text fontSize="xs" color="gray.500" mb={1}>From</Text>
            <Input
              size="sm"
              type="number"
              placeholder={String(minYear)}
              value={yearFrom || ''}
              onChange={(e) => onYearFromChange(e.target.value ? parseInt(e.target.value) : null)}
              bg="whiteAlpha.50"
              borderColor="gray.700"
              _hover={{ borderColor: 'gray.600' }}
              _focus={{ borderColor: 'cyan.500', boxShadow: '0 0 0 1px var(--chakra-colors-cyan-500)' }}
              fontFamily="mono"
            />
          </Box>
          <Text color="gray.500" pt={5}>—</Text>
          <Box flex={1}>
            <Text fontSize="xs" color="gray.500" mb={1}>To</Text>
            <Input
              size="sm"
              type="number"
              placeholder={String(maxYear)}
              value={yearTo || ''}
              onChange={(e) => onYearToChange(e.target.value ? parseInt(e.target.value) : null)}
              bg="whiteAlpha.50"
              borderColor="gray.700"
              _hover={{ borderColor: 'gray.600' }}
              _focus={{ borderColor: 'cyan.500', boxShadow: '0 0 0 1px var(--chakra-colors-cyan-500)' }}
              fontFamily="mono"
            />
          </Box>
        </HStack>
      </Box>

      {/* Zoom Controls */}
      <Box>
        <Text fontSize="sm" fontWeight="600" color="gray.300" textTransform="uppercase" letterSpacing="wide" mb={3}>
          Zoom Controls
        </Text>
        <VStack gap={3}>
          <Box w="full">
            <Text fontSize="xs" color="gray.500" mb={1}>Center Year</Text>
            <Input
              size="sm"
              type="number"
              placeholder="e.g., 1990"
              value={zoom.centerYear || ''}
              onChange={(e) =>
                onZoomChange({
                  ...zoom,
                  centerYear: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              bg="whiteAlpha.50"
              borderColor="gray.700"
              _hover={{ borderColor: 'gray.600' }}
              _focus={{ borderColor: 'cyan.500', boxShadow: '0 0 0 1px var(--chakra-colors-cyan-500)' }}
              fontFamily="mono"
            />
          </Box>

          <Box w="full">
            <Flex justify="space-between" mb={1}>
              <Text fontSize="xs" color="gray.500">Window: ±{zoom.windowSize} years</Text>
            </Flex>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={zoom.windowSize}
              onChange={(e) =>
                onZoomChange({
                  ...zoom,
                  windowSize: parseInt(e.target.value),
                })
              }
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: 'linear-gradient(to right, #0891b2 0%, #0891b2 50%, #374151 50%, #374151 100%)',
                appearance: 'none',
                cursor: 'pointer',
              }}
            />
          </Box>

          <HStack w="full">
            <Button
              flex={1}
              size="sm"
              colorPalette="cyan"
              onClick={handleZoomToYear}
              disabled={!zoom.centerYear}
            >
              Apply Zoom
            </Button>
            <Button
              flex={1}
              size="sm"
              variant="outline"
              colorPalette="gray"
              borderColor="gray.600"
              onClick={handleResetZoom}
              _hover={{ bg: 'whiteAlpha.100' }}
            >
              Reset
            </Button>
          </HStack>
        </VStack>
      </Box>
    </VStack>
  )
}
