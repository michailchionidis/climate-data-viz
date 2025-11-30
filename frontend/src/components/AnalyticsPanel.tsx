/**
 * Analytics summary panel with minimal x.ai styling
 * Shows key statistics for selected weather stations
 */
import { Box, Text, Flex } from '@chakra-ui/react'
import { Card, CardBody } from './ui/Card'
import { SectionHeader } from './ui/SectionHeader'
import { EmptyState } from './ui/EmptyState'
import { BarChartIcon } from './ui/Icons'
import { useTheme } from '../context/ThemeContext'
import type { AnalyticsResponse } from '../types'

interface AnalyticsPanelProps {
  analytics: AnalyticsResponse | undefined
  isLoading: boolean
  selectedStations: string[]
  compact?: boolean
}

// Minimal stat display component
function MinimalStat({
  label,
  value,
  subValue,
}: {
  label: string
  value: string
  subValue?: string
}) {
  const { colors } = useTheme()

  return (
    <Box>
      <Text
        fontSize="10px"
        fontWeight="500"
        color={colors.textMuted}
        textTransform="uppercase"
        letterSpacing="0.05em"
        mb={0.5}
      >
        {label}
      </Text>
      <Text
        fontSize="18px"
        fontWeight="600"
        color={colors.text}
        fontFamily="mono"
        letterSpacing="-0.02em"
      >
        {value}
      </Text>
      {subValue && (
        <Text fontSize="11px" color={colors.textMuted} mt={0.5}>
          {subValue}
        </Text>
      )}
    </Box>
  )
}

export function AnalyticsPanel({
  analytics,
  isLoading,
  selectedStations,
  compact = false,
}: AnalyticsPanelProps) {
  const { colors, colorMode } = useTheme()
  const warningColor = colorMode === 'light' ? 'orange.600' : 'orange.300'

  // Empty state - show skeleton structure matching final layout
  if (selectedStations.length === 0) {
    return (
      <Card>
        <CardBody py={compact ? 2 : 4}>
          <SectionHeader
            title="Analytics Summary"
            badge="—"
            compact={compact}
          />
          <Flex gap={6} flexWrap="wrap">
            {['Min', 'Max', 'Avg', 'Hottest', 'Coldest'].map((label) => (
              <Box key={label} flex="1" minW="80px">
                <Text
                  fontSize="10px"
                  fontWeight="500"
                  color={colors.textMuted}
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                  mb={0.5}
                >
                  {label}
                </Text>
                <Text
                  fontSize="18px"
                  fontWeight="600"
                  color={colors.textMuted}
                  fontFamily="mono"
                  letterSpacing="-0.02em"
                  opacity={0.3}
                >
                  —
                </Text>
              </Box>
            ))}
          </Flex>
        </CardBody>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardBody py={compact ? 2 : 4}>
          <SectionHeader title="Analytics Summary" compact={compact} />
          <Flex gap={6} flexWrap="wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} flex="1" minW="80px">
                <Box
                  h="10px"
                  w="40px"
                  bg={colors.inputBg}
                  borderRadius="sm"
                  mb={1}
                />
                <Box
                  h="20px"
                  w="60px"
                  bg={colors.inputBg}
                  borderRadius="sm"
                  mb={1}
                />
                <Box h="12px" w="80px" bg={colors.inputBg} borderRadius="sm" />
              </Box>
            ))}
          </Flex>
        </CardBody>
      </Card>
    )
  }

  if (!analytics || analytics.stations.length === 0) {
    return (
      <Card variant="accent" accentColor="orange">
        <CardBody py={compact ? 2 : 4}>
          <Flex align="center" gap={3}>
            <Text color={warningColor} fontSize={compact ? 'xs' : 'sm'}>
              No data available for selected stations and year range
            </Text>
          </Flex>
        </CardBody>
      </Card>
    )
  }

  // Find station with global min temperature
  const minStation = analytics.stations.reduce((prev, curr) =>
    curr.min_temp < prev.min_temp ? curr : prev
  )
  // Find station with global max temperature
  const maxStation = analytics.stations.reduce((prev, curr) =>
    curr.max_temp > prev.max_temp ? curr : prev
  )
  const avgMean =
    analytics.stations.reduce((sum, s) => sum + s.mean_temp, 0) /
    analytics.stations.length

  // Find hottest and coldest years across all stations
  const hottestStation = analytics.stations.reduce((prev, curr) =>
    curr.hottest_year_temp > prev.hottest_year_temp ? curr : prev
  )
  const coldestStation = analytics.stations.reduce((prev, curr) =>
    curr.coldest_year_temp < prev.coldest_year_temp ? curr : prev
  )

  // Helper to format month name
  const getMonthName = (month: number): string => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return months[month - 1] || ''
  }

  return (
    <Card>
      <CardBody py={compact ? 2 : 3}>
        <SectionHeader
          title="Analytics Summary"
          badge={`${analytics.year_range[0]} — ${analytics.year_range[1]}`}
          badgeColor="cyan"
          compact={compact}
        />

        {/* Main stats row - minimal design */}
        <Flex
          gap={{ base: 4, md: 6, lg: 8 }}
          flexWrap="wrap"
          py={2}
          borderBottom="1px solid"
          borderColor={colors.border}
        >
          <MinimalStat
            label="Min"
            value={`${minStation.min_temp.toFixed(1)}°C`}
            subValue={`${getMonthName(minStation.min_temp_month)} ${minStation.min_temp_year}`}
          />
          <MinimalStat
            label="Max"
            value={`${maxStation.max_temp.toFixed(1)}°C`}
            subValue={`${getMonthName(maxStation.max_temp_month)} ${maxStation.max_temp_year}`}
          />
          <MinimalStat label="Avg" value={`${avgMean.toFixed(1)}°C`} />
          <MinimalStat
            label="Hottest"
            value={String(hottestStation.hottest_year)}
            subValue={`${hottestStation.hottest_year_temp.toFixed(1)}°C`}
          />
          <MinimalStat
            label="Coldest"
            value={String(coldestStation.coldest_year)}
            subValue={`${coldestStation.coldest_year_temp.toFixed(1)}°C`}
          />
        </Flex>

        {/* Per-station stats - subtle footer */}
        {analytics.stations.length > 0 && (
          <Flex gap={3} flexWrap="wrap" pt={2}>
            {analytics.stations.map((station) => (
              <Text
                key={station.station_id}
                fontSize="11px"
                color={colors.textMuted}
                fontFamily="mono"
                letterSpacing="0.01em"
              >
                {station.station_id}: {station.mean_temp.toFixed(1)}°C avg,
                σ={station.std_temp.toFixed(1)}
              </Text>
            ))}
          </Flex>
        )}
      </CardBody>
    </Card>
  )
}
