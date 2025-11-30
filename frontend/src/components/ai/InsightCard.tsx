/**
 * InsightCard component
 *
 * Displays a single AI-generated insight with type icon,
 * title, description, and confidence indicator.
 */
import { Box, Flex, Text } from '@chakra-ui/react'
import {
  FiTrendingUp,
  FiAlertTriangle,
  FiRefreshCw,
  FiFileText,
  FiTarget,
} from 'react-icons/fi'
import type { AIInsight, InsightType } from '../../types'
import { useTheme } from '../../context/ThemeContext'

interface InsightCardProps {
  insight: AIInsight
  index: number
}

const insightConfig: Record<
  InsightType,
  { icon: React.ElementType; color: string; label: string }
> = {
  trend: { icon: FiTrendingUp, color: '#22d3ee', label: 'Trend' },
  anomaly: { icon: FiAlertTriangle, color: '#f59e0b', label: 'Anomaly' },
  comparison: { icon: FiRefreshCw, color: '#a855f7', label: 'Comparison' },
  summary: { icon: FiFileText, color: '#10b981', label: 'Summary' },
  prediction: { icon: FiTarget, color: '#ec4899', label: 'Prediction' },
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const { colors } = useTheme()
  const config = insightConfig[insight.type] || insightConfig.summary
  const Icon = config.icon

  return (
    <Box
      bg={colors.card}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="lg"
      p={4}
      transition="all 0.2s"
      _hover={{
        borderColor: config.color,
        boxShadow: `0 0 0 1px ${config.color}20`,
      }}
      role="article"
      aria-label={`Insight ${index + 1}: ${insight.title}`}
    >
      {/* Header */}
      <Flex align="center" gap={3} mb={3}>
        <Flex
          align="center"
          justify="center"
          w="32px"
          h="32px"
          borderRadius="md"
          bg={`${config.color}15`}
          color={config.color}
          flexShrink={0}
        >
          <Icon size={16} />
        </Flex>
        <Box flex={1} minW={0}>
          <Flex align="center" gap={2} mb={1}>
            <Text
              fontSize="xs"
              fontWeight="600"
              color={config.color}
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              {config.label}
            </Text>
            <Box
              h="4px"
              w="4px"
              borderRadius="full"
              bg={colors.textMuted}
            />
            <Text fontSize="xs" color={colors.textMuted}>
              {Math.round(insight.confidence * 100)}% confidence
            </Text>
          </Flex>
          <Text
            fontSize="sm"
            fontWeight="600"
            color={colors.text}
            lineHeight="1.3"
            lineClamp={2}
          >
            {insight.title}
          </Text>
        </Box>
      </Flex>

      {/* Description */}
      <Text
        fontSize="sm"
        color={colors.textSecondary}
        lineHeight="1.6"
        pl="44px"
      >
        {insight.description}
      </Text>

      {/* Related stations */}
      {insight.related_stations.length > 0 && (
        <Flex
          gap={1}
          mt={3}
          pl="44px"
          flexWrap="wrap"
        >
          {insight.related_stations.slice(0, 3).map((stationId) => (
            <Text
              key={stationId}
              fontSize="xs"
              color={colors.textMuted}
              bg={colors.inputBg}
              px={2}
              py={0.5}
              borderRadius="full"
            >
              {stationId}
            </Text>
          ))}
          {insight.related_stations.length > 3 && (
            <Text
              fontSize="xs"
              color={colors.textMuted}
            >
              +{insight.related_stations.length - 3} more
            </Text>
          )}
        </Flex>
      )}
    </Box>
  )
}
