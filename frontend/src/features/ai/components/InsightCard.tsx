/**
 * InsightCard component
 *
 * Displays a single AI-generated insight in a minimal x.ai style.
 * Clean typography, no decorative elements, focus on content.
 */
import { Box, Flex, Text } from '@chakra-ui/react'
import type { AIInsight } from '@/shared/types'
import { useTheme } from '@/context/ThemeContext'

interface InsightCardProps {
  insight: AIInsight
  index: number
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const { colors } = useTheme()

  return (
    <Box
      py={3}
      borderBottom="1px solid"
      borderColor={colors.border}
      _last={{ borderBottom: 'none' }}
      role="article"
      aria-label={`Insight ${index + 1}: ${insight.title}`}
    >
      {/* Title */}
      <Text
        fontSize="14px"
        fontWeight="500"
        color={colors.text}
        lineHeight="1.4"
        mb={1.5}
        letterSpacing="-0.01em"
      >
        {insight.title}
      </Text>

      {/* Description */}
      <Text
        fontSize="13px"
        color={colors.textMuted}
        lineHeight="1.6"
        mb={2}
      >
        {insight.description}
      </Text>

      {/* Footer: stations + confidence */}
      <Flex align="center" gap={2} flexWrap="wrap">
        {insight.related_stations.map((stationId) => (
          <Text
            key={stationId}
            fontSize="11px"
            color={colors.textMuted}
            fontFamily="mono"
            letterSpacing="0.02em"
          >
            {stationId}
          </Text>
        ))}
        {insight.related_stations.length > 0 && (
          <Text fontSize="11px" color={colors.textMuted} opacity={0.5}>
            •
          </Text>
        )}
        <Text
          fontSize="11px"
          color={colors.textMuted}
          opacity={0.7}
        >
          {Math.round(insight.confidence * 100)}% confidence
        </Text>
      </Flex>
    </Box>
  )
}
