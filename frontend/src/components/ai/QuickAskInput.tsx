/**
 * QuickAskInput component
 *
 * A compact input for asking quick questions about the data.
 * Shows the AI response inline.
 * Uses consistent theme colors (cyan accent only).
 */
import { useState, useCallback } from 'react'
import { Box, Flex, Text, Input, Spinner } from '@chakra-ui/react'
import { FiSend, FiMessageCircle, FiX } from 'react-icons/fi'
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
  const [showAnswer, setShowAnswer] = useState(true)

  const handleSubmit = useCallback(() => {
    if (question.trim() && !isLoading) {
      onAsk(question.trim())
      setQuestion('')
      setShowAnswer(true)
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

  const handleClearAnswer = useCallback(() => {
    setShowAnswer(false)
  }, [])

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
        <FiMessageCircle size={14} color={colors.textMuted} />
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Grok about this data..."
          variant="flushed"
          fontSize="13px"
          color={colors.text}
          flex={1}
          disabled={isLoading}
          border="none"
          _focus={{ boxShadow: 'none' }}
          _placeholder={{ color: colors.textMuted }}
          aria-label="Ask a question about the climate data"
        />
        {isLoading ? (
          <Spinner size="xs" color={colors.accentCyan} />
        ) : (
          <Box
            as="button"
            onClick={handleSubmit}
            p={1}
            borderRadius="md"
            color={question.trim() ? colors.accentCyan : colors.textMuted}
            cursor={question.trim() ? 'pointer' : 'not-allowed'}
            transition="all 0.2s"
            _hover={question.trim() ? { bg: `${colors.accentCyan}15` } : {}}
            aria-label="Send question"
          >
            <FiSend size={14} />
          </Box>
        )}
      </Flex>

      {/* Answer display */}
      {showAnswer && (answer || error) && (
        <Box
          mt={2}
          p={3}
          bg={colors.inputBg}
          border="1px solid"
          borderColor={error ? `${colors.accentCyan}50` : colors.border}
          borderRadius="lg"
          position="relative"
        >
          {/* Close button */}
          <Box
            as="button"
            position="absolute"
            top={2}
            right={2}
            p={1}
            borderRadius="md"
            color={colors.textMuted}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ color: colors.text, bg: `${colors.accentCyan}10` }}
            onClick={handleClearAnswer}
            aria-label="Close answer"
          >
            <FiX size={12} />
          </Box>

          {error ? (
            <Text fontSize="12px" color={colors.textMuted} pr={6}>
              {error.message || 'Failed to get answer. Please try again.'}
            </Text>
          ) : (
            <>
              <Flex align="center" gap={1.5} mb={1.5}>
                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color={colors.accentCyan}
                  textTransform="uppercase"
                  letterSpacing="0.05em"
                >
                  Grok
                </Text>
              </Flex>
              <Text
                fontSize="12px"
                color={colors.text}
                lineHeight="1.6"
                whiteSpace="pre-wrap"
                pr={6}
              >
                {answer}
              </Text>
            </>
          )}
        </Box>
      )}
    </Box>
  )
}
