/**
 * Collapsible section component for mobile views
 * Allows users to minimize/expand sections to save screen space
 */
import { useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { ChevronDownIcon } from './Icons'
import { useTheme } from '../../context/ThemeContext'

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string | number
  /** Only show collapse functionality on mobile */
  mobileOnly?: boolean
  /** Action element to display in header (e.g., "All" button) */
  action?: React.ReactNode
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  badge,
  mobileOnly = true,
  action,
}: CollapsibleSectionProps) {
  const { colors } = useTheme()
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Box>
      {/* Header - clickable on mobile */}
      <Flex
        align="center"
        justify="space-between"
        mb={isOpen ? 2 : 0}
        cursor={{ base: 'pointer', lg: mobileOnly ? 'default' : 'pointer' }}
        onClick={() => {
          // Only toggle on mobile if mobileOnly is true
          if (mobileOnly) {
            // Check if we're on mobile (window width < 1024)
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              setIsOpen(!isOpen)
            }
          } else {
            setIsOpen(!isOpen)
          }
        }}
        py={1}
        borderRadius="md"
        transition="all 0.2s"
        _hover={{
          bg: { base: colors.buttonHover, lg: mobileOnly ? 'transparent' : colors.buttonHover },
        }}
      >
        <Flex align="center" gap={2}>
          <Text
            fontSize="xs"
            fontWeight="700"
            color={colors.textSecondary}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            {title}
          </Text>
          {badge !== undefined && (
            <Box
              px={1.5}
              py={0.5}
              bg="rgba(6, 182, 212, 0.15)"
              borderRadius="full"
              fontSize="2xs"
              color={colors.accentCyanText}
              fontWeight="600"
            >
              {badge}
            </Box>
          )}
        </Flex>

        <Flex align="center" gap={2}>
          {/* Action element (e.g., "All" button) */}
          {action && (
            <Box onClick={(e) => e.stopPropagation()}>
              {action}
            </Box>
          )}

          {/* Chevron - only visible on mobile */}
          <Box
            display={{ base: 'block', lg: mobileOnly ? 'none' : 'block' }}
            color={colors.textMuted}
            transition="transform 0.2s"
            transform={isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}
          >
            <ChevronDownIcon size="sm" />
          </Box>
        </Flex>
      </Flex>

      {/* Content - collapsible on mobile */}
      <Box
        overflow="hidden"
        maxH={{ base: isOpen ? '1000px' : '0', lg: mobileOnly ? '1000px' : isOpen ? '1000px' : '0' }}
        opacity={{ base: isOpen ? 1 : 0, lg: mobileOnly ? 1 : isOpen ? 1 : 0 }}
        transition="all 0.3s ease"
      >
        {children}
      </Box>
    </Box>
  )
}
