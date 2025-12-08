/**
 * Controls panel for visualization settings
 * Premium UI with smooth interactions and input validation
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { Box, Text, Flex, Input, VStack } from '@chakra-ui/react'
import { SectionHeader, PillButton } from '@/shared/components/ui'
import { useTheme } from '@/context/ThemeContext'
import { validateYear, validateYearRange, parseYearInput } from '@/shared'
import type { VisualizationMode, ZoomState } from '@/shared/types'

// Validation delay in ms (wait for user to stop typing)
const VALIDATION_DELAY = 800

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
  const { colors, colorMode } = useTheme()

  // Slider colors based on theme
  const sliderTrackActive = colorMode === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)'
  const sliderTrackInactive = colorMode === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)'
  const sliderThumbBg = colorMode === 'light' ? '#1a1a1a' : 'white'
  const sliderThumbBorder = colorMode === 'light' ? '2px solid #1a1a1a' : 'none'

  // Track the last applied zoom settings to know when Apply should be enabled
  const [appliedZoom, setAppliedZoom] = useState<ZoomState>({ centerYear: null, windowSize: 10 })

  // Validation states (errors inform user, warnings are softer)
  const [yearFromError, setYearFromError] = useState<string | null>(null)
  const [yearFromWarning, setYearFromWarning] = useState<string | null>(null)
  const [yearToError, setYearToError] = useState<string | null>(null)
  const [yearToWarning, setYearToWarning] = useState<string | null>(null)

  // Debounce timers for validation messages
  const yearFromValidationTimer = useRef<NodeJS.Timeout | null>(null)
  const yearToValidationTimer = useRef<NodeJS.Timeout | null>(null)

  // Check if current zoom differs from applied zoom (i.e., there are unapplied changes)
  const hasUnappliedChanges = zoom.centerYear !== null && (
    zoom.centerYear !== appliedZoom.centerYear ||
    zoom.windowSize !== appliedZoom.windowSize
  )

  // Handle year input changes
  // Updates parent immediately, shows validation messages with debounce
  const handleYearFromChange = useCallback((inputValue: string) => {
    // Clear any pending validation
    if (yearFromValidationTimer.current) {
      clearTimeout(yearFromValidationTimer.current)
    }

    const value = parseYearInput(inputValue)

    // Update parent immediately
    onYearFromChange(value)

    // Clear messages if empty
    if (value === null) {
      setYearFromError(null)
      setYearFromWarning(null)
      return
    }

    // Immediate validation for obvious errors
    if (value < 0) {
      setYearFromError('Year cannot be negative')
      setYearFromWarning(null)
      return
    }

    // Clear error while typing
    setYearFromError(null)
    setYearFromWarning(null)

    // Debounce validation messages
    yearFromValidationTimer.current = setTimeout(() => {
      const validation = validateYear(value, 'from')

      // Check range consistency
      if (yearTo !== null && value > yearTo) {
        setYearFromError('From year cannot be greater than To year')
        return
      }

      // Set warning if applicable
      setYearFromWarning(validation.warning || null)
      setYearToError(null)
    }, VALIDATION_DELAY)
  }, [yearTo, onYearFromChange])

  const handleYearToChange = useCallback((inputValue: string) => {
    // Clear any pending validation
    if (yearToValidationTimer.current) {
      clearTimeout(yearToValidationTimer.current)
    }

    const value = parseYearInput(inputValue)

    // Update parent immediately
    onYearToChange(value)

    // Clear messages if empty
    if (value === null) {
      setYearToError(null)
      setYearToWarning(null)
      return
    }

    // Immediate validation for obvious errors
    if (value < 0) {
      setYearToError('Year cannot be negative')
      setYearToWarning(null)
      return
    }

    // Clear error while typing
    setYearToError(null)
    setYearToWarning(null)

    // Debounce validation messages
    yearToValidationTimer.current = setTimeout(() => {
      const validation = validateYear(value, 'to')

      // Check range consistency
      if (yearFrom !== null && value < yearFrom) {
        setYearToError('To year cannot be less than From year')
        return
      }

      // Set warning if applicable
      setYearToWarning(validation.warning || null)
      setYearFromError(null)
    }, VALIDATION_DELAY)
  }, [yearFrom, onYearToChange])

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (yearFromValidationTimer.current) clearTimeout(yearFromValidationTimer.current)
      if (yearToValidationTimer.current) clearTimeout(yearToValidationTimer.current)
    }
  }, [])

  // Clear validation messages when year range changes externally (e.g., via presets)
  useEffect(() => {
    const rangeValidation = validateYearRange(yearFrom, yearTo)
    if (rangeValidation.isValid) {
      setYearFromError(null)
      setYearToError(null)
    }
    // Also clear warnings if values are within range
    if (yearFrom === null) setYearFromWarning(null)
    if (yearTo === null) setYearToWarning(null)
  }, [yearFrom, yearTo])

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
              bg={mode === 'monthly' ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}
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
                bg: mode === 'monthly' ? 'rgba(255, 255, 255, 0.08)' : colors.buttonHover,
              }}
              _focus={{
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)',
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
                color={mode === 'monthly' ? colors.text : colors.textMuted}
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
              bg={mode === 'annual' ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}
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
                bg: mode === 'annual' ? 'rgba(255, 255, 255, 0.08)' : colors.buttonHover,
              }}
              _focus={{
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.1)',
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
                color={mode === 'annual' ? colors.text : colors.textMuted}
                textAlign="center"
              >
                Annual Avg
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Sigma bounds toggle - disabled for monthly mode */}
        <Flex
          mt={2}
          p={compact ? 2 : 3}
          borderRadius="6px"
          bg={colors.inputBg}
          borderWidth="1px"
          borderColor={colors.border}
          cursor={mode === 'annual' ? 'pointer' : 'not-allowed'}
          opacity={mode === 'annual' ? 1 : 0.5}
          onClick={mode === 'annual' ? () => onShowSigmaBoundsChange(!showSigmaBounds) : undefined}
          onKeyDown={(e) => {
            if (mode === 'annual' && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault()
              onShowSigmaBoundsChange(!showSigmaBounds)
            }
          }}
          _hover={mode === 'annual' ? {
            bg: colors.buttonHover,
          } : {}}
          _focus={{
            boxShadow: mode === 'annual' ? '0 0 0 2px rgba(255, 255, 255, 0.1)' : 'none',
            outline: 'none',
          }}
          transition="all 0.2s ease"
          align="center"
          gap={2}
          tabIndex={mode === 'annual' ? 0 : -1}
          role="switch"
          aria-checked={showSigmaBounds}
          aria-disabled={mode !== 'annual'}
          aria-label="Show plus or minus one standard deviation overlay on chart (only available in Annual mode)"
          title={mode === 'monthly' ? 'Only available in Annual mode' : undefined}
        >
          {/* Toggle switch - white when on */}
          <Box
            w={compact ? '28px' : '36px'}
            h={compact ? '16px' : '20px'}
            borderRadius="full"
            bg={showSigmaBounds && mode === 'annual' ? 'rgba(255, 255, 255, 0.9)' : colors.buttonBg}
            position="relative"
            transition="all 0.2s ease"
            flexShrink={0}
            aria-hidden="true"
          >
            <Box
              w={compact ? '12px' : '16px'}
              h={compact ? '12px' : '16px'}
              borderRadius="full"
              bg={showSigmaBounds && mode === 'annual' ? colors.bg : 'white'}
              position="absolute"
              top="2px"
              left={showSigmaBounds && mode === 'annual' ? (compact ? '14px' : '18px') : '2px'}
              transition="all 0.2s ease"
              boxShadow="0 1px 3px rgba(0,0,0,0.3)"
            />
          </Box>
          <Text fontSize="xs" color={mode === 'annual' && showSigmaBounds ? colors.text : colors.textMuted} fontWeight="500">
            Show ±1σ Overlay
          </Text>
        </Flex>
      </Box>

      {/* Year Range */}
      <Box id="year-range-controls">
        <SectionHeader
          title="Year Range"
          badge={yearFrom || yearTo ? `${yearFrom || minYear}–${yearTo || maxYear}` : undefined}
          badgeColor="cyan"
          compact={compact}
        />
        <Flex gap={2} align="flex-start">
          <Box flex={1}>
            <Text fontSize="2xs" color={colors.textMuted} mb={1} fontWeight="500">
              From
            </Text>
            <Input
              size="sm"
              type="number"
              placeholder={String(minYear)}
              value={yearFrom ?? ''}
              onChange={(e) => handleYearFromChange(e.target.value)}
              bg={colors.inputBg}
              borderColor={yearFromError ? 'rgba(239, 68, 68, 0.6)' : colors.border}
              borderRadius="6px"
              px={3}
              py={1.5}
              h="auto"
              fontSize="xs"
              color={colors.text}
              _placeholder={{ color: colors.textMuted }}
              _hover={{ borderColor: yearFromError ? 'rgba(239, 68, 68, 0.8)' : colors.borderHover }}
              _focus={{
                borderColor: yearFromError ? 'rgba(239, 68, 68, 0.8)' : 'rgba(6, 182, 212, 0.5)',
                boxShadow: yearFromError ? '0 0 0 1px rgba(239, 68, 68, 0.3)' : '0 0 0 1px rgba(6, 182, 212, 0.3)',
              }}
              fontFamily="mono"
              aria-label="Year range start"
              aria-invalid={!!yearFromError}
              aria-describedby={yearFromError ? 'year-from-error' : undefined}
            />
            {yearFromError && (
              <Text
                id="year-from-error"
                fontSize="2xs"
                color="red.400"
                mt={1}
                role="alert"
              >
                {yearFromError}
              </Text>
            )}
            {!yearFromError && yearFromWarning && (
              <Text
                fontSize="2xs"
                color="orange.400"
                mt={1}
              >
                {yearFromWarning}
              </Text>
            )}
          </Box>
          <Text color={colors.textMuted} pt={5} fontSize="sm">
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
              value={yearTo ?? ''}
              onChange={(e) => handleYearToChange(e.target.value)}
              bg={colors.inputBg}
              borderColor={yearToError ? 'rgba(239, 68, 68, 0.6)' : colors.border}
              borderRadius="6px"
              px={3}
              py={1.5}
              h="auto"
              fontSize="xs"
              color={colors.text}
              _placeholder={{ color: colors.textMuted }}
              _hover={{ borderColor: yearToError ? 'rgba(239, 68, 68, 0.8)' : colors.borderHover }}
              _focus={{
                borderColor: yearToError ? 'rgba(239, 68, 68, 0.8)' : 'rgba(6, 182, 212, 0.5)',
                boxShadow: yearToError ? '0 0 0 1px rgba(239, 68, 68, 0.3)' : '0 0 0 1px rgba(6, 182, 212, 0.3)',
              }}
              fontFamily="mono"
              aria-label="Year range end"
              aria-invalid={!!yearToError}
              aria-describedby={yearToError ? 'year-to-error' : undefined}
            />
            {yearToError && (
              <Text
                id="year-to-error"
                fontSize="2xs"
                color="red.400"
                mt={1}
                role="alert"
              >
                {yearToError}
              </Text>
            )}
            {!yearToError && yearToWarning && (
              <Text
                fontSize="2xs"
                color="orange.400"
                mt={1}
              >
                {yearToWarning}
              </Text>
            )}
          </Box>
        </Flex>

        {/* Quick presets - inline with year range in compact mode */}
        <Flex gap={2} mt={2} flexWrap="wrap">
          {[
            { label: 'Last 50y', from: 1970, to: 2019 },
            { label: '20th C', from: 1900, to: 1999 },
            { label: 'All', from: null, to: null },
          ].map((preset) => (
            <PillButton
              key={preset.label}
              onClick={() => {
                onYearFromChange(preset.from)
                onYearToChange(preset.to)
              }}
              size="xs"
            >
              {preset.label}
            </PillButton>
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
                  aria-label="Zoom center year"
                />
              </Box>
              <Box
                flex={1}
                opacity={zoom.centerYear ? 1 : 0.4}
                css={{
                  '& input[type="range"]': {
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    width: '100%',
                    height: '4px',
                    borderRadius: '2px',
                    marginTop: '8px',
                    background: zoom.centerYear
                      ? `linear-gradient(to right, ${sliderTrackActive} 0%, ${sliderTrackActive} ${sliderProgress}%, ${sliderTrackInactive} ${sliderProgress}%, ${sliderTrackInactive} 100%)`
                      : sliderTrackInactive,
                    cursor: zoom.centerYear ? 'pointer' : 'not-allowed',
                  },
                  '& input[type="range"]::-webkit-slider-thumb': {
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: sliderThumbBg,
                    border: sliderThumbBorder,
                    cursor: zoom.centerYear ? 'pointer' : 'not-allowed',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  },
                  '& input[type="range"]::-moz-range-thumb': {
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: sliderThumbBg,
                    border: sliderThumbBorder,
                    cursor: zoom.centerYear ? 'pointer' : 'not-allowed',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  },
                }}
              >
                <Flex justify="space-between" align="center" mb={0.5}>
                  <Text fontSize="2xs" color={colors.textMuted} fontWeight="500">
                    Window
                  </Text>
                  <Text fontSize="2xs" color={zoom.centerYear ? colors.text : colors.textMuted} fontFamily="mono" fontWeight="600">
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
                  aria-label={`Zoom window size: plus or minus ${zoom.windowSize} years`}
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
                  aria-label="Zoom center year"
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
                    <Text fontSize="2xs" color={zoom.centerYear ? colors.text : colors.textMuted} fontFamily="mono" fontWeight="600">
                      ±{zoom.windowSize}y
                    </Text>
                  </Box>
                </Flex>
                <Box
                  position="relative"
                  css={{
                    '& input[type="range"]': {
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      width: '100%',
                      height: '4px',
                      borderRadius: '2px',
                      background: zoom.centerYear
                        ? `linear-gradient(to right, ${sliderTrackActive} 0%, ${sliderTrackActive} ${sliderProgress}%, ${sliderTrackInactive} ${sliderProgress}%, ${sliderTrackInactive} 100%)`
                        : sliderTrackInactive,
                      cursor: zoom.centerYear ? 'pointer' : 'not-allowed',
                    },
                    '& input[type="range"]::-webkit-slider-thumb': {
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: sliderThumbBg,
                      border: sliderThumbBorder,
                      cursor: zoom.centerYear ? 'pointer' : 'not-allowed',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    },
                    '& input[type="range"]::-moz-range-thumb': {
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: sliderThumbBg,
                      border: sliderThumbBorder,
                      cursor: zoom.centerYear ? 'pointer' : 'not-allowed',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    },
                  }}
                >
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
                    aria-label={`Zoom window size: plus or minus ${zoom.windowSize} years`}
                  />
                </Box>
              </Box>
            </>
          )}

          {/* Action buttons */}
          <Flex w="full" gap={2}>
            <PillButton
              onClick={handleZoomToYear}
              disabled={!hasUnappliedChanges}
              variant={hasUnappliedChanges ? 'primary' : 'default'}
              fullWidth
              size="xs"
            >
              Apply
            </PillButton>
            <PillButton
              onClick={handleResetZoom}
              fullWidth
              size="xs"
            >
              Reset
            </PillButton>
          </Flex>
        </VStack>
      </Box>
    </VStack>
  )
}
