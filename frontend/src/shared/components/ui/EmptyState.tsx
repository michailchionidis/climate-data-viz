/**
 * Empty state component for when no data is available
 */
import { Box, Text, Flex } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { useTheme } from '@/context/ThemeContext'

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
  const { colors } = useTheme()

  return (
    <Box
      minH={minHeight}
      flex={1}
      bg={colors.card}
      borderRadius={compact ? '8px' : '12px'}
      borderWidth="1px"
      borderColor={colors.border}
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
        <Text color={colors.textSecondary} fontSize={compact ? 'sm' : 'md'} fontWeight="500" mb={compact ? 0 : 1}>
          {title}
        </Text>
        {description && !compact && (
          <Text color={colors.textMuted} fontSize="sm" maxW="280px">
            {description}
          </Text>
        )}
        {action && <Box mt={compact ? 2 : 4}>{action}</Box>}
      </Flex>
    </Box>
  )
}
