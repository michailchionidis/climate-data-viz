/**
 * Welcome Modal Component
 * First-time visitor greeting with option to start tour or skip
 */
import { Box, Flex, Text, Heading } from '@chakra-ui/react'
import { FiPlay, FiX } from 'react-icons/fi'
import { LuActivity } from 'react-icons/lu'
import { useTour } from './TourContext'
import { useTheme } from '../../context/ThemeContext'

export function WelcomeModal() {
  const { showWelcome, startTour, skipTour } = useTour()
  const { colors } = useTheme()

  if (!showWelcome) return null

  return (
    <>
      {/* Backdrop */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(8px)"
        zIndex={9998}
        onClick={skipTour}
      />

      {/* Modal */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="440px"
        maxW="calc(100vw - 32px)"
        bg={colors.cardSolid}
        borderRadius="24px"
        border="1px solid"
        borderColor={colors.border}
        boxShadow={`0 40px 80px rgba(0, 0, 0, 0.6), 0 0 60px ${colors.accentCyanGlow}`}
        zIndex={9999}
        overflow="hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        {/* Accent line */}
        <Box
          h="3px"
          bg={`linear-gradient(90deg, ${colors.accentCyan}, ${colors.accentCyan})`}
        />

        {/* Content */}
        <Box p="8" textAlign="center">
          {/* Icon */}
          <Flex
            w="80px"
            h="80px"
            mx="auto"
            mb="6"
            align="center"
            justify="center"
            borderRadius="full"
            bg={colors.accentCyanGlow}
            border="2px solid"
            borderColor={colors.accentCyan}
            boxShadow={`0 0 30px ${colors.accentCyanGlow}`}
          >
            <LuActivity size={36} color={colors.accentCyan} />
          </Flex>

          {/* Title */}
          <Heading
            id="welcome-title"
            as="h2"
            fontSize="2xl"
            fontWeight="700"
            color={colors.text}
            mb="3"
            fontFamily="heading"
          >
            Welcome to Climate Data Explorer
          </Heading>

          {/* Description */}
          <Text
            fontSize="md"
            color={colors.textSecondary}
            lineHeight="1.7"
            mb="8"
            maxW="340px"
            mx="auto"
          >
            Explore 160 years of temperature data from weather stations worldwide.
            Compare trends, analyze patterns, and export insights.
          </Text>

          {/* Features preview */}
          <Flex
            justify="center"
            gap="6"
            mb="8"
            flexWrap="wrap"
          >
            {[
              { label: '10 Stations', icon: '📍' },
              { label: '1859–2019', icon: '📅' },
              { label: 'Interactive Charts', icon: '📊' },
            ].map((feature) => (
              <Flex
                key={feature.label}
                direction="column"
                align="center"
                gap="1"
              >
                <Text fontSize="2xl">{feature.icon}</Text>
                <Text fontSize="xs" color={colors.textMuted} fontWeight="500">
                  {feature.label}
                </Text>
              </Flex>
            ))}
          </Flex>

          {/* Actions */}
          <Flex direction="column" gap="3">
            <Box
              as="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="2"
              w="100%"
              h="48px"
              borderRadius="10px"
              fontSize="sm"
              fontWeight="600"
              bg="rgba(6, 182, 212, 0.15)"
              color={colors.accentCyan}
              borderWidth="1px"
              borderColor="rgba(6, 182, 212, 0.3)"
              cursor="pointer"
              onClick={startTour}
              _hover={{
                bg: 'rgba(6, 182, 212, 0.25)',
                borderColor: 'rgba(6, 182, 212, 0.5)',
                boxShadow: `0 0 20px ${colors.accentCyanGlow}`,
              }}
              _active={{
                bg: 'rgba(6, 182, 212, 0.35)',
              }}
              transition="all 0.2s"
            >
              <FiPlay size={16} />
              Take a Quick Tour
            </Box>
            <Box
              as="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap="2"
              w="100%"
              py="2"
              borderRadius="md"
              fontSize="sm"
              fontWeight="500"
              color={colors.textMuted}
              cursor="pointer"
              onClick={skipTour}
              _hover={{ color: colors.text, bg: colors.buttonHover }}
              transition="all 0.15s"
            >
              <FiX size={14} />
              Skip, I'll explore on my own
            </Box>
          </Flex>
        </Box>

        {/* Footer hint */}
        <Box
          py="3"
          px="6"
          bg={colors.bg}
          borderTop="1px solid"
          borderColor={colors.border}
        >
          <Text fontSize="xs" color={colors.textMuted} textAlign="center">
            💡 You can restart this tour anytime from the Help button
          </Text>
        </Box>
      </Box>
    </>
  )
}
