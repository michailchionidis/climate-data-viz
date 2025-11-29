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
  compact?: boolean
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
  compact = false,
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
    <VStack gap={compact ? 3 : 6} align="stretch">
      {/* Visualization Mode */}
      <Box>
        <SectionHeader title="Visualization Mode" compact={compact} />

        {/* Mode toggle */}
        <Box
          p={0.5}
          bg="rgba(255, 255, 255, 0.03)"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="rgba(255, 255, 255, 0.08)"
        >
          <Flex gap={0.5}>
            <Box
              flex={1}
              py={compact ? 1 : 2}
              px={2}
              borderRadius="6px"
              bg={mode === 'monthly' ? 'rgba(6, 182, 212, 0.2)' : 'transparent'}
              cursor="pointer"
              onClick={() => onModeChange('monthly')}
              transition="all 0.2s ease"
              _hover={{
                bg: mode === 'monthly' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Text
                fontSize="xs"
                fontWeight="600"
                color={mode === 'monthly' ? 'cyan.300' : 'gray.400'}
                textAlign="center"
              >
                Monthly
              </Text>
            </Box>
            <Box
              flex={1}
              py={compact ? 1 : 2}
              px={2}
              borderRadius="6px"
              bg={mode === 'annual' ? 'rgba(6, 182, 212, 0.2)' : 'transparent'}
              cursor="pointer"
              onClick={() => onModeChange('annual')}
              transition="all 0.2s ease"
              _hover={{
                bg: mode === 'annual' ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Text
                fontSize="xs"
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
            mt={2}
            p={compact ? 2 : 3}
            borderRadius="6px"
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
            gap={2}
          >
            {/* Toggle switch */}
            <Box
              w={compact ? '28px' : '36px'}
              h={compact ? '16px' : '20px'}
              borderRadius="full"
              bg={showSigmaBounds ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'}
              position="relative"
              transition="all 0.2s ease"
              flexShrink={0}
            >
              <Box
                w={compact ? '12px' : '16px'}
                h={compact ? '12px' : '16px'}
                borderRadius="full"
                bg="white"
                position="absolute"
                top="2px"
                left={showSigmaBounds ? (compact ? '14px' : '18px') : '2px'}
                transition="all 0.2s ease"
                boxShadow="0 1px 3px rgba(0,0,0,0.3)"
              />
            </Box>
            <Text fontSize="xs" color={showSigmaBounds ? 'purple.200' : 'gray.400'} fontWeight="500">
              Show ±1σ Overlay
            </Text>
          </Flex>
        )}
      </Box>

      {/* Year Range */}
      <Box>
        <SectionHeader
          title="Year Range"
          badge={yearFrom || yearTo ? `${yearFrom || minYear}–${yearTo || maxYear}` : undefined}
          badgeColor="cyan"
          compact={compact}
        />
        <Flex gap={2} align="center">
          <Box flex={1}>
            <Text fontSize="2xs" color="gray.500" mb={1} fontWeight="500">
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
              borderRadius="6px"
              px={3}
              py={1.5}
              h="auto"
              fontSize="xs"
              _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              _focus={{
                borderColor: 'rgba(6, 182, 212, 0.5)',
                boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
              }}
              fontFamily="mono"
            />
          </Box>
          <Text color="gray.600" pt={4} fontSize="sm">
            —
          </Text>
          <Box flex={1}>
            <Text fontSize="2xs" color="gray.500" mb={1} fontWeight="500">
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
              borderRadius="6px"
              px={3}
              py={1.5}
              h="auto"
              fontSize="xs"
              _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
              _focus={{
                borderColor: 'rgba(6, 182, 212, 0.5)',
                boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
              }}
              fontFamily="mono"
            />
          </Box>
        </Flex>

        {/* Quick presets - inline with year range in compact mode */}
        <Flex gap={1} mt={2} flexWrap="wrap">
          {[
            { label: 'Last 50y', from: 1970, to: 2019 },
            { label: '20th C', from: 1900, to: 1999 },
            { label: 'All', from: null, to: null },
          ].map((preset) => (
            <Box
              key={preset.label}
              px={1.5}
              py={0.5}
              bg="rgba(255, 255, 255, 0.03)"
              borderRadius="4px"
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
              <Text fontSize="2xs" color="gray.400">
                {preset.label}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Zoom Controls */}
      <Box>
        <SectionHeader title="Zoom Controls" compact={compact} />
        <VStack gap={compact ? 2 : 3}>
          {/* Center Year + Window Size in row for compact */}
          {compact ? (
            <Flex gap={2} w="full">
              <Box flex={1}>
                <Text fontSize="2xs" color="gray.500" mb={0.5} fontWeight="500">
                  Center Year
                </Text>
                <Input
                  size="sm"
                  type="number"
                  placeholder="1990"
                  value={zoom.centerYear || ''}
                  onChange={(e) =>
                    onZoomChange({
                      ...zoom,
                      centerYear: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  bg="rgba(255, 255, 255, 0.03)"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  borderRadius="6px"
                  px={3}
                  py={1.5}
                  h="auto"
                  fontSize="xs"
                  _hover={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                  _focus={{
                    borderColor: 'rgba(6, 182, 212, 0.5)',
                    boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
                  }}
                  fontFamily="mono"
                />
              </Box>
              <Box flex={1}>
                <Flex justify="space-between" align="center" mb={0.5}>
                  <Text fontSize="2xs" color="gray.500" fontWeight="500">
                    Window
                  </Text>
                  <Text fontSize="2xs" color="cyan.300" fontFamily="mono" fontWeight="600">
                    ±{zoom.windowSize}y
                  </Text>
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
                    height: '4px',
                    borderRadius: '2px',
                    marginTop: '8px',
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${sliderProgress}%, rgba(255,255,255,0.1) ${sliderProgress}%, rgba(255,255,255,0.1) 100%)`,
                    cursor: 'pointer',
                  }}
                />
              </Box>
            </Flex>
          ) : (
            <>
              {/* Center Year input */}
              <Box w="full">
                <Text fontSize="2xs" color="gray.500" mb={1} fontWeight="500">
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
                  borderRadius="6px"
                  px={3}
                  py={1.5}
                  h="auto"
                  fontSize="xs"
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
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontSize="2xs" color="gray.500" fontWeight="500">
                    Window Size
                  </Text>
                  <Box
                    px={1.5}
                    py={0.5}
                    bg="rgba(6, 182, 212, 0.15)"
                    borderRadius="md"
                  >
                    <Text fontSize="2xs" color="cyan.300" fontFamily="mono" fontWeight="600">
                      ±{zoom.windowSize}y
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
                      height: '4px',
                      borderRadius: '2px',
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${sliderProgress}%, rgba(255,255,255,0.1) ${sliderProgress}%, rgba(255,255,255,0.1) 100%)`,
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Box>
            </>
          )}

          {/* Action buttons */}
          <Flex w="full" gap={2}>
            <Button
              flex={1}
              size="xs"
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
              borderRadius="6px"
            >
              Apply
            </Button>
            <Button
              flex={1}
              size="xs"
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
              borderRadius="6px"
            >
              Reset
            </Button>
          </Flex>
        </VStack>
      </Box>
    </VStack>
  )
}
