/**
 * Unified Sidebar Component
 * Collapsible sidebar containing all filters and controls for desktop view
 */
import { Box, Flex, Text } from '@chakra-ui/react'
import { StationSelector } from './StationSelector'
import { ControlsPanel } from '@/features/visualization'
import { ChevronLeftIcon } from '@/shared/components/ui'
import { useTheme } from '@/context/ThemeContext'
import type { VisualizationMode, ZoomState, Station } from '@/shared/types'

interface SidebarProps {
  // Station selection
  selectedStations: string[]
  onStationChange: (stations: string[]) => void
  stations: Station[] | undefined

  // Controls
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

  // Collapse state (controlled from parent)
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({
  selectedStations,
  onStationChange,
  stations,
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
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const { colors } = useTheme()

  return (
    <>
      {/* Sidebar Container */}
      <Box
        position="relative"
        w={isCollapsed ? '0px' : '280px'}
        minW={isCollapsed ? '0px' : '280px'}
        h="100%"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        overflow="hidden"
      >
        <Box
          id="sidebar-content"
          w="280px"
          h="100%"
          bg={colors.card}
          borderRadius="12px"
          borderWidth="1px"
          borderColor={colors.border}
          display="flex"
          flexDirection="column"
          overflow="hidden"
          opacity={isCollapsed ? 0 : 1}
          transform={isCollapsed ? 'translateX(-20px)' : 'translateX(0)'}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          {/* Content Container - Flex column to push controls to bottom */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            {/* Weather Stations Section - Takes available space */}
            <Box
              id="station-selector-desktop"
              p={3}
              flex={1}
              minH={0}
              display="flex"
              flexDirection="column"
            >
              {/* Header with collapse button integrated */}
              <Flex align="center" justify="space-between" mb={2}>
                <Flex align="center" gap={2}>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color={colors.textSecondary}
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Weather Stations
                  </Text>
                  <Text
                    fontSize="2xs"
                    color={colors.textMuted}
                    fontFamily="mono"
                    letterSpacing="0.02em"
                  >
                    {selectedStations.length}/{stations?.length || 0}
                  </Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Text
                    fontSize="2xs"
                    color={colors.textMuted}
                    cursor="pointer"
                    onClick={() => {
                      if (selectedStations.length === (stations?.length || 0)) {
                        onStationChange([])
                      } else {
                        onStationChange(stations?.map((s) => s.id) || [])
                      }
                    }}
                    _hover={{ color: colors.text }}
                    transition="color 0.15s"
                    fontWeight="500"
                  >
                    {selectedStations.length === (stations?.length || 0) ? 'Clear' : 'All'}
                  </Text>
                  <Box
                    as="button"
                    onClick={onToggle}
                    p={1}
                    borderRadius="4px"
                    color={colors.textMuted}
                    _hover={{
                      bg: colors.buttonHover,
                      color: colors.text,
                    }}
                    transition="all 0.15s"
                    cursor="pointer"
                    title="Collapse sidebar"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeftIcon size="xs" />
                  </Box>
                </Flex>
              </Flex>
              <Box
                mt={2}
                flex={1}
                overflow="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
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
                <StationSelector
                  selectedStations={selectedStations}
                  onSelectionChange={onStationChange}
                  compact
                  hideHeader
                />
              </Box>
            </Box>

            {/* Visualization Options Section - Fixed at bottom, scrollable if needed */}
            <Box
              id="visualization-options-desktop"
              p={3}
              flexShrink={0}
              overflow="auto"
              maxH="52%"
              css={{
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
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
              <ControlsPanel
                yearFrom={yearFrom}
                yearTo={yearTo}
                onYearFromChange={onYearFromChange}
                onYearToChange={onYearToChange}
                mode={mode}
                onModeChange={onModeChange}
                showSigmaBounds={showSigmaBounds}
                onShowSigmaBoundsChange={onShowSigmaBoundsChange}
                zoom={zoom}
                onZoomChange={onZoomChange}
                compact
              />
            </Box>
          </Box>

        </Box>
      </Box>

    </>
  )
}
