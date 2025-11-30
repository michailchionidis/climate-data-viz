/**
 * AIInsightsPanel component
 *
 * Main panel for AI-powered insights, displayed below the Analytics Summary.
 * Features on-demand insight generation.
 * "Ask Grok" button opens the chat sidebar.
 */
import { useState, useCallback } from 'react'
import { Box, Flex, Text, Spinner, SimpleGrid } from '@chakra-ui/react'
import { FiZap, FiRefreshCw, FiChevronDown, FiChevronRight, FiMessageCircle } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import { useAI } from '../../hooks/useAIInsights'
import { InsightCard } from './InsightCard'

interface AIInsightsPanelProps {
  stations: string[]
  yearFrom: number | null
  yearTo: number | null
  onOpenChat?: () => void
}

export function AIInsightsPanel({
  stations,
  yearFrom,
  yearTo,
  onOpenChat,
}: AIInsightsPanelProps) {
  const { colors } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    insights,
    isGeneratingInsights,
    insightsError,
    generateInsights,
    hasInsights,
  } = useAI(stations, yearFrom, yearTo)

  const handleGenerateAndExpand = useCallback(() => {
    generateInsights()
    setIsExpanded(true)
  }, [generateInsights])

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  // Don't render if no stations selected
  if (stations.length === 0) {
    return null
  }

  return (
    <Box
      bg={colors.card}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="xl"
      overflow="hidden"
      role="region"
      aria-label="AI Insights"
    >
      {/* Header - Always visible, clickable to expand/collapse */}
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2.5}
        cursor="pointer"
        onClick={toggleExpanded}
        _hover={{ bg: `${colors.accentCyan}05` }}
        transition="background 0.2s"
      >
        <Flex align="center" gap={2}>
          {/* Expand/Collapse icon */}
          <Box color={colors.textMuted}>
            {isExpanded ? (
              <FiChevronDown size={14} />
            ) : (
              <FiChevronRight size={14} />
            )}
          </Box>

          {/* Title - matching SectionHeader style */}
          <Text
            fontSize="xs"
            fontWeight="600"
            color={colors.textSecondary}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            AI Insights
          </Text>

          {/* Badge - only show count when collapsed and has insights */}
          {hasInsights && !isExpanded && (
            <Box
              px={1.5}
              py={0.5}
              bg="rgba(6, 182, 212, 0.15)"
              borderRadius="full"
              borderWidth="1px"
              borderColor="rgba(6, 182, 212, 0.3)"
            >
              <Text fontSize="2xs" color="#06b6d4" fontFamily="mono" fontWeight="600">
                {insights.length}
              </Text>
            </Box>
          )}
        </Flex>

        {/* Action buttons */}
        <Flex align="center" gap={2}>
          {/* Ask Grok button */}
          {onOpenChat && (
            <Box
              as="button"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation()
                onOpenChat()
              }}
              display="flex"
              alignItems="center"
              gap={1.5}
              px={2.5}
              py={1.5}
              borderRadius="md"
              fontSize="12px"
              fontWeight="500"
              color={colors.accentCyan}
              bg={`${colors.accentCyan}10`}
              border="1px solid"
              borderColor={`${colors.accentCyan}30`}
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                bg: `${colors.accentCyan}20`,
                borderColor: colors.accentCyan,
              }}
              aria-label="Open chat with Grok"
            >
              <FiMessageCircle size={12} />
              <Text>Ask Grok</Text>
            </Box>
          )}

          {/* Generate/Refresh button */}
          <Box
            as="button"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation()
              handleGenerateAndExpand()
            }}
            aria-disabled={isGeneratingInsights}
            display="flex"
            alignItems="center"
            gap={1.5}
            px={2.5}
            py={1.5}
            borderRadius="md"
            fontSize="12px"
            fontWeight="500"
            color={isGeneratingInsights ? colors.textMuted : colors.accentCyan}
            bg={`${colors.accentCyan}10`}
            border="1px solid"
            borderColor={`${colors.accentCyan}30`}
            cursor={isGeneratingInsights ? 'not-allowed' : 'pointer'}
            transition="all 0.2s"
            _hover={
              isGeneratingInsights
                ? {}
                : {
                    bg: `${colors.accentCyan}20`,
                    borderColor: colors.accentCyan,
                  }
            }
            aria-label={hasInsights ? 'Refresh insights' : 'Generate insights'}
          >
            {isGeneratingInsights ? (
              <>
                <Spinner size="xs" />
                <Text>Analyzing...</Text>
              </>
            ) : (
              <>
                {hasInsights ? <FiRefreshCw size={12} /> : <FiZap size={12} />}
                <Text>{hasInsights ? 'Refresh' : 'Generate'}</Text>
              </>
            )}
          </Box>
        </Flex>
      </Flex>

      {/* Collapsible Content - No max height, show all insights */}
      {isExpanded && (
        <Box p={3}>
          {/* Error state */}
          {insightsError && (
            <Box
              p={3}
              bg={`${colors.accentCyan}05`}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="lg"
              mb={3}
            >
              <Text fontSize="12px" color={colors.textMuted}>
                {insightsError.message ||
                  'Failed to generate insights. Please try again.'}
              </Text>
            </Box>
          )}

          {/* Empty state */}
          {!hasInsights && !isGeneratingInsights && !insightsError && (
            <Box textAlign="center" py={4}>
              <Flex
                align="center"
                justify="center"
                w="36px"
                h="36px"
                mx="auto"
                mb={2}
                borderRadius="lg"
                bg={`${colors.accentCyan}10`}
                color={colors.accentCyan}
              >
                <FiZap size={18} />
              </Flex>
              <Text fontSize="12px" fontWeight="500" color={colors.text} mb={0.5}>
                Get AI-powered insights
              </Text>
              <Text fontSize="11px" color={colors.textMuted}>
                Click "Generate" to analyze your data
              </Text>
            </Box>
          )}

          {/* Loading state */}
          {isGeneratingInsights && !hasInsights && (
            <Box textAlign="center" py={4}>
              <Spinner size="sm" color={colors.accentCyan} mb={2} />
              <Text fontSize="11px" color={colors.textMuted}>
                Analyzing climate patterns...
              </Text>
            </Box>
          )}

          {/* Insights grid - 2 columns on larger screens */}
          {hasInsights && (
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={2}>
              {insights.map((insight, index) => (
                <InsightCard
                  key={`${insight.type}-${index}`}
                  insight={insight}
                  index={index}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}
    </Box>
  )
}
