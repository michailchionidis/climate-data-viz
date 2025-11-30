/**
 * AIInsightsPanel component
 *
 * Main panel for AI-powered insights, displayed below the Analytics Summary.
 * Features on-demand insight generation and quick Q&A.
 * Collapsible by default to save space.
 */
import { useState, useCallback } from 'react'
import { Box, Flex, Text, Spinner } from '@chakra-ui/react'
import { FiZap, FiRefreshCw, FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'
import { useTheme } from '../../context/ThemeContext'
import { useAI } from '../../hooks/useAIInsights'
import { InsightCard } from './InsightCard'
import { QuickAskInput } from './QuickAskInput'

interface AIInsightsPanelProps {
  stations: string[]
  yearFrom: number | null
  yearTo: number | null
}

export function AIInsightsPanel({
  stations,
  yearFrom,
  yearTo,
}: AIInsightsPanelProps) {
  const { colors } = useTheme()
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    insights,
    isGeneratingInsights,
    insightsError,
    generateInsights,
    lastAnswer,
    isAskingQuestion,
    askError,
    askQuestion,
    hasInsights,
  } = useAI(stations, yearFrom, yearTo)

  const handleAsk = useCallback(
    (question: string) => {
      askQuestion(question)
    },
    [askQuestion]
  )

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
        py={3}
        borderBottom={isExpanded ? '1px solid' : 'none'}
        borderColor={colors.border}
        bg={`${colors.accentCyan}05`}
        cursor="pointer"
        onClick={toggleExpanded}
        _hover={{ bg: `${colors.accentCyan}08` }}
        transition="background 0.2s"
      >
        <Flex align="center" gap={2}>
          {/* Expand/Collapse icon */}
          <Box color={colors.textMuted}>
            {isExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </Box>
          <Flex
            align="center"
            justify="center"
            w="28px"
            h="28px"
            borderRadius="md"
            bg={`${colors.accentCyan}15`}
            color={colors.accentCyan}
          >
            <LuBrain size={16} />
          </Flex>
          <Box>
            <Flex align="center" gap={2}>
              <Text fontSize="sm" fontWeight="600" color={colors.text}>
                AI Insights
              </Text>
              <Text
                fontSize="xs"
                color={colors.textMuted}
                bg={colors.inputBg}
                px={2}
                py={0.5}
                borderRadius="full"
              >
                Powered by Grok
              </Text>
              {hasInsights && !isExpanded && (
                <Text
                  fontSize="xs"
                  color={colors.accentCyan}
                  bg={`${colors.accentCyan}15`}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                >
                  {insights.length} insights
                </Text>
              )}
            </Flex>
          </Box>
        </Flex>

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
          gap={2}
          px={3}
          py={1.5}
          borderRadius="md"
          fontSize="sm"
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
              <Spinner size="sm" />
              <Text>Analyzing...</Text>
            </>
          ) : (
            <>
              {hasInsights ? <FiRefreshCw size={14} /> : <FiZap size={14} />}
              <Text>{hasInsights ? 'Refresh' : 'Generate'}</Text>
            </>
          )}
        </Box>
      </Flex>

      {/* Collapsible Content */}
      {isExpanded && (
        <Box p={4}>
          {/* Error state */}
          {insightsError && (
            <Box
              p={4}
              bg="rgba(239, 68, 68, 0.1)"
              border="1px solid"
              borderColor="#ef4444"
              borderRadius="lg"
              mb={4}
            >
              <Text fontSize="sm" color="#ef4444">
                {insightsError.message ||
                  'Failed to generate insights. Please try again.'}
              </Text>
            </Box>
          )}

          {/* Empty state */}
          {!hasInsights && !isGeneratingInsights && !insightsError && (
            <Box textAlign="center" py={6}>
              <Flex
                align="center"
                justify="center"
                w="48px"
                h="48px"
                mx="auto"
                mb={3}
                borderRadius="full"
                bg={`${colors.accentCyan}10`}
                color={colors.accentCyan}
              >
                <FiZap size={24} />
              </Flex>
              <Text fontSize="sm" fontWeight="500" color={colors.text} mb={1}>
                Get AI-powered insights
              </Text>
              <Text fontSize="sm" color={colors.textMuted}>
                Click "Generate" to analyze your selected data with Grok
              </Text>
            </Box>
          )}

          {/* Loading state */}
          {isGeneratingInsights && !hasInsights && (
            <Box textAlign="center" py={6}>
              <Spinner size="lg" color={colors.accentCyan} mb={3} />
              <Text fontSize="sm" color={colors.textMuted}>
                Analyzing climate data patterns...
              </Text>
            </Box>
          )}

          {/* Insights list */}
          {hasInsights && (
            <Flex direction="column" gap={3} mb={4}>
              {insights.map((insight, index) => (
                <InsightCard
                  key={`${insight.type}-${index}`}
                  insight={insight}
                  index={index}
                />
              ))}
            </Flex>
          )}

          {/* Quick Ask */}
          <Box
            pt={hasInsights ? 4 : 0}
            borderTop={hasInsights ? '1px solid' : 'none'}
            borderColor={colors.border}
          >
            <QuickAskInput
              onAsk={handleAsk}
              isLoading={isAskingQuestion}
              answer={lastAnswer}
              error={askError}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}
