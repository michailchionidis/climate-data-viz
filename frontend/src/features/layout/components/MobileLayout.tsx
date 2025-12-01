/**
 * MobileLayout Component
 * Stacked layout for mobile devices
 */
import { memo } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { StationSelector } from '@/features/stations'
import { ChartPanel, ControlsPanel } from '@/features/visualization'
import { AnalyticsPanel } from '@/features/analytics'
import { AIInsightsPanel } from '@/features/ai'
import { CollapsibleSection } from '@/shared/components/ui'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { LayoutProps } from './types'

type MobileLayoutProps = Omit<LayoutProps, 'ui'>

export const MobileLayout = memo(function MobileLayout({
  filters,
  stations,
  analytics,
  monthlyData,
  annualData,
  isLoading,
  isAnalyticsLoading,
  onStationChange,
  onModeChange,
  colors,
  colorMode,
  cyanAccent,
}: MobileLayoutProps) {
  return (
    <Box
      as="main"
      id="main-content"
      tabIndex={-1}
      role="main"
      aria-label="Climate data visualization"
      display={{ base: 'block', lg: 'none' }}
    >
      <Flex direction="column" gap={3}>
        {/* Station Selector */}
        <Box
          id="station-selector-mobile"
          p={3}
          bg={colors.card}
          borderRadius="10px"
          borderWidth="1px"
          borderColor={colors.border}
        >
          <CollapsibleSection
            title="Weather Stations"
            badge={`${filters.selectedStations.length}/${stations?.length || 0}`}
            defaultOpen={true}
            action={
              <Text
                fontSize="2xs"
                color={cyanAccent}
                cursor="pointer"
                onClick={() => {
                  if (filters.selectedStations.length === (stations?.length || 0)) {
                    onStationChange([])
                  } else {
                    onStationChange(stations?.map((s) => s.id) || [])
                  }
                }}
                _hover={{ opacity: 0.8 }}
                transition="opacity 0.15s"
                fontWeight="500"
              >
                {filters.selectedStations.length === (stations?.length || 0) ? 'Clear' : 'All'}
              </Text>
            }
          >
            <Box maxH="250px" overflow="auto">
              <StationSelector
                selectedStations={filters.selectedStations}
                onSelectionChange={onStationChange}
                compact
                hideHeader
              />
            </Box>
          </CollapsibleSection>
        </Box>

        {/* Controls */}
        <Box
          p={3}
          bg={colors.card}
          borderRadius="10px"
          borderWidth="1px"
          borderColor={colors.border}
        >
          <CollapsibleSection title="Visualization Options" defaultOpen={false}>
            <ControlsPanel
              yearFrom={filters.yearFrom}
              yearTo={filters.yearTo}
              onYearFromChange={filters.setYearFrom}
              onYearToChange={filters.setYearTo}
              mode={filters.mode}
              onModeChange={onModeChange}
              showSigmaBounds={filters.showSigmaBounds}
              onShowSigmaBoundsChange={filters.setShowSigmaBounds}
              zoom={filters.zoom}
              onZoomChange={filters.setZoom}
              compact
            />
          </CollapsibleSection>
        </Box>

        {/* Analytics */}
        <ErrorBoundary>
          <AnalyticsPanel
            analytics={analytics}
            isLoading={isAnalyticsLoading}
            selectedStations={filters.selectedStations}
            compact
          />
        </ErrorBoundary>

        {/* AI Insights */}
        <ErrorBoundary>
          <AIInsightsPanel
            stations={filters.selectedStations}
            yearFrom={filters.yearFrom}
            yearTo={filters.yearTo}
          />
        </ErrorBoundary>

        {/* Chart */}
        <Box minH="350px" id="chart-section" tabIndex={-1}>
          <ErrorBoundary>
            <ChartPanel
              monthlyData={monthlyData}
              annualData={annualData}
              mode={filters.mode}
              showSigmaBounds={filters.showSigmaBounds}
              isLoading={isLoading}
              selectedStations={filters.selectedStations}
              fillHeight
              containerKey={`mobile-${colorMode}-${filters.mode}`}
            />
          </ErrorBoundary>
        </Box>
      </Flex>
    </Box>
  )
})
