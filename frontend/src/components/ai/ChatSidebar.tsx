/**
 * Chat Sidebar Component
 * Collapsible sidebar for Grok AI chat - mirrors the Filters sidebar design
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { Box, Flex, Text, Textarea, Spinner } from '@chakra-ui/react'
import { FiSend, FiChevronRight } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'
import { GrokIcon } from '../ui/GrokIcon'
import { useAskGrok } from '../../hooks/useAIInsights'
import type { AIInsightsParams } from '../../api/client'

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
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

    // Build conversation history from previous messages (excluding the new one)
    const history = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    askGrok(
      { question: inputValue.trim(), history },
      {
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
      }
    )
  }, [inputValue, isPending, askGrok, stations.length, messages])

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

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current
    if (textarea) {
      textarea.style.height = '20px'
      const newHeight = Math.min(textarea.scrollHeight, 80)
      textarea.style.height = `${newHeight}px`
    }
  }, [inputValue])

  return (
    <>
      {/* Sidebar Container - mirrors Filters sidebar structure */}
      <Box
        position="relative"
        w={isOpen ? '320px' : '0px'}
        minW={isOpen ? '320px' : '0px'}
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
          opacity={isOpen ? 1 : 0}
          transform={isOpen ? 'translateX(0)' : 'translateX(20px)'}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          {/* Sidebar Header */}
          <Flex
            align="center"
            justify="space-between"
            p={3}
            flexShrink={0}
          >
            <Flex align="center" gap={3}>
              <GrokIcon size={20} color={colors.text} />
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
              p={1}
              borderRadius="4px"
              color={colors.textMuted}
              _hover={{
                bg: colors.buttonHover,
                color: colors.text,
              }}
              transition="all 0.15s"
              cursor="pointer"
              title="Collapse chat"
            >
              <FiChevronRight size={14} />
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
                <Flex
                  w="48px"
                  h="48px"
                  mb={3}
                  align="center"
                  justify="center"
                  borderRadius="full"
                  border="1px solid"
                  borderColor={colors.border}
                >
                  <GrokIcon size={18} color={colors.textMuted} />
                </Flex>
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
            <Flex direction="column" gap={4}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                  maxW={message.role === 'user' ? '85%' : '100%'}
                >
                  {message.role === 'user' ? (
                    // User message - pill style like Grok
                    <>
                      <Box
                        px={4}
                        py={2.5}
                        borderRadius="2xl"
                        bg={colorMode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)'}
                      >
                        <Text
                          fontSize="14px"
                          color={colors.text}
                          lineHeight="1.6"
                        >
                          {message.content}
                        </Text>
                      </Box>
                      <Text
                        fontSize="10px"
                        color={colors.textMuted}
                        mt={1}
                        textAlign="right"
                        px={2}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </>
                  ) : (
                    // Assistant message - clean, minimal like Grok
                    <>
                      <Text
                        fontSize="14px"
                        color={colors.text}
                        lineHeight="1.7"
                        whiteSpace="pre-wrap"
                        pl={0.5}
                      >
                        {message.content}
                      </Text>
                      <Text
                        fontSize="11px"
                        color={colors.textMuted}
                        mt={2}
                        pl={0.5}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </>
                  )}
                </Box>
              ))}

              {/* Loading indicator */}
              {isPending && (
                <Flex align="center" gap={2} py={2}>
                  <Spinner size="xs" color={colors.accentCyan} />
                  <Text fontSize="12px" color={colors.textMuted}>
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
            flexShrink={0}
          >
            <Flex
              align="center"
              gap={2}
              bg={colors.inputBg}
              border="1px solid"
              borderColor={colors.border}
              borderRadius="full"
              px={4}
              py={2.5}
              transition="all 0.2s"
              _focusWithin={{
                borderColor: colors.accentCyan,
                boxShadow: `0 0 0 1px ${colors.accentCyan}40`,
              }}
            >
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={stations.length === 0 ? 'Select stations first...' : 'Type your question...'}
            fontSize="13px"
            color={colors.text}
            bg="transparent"
            flex={1}
            border="none"
            outline="none"
            resize="none"
            minH="20px"
            maxH="80px"
            rows={1}
            overflow="auto"
            py={0}
            _focus={{ boxShadow: 'none', outline: 'none', border: 'none' }}
            _focusVisible={{ boxShadow: 'none', outline: 'none', border: 'none' }}
            disabled={isPending || stations.length === 0}
            _placeholder={{ color: colors.textMuted }}
            css={{
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&::-webkit-scrollbar': { width: '3px' },
              '&::-webkit-scrollbar-thumb': { background: colors.border, borderRadius: '2px' },
            }}
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
                data-disabled={!inputValue.trim() || isPending || stations.length === 0 || undefined}
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
