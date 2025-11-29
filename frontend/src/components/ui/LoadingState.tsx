/**
 * Loading state component with spinner and optional message
 */
import { Box, Text, Flex, Spinner } from '@chakra-ui/react'

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
  const sizes = sizeMap[size]

  return (
    <Box
      minH={minHeight}
      h="100%"
      w="100%"
      flex={1}
      bg="rgba(255, 255, 255, 0.02)"
      borderRadius="12px"
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.06)"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex direction="column" align="center" textAlign="center" p={6}>
        <Box position="relative">
          <Spinner
            size={sizes.spinner as 'md' | 'lg' | 'xl'}
            color="cyan.400"
            css={{
              '--spinner-track-color': 'rgba(255, 255, 255, 0.1)',
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
            opacity={0.3}
            animation="pulse 2s ease-in-out infinite"
          />
        </Box>
        <Text color="gray.400" fontSize={sizes.text} mt={4}>
          {message}
        </Text>
      </Flex>
    </Box>
  )
}

// Skeleton loader for cards
export function CardSkeleton({ height = '150px' }: { height?: string }) {
  return (
    <Box
      h={height}
      bg="rgba(255, 255, 255, 0.03)"
      borderRadius="12px"
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.08)"
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
