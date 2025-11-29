/**
 * Section header component with title and optional badge
 */
import { Flex, Text, Box } from '@chakra-ui/react'

interface SectionHeaderProps {
  title: string
  badge?: string | number
  badgeColor?: 'cyan' | 'orange' | 'green' | 'purple'
  action?: React.ReactNode
}

const badgeColors = {
  cyan: { bg: 'rgba(6, 182, 212, 0.15)', text: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)' },
  orange: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
  green: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
  purple: { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.3)' },
}

export function SectionHeader({
  title,
  badge,
  badgeColor = 'cyan',
  action,
}: SectionHeaderProps) {
  const colors = badgeColors[badgeColor]

  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Flex align="center" gap={3}>
        <Text
          fontSize="sm"
          fontWeight="600"
          color="gray.300"
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {title}
        </Text>
        {badge !== undefined && (
          <Box
            px={2}
            py={0.5}
            bg={colors.bg}
            borderRadius="full"
            borderWidth="1px"
            borderColor={colors.border}
          >
            <Text fontSize="xs" color={colors.text} fontFamily="mono" fontWeight="600">
              {badge}
            </Text>
          </Box>
        )}
      </Flex>
      {action}
    </Flex>
  )
}
