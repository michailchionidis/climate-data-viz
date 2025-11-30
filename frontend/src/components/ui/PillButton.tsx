/**
 * PillButton - x.ai style pill-shaped button
 *
 * A reusable button component with consistent styling across the app.
 * Features pill shape, uppercase text, subtle border, and hover effects.
 */
import { Box, Spinner } from '@chakra-ui/react'
import { useTheme } from '../../context/ThemeContext'
import type { ReactNode } from 'react'

interface PillButtonProps {
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  isLoading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  size?: 'xs' | 'sm' | 'md'
  variant?: 'default' | 'primary' | 'warning'
  ariaLabel?: string
  title?: string
  fullWidth?: boolean
}

export function PillButton({
  children,
  onClick,
  disabled = false,
  isLoading = false,
  icon,
  iconPosition = 'right',
  size = 'md',
  variant = 'default',
  ariaLabel,
  title,
  fullWidth = false,
}: PillButtonProps) {
  const { colors, colorMode } = useTheme()

  const isDisabled = disabled || isLoading

  // Monochromatic primary colors based on theme
  const primaryBg = colorMode === 'light' ? '#1a1a1a' : 'rgba(255, 255, 255, 0.95)'
  const primaryText = colorMode === 'light' ? 'white' : '#0a0a0a'
  const primaryHoverBg = colorMode === 'light' ? '#333333' : 'rgba(255, 255, 255, 0.85)'

  const sizeStyles = {
    xs: {
      px: 3,
      py: 1.5,
      fontSize: '11px',
      gap: 1.5,
    },
    sm: {
      px: 3,
      py: 1.5,
      fontSize: '11px',
      gap: 1.5,
    },
    md: {
      px: 4,
      py: 2,
      fontSize: '12px',
      gap: 2,
    },
  }

  const variantStyles = {
    default: {
      color: isDisabled ? colors.textMuted : colors.text,
      bg: 'transparent',
      borderColor: colors.border,
      hoverBg: `${colors.text}08`,
      hoverBorderColor: colors.textMuted,
    },
    primary: {
      color: isDisabled ? colors.textMuted : primaryText,
      bg: isDisabled ? 'transparent' : primaryBg,
      borderColor: isDisabled ? colors.border : primaryBg,
      hoverBg: primaryHoverBg,
      hoverBorderColor: primaryHoverBg,
    },
    warning: {
      color: isDisabled ? colors.textMuted : '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      hoverBg: 'rgba(245, 158, 11, 0.25)',
      hoverBorderColor: 'rgba(245, 158, 11, 0.5)',
    },
  }

  const styles = variantStyles[variant]
  const sizing = sizeStyles[size]

  return (
    <Box
      as="button"
      onClick={isDisabled ? undefined : onClick}
      data-disabled={isDisabled || undefined}
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={sizing.gap}
      px={sizing.px}
      py={sizing.py}
      w={fullWidth ? '100%' : 'auto'}
      borderRadius="full"
      fontSize={sizing.fontSize}
      fontWeight="500"
      letterSpacing="0.02em"
      textTransform="uppercase"
      color={styles.color}
      bg={styles.bg}
      border="1px solid"
      borderColor={styles.borderColor}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      transition="all 0.2s"
      opacity={isDisabled ? 0.5 : 1}
      _hover={
        isDisabled
          ? {}
          : {
              borderColor: styles.hoverBorderColor,
              bg: styles.hoverBg,
            }
      }
      _active={
        isDisabled
          ? {}
          : {
              transform: 'scale(0.98)',
            }
      }
      aria-label={ariaLabel}
      aria-disabled={isDisabled}
      title={title}
    >
      {isLoading ? (
        <Spinner size="xs" color={colors.textMuted} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Box as="span">{children}</Box>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </Box>
  )
}
