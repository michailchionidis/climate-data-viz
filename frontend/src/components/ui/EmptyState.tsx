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
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  minHeight = '200px',
}: EmptyStateProps) {
  return (
    <Box
      minH={minHeight}
      bg="rgba(255, 255, 255, 0.02)"
      borderRadius="12px"
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.06)"
      borderStyle="dashed"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Flex direction="column" align="center" textAlign="center" p={6}>
        {icon && (
          <Box mb={3} opacity={0.7}>
            {icon}
          </Box>
        )}
        <Text color="gray.300" fontSize="md" fontWeight="500" mb={1}>
          {title}
        </Text>
        {description && (
          <Text color="gray.500" fontSize="sm" maxW="280px">
            {description}
          </Text>
        )}
        {action && <Box mt={4}>{action}</Box>}
      </Flex>
    </Box>
  )
}
