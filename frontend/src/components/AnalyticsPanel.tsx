/**
 * Analytics summary panel with premium styling
 * Shows key statistics for selected weather stations
 */
import { Box, Text, Flex, SimpleGrid } from '@chakra-ui/react'
import { StatCard, StatCardSkeleton } from './ui/StatCard'
import { Card, CardBody } from './ui/Card'
import { SectionHeader } from './ui/SectionHeader'
import { EmptyState } from './ui/EmptyState'
import {
  TemperatureMinIcon,
  TemperatureMaxIcon,
  BarChartIcon,
  TrendingUpIcon,
  FlameIcon,
  SnowflakeIcon,
} from './ui/Icons'
import type { AnalyticsResponse } from '../types'

interface AnalyticsPanelProps {
  analytics: AnalyticsResponse | undefined
  isLoading: boolean
  selectedStations: string[]
}

export function AnalyticsPanel({ analytics, isLoading, selectedStations }: AnalyticsPanelProps) {
  if (selectedStations.length === 0) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            icon={<BarChartIcon size="xl" color="#71717a" />}
            title="No stations selected"
            description="Select one or more weather stations to view analytics summary"
            minHeight="120px"
          />
        </CardBody>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <SectionHeader title="Analytics Summary" />
          <SimpleGrid columns={{ base: 2, lg: 4 }} gap={3}>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </SimpleGrid>
        </CardBody>
      </Card>
    )
  }

  if (!analytics || analytics.stations.length === 0) {
    return (
      <Card variant="accent" accentColor="orange">
        <CardBody>
          <Flex align="center" gap={3}>
            <Text color="orange.300" fontSize="sm">
              No data available for selected stations and year range
            </Text>
          </Flex>
        </CardBody>
      </Card>
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
    <Card>
      <CardBody>
        <SectionHeader
          title="Analytics Summary"
          badge={`${analytics.year_range[0]} — ${analytics.year_range[1]}`}
          badgeColor="cyan"
        />

        {/* Main stats grid */}
        <SimpleGrid columns={{ base: 2, lg: 4 }} gap={3} mb={4}>
          <StatCard
            icon={<TemperatureMinIcon size="lg" />}
            label="Min Temperature"
            value={`${globalMin.toFixed(1)}°C`}
            color="blue"
            animate
            animationDelay={0.1}
          />
          <StatCard
            icon={<TemperatureMaxIcon size="lg" />}
            label="Max Temperature"
            value={`${globalMax.toFixed(1)}°C`}
            color="orange"
            animate
            animationDelay={0.15}
          />
          <StatCard
            icon={<BarChartIcon size="lg" />}
            label="Avg Mean Temp"
            value={`${avgMean.toFixed(1)}°C`}
            color="cyan"
            animate
            animationDelay={0.2}
          />
          <StatCard
            icon={<TrendingUpIcon size="lg" />}
            label="Data Coverage"
            value={`${avgCoverage.toFixed(1)}%`}
            color="green"
            animate
            animationDelay={0.25}
          />
        </SimpleGrid>

        {/* Hottest and Coldest Year cards */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mb={4}>
          <Box
            p={4}
            bg="linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)"
            borderRadius="12px"
            borderWidth="1px"
            borderColor="rgba(245, 158, 11, 0.3)"
            transition="all 0.2s ease"
            _hover={{
              borderColor: 'rgba(245, 158, 11, 0.5)',
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)',
            }}
          >
            <Flex align="center" gap={2} mb={2}>
              <FlameIcon size="md" color="#f59e0b" />
              <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" fontWeight="500">
                Hottest Year
              </Text>
            </Flex>
            <Text fontSize="2xl" fontWeight="700" color="orange.300" fontFamily="mono">
              {hottestStation.hottest_year}
            </Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              <Text as="span" color="orange.400" fontWeight="600">
                {hottestStation.hottest_year_temp.toFixed(1)}°C
              </Text>
              {' '}at {hottestStation.station_name}
            </Text>
          </Box>

          <Box
            p={4}
            bg="linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)"
            borderRadius="12px"
            borderWidth="1px"
            borderColor="rgba(6, 182, 212, 0.3)"
            transition="all 0.2s ease"
            _hover={{
              borderColor: 'rgba(6, 182, 212, 0.5)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)',
            }}
          >
            <Flex align="center" gap={2} mb={2}>
              <SnowflakeIcon size="md" color="#06b6d4" />
              <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider" fontWeight="500">
                Coldest Year
              </Text>
            </Flex>
            <Text fontSize="2xl" fontWeight="700" color="blue.300" fontFamily="mono">
              {coldestStation.coldest_year}
            </Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              <Text as="span" color="blue.400" fontWeight="600">
                {coldestStation.coldest_year_temp.toFixed(1)}°C
              </Text>
              {' '}at {coldestStation.station_name}
            </Text>
          </Box>
        </SimpleGrid>

        {/* Per-station statistics */}
        {analytics.stations.length > 1 && (
          <Box>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide" mb={3} fontWeight="500">
              Per-Station Statistics
            </Text>
            <Flex gap={2} flexWrap="wrap">
              {analytics.stations.map((station, idx) => (
                <Box
                  key={station.station_id}
                  px={3}
                  py={2}
                  bg="rgba(255, 255, 255, 0.03)"
                  borderRadius="8px"
                  borderWidth="1px"
                  borderColor="rgba(255, 255, 255, 0.08)"
                  transition="all 0.2s ease"
                  _hover={{
                    bg: 'rgba(255, 255, 255, 0.06)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                  }}
                  style={{
                    opacity: 0,
                    animation: 'fadeInUp 0.3s ease-out forwards',
                    animationDelay: `${0.3 + idx * 0.05}s`,
                  }}
                >
                  <Text fontSize="sm" fontWeight="600" color="gray.300" fontFamily="mono">
                    {station.station_id}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {station.mean_temp.toFixed(1)}°C avg, σ={station.std_temp.toFixed(1)}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Box>
        )}
      </CardBody>
    </Card>
  )
}
