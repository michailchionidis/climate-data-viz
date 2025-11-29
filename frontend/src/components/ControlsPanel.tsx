/**
 * Controls panel for visualization settings
 * Premium UI with smooth interactions
 */
import { Box, Text, Flex, Input, Button, VStack } from '@chakra-ui/react'
import { SectionHeader } from './ui/SectionHeader'
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

  // Calculate slider progress for styling
  const sliderProgress = ((zoom.windowSize - 5) / (50 - 5)) * 100

  return (
    <VStack gap={6} align="stretch">
      {/* Visualization Mode */}
      <Box>
        <SectionHeader title="Visualization Mode" />

        {/* Mode toggle */}
        <Box
          p={1}
          bg="rgba(255, 255, 255, 0.03)"
          borderRadius="10px"
          borderWidth="1px"
          borderColor="rgba(255, 255, 255, 0.08)"
        >
          <Flex gap={1}>
            <Box
              flex={1}
              py={2}
              px={3}
              borderRadius="8px"
              bg={mode === 'monthly' ? 'rgba(6, 182, 212, 0.2)' : 'transparent'}
              cursor="pointer"
              onClick={() => onModeChange('monthly')}
              transition="all 0.2s ease"
              _hover={{
                bg: mode === 'monthly' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Text
                fontSize="sm"
                fontWeight="600"
                color={mode === 'monthly' ? 'cyan.300' : 'gray.400'}
                textAlign="center"
              >
                Monthly
              </Text>
            </Box>
            <Box
              flex={1}
              py={2}
              px={3}
              borderRadius="8px"
              bg={mode === 'annual' ? 'rgba(6, 182, 212, 0.2)' : 'transparent'}
              cursor="pointer"
              onClick={() => onModeChange('annual')}
              transition="all 0.2s ease"
              _hover={{
                bg: mode === 'annual' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Text
                fontSize="sm"
                fontWeight="600"
                color={mode === 'annual' ? 'cyan.300' : 'gray.400'}
                textAlign="center"
              >
                Annual Avg
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Sigma bounds toggle - only for annual mode */}
        {mode === 'annual' && (
          <Flex
            mt={3}
            p={3}
            borderRadius="8px"
            bg={showSigmaBounds ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)'}
            borderWidth="1px"
            borderColor={showSigmaBounds ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.08)'}
            cursor="pointer"
            onClick={() => onShowSigmaBoundsChange(!showSigmaBounds)}
            _hover={{
              bg: showSigmaBounds ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: showSigmaBounds ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.15)',
            }}
            transition="all 0.2s ease"
            align="center"
            gap={3}
          >
            {/* Toggle switch */}
            <Box
              w="36px"
              h="20px"
              borderRadius="full"
              bg={showSigmaBounds ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'}
              position="relative"
              transition="all 0.2s ease"
              flexShrink={0}
            >
              <Box
                w="16px"
                h="16px"
                borderRadius="full"
                bg="white"
                position="absolute"
                top="2px"
                left={showSigmaBounds ? '18px' : '2px'}
                transition="all 0.2s ease"
                boxShadow="0 1px 3px rgba(0,0,0,0.3)"
              />
            </Box>
            <Box>
              <Text fontSize="sm" color={showSigmaBounds ? 'purple.200' : 'gray.400'} fontWeight="500">
                Show ±1σ Overlay
              </Text>
              <Text fontSize="xs" color="gray.500">
                Display standard deviation range
              </Text>
            </Box>
          </Flex>
        )}
      </Box>

      {/* Year Range */}
      <Box>
        <SectionHeader
          title="Year Range"
          badge={yearFrom || yearTo ? `${yearFrom || minYear}–${yearTo || maxYear}` : undefined}
          badgeColor="cyan"
        />
        <Flex gap={3} align="center">
          <Box flex={1}>
            <Text fontSize="xs" color="gray.500" mb={1.5} fontWeight="500">
              From
            </Text>
            <Input
              size="sm"
              type="number"
              placeholder={String(minYear)}
              value={yearFrom || ''}
              onChange={(e) => onYearFromChange(e.target.value ? parseInt(e.target.value) : null)}
              bg="rgba(255, 255, 255, 0.03)"
              borderColor="rgba(255, 255, 255, 0.1)"
              borderRadius="8px"
              _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              _focus={{
                borderColor: 'rgba(6, 182, 212, 0.5)',
                boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
              }}
              fontFamily="mono"
            />
          </Box>
          <Text color="gray.600" pt={5} fontSize="lg">
            —
          </Text>
          <Box flex={1}>
            <Text fontSize="xs" color="gray.500" mb={1.5} fontWeight="500">
              To
            </Text>
            <Input
              size="sm"
              type="number"
              placeholder={String(maxYear)}
              value={yearTo || ''}
              onChange={(e) => onYearToChange(e.target.value ? parseInt(e.target.value) : null)}
              bg="rgba(255, 255, 255, 0.03)"
              borderColor="rgba(255, 255, 255, 0.1)"
              borderRadius="8px"
              _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              _focus={{
                borderColor: 'rgba(6, 182, 212, 0.5)',
                boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
              }}
              fontFamily="mono"
            />
          </Box>
        </Flex>
      </Box>

      {/* Zoom Controls */}
      <Box>
        <SectionHeader title="Zoom Controls" />
        <VStack gap={4}>
          {/* Center Year input */}
          <Box w="full">
            <Text fontSize="xs" color="gray.500" mb={1.5} fontWeight="500">
              Center Year
            </Text>
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
              bg="rgba(255, 255, 255, 0.03)"
              borderColor="rgba(255, 255, 255, 0.1)"
              borderRadius="8px"
              _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              _focus={{
                borderColor: 'rgba(6, 182, 212, 0.5)',
                boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
              }}
              fontFamily="mono"
            />
          </Box>

          {/* Window size slider */}
          <Box w="full">
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="xs" color="gray.500" fontWeight="500">
                Window Size
              </Text>
              <Box
                px={2}
                py={0.5}
                bg="rgba(6, 182, 212, 0.15)"
                borderRadius="md"
              >
                <Text fontSize="xs" color="cyan.300" fontFamily="mono" fontWeight="600">
                  ±{zoom.windowSize} years
                </Text>
              </Box>
            </Flex>
            <Box position="relative">
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
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${sliderProgress}%, rgba(255,255,255,0.1) ${sliderProgress}%, rgba(255,255,255,0.1) 100%)`,
                  cursor: 'pointer',
                }}
              />
              {/* Tick marks */}
              <Flex justify="space-between" mt={1}>
                <Text fontSize="xs" color="gray.600">5</Text>
                <Text fontSize="xs" color="gray.600">50</Text>
              </Flex>
            </Box>
          </Box>

          {/* Action buttons */}
          <Flex w="full" gap={2}>
            <Button
              flex={1}
              size="sm"
              bg={zoom.centerYear ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)'}
              color={zoom.centerYear ? 'cyan.300' : 'gray.500'}
              borderWidth="1px"
              borderColor={zoom.centerYear ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.1)'}
              _hover={{
                bg: zoom.centerYear ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              }}
              _active={{
                bg: zoom.centerYear ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              }}
              onClick={handleZoomToYear}
              disabled={!zoom.centerYear}
              borderRadius="8px"
            >
              Apply Zoom
            </Button>
            <Button
              flex={1}
              size="sm"
              bg="rgba(255, 255, 255, 0.03)"
              color="gray.400"
              borderWidth="1px"
              borderColor="rgba(255, 255, 255, 0.1)"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.06)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              }}
              _active={{
                bg: 'rgba(255, 255, 255, 0.08)',
              }}
              onClick={handleResetZoom}
              borderRadius="8px"
            >
              Reset
            </Button>
          </Flex>
        </VStack>
      </Box>

      {/* Quick presets */}
      <Box>
        <Text fontSize="xs" color="gray.500" mb={2} fontWeight="500">
          Quick Presets
        </Text>
        <Flex gap={2} flexWrap="wrap">
          {[
            { label: 'Last 50 years', from: 1970, to: 2019 },
            { label: '20th Century', from: 1900, to: 1999 },
            { label: '19th Century', from: 1859, to: 1899 },
            { label: 'All Data', from: null, to: null },
          ].map((preset) => (
            <Box
              key={preset.label}
              px={2.5}
              py={1.5}
              bg="rgba(255, 255, 255, 0.03)"
              borderRadius="6px"
              borderWidth="1px"
              borderColor="rgba(255, 255, 255, 0.08)"
              cursor="pointer"
              _hover={{
                bg: 'rgba(255, 255, 255, 0.06)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              }}
              onClick={() => {
                onYearFromChange(preset.from)
                onYearToChange(preset.to)
              }}
              transition="all 0.15s ease"
            >
              <Text fontSize="xs" color="gray.400">
                {preset.label}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </VStack>
  )
}
