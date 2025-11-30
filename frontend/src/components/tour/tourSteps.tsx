/**
 * Tour Steps Configuration
 * Defines all steps for the onboarding tour
 */
import { Box, Text, Flex } from '@chakra-ui/react'
import {
  FiMousePointer,
  FiMove,
  FiZoomIn,
  FiMapPin,
  FiSettings,
  FiBarChart2,
  FiCalendar,
  FiMaximize2,
  FiMoon,
  FiDownload,
  FiZap,
  FiMessageCircle,
} from 'react-icons/fi'
import { LuSigma } from 'react-icons/lu'
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

// Step title component with icon
function StepTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Flex align="center" gap="2">
      <Box color="cyan.400">{icon}</Box>
      <Text as="span">{title}</Text>
    </Flex>
  )
}

export const tourSteps: TourStep[] = [
  {
    id: 'stations',
    target: 'station-selector-desktop',
    title: <StepTitle icon={<FiMapPin size={18} />} title="Select Weather Stations" />,
    placement: 'right',
    spotlight: true,
    content: (
      <Box>
        <Text mb="3">
          Choose one or more weather stations to compare their temperature data over time.
        </Text>
        <Flex align="center" gap="2" fontSize="xs" color="gray.400">
          <Box color="cyan.400"><FiMousePointer size={12} /></Box>
          <Text>Tip: Select multiple stations to compare locations</Text>
        </Flex>
      </Box>
    ),
  },
  {
    id: 'viz-options',
    target: 'visualization-options-desktop',
    title: <StepTitle icon={<FiSettings size={18} />} title="Visualization Options" />,
    placement: 'right',
    spotlight: true,
    content: (
      <Box>
        <Text mb="3" fontWeight="600">View Modes:</Text>
        <FeatureList
          items={[
            { icon: <FiCalendar size={14} />, text: 'Monthly — Data for each month' },
            { icon: <FiBarChart2 size={14} />, text: 'Annual — Yearly averages' },
            { icon: <LuSigma size={14} />, text: 'Overlay — Standard deviation bands' },
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
    target: 'chart-section-desktop',
    title: <StepTitle icon={<FiMousePointer size={18} />} title="Navigate the Chart" />,
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
        <Flex align="center" gap="2" fontSize="xs" color="gray.400" mt="3">
          <Box color="cyan.400"><FiDownload size={12} /></Box>
          <Text>Use the menu to export data as CSV or PNG</Text>
        </Flex>
      </Box>
    ),
  },
  {
    id: 'sidebar-toggle',
    target: 'sidebar-toggle',
    title: <StepTitle icon={<FiMaximize2 size={18} />} title="Maximize Chart Space" />,
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
    id: 'ai-insights',
    target: 'ai-insights-panel',
    title: <StepTitle icon={<FiZap size={18} />} title="AI-Powered Insights" />,
    placement: 'left',
    spotlight: true,
    content: (
      <Box>
        <Text mb="3">
          Get AI-generated insights about your climate data powered by Grok.
        </Text>
        <FeatureList
          items={[
            { icon: <FiZap size={14} />, text: 'Click "Generate" for automatic analysis' },
            { icon: <FiBarChart2 size={14} />, text: 'Discover trends and anomalies' },
            { icon: <FiMessageCircle size={14} />, text: 'Ask follow-up questions' },
          ]}
        />
      </Box>
    ),
  },
  {
    id: 'grok-chat',
    target: 'ask-grok-button',
    title: <StepTitle icon={<FiMessageCircle size={18} />} title="Chat with Grok" />,
    placement: 'bottom',
    spotlight: true,
    desktopOnly: true, // Grok chat sidebar is only available on desktop
    content: (
      <Box>
        <Text mb="3">
          Click "Ask Grok" to open the chat sidebar and ask questions about your data.
        </Text>
        <Text fontSize="sm" color="gray.400">
          Try questions like "What's the warmest year?" or "Compare these stations"
        </Text>
        <Flex align="center" gap="2" mt="2">
          <Text fontSize="xs" color="gray.400">Keyboard shortcut:</Text>
          <Kbd>G</Kbd>
          <Text fontSize="xs" color="gray.400">to toggle chat</Text>
        </Flex>
      </Box>
    ),
  },
  {
    id: 'theme-toggle',
    target: 'theme-toggle',
    title: <StepTitle icon={<FiMoon size={18} />} title="Light & Dark Mode" />,
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
