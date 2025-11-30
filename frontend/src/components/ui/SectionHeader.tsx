/**
 * Section header component with title and optional inline metadata
 * Minimal x.ai style - no badges, just subtle inline text
 */
import { Flex, Text } from '@chakra-ui/react'
import { useTheme } from '../../context/ThemeContext'

interface SectionHeaderProps {
  title: string
  badge?: string | number
  badgeColor?: 'cyan' | 'orange' | 'green' | 'purple' // kept for API compatibility
  action?: React.ReactNode
  compact?: boolean
}

export function SectionHeader({
  title,
  badge,
  badgeColor: _badgeColor = 'cyan', // unused now, kept for compatibility
  action,
  compact = false,
}: SectionHeaderProps) {
  const { colors } = useTheme()

  return (
    <Flex justify="space-between" align="center" mb={compact ? 2 : 4}>
      <Flex align="center" gap={2}>
        <Text
          fontSize={compact ? 'xs' : 'sm'}
          fontWeight="600"
          color={colors.textSecondary}
          textTransform="uppercase"
          letterSpacing="wide"
        >
          {title}
        </Text>
        {badge !== undefined && (
          <Text
            fontSize={compact ? '2xs' : 'xs'}
            color={colors.textMuted}
            fontFamily="mono"
            letterSpacing="0.02em"
          >
            {badge}
          </Text>
        )}
      </Flex>
      {action}
    </Flex>
  )
}
