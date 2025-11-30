/**
 * Tour Steps Configuration
 * Defines all steps for the onboarding tour
 */
import { Box, Text, Flex } from '@chakra-ui/react'
import { FiMousePointer, FiMove, FiZoomIn } from 'react-icons/fi'
import type { TourStep } from './TourContext'

// Helper component for keyboard shortcuts
function Kbd({ children }: { children: string }) {
  return (
    <Box
      as="kbd"
      display="inline-block"
      px="2"
      py="0.5"
      mx="1"
      fontSize="xs"
      fontFamily="mono"
      bg="rgba(255, 255, 255, 0.1)"
      borderRadius="4px"
      border="1px solid rgba(255, 255, 255, 0.2)"
    >
      {children}
    </Box>
  )
}

// Helper component for feature list
function FeatureList({ items }: { items: { icon: React.ReactNode; text: string }[] }) {
  return (
    <Flex direction="column" gap="2" mt="2">
      {items.map((item, i) => (
        <Flex key={i} align="center" gap="2">
          <Box color="cyan.400" flexShrink={0}>{item.icon}</Box>
          <Text>{item.text}</Text>
        </Flex>
      ))}
    </Flex>
  )
}

export const tourSteps: TourStep[] = [
  {
    id: 'stations',
    target: 'station-selector-desktop',  // Desktop sidebar station selector
    title: '📍 Select Weather Stations',
    placement: 'right',
    spotlight: true,
    content: (
      <Box>
        <Text mb="3">
          Choose one or more weather stations to compare their temperature data over time.
        </Text>
        <Text fontSize="xs" color="gray.400">
          💡 Tip: Select multiple stations to see how temperatures differ across locations.
        </Text>
      </Box>
    ),
  },
  {
    id: 'viz-options',
    target: 'visualization-options-desktop',  // Target the whole options container
    title: '⚙️ Visualization Options',
    placement: 'right',
    spotlight: true,
    content: (
      <Box>
        <Text mb="3" fontWeight="600">View Modes:</Text>
        <FeatureList
          items={[
            { icon: '📅', text: 'Monthly — Data for each month' },
            { icon: '📈', text: 'Annual — Yearly averages' },
            { icon: '±σ', text: 'Overlay — Standard deviation bands' },
          ]}
        />
        <Text mt="3" mb="2" fontWeight="600">Time Filters:</Text>
        <Text fontSize="sm">
          Use year range presets or zoom controls to focus on specific periods.
        </Text>
      </Box>
    ),
  },
  {
    id: 'chart-interactions',
    target: 'chart-section-desktop',  // Desktop chart area
    title: '🖱️ Navigate the Chart',
    placement: 'left',
    spotlight: true,
    content: (
      <Box>
        <Text mb="3">
          Interact with the chart using your mouse or touchpad:
        </Text>
        <FeatureList
          items={[
            { icon: <FiZoomIn size={14} />, text: 'Scroll or pinch to zoom in/out' },
            { icon: <FiMove size={14} />, text: 'Click and drag to pan left/right' },
            { icon: <FiMousePointer size={14} />, text: 'Hover over points for details' },
          ]}
        />
        <Text fontSize="xs" color="gray.400" mt="3">
          💡 Use the ⋮ menu to export data as CSV or PNG
        </Text>
      </Box>
    ),
  },
  {
    id: 'sidebar-toggle',
    target: 'sidebar-toggle',
    title: '📐 Maximize Chart Space',
    placement: 'bottom',
    spotlight: true,
    content: (
      <Box>
        <Text mb="3">
          Collapse the sidebar to give the chart more room.
        </Text>
        <Text fontSize="xs" color="gray.400">
          Perfect for presentations or when you need a closer look at the data.
        </Text>
      </Box>
    ),
  },
  {
    id: 'theme-toggle',
    target: 'theme-toggle',
    title: '🌓 Light & Dark Mode',
    placement: 'bottom',
    spotlight: true,
    content: (
      <Box>
        <Text mb="3">
          Switch between dark and light themes based on your preference or environment.
        </Text>
        <Flex align="center" gap="2" mt="2">
          <Text fontSize="xs" color="gray.400">Keyboard shortcut:</Text>
          <Kbd>M</Kbd>
          <Text fontSize="xs" color="gray.400">to toggle mode</Text>
        </Flex>
      </Box>
    ),
  },
]
