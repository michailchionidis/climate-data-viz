/**
 * InsightCard component
 *
 * Displays a single AI-generated insight with type icon,
 * title, description, and confidence indicator.
 * Uses consistent theme colors (cyan accent only).
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

const insightIcons: Record<InsightType, React.ElementType> = {
  trend: FiTrendingUp,
  anomaly: FiAlertTriangle,
  comparison: FiRefreshCw,
  summary: FiFileText,
  prediction: FiTarget,
}

const insightLabels: Record<InsightType, string> = {
  trend: 'Trend',
  anomaly: 'Anomaly',
  comparison: 'Comparison',
  summary: 'Summary',
  prediction: 'Prediction',
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const { colors } = useTheme()
  const Icon = insightIcons[insight.type] || insightIcons.summary
  const label = insightLabels[insight.type] || 'Insight'
  const confidencePercent = Math.round(insight.confidence * 100)

  return (
    <Box
      bg={colors.card}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="lg"
      p={3}
      transition="all 0.2s"
      _hover={{
        borderColor: colors.accentCyan,
        boxShadow: `0 0 0 1px ${colors.accentCyan}30`,
      }}
      role="article"
      aria-label={`Insight ${index + 1}: ${insight.title}`}
    >
      {/* Header row */}
      <Flex align="flex-start" gap={2.5} mb={2}>
        {/* Icon */}
        <Flex
          align="center"
          justify="center"
          w="28px"
          h="28px"
          borderRadius="md"
          bg={`${colors.accentCyan}15`}
          color={colors.accentCyan}
          flexShrink={0}
        >
          <Icon size={14} />
        </Flex>

        {/* Content */}
        <Box flex={1} minW={0}>
          {/* Type and confidence */}
          <Flex align="center" gap={2} mb={1}>
            <Text
              fontSize="10px"
              fontWeight="600"
              color={colors.accentCyan}
              textTransform="uppercase"
              letterSpacing="0.05em"
            >
              {label}
            </Text>
            <Text fontSize="10px" color={colors.textMuted}>
              •
            </Text>
            <Text fontSize="10px" color={colors.textMuted}>
              {confidencePercent}% confidence
            </Text>
          </Flex>

          {/* Title */}
          <Text
            fontSize="13px"
            fontWeight="600"
            color={colors.text}
            lineHeight="1.35"
          >
            {insight.title}
          </Text>
        </Box>
      </Flex>

      {/* Description */}
      <Text
        fontSize="12px"
        color={colors.textSecondary}
        lineHeight="1.55"
        pl="36px"
      >
        {insight.description}
      </Text>

      {/* Related stations */}
      {insight.related_stations.length > 0 && (
        <Flex gap={1} mt={2} pl="36px" flexWrap="wrap">
          {insight.related_stations.map((stationId) => (
            <Text
              key={stationId}
              fontSize="10px"
              color={colors.textMuted}
              bg={colors.inputBg}
              px={1.5}
              py={0.5}
              borderRadius="sm"
              fontFamily="mono"
            >
              {stationId}
            </Text>
          ))}
        </Flex>
      )}
    </Box>
  )
}
