/**
 * Skip Link Component for Accessibility
 * Allows keyboard users to skip navigation and jump to main content
 */
import { Box, Link } from '@chakra-ui/react'

interface SkipLinkProps {
  /** Target element ID to skip to */
  targetId: string
  /** Link text */
  children: string
}

export function SkipLink({ targetId, children }: SkipLinkProps) {

  return (
    <Link
      href={`#${targetId}`}
      position="absolute"
      left="-9999px"
      top="auto"
      width="1px"
      height="1px"
      overflow="hidden"
      zIndex={9999}
      _focus={{
        position: 'fixed',
        top: '8px',
        left: '8px',
        width: 'auto',
        height: 'auto',
        overflow: 'visible',
        padding: '12px 24px',
        bg: 'cyan.500',
        color: 'white',
        fontWeight: '600',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
        outline: 'none',
        textDecoration: 'none',
      }}
      onClick={(e) => {
        e.preventDefault()
        const target = document.getElementById(targetId)
        if (target) {
          target.focus()
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }}
    >
      {children}
    </Link>
  )
}

/**
 * VisuallyHidden Component
 * Hides content visually but keeps it accessible to screen readers
 */
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="span"
      position="absolute"
      width="1px"
      height="1px"
      padding="0"
      margin="-1px"
      overflow="hidden"
      clip="rect(0, 0, 0, 0)"
      whiteSpace="nowrap"
      border="0"
    >
      {children}
    </Box>
  )
}
