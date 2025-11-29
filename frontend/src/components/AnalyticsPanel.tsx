/**
 * Analytics summary panel showing key statistics
 */
import { Box, Text, Flex, SimpleGrid, Spinner } from '@chakra-ui/react'
import type { AnalyticsResponse } from '../types'

interface AnalyticsPanelProps {
  analytics: AnalyticsResponse | undefined
  isLoading: boolean
  selectedStations: string[]
}

interface StatCardProps {
  label: string
  value: string | number
  subValue?: string
  color?: string
  icon?: string
}

function StatCard({ label, value, subValue, color = 'cyan.400', icon }: StatCardProps) {
  return (
    <Box
      p={4}
      bg="whiteAlpha.50"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
      transition="all 0.2s"
      _hover={{ borderColor: 'whiteAlpha.200', bg: 'whiteAlpha.100' }}
    >
      <Flex align="center" gap={2} mb={2}>
        {icon && <Text fontSize="lg">{icon}</Text>}
        <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" fontWeight="500">
          {label}
        </Text>
      </Flex>
      <Text fontSize="2xl" fontWeight="700" color={color} fontFamily="mono">
        {value}
      </Text>
      {subValue && (
        <Text fontSize="xs" color="gray.500" mt={1}>
          {subValue}
        </Text>
      )}
    </Box>
  )
}

export function AnalyticsPanel({ analytics, isLoading, selectedStations }: AnalyticsPanelProps) {
  if (selectedStations.length === 0) {
    return (
      <Box
        p={6}
        bg="whiteAlpha.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        textAlign="center"
      >
        <Text fontSize="4xl" mb={2}>📊</Text>
        <Text color="gray.400" fontSize="sm">
          Select one or more stations to view analytics
        </Text>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box
        p={6}
        bg="whiteAlpha.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        textAlign="center"
      >
        <Spinner size="lg" color="cyan.400" />
        <Text color="gray.400" fontSize="sm" mt={3}>
          Computing analytics...
        </Text>
      </Box>
    )
  }

  if (!analytics || analytics.stations.length === 0) {
    return (
      <Box
        p={6}
        bg="red.900/20"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="red.500/30"
        textAlign="center"
      >
        <Text color="red.400" fontSize="sm">
          No data available for selected stations
        </Text>
      </Box>
    )
  }

  // Aggregate statistics across all selected stations
  const allTemps = analytics.stations.flatMap((s) => [s.min_temp, s.max_temp])
  const globalMin = Math.min(...allTemps)
  const globalMax = Math.max(...allTemps)
  const avgMean = analytics.stations.reduce((sum, s) => sum + s.mean_temp, 0) / analytics.stations.length
  const avgCoverage = analytics.stations.reduce((sum, s) => sum + s.data_coverage, 0) / analytics.stations.length

  // Find hottest and coldest years across all stations
  const hottestStation = analytics.stations.reduce((prev, curr) =>
    curr.hottest_year_temp > prev.hottest_year_temp ? curr : prev
  )
  const coldestStation = analytics.stations.reduce((prev, curr) =>
    curr.coldest_year_temp < prev.coldest_year_temp ? curr : prev
  )

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" fontWeight="600" color="gray.300" textTransform="uppercase" letterSpacing="wide">
          Analytics Summary
        </Text>
        <Text fontSize="xs" color="cyan.400" fontFamily="mono">
          {analytics.year_range[0]} — {analytics.year_range[1]}
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 2, lg: 4 }} gap={3}>
        <StatCard
          icon="🌡️"
          label="Min Temperature"
          value={`${globalMin.toFixed(1)}°C`}
          color="blue.400"
        />
        <StatCard
          icon="☀️"
          label="Max Temperature"
          value={`${globalMax.toFixed(1)}°C`}
          color="orange.400"
        />
        <StatCard
          icon="📊"
          label="Avg Mean Temp"
          value={`${avgMean.toFixed(1)}°C`}
          color="cyan.400"
        />
        <StatCard
          icon="📈"
          label="Data Coverage"
          value={`${avgCoverage.toFixed(1)}%`}
          color="green.400"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={3}>
        <Box
          p={4}
          bg="gradient-to-r from-red.900/30 to-orange.900/20"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="orange.500/30"
        >
          <Flex align="center" gap={2} mb={2}>
            <Text fontSize="lg">🔥</Text>
            <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider">
              Hottest Year
            </Text>
          </Flex>
          <Text fontSize="xl" fontWeight="700" color="orange.300" fontFamily="mono">
            {hottestStation.hottest_year}
          </Text>
          <Text fontSize="sm" color="gray.400">
            {hottestStation.hottest_year_temp.toFixed(1)}°C at {hottestStation.station_name}
          </Text>
        </Box>

        <Box
          p={4}
          bg="gradient-to-r from-blue.900/30 to-cyan.900/20"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="blue.500/30"
        >
          <Flex align="center" gap={2} mb={2}>
            <Text fontSize="lg">❄️</Text>
            <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider">
              Coldest Year
            </Text>
          </Flex>
          <Text fontSize="xl" fontWeight="700" color="blue.300" fontFamily="mono">
            {coldestStation.coldest_year}
          </Text>
          <Text fontSize="sm" color="gray.400">
            {coldestStation.coldest_year_temp.toFixed(1)}°C at {coldestStation.station_name}
          </Text>
        </Box>
      </SimpleGrid>

      {/* Individual station stats */}
      {analytics.stations.length > 1 && (
        <Box mt={4}>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide" mb={2}>
            Per-Station Statistics
          </Text>
          <Flex gap={2} flexWrap="wrap">
            {analytics.stations.map((station) => (
              <Box
                key={station.station_id}
                px={3}
                py={2}
                bg="whiteAlpha.50"
                borderRadius="md"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
                fontSize="xs"
              >
                <Text fontWeight="600" color="gray.300">{station.station_id}</Text>
                <Text color="gray.500">
                  {station.mean_temp.toFixed(1)}°C avg, σ={station.std_temp.toFixed(1)}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  )
}

