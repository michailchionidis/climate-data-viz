/**
 * Controls panel for visualization settings
 * Premium UI with smooth interactions
 */
import { useState, useEffect } from 'react'
import { Box, Text, Flex, Input, Button, VStack } from '@chakra-ui/react'
import { SectionHeader } from './ui/SectionHeader'
import { useTheme } from '../context/ThemeContext'
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
  const { colors } = useTheme()
  // Use accessible accent colors from theme (WCAG AA compliant)
  const cyanAccent = colors.accentCyanText

  // Track the last applied zoom settings to know when Apply should be enabled
  const [appliedZoom, setAppliedZoom] = useState<ZoomState>({ centerYear: null, windowSize: 10 })

  // Check if current zoom differs from applied zoom (i.e., there are unapplied changes)
  const hasUnappliedChanges = zoom.centerYear !== null && (
    zoom.centerYear !== appliedZoom.centerYear ||
    zoom.windowSize !== appliedZoom.windowSize
  )

  const handleZoomToYear = () => {
    if (zoom.centerYear) {
      const from = Math.max(minYear, zoom.centerYear - zoom.windowSize)
      const to = Math.min(maxYear, zoom.centerYear + zoom.windowSize)
      onYearFromChange(from)
      onYearToChange(to)
      // Mark current zoom as applied
      setAppliedZoom({ ...zoom })
    }
  }

  const handleResetZoom = () => {
    onYearFromChange(null)
    onYearToChange(null)
    onZoomChange({ centerYear: null, windowSize: 10 })
    // Reset applied zoom state
    setAppliedZoom({ centerYear: null, windowSize: 10 })
  }

  // Reset applied state when center year is cleared externally
  useEffect(() => {
    if (zoom.centerYear === null) {
      setAppliedZoom({ centerYear: null, windowSize: 10 })
    }
  }, [zoom.centerYear])

  // Calculate slider progress for styling
  const sliderProgress = ((zoom.windowSize - 5) / (50 - 5)) * 100

  return (
    <VStack gap={compact ? 3 : 6} align="stretch">
      {/* Visualization Mode */}
      <Box id="visualization-mode">
        <SectionHeader title="Visualization Mode" compact={compact} />

        {/* Mode toggle */}
        <Box
          p={0.5}
          bg={colors.inputBg}
          borderRadius="8px"
          borderWidth="1px"
          borderColor={colors.border}
          role="radiogroup"
          aria-label="Visualization mode"
        >
          <Flex gap={0.5}>
            <Box
              flex={1}
              py={compact ? 1 : 2}
              px={2}
              borderRadius="6px"
              bg={mode === 'monthly' ? colors.selectedBg : 'transparent'}
              cursor="pointer"
              onClick={() => onModeChange('monthly')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onModeChange('monthly')
                }
              }}
              transition="all 0.2s ease"
              _hover={{
                bg: mode === 'monthly' ? colors.selectedBg : colors.buttonHover,
              }}
              _focus={{
                boxShadow: '0 0 0 2px rgba(6, 182, 212, 0.4)',
                outline: 'none',
              }}
              tabIndex={0}
              role="radio"
              aria-checked={mode === 'monthly'}
              aria-label="Monthly view - show data by month"
            >
              <Text
                fontSize="xs"
                fontWeight="600"
                color={mode === 'monthly' ? colors.accentCyanText : colors.textMuted}
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
              bg={mode === 'annual' ? colors.selectedBg : 'transparent'}
              cursor="pointer"
              onClick={() => onModeChange('annual')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onModeChange('annual')
                }
              }}
              transition="all 0.2s ease"
              _hover={{
                bg: mode === 'annual' ? colors.selectedBg : colors.buttonHover,
              }}
              _focus={{
                boxShadow: '0 0 0 2px rgba(6, 182, 212, 0.4)',
                outline: 'none',
              }}
              tabIndex={0}
              role="radio"
              aria-checked={mode === 'annual'}
              aria-label="Annual average view - show yearly averages"
            >
              <Text
                fontSize="xs"
                fontWeight="600"
                color={mode === 'annual' ? colors.accentCyanText : colors.textMuted}
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
            bg={showSigmaBounds ? colors.selectedBg : colors.inputBg}
            borderWidth="1px"
            borderColor={showSigmaBounds ? colors.selectedBorder : colors.border}
            cursor="pointer"
            onClick={() => onShowSigmaBoundsChange(!showSigmaBounds)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onShowSigmaBoundsChange(!showSigmaBounds)
              }
            }}
            _hover={{
              bg: showSigmaBounds ? colors.selectedBg : colors.buttonHover,
              borderColor: showSigmaBounds ? colors.selectedBorder : colors.borderHover,
            }}
            _focus={{
              boxShadow: '0 0 0 2px rgba(6, 182, 212, 0.4)',
              outline: 'none',
            }}
            transition="all 0.2s ease"
            align="center"
            gap={2}
            tabIndex={0}
            role="switch"
            aria-checked={showSigmaBounds}
            aria-label="Show plus or minus one standard deviation overlay on chart"
          >
            {/* Toggle switch */}
            <Box
              w={compact ? '28px' : '36px'}
              h={compact ? '16px' : '20px'}
              borderRadius="full"
              bg={showSigmaBounds ? '#06b6d4' : colors.buttonBg}
              position="relative"
              transition="all 0.2s ease"
              flexShrink={0}
              aria-hidden="true"
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
            <Text fontSize="xs" color={showSigmaBounds ? colors.accentCyanText : colors.textMuted} fontWeight="500">
              Show ±1σ Overlay
            </Text>
          </Flex>
        )}
      </Box>

      {/* Year Range */}
      <Box id="year-range-controls">
        <SectionHeader
          title="Year Range"
          badge={yearFrom || yearTo ? `${yearFrom || minYear}–${yearTo || maxYear}` : undefined}
          badgeColor="cyan"
          compact={compact}
        />
        <Flex gap={2} align="center">
          <Box flex={1}>
            <Text fontSize="2xs" color={colors.textMuted} mb={1} fontWeight="500">
              From
            </Text>
            <Input
              size="sm"
              type="number"
              placeholder={String(minYear)}
              value={yearFrom || ''}
              onChange={(e) => onYearFromChange(e.target.value ? parseInt(e.target.value) : null)}
              bg={colors.inputBg}
              borderColor={colors.border}
              borderRadius="6px"
              px={3}
              py={1.5}
              h="auto"
              fontSize="xs"
              color={colors.text}
              _placeholder={{ color: colors.textMuted }}
              _hover={{ borderColor: colors.borderHover }}
              _focus={{
                borderColor: 'rgba(6, 182, 212, 0.5)',
                boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
              }}
              fontFamily="mono"
            />
          </Box>
          <Text color={colors.textMuted} pt={4} fontSize="sm">
            —
          </Text>
          <Box flex={1}>
            <Text fontSize="2xs" color={colors.textMuted} mb={1} fontWeight="500">
              To
            </Text>
            <Input
              size="sm"
              type="number"
              placeholder={String(maxYear)}
              value={yearTo || ''}
              onChange={(e) => onYearToChange(e.target.value ? parseInt(e.target.value) : null)}
              bg={colors.inputBg}
              borderColor={colors.border}
              borderRadius="6px"
              px={3}
              py={1.5}
              h="auto"
              fontSize="xs"
              color={colors.text}
              _placeholder={{ color: colors.textMuted }}
              _hover={{ borderColor: colors.borderHover }}
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
              bg={colors.inputBg}
              borderRadius="4px"
              borderWidth="1px"
              borderColor={colors.border}
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
              <Text fontSize="2xs" color={colors.textSecondary}>
                {preset.label}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Zoom Controls */}
      <Box id="zoom-controls">
        <SectionHeader title="Zoom Controls" compact={compact} />
        <VStack gap={compact ? 2 : 3}>
          {/* Center Year + Window Size in row for compact */}
          {compact ? (
            <Flex gap={2} w="full">
              <Box flex={1}>
                <Text fontSize="2xs" color={colors.textMuted} mb={0.5} fontWeight="500">
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
                  bg={colors.inputBg}
                  borderColor={colors.border}
                  borderRadius="6px"
                  px={3}
                  py={1.5}
                  h="auto"
                  fontSize="xs"
                  color={colors.text}
                  _placeholder={{ color: colors.textMuted }}
                  _hover={{ borderColor: colors.borderHover }}
                  _focus={{
                    borderColor: 'rgba(6, 182, 212, 0.5)',
                    boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
                  }}
                  fontFamily="mono"
                />
              </Box>
              <Box flex={1} opacity={zoom.centerYear ? 1 : 0.4}>
                <Flex justify="space-between" align="center" mb={0.5}>
                  <Text fontSize="2xs" color={colors.textMuted} fontWeight="500">
                    Window
                  </Text>
                  <Text fontSize="2xs" color={zoom.centerYear ? colors.accentCyanText : colors.textMuted} fontFamily="mono" fontWeight="600">
                    ±{zoom.windowSize}y
                  </Text>
                </Flex>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={zoom.windowSize}
                  disabled={!zoom.centerYear}
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
                    background: zoom.centerYear
                      ? `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${sliderProgress}%, rgba(255,255,255,0.1) ${sliderProgress}%, rgba(255,255,255,0.1) 100%)`
                      : 'rgba(255,255,255,0.1)',
                    cursor: zoom.centerYear ? 'pointer' : 'not-allowed',
                  }}
                />
              </Box>
            </Flex>
          ) : (
            <>
              {/* Center Year input */}
              <Box w="full">
                <Text fontSize="2xs" color={colors.textMuted} mb={1} fontWeight="500">
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
                  bg={colors.inputBg}
                  borderColor={colors.border}
                  borderRadius="6px"
                  px={3}
                  py={1.5}
                  h="auto"
                  fontSize="xs"
                  color={colors.text}
                  _placeholder={{ color: colors.textMuted }}
                  _hover={{ borderColor: colors.borderHover }}
                  _focus={{
                    borderColor: 'rgba(6, 182, 212, 0.5)',
                    boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
                  }}
                  fontFamily="mono"
                />
              </Box>

              {/* Window size slider */}
              <Box w="full" opacity={zoom.centerYear ? 1 : 0.4}>
                <Flex justify="space-between" align="center" mb={1}>
                  <Text fontSize="2xs" color={colors.textMuted} fontWeight="500">
                    Window Size
                  </Text>
                  <Box
                    px={1.5}
                    py={0.5}
                    bg={zoom.centerYear ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)'}
                    borderRadius="md"
                  >
                    <Text fontSize="2xs" color={zoom.centerYear ? colors.accentCyanText : colors.textMuted} fontFamily="mono" fontWeight="600">
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
                    disabled={!zoom.centerYear}
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
                      background: zoom.centerYear
                        ? `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${sliderProgress}%, rgba(255,255,255,0.1) ${sliderProgress}%, rgba(255,255,255,0.1) 100%)`
                        : 'rgba(255,255,255,0.1)',
                      cursor: zoom.centerYear ? 'pointer' : 'not-allowed',
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
              bg={hasUnappliedChanges ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)'}
              color={hasUnappliedChanges ? cyanAccent : 'gray.500'}
              borderWidth="1px"
              borderColor={hasUnappliedChanges ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.1)'}
              _hover={{
                bg: hasUnappliedChanges ? 'rgba(6, 182, 212, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              }}
              _active={{
                bg: hasUnappliedChanges ? 'rgba(6, 182, 212, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              }}
              onClick={handleZoomToYear}
              disabled={!hasUnappliedChanges}
              borderRadius="6px"
            >
              Apply
            </Button>
            <Button
              flex={1}
              size="xs"
              bg={colors.inputBg}
              color={colors.textSecondary}
              borderWidth="1px"
              borderColor={colors.border}
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
