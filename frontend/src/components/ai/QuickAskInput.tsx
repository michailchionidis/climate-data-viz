/**
 * QuickAskInput component
 *
 * A compact input for asking quick questions about the data.
 * Shows the AI response inline.
 */
import { useState, useCallback } from 'react'
import { Box, Flex, Text, Input, Spinner } from '@chakra-ui/react'
import { FiSend, FiMessageCircle } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

interface QuickAskInputProps {
  onAsk: (question: string) => void
  isLoading: boolean
  answer: string | null
  error: Error | null
}

export function QuickAskInput({
  onAsk,
  isLoading,
  answer,
  error,
}: QuickAskInputProps) {
  const { colors } = useTheme()
  const [question, setQuestion] = useState('')

  const handleSubmit = useCallback(() => {
    if (question.trim() && !isLoading) {
      onAsk(question.trim())
      // Don't clear the question - keep it visible while loading
    }
  }, [question, isLoading, onAsk])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  // Clear question only after we get an answer
  const displayedQuestion = isLoading ? question : ''

  return (
    <Box>
      {/* Input */}
      <Flex
        align="center"
        gap={2}
        bg={colors.inputBg}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="lg"
        px={3}
        py={2}
        transition="all 0.2s"
        _focusWithin={{
          borderColor: colors.accentCyan,
          boxShadow: `0 0 0 1px ${colors.accentCyan}40`,
        }}
      >
        <FiMessageCircle size={16} color={colors.textMuted} />
        <Input
          value={isLoading ? displayedQuestion : question}
          onChange={(e) => !isLoading && setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Grok about this data..."
          variant="flushed"
          fontSize="sm"
          color={colors.text}
          flex={1}
          readOnly={isLoading}
          _placeholder={{ color: colors.textMuted }}
          aria-label="Ask a question about the climate data"
        />
        {isLoading ? (
          <Spinner size="sm" color={colors.accentCyan} />
        ) : (
          <Box
            as="button"
            onClick={handleSubmit}
            aria-disabled={!question.trim()}
            p={1}
            borderRadius="md"
            color={question.trim() ? colors.accentCyan : colors.textMuted}
            cursor={question.trim() ? 'pointer' : 'not-allowed'}
            transition="all 0.2s"
            _hover={question.trim() ? { bg: `${colors.accentCyan}15` } : {}}
            aria-label="Send question"
          >
            <FiSend size={16} />
          </Box>
        )}
      </Flex>

      {/* Answer display */}
      {(answer || error) && !isLoading && (
        <Box
          mt={3}
          p={3}
          bg={error ? 'rgba(239, 68, 68, 0.1)' : `${colors.accentCyan}08`}
          border="1px solid"
          borderColor={error ? '#ef4444' : `${colors.accentCyan}30`}
          borderRadius="lg"
        >
          {error ? (
            <Text fontSize="sm" color="#ef4444">
              {error.message || 'Failed to get answer. Please try again.'}
            </Text>
          ) : (
            <>
              <Flex align="center" gap={2} mb={2}>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color={colors.accentCyan}
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  Grok
                </Text>
              </Flex>
              <Text
                fontSize="sm"
                color={colors.text}
                lineHeight="1.6"
                whiteSpace="pre-wrap"
              >
                {answer}
              </Text>
            </>
          )}
        </Box>
      )}

      {/* Loading indicator for answer */}
      {isLoading && (
        <Box
          mt={3}
          p={3}
          bg={`${colors.accentCyan}08`}
          border="1px solid"
          borderColor={`${colors.accentCyan}30`}
          borderRadius="lg"
        >
          <Flex align="center" gap={2}>
            <Spinner size="sm" color={colors.accentCyan} />
            <Text fontSize="sm" color={colors.textMuted}>
              Grok is thinking...
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  )
}
