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
  sm: { spinner: 'sm', text: '11px' },
  md: { spinner: 'sm', text: '12px' },
  lg: { spinner: 'sm', text: '13px' },
}

export function LoadingState({
  message = 'Loading...',
  minHeight = '200px',
  size = 'md',
}: LoadingStateProps) {
  const { colors } = useTheme()
  const sizes = sizeMap[size]

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
      <Flex direction="column" align="center" textAlign="center" py={4}>
        <Spinner
          size={sizes.spinner as 'sm'}
          color={colors.accentCyan}
        />
        <Text color={colors.textMuted} fontSize={sizes.text} mt={3}>
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
