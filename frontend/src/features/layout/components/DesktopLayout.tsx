/**
 * DesktopLayout Component
 * Side-by-side layout with collapsible sidebar for desktop
 */
import { memo } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from '@/features/stations'
import { ChartPanel } from '@/features/visualization'
import { AnalyticsPanel } from '@/features/analytics'
import { AIInsightsPanel, ChatSidebar } from '@/features/ai'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { LayoutProps } from './types'

type DesktopLayoutProps = Omit<LayoutProps, 'cyanAccent'>

export const DesktopLayout = memo(function DesktopLayout({
  filters,
  ui,
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
}: DesktopLayoutProps) {
  return (
    <Flex
      display={{ base: 'none', lg: 'flex' }}
      gap={4}
      h="100%"
      position="relative"
      opacity={ui.isLoaded ? 1 : 0}
      transform={ui.isLoaded ? 'translateX(0)' : 'translateX(-20px)'}
      transition="all 0.5s ease-out 0.1s"
    >
      {/* Sidebar */}
      <Sidebar
        selectedStations={filters.selectedStations}
        onStationChange={onStationChange}
        stations={stations}
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
        isCollapsed={ui.isSidebarCollapsed}
        onToggle={ui.toggleSidebar}
      />

      {/* Main Content Area */}
      <Flex
        flex={1}
        direction="column"
        overflow="auto"
        opacity={ui.isLoaded ? 1 : 0}
        transform={ui.isLoaded ? 'translateY(0)' : 'translateY(20px)'}
        transition="all 0.5s ease-out 0.2s"
        css={{
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: colors.border, borderRadius: '4px' },
          '&::-webkit-scrollbar-thumb:hover': { background: colors.textMuted },
        }}
      >
        <Flex direction="column" gap={3} flex={1}>
          {/* Analytics Summary */}
          <Box flexShrink={0}>
            <ErrorBoundary>
              <AnalyticsPanel
                analytics={analytics}
                isLoading={isAnalyticsLoading}
                selectedStations={filters.selectedStations}
                compact
              />
            </ErrorBoundary>
          </Box>

          {/* AI Insights */}
          <Box flexShrink={0}>
            <ErrorBoundary>
              <AIInsightsPanel
                stations={filters.selectedStations}
                yearFrom={filters.yearFrom}
                yearTo={filters.yearTo}
                onOpenChat={ui.openChat}
                onExpandChange={ui.setAIInsightsExpanded}
              />
            </ErrorBoundary>
          </Box>

          {/* Chart */}
          <Box flex={1} minH="400px" id="chart-section-desktop" tabIndex={-1}>
            <ErrorBoundary>
              <ChartPanel
                monthlyData={monthlyData}
                annualData={annualData}
                mode={filters.mode}
                showSigmaBounds={filters.showSigmaBounds}
                isLoading={isLoading}
                selectedStations={filters.selectedStations}
                fillHeight
                containerKey={`desktop-${ui.isSidebarCollapsed ? 'collapsed' : 'expanded'}-${ui.isChatOpen ? 'chat' : 'nochat'}-${colorMode}-${filters.mode}-ai${ui.isAIInsightsExpanded ? 'open' : 'closed'}`}
              />
            </ErrorBoundary>
          </Box>
        </Flex>
      </Flex>

      {/* Chat Sidebar */}
      <ChatSidebar
        isOpen={ui.isChatOpen}
        onClose={ui.closeChat}
        stations={filters.selectedStations}
        yearFrom={filters.yearFrom}
        yearTo={filters.yearTo}
      />
    </Flex>
  )
})
