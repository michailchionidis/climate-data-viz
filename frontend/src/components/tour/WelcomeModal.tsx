/**
 * Welcome Modal Component
 * First-time visitor greeting with option to start tour or skip
 * xAI-level minimal design
 */
import { Box, Flex, Text, Heading } from '@chakra-ui/react'
import { FiPlay, FiMapPin, FiCalendar, FiBarChart2 } from 'react-icons/fi'
import { LuActivity } from 'react-icons/lu'
import { useTour } from './TourContext'
import { useTheme } from '../../context/ThemeContext'
import { PillButton } from '../ui/PillButton'

// Feature item component - minimal inline style
function FeatureItem({
  icon,
  label,
  colors,
}: {
  icon: React.ReactNode
  label: string
  colors: { text: string; textMuted: string; border: string }
}) {
  return (
    <Flex align="center" gap="2">
      <Box color={colors.textMuted}>{icon}</Box>
      <Text fontSize="xs" color={colors.textMuted} fontWeight="500" letterSpacing="0.02em">
        {label}
      </Text>
    </Flex>
  )
}

export function WelcomeModal() {
  const { showWelcome, startTour, skipTour } = useTour()
  const { colors, colorMode } = useTheme()

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
        bg="rgba(0, 0, 0, 0.85)"
        backdropFilter="blur(12px)"
        zIndex={9998}
        onClick={skipTour}
      />

      {/* Modal */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        width="400px"
        maxW="calc(100vw - 32px)"
        bg={colors.cardSolid}
        borderRadius="16px"
        border="1px solid"
        borderColor={colors.border}
        boxShadow="0 25px 50px rgba(0, 0, 0, 0.5)"
        zIndex={9999}
        overflow="hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        {/* Content */}
        <Box p="8" textAlign="center">
          {/* Icon - minimal white circle */}
          <Flex
            w="64px"
            h="64px"
            mx="auto"
            mb="6"
            align="center"
            justify="center"
            borderRadius="full"
            border="1px solid"
            borderColor={colors.border}
          >
            <LuActivity size={28} color={colors.text} />
          </Flex>

          {/* Title */}
          <Heading
            id="welcome-title"
            as="h2"
            fontSize="xl"
            fontWeight="600"
            color={colors.text}
            mb="3"
            letterSpacing="-0.02em"
          >
            Climate Data Explorer
          </Heading>

          {/* Description */}
          <Text
            fontSize="sm"
            color={colors.textMuted}
            lineHeight="1.7"
            mb="6"
            maxW="300px"
            mx="auto"
          >
            Explore 160 years of temperature data from weather stations worldwide.
          </Text>

          {/* Features - minimal inline */}
          <Flex
            justify="center"
            gap="6"
            mb="8"
            flexWrap="wrap"
          >
            <FeatureItem
              icon={<FiMapPin size={14} />}
              label="10 Stations"
              colors={colors}
            />
            <FeatureItem
              icon={<FiCalendar size={14} />}
              label="1859–2019"
              colors={colors}
            />
            <FeatureItem
              icon={<FiBarChart2 size={14} />}
              label="Charts"
              colors={colors}
            />
          </Flex>

          {/* Actions */}
          <Flex direction="column" gap="3" align="center">
            <PillButton
              onClick={startTour}
              variant="primary"
              icon={<FiPlay size={14} />}
              iconPosition="left"
            >
              Start Tour
            </PillButton>
            <Text
              as="button"
              onClick={skipTour}
              fontSize="xs"
              color={colors.textMuted}
              cursor="pointer"
              _hover={{ color: colors.text }}
              transition="color 0.15s"
              bg="transparent"
              border="none"
              letterSpacing="0.02em"
            >
              Skip
            </Text>
          </Flex>
        </Box>

        {/* Footer hint - subtle */}
        <Box
          py="2.5"
          px="6"
          borderTop="1px solid"
          borderColor={colors.border}
        >
          <Text fontSize="2xs" color={colors.textMuted} textAlign="center" letterSpacing="0.02em">
            Press{' '}
            <Text
              as="span"
              fontFamily="mono"
              px="1"
              py="0.5"
              bg={colorMode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
              borderRadius="3px"
              fontSize="2xs"
            >
              ?
            </Text>
            {' '}anytime to restart
          </Text>
        </Box>
      </Box>
    </>
  )
}
