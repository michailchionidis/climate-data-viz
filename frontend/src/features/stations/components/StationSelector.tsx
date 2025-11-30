/**
 * Multi-select component for weather station selection
 * Premium UI with search, visual feedback, and full accessibility support
 */
import { useState, useMemo, useRef, useCallback, memo } from 'react'
import { Box, Text, Flex, Input, Spinner } from '@chakra-ui/react'
import { useStations } from '@/shared/hooks/useClimateData'
import { SectionHeader, CheckIcon, AlertIcon, VisuallyHidden } from '@/shared/components/ui'
import { STATION_COLORS } from '@/theme'
import { useTheme } from '@/context/ThemeContext'

interface StationSelectorProps {
  selectedStations: string[]
  onSelectionChange: (stations: string[]) => void
  compact?: boolean
  /** Hide the header section (used when wrapped in CollapsibleSection) */
  hideHeader?: boolean
}

export const StationSelector = memo(function StationSelector({
  selectedStations,
  onSelectionChange,
  compact = false,
  hideHeader = false,
}: StationSelectorProps) {
  const { colors, colorMode } = useTheme()
  const spinnerColor = colors.accentCyan

  // Checkbox colors based on theme
  const checkboxBg = colorMode === 'light' ? '#1a1a1a' : 'rgba(255, 255, 255, 0.9)'
  const checkboxBorder = colorMode === 'light' ? '#1a1a1a' : 'rgba(255, 255, 255, 0.9)'
  const checkIconColor = colorMode === 'light' ? 'white' : colors.bg
  const { data: stations, isLoading, error } = useStations()
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter stations based on search
  const filteredStations = useMemo(() => {
    if (!stations) return []
    if (!searchQuery.trim()) return stations

    const query = searchQuery.toLowerCase()
    return stations.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
    )
  }, [stations, searchQuery])

  const handleToggle = (stationId: string) => {
    if (selectedStations.includes(stationId)) {
      onSelectionChange(selectedStations.filter((id) => id !== stationId))
    } else {
      onSelectionChange([...selectedStations, stationId])
    }
  }

  const handleSelectAll = () => {
    if (stations) {
      if (selectedStations.length === stations.length) {
        onSelectionChange([])
      } else {
        onSelectionChange(stations.map((s) => s.id))
      }
    }
  }

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!filteredStations.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex((prev) =>
          prev < filteredStations.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredStations.length - 1
        )
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < filteredStations.length) {
          handleToggle(filteredStations[focusedIndex].id)
        }
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(filteredStations.length - 1)
        break
      case 'Escape':
        e.preventDefault()
        setSearchQuery('')
        searchInputRef.current?.focus()
        break
    }
  }, [filteredStations, focusedIndex, handleToggle])

  // Get color for station - used only for the small color dot indicator
  // Chart colors are based on selection order, so we match that here
  const getStationChartColor = (stationId: string): string => {
    const selectedIndex = selectedStations.indexOf(stationId)
    if (selectedIndex !== -1) {
      return STATION_COLORS[selectedIndex % STATION_COLORS.length]
    }
    return STATION_COLORS[0]
  }

  if (isLoading) {
    return (
      <Box h="100%" display="flex" flexDirection="column">
        <SectionHeader title="Weather Stations" compact={compact} />
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={compact ? 4 : 8}
          gap={2}
          flex={1}
        >
          <Spinner size={compact ? 'md' : 'lg'} color={spinnerColor} />
          <Text fontSize="xs" color={colors.textSecondary}>
            Loading stations...
          </Text>
        </Flex>
      </Box>
    )
  }

  if (error) {
    return (
      <Box h="100%" display="flex" flexDirection="column">
        <SectionHeader title="Weather Stations" compact={compact} />
        <Box
          p={compact ? 2 : 4}
          bg="rgba(239, 68, 68, 0.1)"
          borderRadius="8px"
          borderWidth="1px"
          borderColor="rgba(239, 68, 68, 0.3)"
        >
          <Flex align="center" gap={2}>
            <AlertIcon size="sm" color="#ef4444" />
            <Text color="red.400" fontSize="xs">
              Failed to load stations. Please refresh.
            </Text>
          </Flex>
        </Box>
      </Box>
    )
  }

  return (
    <Box h="100%" display="flex" flexDirection="column">
      {!hideHeader && (
        <SectionHeader
          title="Weather Stations"
          compact={compact}
          badge={`${selectedStations.length}/${stations?.length || 0}`}
          action={
            <Text
              fontSize="2xs"
              color={colors.textMuted}
              cursor="pointer"
              onClick={handleSelectAll}
              _hover={{ color: colors.text }}
              transition="color 0.15s"
              fontWeight="500"
            >
              {selectedStations.length === stations?.length ? 'Clear' : 'All'}
            </Text>
          }
        />
      )}

      {/* Search input */}
      <Box mb={compact ? 2 : 3} flexShrink={0}>
        <Input
          ref={searchInputRef}
          size="sm"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setFocusedIndex(-1)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setFocusedIndex(0)
              listRef.current?.focus()
            }
          }}
          bg={colors.inputBg}
          borderColor={colors.border}
          borderRadius="6px"
          px={3}
          py={1.5}
          h="auto"
          fontSize="xs"
          color={colors.text}
          _hover={{ borderColor: colors.borderHover }}
          _focus={{
            borderColor: 'rgba(6, 182, 212, 0.5)',
            boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.3)',
          }}
          _placeholder={{ color: colors.textMuted }}
          aria-label="Search weather stations"
          aria-describedby="station-search-hint"
          role="combobox"
          aria-expanded="true"
          aria-controls="station-listbox"
          aria-autocomplete="list"
        />
        <VisuallyHidden>
          <span id="station-search-hint">
            Type to filter stations. Use arrow keys to navigate, Enter or Space to select.
          </span>
        </VisuallyHidden>
      </Box>

      {/* Station list - flex grow to fill available space */}
      <Box
        ref={listRef}
        flex={1}
        minH={0}
        overflowY="auto"
        tabIndex={0}
        role="listbox"
        id="station-listbox"
        aria-label="Weather stations"
        aria-multiselectable="true"
        aria-activedescendant={focusedIndex >= 0 ? `station-${filteredStations[focusedIndex]?.id}` : undefined}
        onKeyDown={handleKeyDown}
        onBlur={() => setFocusedIndex(-1)}
        _focus={{
          outline: 'none',
        }}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: colors.inputBg,
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: colors.border,
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: colors.borderHover,
          },
        }}
      >
        <Flex direction="column" gap={0.5} role="presentation">
          {filteredStations.length === 0 ? (
            <Box py={2} textAlign="center">
              <Text color={colors.textMuted} fontSize="xs">
                No match for "{searchQuery}"
              </Text>
            </Box>
          ) : (
            filteredStations.map((station, idx) => {
              const isSelected = selectedStations.includes(station.id)
              const isFocused = focusedIndex === idx
              const chartColor = getStationChartColor(station.id)

              return (
                <Flex
                  key={station.id}
                  id={`station-${station.id}`}
                  role="option"
                  aria-selected={isSelected}
                  align="center"
                  gap={2}
                  p={compact ? 1.5 : 2.5}
                  borderRadius="6px"
                  cursor="pointer"
                  bg="transparent"
                  boxShadow={isFocused ? '0 0 0 2px rgba(6, 182, 212, 0.2)' : 'none'}
                  _hover={{
                    bg: colors.buttonHover,
                  }}
                  onClick={() => handleToggle(station.id)}
                  transition="all 0.15s ease"
                  style={{
                    opacity: 0,
                    animation: 'fadeInUp 0.2s ease-out forwards',
                    animationDelay: `${idx * 0.02}s`,
                  }}
                >
                  {/* Custom checkbox - theme-aware style */}
                  <Box
                    w={compact ? '14px' : '18px'}
                    h={compact ? '14px' : '18px'}
                    borderRadius="4px"
                    borderWidth="2px"
                    borderColor={isSelected ? checkboxBorder : colors.border}
                    bg={isSelected ? checkboxBg : 'transparent'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.15s ease"
                    flexShrink={0}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <CheckIcon size="xs" color={checkIconColor} />
                    )}
                  </Box>

                  {/* Station info */}
                  <Box flex={1} minW={0}>
                    <Text
                      fontSize={compact ? 'xs' : 'sm'}
                      fontWeight="600"
                      color={isSelected ? colors.text : colors.textSecondary}
                      css={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {station.name}
                    </Text>
                  </Box>

                  {/* Small color indicator matching chart color */}
                  {isSelected && (
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={chartColor}
                      flexShrink={0}
                      title={`Chart color for ${station.name}`}
                    />
                  )}
                </Flex>
              )
            })
          )}
        </Flex>
      </Box>

    </Box>
  )
})
