/**
 * Welcome Modal Component
 * First-time visitor greeting with option to start tour or skip
 */
import { Box, Flex, Text, Heading } from '@chakra-ui/react'
import { FiPlay, FiX, FiMapPin, FiCalendar, FiBarChart2 } from 'react-icons/fi'
import { LuActivity } from 'react-icons/lu'
import { useTour } from './TourContext'
import { useTheme } from '../../context/ThemeContext'
import { PillButton } from '../ui/PillButton'

// Feature card component
function FeatureCard({
  icon,
  label,
  colors,
}: {
  icon: React.ReactNode
  label: string
  colors: { accentCyan: string; accentCyanGlow: string; textMuted: string; border: string }
}) {
  return (
    <Flex
      direction="column"
      align="center"
      gap="2"
      p="3"
      borderRadius="12px"
      bg="rgba(6, 182, 212, 0.05)"
      border="1px solid"
      borderColor="rgba(6, 182, 212, 0.1)"
    >
      <Box color={colors.accentCyan}>{icon}</Box>
      <Text fontSize="xs" color={colors.textMuted} fontWeight="500">
        {label}
      </Text>
    </Flex>
  )
}

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
            gap="4"
            mb="8"
            flexWrap="wrap"
          >
            <FeatureCard
              icon={<FiMapPin size={20} />}
              label="10 Stations"
              colors={colors}
            />
            <FeatureCard
              icon={<FiCalendar size={20} />}
              label="1859–2019"
              colors={colors}
            />
            <FeatureCard
              icon={<FiBarChart2 size={20} />}
              label="Interactive Charts"
              colors={colors}
            />
          </Flex>

          {/* Actions */}
          <Flex direction="column" gap="3" align="center">
            <PillButton
              onClick={startTour}
              variant="primary"
              icon={<FiPlay size={16} />}
              iconPosition="left"
            >
              Take a Quick Tour
            </PillButton>
            <PillButton
              onClick={skipTour}
              icon={<FiX size={14} />}
              iconPosition="left"
            >
              Skip, I'll explore on my own
            </PillButton>
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
          <Flex align="center" justify="center" gap="2">
            <Box color={colors.accentCyan} opacity={0.7}>
              <FiPlay size={12} />
            </Box>
            <Text fontSize="xs" color={colors.textMuted}>
              You can restart this tour anytime from the Help button
            </Text>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
