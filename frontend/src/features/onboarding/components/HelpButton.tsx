/**
 * Help Button Component
 * Allows users to restart the tour at any time
 */
import { Box } from '@chakra-ui/react'
import { FiHelpCircle } from 'react-icons/fi'
import { useTour } from './TourContext'
import { useTheme } from '@/context/ThemeContext'

interface HelpButtonProps {
  size?: 'sm' | 'md'
}

export function HelpButton({ size = 'sm' }: HelpButtonProps) {
  const { resetTour, isOpen } = useTour()
  const { colors } = useTheme()

  // Don't show during active tour
  if (isOpen) return null

  return (
    <Box
      id="help-button"
      as="button"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p="2"
      borderRadius="md"
      color={colors.textMuted}
      bg="transparent"
      cursor="pointer"
      onClick={resetTour}
      _hover={{
        color: colors.accentCyan,
        bg: colors.buttonHover,
      }}
      transition="all 0.15s"
      aria-label="Start app tour"
      title="Take a tour of the app"
    >
      <FiHelpCircle size={size === 'sm' ? 18 : 22} />
    </Box>
  )
}
