/**
 * Multi-select component for weather station selection
 */
import { Box, Text, Flex, Spinner, Checkbox } from '@chakra-ui/react'
import { useStations } from '../hooks/useClimateData'

interface StationSelectorProps {
  selectedStations: string[]
  onSelectionChange: (stations: string[]) => void
}

export function StationSelector({
  selectedStations,
  onSelectionChange,
}: StationSelectorProps) {
  const { data: stations, isLoading, error } = useStations()

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

  if (isLoading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="md" color="cyan.400" />
        <Text mt={2} fontSize="sm" color="gray.400">
          Loading stations...
        </Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={4} bg="red.900/20" borderRadius="md" borderWidth="1px" borderColor="red.500/30">
        <Text color="red.400" fontSize="sm">
          Failed to load stations. Please try again.
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontSize="sm" fontWeight="600" color="gray.300" textTransform="uppercase" letterSpacing="wide">
          Weather Stations
        </Text>
        <Text
          fontSize="xs"
          color="cyan.400"
          cursor="pointer"
          onClick={handleSelectAll}
          _hover={{ color: 'cyan.300' }}
        >
          {selectedStations.length === stations?.length ? 'Clear all' : 'Select all'}
        </Text>
      </Flex>

      <Box
        maxH="280px"
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(255,255,255,0.3)',
          },
        }}
      >
        <Flex direction="column" gap={1}>
          {stations?.map((station) => {
            const isSelected = selectedStations.includes(station.id)
            return (
              <Flex
                key={station.id}
                align="center"
                gap={3}
                p={2}
                borderRadius="md"
                cursor="pointer"
                bg={isSelected ? 'cyan.900/30' : 'transparent'}
                borderWidth="1px"
                borderColor={isSelected ? 'cyan.500/40' : 'transparent'}
                _hover={{
                  bg: isSelected ? 'cyan.900/40' : 'whiteAlpha.100',
                }}
                onClick={() => handleToggle(station.id)}
                transition="all 0.15s"
              >
                <Checkbox.Root
                  checked={isSelected}
                  size="sm"
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control
                    borderColor={isSelected ? 'cyan.400' : 'gray.600'}
                    bg={isSelected ? 'cyan.500' : 'transparent'}
                  >
                    <Checkbox.Indicator>
                      <Box as="span" color="white" fontSize="xs">✓</Box>
                    </Checkbox.Indicator>
                  </Checkbox.Control>
                </Checkbox.Root>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="500" color={isSelected ? 'cyan.100' : 'gray.200'}>
                    {station.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500" fontFamily="mono">
                    {station.id}
                  </Text>
                </Box>
              </Flex>
            )
          })}
        </Flex>
      </Box>

      <Text fontSize="xs" color="gray.500" mt={3}>
        {selectedStations.length} of {stations?.length || 0} selected
      </Text>
    </Box>
  )
}

