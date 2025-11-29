/**
 * Reusable Card component with glass morphism effect
 */
import { Box, type BoxProps } from '@chakra-ui/react'
import { forwardRef, type ReactNode } from 'react'

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
    const variants = {
      default: {
        bg: 'rgba(255, 255, 255, 0.03)',
        borderWidth: '1px',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        _hover: {},
      },
      elevated: {
        bg: 'rgba(255, 255, 255, 0.04)',
        borderWidth: '1px',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
        _hover: {},
      },
      interactive: {
        bg: 'rgba(255, 255, 255, 0.03)',
        borderWidth: '1px',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        _hover: {
          bg: 'rgba(255, 255, 255, 0.06)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        },
      },
      accent: {
        bg: 'rgba(255, 255, 255, 0.03)',
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
}

export function CardHeader({ children, ...props }: CardHeaderProps) {
  return (
    <Box
      px={4}
      py={3}
      borderBottomWidth="1px"
      borderColor="rgba(255, 255, 255, 0.08)"
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
