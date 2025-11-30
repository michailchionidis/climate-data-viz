/**
 * Tour Steps Configuration
 * Defines all steps for the onboarding tour
 * xAI-level minimal design
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

// Helper component for keyboard shortcuts - minimal style
function Kbd({ children }: { children: string }) {
  return (
    <Box
      as="kbd"
      display="inline-block"
      px="1.5"
      py="0.5"
      mx="1"
      fontSize="2xs"
      fontFamily="mono"
      bg="rgba(255, 255, 255, 0.05)"
      borderRadius="3px"
      color="inherit"
    >
      {children}
    </Box>
  )
}

// Helper component for feature list - minimal gray icons
function FeatureList({ items }: { items: { icon: React.ReactNode; text: string }[] }) {
  return (
    <Flex direction="column" gap="2" mt="2">
      {items.map((item, i) => (
        <Flex key={i} align="center" gap="2.5" fontSize="sm">
          <Box color="gray.500" flexShrink={0}>{item.icon}</Box>
          <Text color="gray.400">{item.text}</Text>
        </Flex>
      ))}
    </Flex>
  )
}

// Step title component with icon - minimal white icons
function StepTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Flex align="center" gap="2.5">
      <Box color="gray.400">{icon}</Box>
      <Text as="span">{title}</Text>
    </Flex>
  )
}

export const tourSteps: TourStep[] = [
  {
    id: 'stations',
    target: 'station-selector-desktop',
    title: <StepTitle icon={<FiMapPin size={16} />} title="Weather Stations" />,
    placement: 'right',
    spotlight: true,
    content: (
      <Box>
        <Text mb="2" color="gray.400">
          Select stations to compare temperature data over time.
        </Text>
        <Text fontSize="xs" color="gray.500">
          Multiple selections enable comparison views.
        </Text>
      </Box>
    ),
  },
  {
    id: 'viz-options',
    target: 'visualization-options-desktop',
    title: <StepTitle icon={<FiSettings size={16} />} title="Visualization Options" />,
    placement: 'right',
    spotlight: true,
    content: (
      <Box>
        <FeatureList
          items={[
            { icon: <FiCalendar size={13} />, text: 'Monthly or annual views' },
            { icon: <LuSigma size={13} />, text: 'Standard deviation overlay' },
            { icon: <FiBarChart2 size={13} />, text: 'Year range filters' },
          ]}
        />
      </Box>
    ),
  },
  {
    id: 'chart-interactions',
    target: 'chart-section-desktop',
    title: <StepTitle icon={<FiMousePointer size={16} />} title="Chart Navigation" />,
    placement: 'left',
    spotlight: true,
    content: (
      <Box>
        <FeatureList
          items={[
            { icon: <FiZoomIn size={13} />, text: 'Scroll to zoom' },
            { icon: <FiMove size={13} />, text: 'Drag to pan' },
            { icon: <FiMousePointer size={13} />, text: 'Hover for details' },
            { icon: <FiDownload size={13} />, text: 'Export as CSV or PNG' },
          ]}
        />
      </Box>
    ),
  },
  {
    id: 'sidebar-toggle',
    target: 'sidebar-toggle',
    title: <StepTitle icon={<FiMaximize2 size={16} />} title="Maximize View" />,
    placement: 'bottom',
    spotlight: true,
    content: (
      <Text color="gray.400">
        Collapse the sidebar for more chart space.
      </Text>
    ),
  },
  {
    id: 'ai-insights',
    target: 'ai-insights-panel',
    title: <StepTitle icon={<FiZap size={16} />} title="AI Insights" />,
    placement: 'left',
    spotlight: true,
    content: (
      <Box>
        <Text mb="2" color="gray.400">
          AI-powered analysis of your climate data.
        </Text>
        <FeatureList
          items={[
            { icon: <FiZap size={13} />, text: 'Generate automatic insights' },
            { icon: <FiMessageCircle size={13} />, text: 'Ask follow-up questions' },
          ]}
        />
      </Box>
    ),
  },
  {
    id: 'grok-chat',
    target: 'ask-grok-button',
    title: <StepTitle icon={<FiMessageCircle size={16} />} title="Chat with Grok" />,
    placement: 'bottom',
    spotlight: true,
    desktopOnly: true,
    content: (
      <Box>
        <Text mb="2" color="gray.400">
          Ask questions about your data in natural language.
        </Text>
        <Flex align="center" fontSize="xs" color="gray.500">
          <Text>Press</Text>
          <Kbd>G</Kbd>
          <Text>to toggle</Text>
        </Flex>
      </Box>
    ),
  },
  {
    id: 'theme-toggle',
    target: 'theme-toggle',
    title: <StepTitle icon={<FiMoon size={16} />} title="Theme" />,
    placement: 'bottom',
    spotlight: true,
    content: (
      <Box>
        <Text mb="2" color="gray.400">
          Switch between dark and light modes.
        </Text>
        <Flex align="center" fontSize="xs" color="gray.500">
          <Text>Press</Text>
          <Kbd>M</Kbd>
          <Text>to toggle mode</Text>
        </Flex>
      </Box>
    ),
  },
]
