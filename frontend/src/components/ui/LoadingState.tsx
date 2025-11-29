/**
 * Loading state component with spinner and optional message
 */
import { Box, Text, Flex, Spinner } from '@chakra-ui/react'
import { useTheme } from '../../context/ThemeContext'

interface LoadingStateProps {
  message?: string
  minHeight?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { spinner: 'md', text: 'xs' },
  md: { spinner: 'lg', text: 'sm' },
  lg: { spinner: 'xl', text: 'md' },
}

export function LoadingState({
  message = 'Loading...',
  minHeight = '200px',
  size = 'md',
}: LoadingStateProps) {
  const { colors, colorMode } = useTheme()
  const sizes = sizeMap[size]

  // Dynamic colors based on theme
  const spinnerColor = colorMode === 'light' ? 'cyan.500' : 'cyan.400'
  const trackColor = colorMode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
  const glowOpacity = colorMode === 'light' ? 0.4 : 0.3

  return (
    <Box
      minH={minHeight}
      h="100%"
      w="100%"
      flex={1}
      bg={colors.card}
      borderRadius="12px"
      borderWidth="1px"
      borderColor={colors.border}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex direction="column" align="center" textAlign="center" p={6}>
        <Box position="relative">
          <Spinner
            size={sizes.spinner as 'md' | 'lg' | 'xl'}
            color={spinnerColor}
            css={{
              '--spinner-track-color': trackColor,
            }}
          />
          {/* Glow effect */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="100%"
            h="100%"
            borderRadius="full"
            bg="cyan.400"
            filter="blur(20px)"
            opacity={glowOpacity}
            animation="pulse 2s ease-in-out infinite"
          />
        </Box>
        <Text color={colors.textMuted} fontSize={sizes.text} mt={4}>
          {message}
        </Text>
      </Flex>
    </Box>
  )
}

// Skeleton loader for cards
export function CardSkeleton({ height = '150px' }: { height?: string }) {
  const { colors } = useTheme()

  return (
    <Box
      h={height}
      bg={colors.card}
      borderRadius="12px"
      borderWidth="1px"
      borderColor={colors.border}
      overflow="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        className="animate-shimmer"
      />
    </Box>
  )
}
