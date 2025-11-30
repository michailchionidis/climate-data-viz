/**
 * Reusable Card component with glass morphism effect
 */
import { Box, type BoxProps } from '@chakra-ui/react'
import { forwardRef, type ReactNode } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface CardProps extends Omit<BoxProps, 'animationDelay'> {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'interactive' | 'accent'
  accentColor?: 'cyan' | 'orange' | 'purple' | 'emerald'
  animate?: boolean
  animationDelay?: number
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      accentColor,
      animate = false,
      animationDelay = 0,
      ...props
    },
    ref
  ) => {
    const { colors, colorMode } = useTheme()

    const variants = {
      default: {
        bg: colors.card,
        borderWidth: '1px',
        borderColor: colors.border,
        boxShadow: colorMode === 'light' ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none',
        _hover: {},
      },
      elevated: {
        bg: colors.cardSolid,
        borderWidth: '1px',
        borderColor: colors.border,
        boxShadow: colorMode === 'light' ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 4px 24px rgba(0, 0, 0, 0.3)',
        _hover: {},
      },
      interactive: {
        bg: colors.card,
        borderWidth: '1px',
        borderColor: colors.border,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        _hover: {
          bg: colors.cardHover,
          borderColor: colors.borderHover,
          transform: 'translateY(-2px)',
          boxShadow: colorMode === 'light' ? '0 8px 24px rgba(0, 0, 0, 0.12)' : '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
      accent: {
        bg: colors.card,
        borderWidth: '1px',
        borderColor: getAccentBorderColor(accentColor),
        boxShadow: getAccentGlow(accentColor),
        _hover: {},
      },
    }

    const animationStyles = animate
      ? {
          opacity: 0,
          animation: 'fadeInUp 0.5s ease-out forwards',
          animationDelay: `${animationDelay}s`,
        }
      : {}

    return (
      <Box
        ref={ref}
        borderRadius="12px"
        overflow="hidden"
        {...variants[variant]}
        {...animationStyles}
        {...props}
      >
        {children}
      </Box>
    )
  }
)

Card.displayName = 'Card'

function getAccentBorderColor(color?: string): string {
  const colors: Record<string, string> = {
    cyan: 'rgba(6, 182, 212, 0.4)',
    orange: 'rgba(245, 158, 11, 0.4)',
    purple: 'rgba(139, 92, 246, 0.4)',
    emerald: 'rgba(16, 185, 129, 0.4)',
  }
  return colors[color || 'cyan'] || colors.cyan
}

function getAccentGlow(color?: string): string {
  const glows: Record<string, string> = {
    cyan: '0 0 20px rgba(6, 182, 212, 0.15)',
    orange: '0 0 20px rgba(245, 158, 11, 0.15)',
    purple: '0 0 20px rgba(139, 92, 246, 0.15)',
    emerald: '0 0 20px rgba(16, 185, 129, 0.15)',
  }
  return glows[color || 'cyan'] || glows.cyan
}

// Card Header component
interface CardHeaderProps extends BoxProps {
  children: ReactNode
  showBorder?: boolean
}

export function CardHeader({ children, showBorder = false, ...props }: CardHeaderProps) {
  const { colors } = useTheme()
  return (
    <Box
      px={4}
      py={3}
      borderBottomWidth={showBorder ? '1px' : '0'}
      borderColor={colors.border}
      {...props}
    >
      {children}
    </Box>
  )
}

// Card Body component
interface CardBodyProps extends BoxProps {
  children: ReactNode
}

export function CardBody({ children, ...props }: CardBodyProps) {
  return (
    <Box p={4} {...props}>
      {children}
    </Box>
  )
}
