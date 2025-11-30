/**
 * Premium stat card component for analytics display
 */
import { Box, Text, Flex, type BoxProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface StatCardProps extends Omit<BoxProps, 'animationDelay'> {
  label: string
  value: string | number
  subValue?: string
  icon?: ReactNode
  color?: 'cyan' | 'orange' | 'blue' | 'green' | 'purple' | 'red'
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  animationDelay?: number
  compact?: boolean
}

const colorMap = {
  cyan: {
    text: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.1)',
    border: 'rgba(6, 182, 212, 0.3)',
    glow: '0 0 20px rgba(6, 182, 212, 0.2)',
  },
  orange: {
    text: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    glow: '0 0 20px rgba(245, 158, 11, 0.2)',
  },
  blue: {
    text: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    glow: '0 0 20px rgba(59, 130, 246, 0.2)',
  },
  green: {
    text: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    glow: '0 0 20px rgba(16, 185, 129, 0.2)',
  },
  purple: {
    text: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.3)',
    glow: '0 0 20px rgba(139, 92, 246, 0.2)',
  },
  red: {
    text: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    glow: '0 0 20px rgba(239, 68, 68, 0.2)',
  },
}

const sizeMap = {
  sm: { value: 'xl', label: 'xs', padding: 3 },
  md: { value: '2xl', label: 'xs', padding: 4 },
  lg: { value: '3xl', label: 'sm', padding: 5 },
}

export function StatCard({
  label,
  value,
  subValue,
  icon,
  color = 'cyan',
  trend,
  trendValue,
  size = 'md',
  animate = false,
  animationDelay = 0,
  compact = false,
  ...props
}: StatCardProps) {
  const { colors: themeColors } = useTheme()
  const colors = colorMap[color]
  const sizes = sizeMap[size]

  const trendColors = {
    up: '#10b981',
    down: '#ef4444',
    neutral: '#71717a',
  }

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  }

  const animationStyles = animate
    ? {
        opacity: 0,
        animation: 'fadeInUp 0.5s ease-out forwards',
        animationDelay: `${animationDelay}s`,
      }
    : {}

  // Compact mode: inline horizontal layout
  if (compact) {
    return (
      <Box
        px={2.5}
        py={1.5}
        bg={themeColors.inputBg}
        borderRadius="8px"
        borderWidth="1px"
        borderColor={themeColors.border}
        transition="all 0.2s ease"
        _hover={{
          bg: themeColors.buttonHover,
          borderColor: colors.border,
        }}
        {...props}
      >
        <Flex align="center" gap={1.5}>
          {icon && (
            <Box color={colors.text} flexShrink={0}>
              {icon}
            </Box>
          )}
          <Box>
            <Text fontSize="2xs" color={themeColors.textMuted} textTransform="uppercase" letterSpacing="wider" fontWeight="500" lineHeight="1">
              {label}
            </Text>
            <Flex align="baseline" gap={1}>
              <Text fontSize="sm" fontWeight="700" color={colors.text} fontFamily="mono" lineHeight="1.2">
                {value}
              </Text>
              {subValue && (
                <Text fontSize="2xs" color={themeColors.textMuted}>
                  {subValue}
                </Text>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    )
  }

  return (
    <Box
      p={sizes.padding}
      bg={themeColors.inputBg}
      borderRadius="12px"
      borderWidth="1px"
      borderColor={themeColors.border}
      transition="all 0.25s ease"
      _hover={{
        bg: themeColors.buttonHover,
        borderColor: colors.border,
        boxShadow: colors.glow,
        transform: 'translateY(-2px)',
      }}
      {...animationStyles}
      {...props}
    >
      <Flex align="center" gap={2} mb={2}>
        {icon && (
          <Box color={colors.text}>
            {icon}
          </Box>
        )}
        <Text
          fontSize={sizes.label}
          color={themeColors.textSecondary}
          textTransform="uppercase"
          letterSpacing="wider"
          fontWeight="500"
        >
          {label}
        </Text>
      </Flex>

      <Flex align="baseline" gap={2}>
        <Text
          fontSize={sizes.value}
          fontWeight="700"
          color={colors.text}
          fontFamily="mono"
          letterSpacing="-0.02em"
        >
          {value}
        </Text>

        {trend && trendValue && (
          <Flex align="center" gap={1}>
            <Text fontSize="sm" color={trendColors[trend]} fontWeight="600">
              {trendIcons[trend]}
            </Text>
            <Text fontSize="xs" color={trendColors[trend]}>
              {trendValue}
            </Text>
          </Flex>
        )}
      </Flex>

      {subValue && (
        <Text fontSize="xs" color={themeColors.textMuted} mt={1}>
          {subValue}
        </Text>
      )}
    </Box>
  )
}

// Skeleton loading state for StatCard
export function StatCardSkeleton({ size = 'md', compact = false }: { size?: 'sm' | 'md' | 'lg'; compact?: boolean }) {
  const { colors } = useTheme()
  const sizes = sizeMap[size]

  if (compact) {
    return (
      <Box
        px={2.5}
        py={1.5}
        bg={colors.inputBg}
        borderRadius="8px"
        borderWidth="1px"
        borderColor={colors.border}
      >
        <Box h="8px" w="40px" bg={colors.buttonBg} borderRadius="2px" mb={1} className="animate-shimmer" />
        <Box h="14px" w="50px" bg={colors.buttonBg} borderRadius="2px" className="animate-shimmer" />
      </Box>
    )
  }

  return (
    <Box
      p={sizes.padding}
      bg={colors.inputBg}
      borderRadius="12px"
      borderWidth="1px"
      borderColor={colors.border}
    >
      <Box
        h="12px"
        w="60%"
        bg={colors.buttonBg}
        borderRadius="4px"
        mb={3}
        className="animate-shimmer"
      />
      <Box
        h="32px"
        w="80%"
        bg={colors.buttonBg}
        borderRadius="4px"
        className="animate-shimmer"
      />
    </Box>
  )
}
