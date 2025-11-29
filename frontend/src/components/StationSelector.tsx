/**
 * Multi-select component for weather station selection
 * Premium UI with search and visual feedback
 */
import { useState, useMemo } from 'react'
import { Box, Text, Flex, Input, Spinner } from '@chakra-ui/react'
import { useStations } from '../hooks/useClimateData'
import { SectionHeader } from './ui/SectionHeader'
import { CheckIcon, AlertIcon } from './ui/Icons'
import { STATION_COLORS } from '../theme'

interface StationSelectorProps {
  selectedStations: string[]
  onSelectionChange: (stations: string[]) => void
  compact?: boolean
  /** Hide the header section (used when wrapped in CollapsibleSection) */
  hideHeader?: boolean
}

export function StationSelector({
  selectedStations,
  onSelectionChange,
  compact = false,
  hideHeader = false,
}: StationSelectorProps) {
  const { data: stations, isLoading, error } = useStations()
  const [searchQuery, setSearchQuery] = useState('')

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

  // Get color for station based on its position in selectedStations
  // This ensures colors match the chart which uses selectedStations order
  const getStationColor = (stationId: string): string => {
    const selectedIndex = selectedStations.indexOf(stationId)
    if (selectedIndex !== -1) {
      return STATION_COLORS[selectedIndex % STATION_COLORS.length]
    }
    // For unselected stations, use their position in the full list (grayed out anyway)
    if (!stations) return STATION_COLORS[0]
    const index = stations.findIndex((s) => s.id === stationId)
    return STATION_COLORS[index % STATION_COLORS.length]
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
          <Spinner size={compact ? 'md' : 'lg'} color="cyan.400" />
          <Text fontSize="xs" color="gray.400">
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
          action={
            <Text
              fontSize="2xs"
              color="cyan.400"
              cursor="pointer"
              onClick={handleSelectAll}
              _hover={{ color: 'cyan.300' }}
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
          size="sm"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          _placeholder={{ color: 'gray.600' }}
        />
      </Box>

      {/* Station list - flex grow to fill available space */}
      <Box
        flex={1}
        minH={0}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.25)',
          },
        }}
      >
        <Flex direction="column" gap={0.5}>
          {filteredStations.length === 0 ? (
            <Box py={2} textAlign="center">
              <Text color="gray.500" fontSize="xs">
                No match for "{searchQuery}"
              </Text>
            </Box>
          ) : (
            filteredStations.map((station, idx) => {
              const isSelected = selectedStations.includes(station.id)
              const color = getStationColor(station.id)

              return (
                <Flex
                  key={station.id}
                  align="center"
                  gap={2}
                  p={compact ? 1.5 : 2.5}
                  borderRadius="6px"
                  cursor="pointer"
                  bg={isSelected ? `${color}15` : 'transparent'}
                  borderWidth="1px"
                  borderColor={isSelected ? `${color}40` : 'transparent'}
                  _hover={{
                    bg: isSelected ? `${color}20` : 'rgba(255, 255, 255, 0.05)',
                    borderColor: isSelected ? `${color}50` : 'rgba(255, 255, 255, 0.1)',
                  }}
                  onClick={() => handleToggle(station.id)}
                  transition="all 0.15s ease"
                  style={{
                    opacity: 0,
                    animation: 'fadeInUp 0.2s ease-out forwards',
                    animationDelay: `${idx * 0.02}s`,
                  }}
                >
                  {/* Custom checkbox */}
                  <Box
                    w={compact ? '14px' : '18px'}
                    h={compact ? '14px' : '18px'}
                    borderRadius="4px"
                    borderWidth="2px"
                    borderColor={isSelected ? color : 'rgba(255, 255, 255, 0.2)'}
                    bg={isSelected ? color : 'transparent'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.15s ease"
                    flexShrink={0}
                  >
                    {isSelected && (
                      <CheckIcon size="xs" color="white" />
                    )}
                  </Box>

                  {/* Station info */}
                  <Box flex={1} minW={0}>
                    <Text
                      fontSize={compact ? 'xs' : 'sm'}
                      fontWeight="500"
                      color={isSelected ? 'white' : 'gray.300'}
                      css={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                    >
                      {station.name}
                    </Text>
                  </Box>

                  {/* Color indicator */}
                  {isSelected && (
                    <Box
                      w="6px"
                      h="6px"
                      borderRadius="full"
                      bg={color}
                      boxShadow={`0 0 6px ${color}`}
                      flexShrink={0}
                    />
                  )}
                </Flex>
              )
            })
          )}
        </Flex>
      </Box>

      {/* Selection count */}
      <Box
        mt={2}
        pt={2}
        borderTopWidth="1px"
        borderColor="rgba(255, 255, 255, 0.06)"
        flexShrink={0}
      >
        <Flex justify="space-between" align="center">
          <Text fontSize="2xs" color="gray.500">
            {selectedStations.length}/{stations?.length || 0} selected
          </Text>
          {selectedStations.length > 0 && (
            <Flex gap={0.5}>
              {selectedStations.slice(0, 4).map((id) => (
                <Box
                  key={id}
                  w="5px"
                  h="5px"
                  borderRadius="full"
                  bg={getStationColor(id)}
                />
              ))}
              {selectedStations.length > 4 && (
                <Text fontSize="2xs" color="gray.500">
                  +{selectedStations.length - 4}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
      </Box>
    </Box>
  )
}
