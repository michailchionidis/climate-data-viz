/**
 * Chat Sidebar Component
 * Collapsible sidebar for Grok AI chat - mirrors the Filters sidebar design
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { Box, Flex, Text, Input, Spinner } from '@chakra-ui/react'
import { FiSend, FiX, FiMessageCircle } from 'react-icons/fi'
import { LuBrain } from 'react-icons/lu'
import { useTheme } from '../../context/ThemeContext'
import { useAskGrok } from '../../hooks/useAIInsights'
import type { AIInsightsParams } from '../../types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  stations: string[]
  yearFrom: number | null
  yearTo: number | null
}

export function ChatSidebar({
  isOpen,
  onClose,
  stations,
  yearFrom,
  yearTo,
}: ChatSidebarProps) {
  const { colors, colorMode } = useTheme()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const params: AIInsightsParams = {
    stations,
    yearFrom,
    yearTo,
  }

  const { mutate: askGrok, isPending } = useAskGrok(params)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isPending || stations.length === 0) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    askGrok(inputValue.trim(), {
      onSuccess: (data) => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      },
      onError: (error) => {
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error: ${error.message || 'Failed to get response'}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      },
    })
  }, [inputValue, isPending, askGrok, stations.length])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [handleSend, onClose]
  )

  // Don't render anything if closed
  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Sidebar Container - mirrors Filters sidebar structure */}
      <Box
        position="relative"
        w="320px"
        minW="320px"
        h="100%"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        overflow="hidden"
      >
        <Box
          w="320px"
          h="100%"
          bg={colors.card}
          borderRadius="12px"
          borderWidth="1px"
          borderColor={colors.border}
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          {/* Sidebar Header */}
          <Flex
            align="center"
            justify="space-between"
            p={3}
            borderBottomWidth="1px"
            borderColor={colors.border}
            flexShrink={0}
          >
            <Flex align="center" gap={2}>
              <Box
                w="24px"
                h="24px"
                borderRadius="6px"
                bg={colorMode === 'light' ? 'cyan.50' : 'rgba(6, 182, 212, 0.15)'}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <LuBrain size={14} color={colorMode === 'light' ? '#0891b2' : '#06b6d4'} />
              </Box>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  color={colors.text}
                  letterSpacing="-0.01em"
                >
                  Ask Grok
                </Text>
                <Text fontSize="2xs" color={colors.textMuted}>
                  Chat about your data
                </Text>
              </Box>
            </Flex>
            <Box
              as="button"
              onClick={onClose}
              p={1.5}
              borderRadius="6px"
              bg={colors.buttonBg}
              color={colors.textMuted}
              _hover={{
                bg: colors.buttonHover,
                color: colors.text,
              }}
              transition="all 0.15s"
              cursor="pointer"
              title="Close chat"
            >
              <FiX size={14} />
            </Box>
          </Flex>

          {/* Messages Area */}
          <Box
            flex={1}
            overflow="auto"
            p={3}
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: colors.border,
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: colors.borderHover,
              },
            }}
          >
            {/* Empty state */}
            {messages.length === 0 && (
              <Flex
                direction="column"
                align="center"
                justify="center"
                h="100%"
                textAlign="center"
                py={8}
              >
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="12px"
                  bg={`${colors.accentCyan}10`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={3}
                >
                  <FiMessageCircle size={24} color={colors.accentCyan} />
                </Box>
                <Text fontSize="sm" fontWeight="500" color={colors.text} mb={1}>
                  Ask anything about your data
                </Text>
                <Text fontSize="xs" color={colors.textMuted} maxW="200px">
                  {stations.length === 0
                    ? 'Select stations first to start chatting'
                    : 'Try: "What\'s the warmest year?" or "Compare the stations"'}
                </Text>
              </Flex>
            )}

            {/* Messages */}
            <Flex direction="column" gap={3}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  maxW="90%"
                >
                  <Box
                    px={3}
                    py={2}
                    borderRadius="lg"
                    bg={
                      message.role === 'user'
                        ? `${colors.accentCyan}15`
                        : colors.inputBg
                    }
                    borderWidth="1px"
                    borderColor={
                      message.role === 'user'
                        ? `${colors.accentCyan}30`
                        : colors.border
                    }
                  >
                    {message.role === 'assistant' && (
                      <Flex align="center" gap={1} mb={1}>
                        <LuBrain size={10} color={colors.accentCyan} />
                        <Text fontSize="9px" fontWeight="600" color={colors.accentCyan} textTransform="uppercase">
                          Grok
                        </Text>
                      </Flex>
                    )}
                    <Text
                      fontSize="12px"
                      color={colors.text}
                      lineHeight="1.5"
                      whiteSpace="pre-wrap"
                    >
                      {message.content}
                    </Text>
                  </Box>
                  <Text
                    fontSize="9px"
                    color={colors.textMuted}
                    mt={0.5}
                    textAlign={message.role === 'user' ? 'right' : 'left'}
                    px={1}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Box>
              ))}

              {/* Loading indicator */}
              {isPending && (
                <Flex align="center" gap={2} p={2}>
                  <Spinner size="xs" color={colors.accentCyan} />
                  <Text fontSize="11px" color={colors.textMuted}>
                    Grok is thinking...
                  </Text>
                </Flex>
              )}

              <div ref={messagesEndRef} />
            </Flex>
          </Box>

          {/* Input Area */}
          <Box
            p={3}
            borderTopWidth="1px"
            borderColor={colors.border}
            flexShrink={0}
          >
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
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={stations.length === 0 ? 'Select stations first...' : 'Type your question...'}
            variant="flushed"
            fontSize="13px"
            color={colors.text}
            bg="transparent"
            flex={1}
            border="none"
            _focus={{ boxShadow: 'none' }}
            disabled={isPending || stations.length === 0}
            _placeholder={{ color: colors.textMuted }}
          />
              <Box
                as="button"
                onClick={handleSend}
                p={1.5}
                borderRadius="md"
                color={inputValue.trim() && !isPending ? colors.accentCyan : colors.textMuted}
                cursor={inputValue.trim() && !isPending ? 'pointer' : 'not-allowed'}
                transition="all 0.2s"
                _hover={inputValue.trim() && !isPending ? { bg: `${colors.accentCyan}15` } : {}}
                aria-label="Send message"
                disabled={!inputValue.trim() || isPending || stations.length === 0}
              >
                <FiSend size={14} />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  )
}
