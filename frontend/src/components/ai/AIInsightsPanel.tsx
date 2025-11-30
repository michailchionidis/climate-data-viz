/**
 * AIInsightsPanel component
 *
 * Main panel for AI-powered insights, displayed below the Analytics Summary.
 * Features on-demand insight generation.
 * "Ask Grok" button opens the chat sidebar.
 */
import { useState, useCallback } from 'react'
import { Box, Flex, Text, Spinner } from '@chakra-ui/react'
import { FiZap, FiRefreshCw, FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import { useAI } from '../../hooks/useAIInsights'
import { InsightCard } from './InsightCard'
import { PillButton } from '../ui/PillButton'
import { GrokIcon } from '../ui/GrokIcon'

interface AIInsightsPanelProps {
  stations: string[]
  yearFrom: number | null
  yearTo: number | null
  onOpenChat?: () => void
  onExpandChange?: (expanded: boolean) => void
}

export function AIInsightsPanel({
  stations,
  yearFrom,
  yearTo,
  onOpenChat,
  onExpandChange,
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
    setIsExpanded((prev) => {
      const newValue = !prev
      onExpandChange?.(newValue)
      return newValue
    })
  }, [onExpandChange])

  const noStationsSelected = stations.length === 0

  return (
    <Box
      id="ai-insights-panel"
      bg={colors.card}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="xl"
      overflow="hidden"
      role="region"
      aria-label="AI Insights"
      aria-expanded={isExpanded}
      opacity={noStationsSelected ? 0.5 : 1}
      transition="opacity 0.2s"
    >
      {/* Header - Always visible, clickable to expand/collapse */}
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2.5}
        cursor={noStationsSelected ? 'default' : 'pointer'}
        onClick={noStationsSelected ? undefined : toggleExpanded}
        _hover={noStationsSelected ? {} : { bg: `${colors.accentCyan}05` }}
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

          {/* Count - only show when collapsed and has insights */}
          {hasInsights && !isExpanded && (
            <Text
              fontSize="2xs"
              color={colors.textMuted}
              fontFamily="mono"
              letterSpacing="0.02em"
            >
              {insights.length}
            </Text>
          )}
        </Flex>

        {/* Action buttons */}
        <Flex id="ai-action-buttons" align="center" gap={2} onClick={(e) => e.stopPropagation()}>
          {onOpenChat && (
            <Box id="ask-grok-button">
              <PillButton
                onClick={noStationsSelected ? undefined : onOpenChat}
                icon={<GrokIcon size={11} />}
                ariaLabel="Open chat with Grok"
                size="xs"
                disabled={noStationsSelected}
              >
                Ask Grok
              </PillButton>
            </Box>
          )}

          <Box id="generate-insights-button">
            <PillButton
              onClick={noStationsSelected ? undefined : handleGenerateAndExpand}
              isLoading={isGeneratingInsights}
              icon={hasInsights ? <FiRefreshCw size={11} /> : <FiZap size={11} />}
              ariaLabel={hasInsights ? 'Refresh insights' : 'Generate insights'}
              size="xs"
              disabled={noStationsSelected}
            >
              {hasInsights ? 'Refresh' : 'Generate'}
            </PillButton>
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
            <Box textAlign="center" py={6}>
              <Flex
                w="48px"
                h="48px"
                mx="auto"
                mb={3}
                align="center"
                justify="center"
                borderRadius="full"
                border="1px solid"
                borderColor={colors.border}
              >
                <FiZap size={18} color={colors.textMuted} />
              </Flex>
              <Text fontSize="13px" fontWeight="500" color={colors.text} mb={1}>
                Get AI-powered insights
              </Text>
              <Text fontSize="11px" color={colors.textMuted} letterSpacing="-0.01em">
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

          {/* Insights list - clean vertical layout */}
          {hasInsights && (
            <Box>
              {insights.map((insight, index) => (
                <InsightCard
                  key={`${insight.type}-${index}`}
                  insight={insight}
                  index={index}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}
