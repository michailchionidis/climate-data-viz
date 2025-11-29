/**
 * Empty state component for when no data is available
 */
import { Box, Text, Flex } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  minHeight?: string
  compact?: boolean
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  minHeight = '200px',
  compact = false,
}: EmptyStateProps) {
  return (
    <Box
      minH={minHeight}
      flex={1}
      bg="rgba(255, 255, 255, 0.02)"
      borderRadius={compact ? '8px' : '12px'}
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.06)"
      borderStyle="dashed"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex direction="column" align="center" textAlign="center" p={compact ? 3 : 6}>
        {icon && (
          <Box mb={compact ? 1.5 : 3} opacity={0.7}>
            {icon}
          </Box>
        )}
        <Text color="gray.300" fontSize={compact ? 'sm' : 'md'} fontWeight="500" mb={compact ? 0 : 1}>
          {title}
        </Text>
        {description && !compact && (
          <Text color="gray.500" fontSize="sm" maxW="280px">
            {description}
          </Text>
        )}
        {action && <Box mt={compact ? 2 : 4}>{action}</Box>}
      </Flex>
    </Box>
  )
}
