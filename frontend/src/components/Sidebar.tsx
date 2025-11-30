/**
 * Unified Sidebar Component
 * Collapsible sidebar containing all filters and controls for desktop view
 */
import { Box, Flex, Text } from '@chakra-ui/react'
import { StationSelector } from './StationSelector'
import { ControlsPanel } from './ControlsPanel'
import { SectionHeader } from './ui/SectionHeader'
import { ChevronLeftIcon, SettingsIcon } from './ui/Icons'
import { useTheme } from '../context/ThemeContext'
import type { VisualizationMode, ZoomState, Station } from '../types'

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
  const { colors, colorMode } = useTheme()

  const cyanAccent = colors.accentCyanText

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
          {/* Sidebar Header */}
          <Flex
            align="center"
            justify="space-between"
            p={3}
            flexShrink={0}
          >
            <Flex align="center" gap={2}>
              <Box
                w="24px"
                h="24px"
                borderRadius="6px"
                bg={colorMode === 'light' ? 'cyan.50' : 'rgba(6, 182, 212, 0.15)'}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <SettingsIcon size="sm" color={colorMode === 'light' ? '#0891b2' : '#06b6d4'} />
              </Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color={colors.text}
                letterSpacing="-0.01em"
              >
                Filters & Controls
              </Text>
            </Flex>
            <Box
              as="button"
              onClick={onToggle}
              p={1.5}
              borderRadius="6px"
              bg={colors.buttonBg}
              color={colors.textMuted}
              _hover={{
                bg: colors.buttonHover,
                color: colors.text,
              }}
              transition="all 0.15s"
              cursor="pointer"
              title="Collapse sidebar (more chart space)"
            >
              <ChevronLeftIcon size="sm" />
            </Box>
          </Flex>

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
              <SectionHeader
                title="Weather Stations"
                badge={`${selectedStations.length}/${stations?.length || 0}`}
                action={
                  <Text
                    fontSize="2xs"
                    color={cyanAccent}
                    cursor="pointer"
                    onClick={() => {
                      if (selectedStations.length === (stations?.length || 0)) {
                        onStationChange([])
                      } else {
                        onStationChange(stations?.map((s) => s.id) || [])
                      }
                    }}
                    _hover={{ opacity: 0.8 }}
                    transition="opacity 0.15s"
                    fontWeight="500"
                  >
                    {selectedStations.length === (stations?.length || 0) ? 'Clear' : 'All'}
                  </Text>
                }
              />
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

            <Box h="1px" bg={colors.border} flexShrink={0} />

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

          {/* Sidebar Footer - Summary */}
          <Box
            p={2}
            borderTopWidth="1px"
            borderColor={colors.border}
            bg={colorMode === 'light' ? 'gray.50' : 'rgba(0, 0, 0, 0.2)'}
            flexShrink={0}
          >
            <Flex justify="space-between" align="center">
              <Text fontSize="2xs" color={colors.textMuted}>
                {selectedStations.length > 0
                  ? `${selectedStations.length} station${selectedStations.length > 1 ? 's' : ''} • ${mode === 'monthly' ? 'Monthly' : 'Annual'}`
                  : 'No stations selected'}
              </Text>
              {yearFrom && yearTo && (
                <Text fontSize="2xs" color={colors.textMuted} fontFamily="mono">
                  {yearFrom}–{yearTo}
                </Text>
              )}
            </Flex>
          </Box>
        </Box>
      </Box>

    </>
  )
}
