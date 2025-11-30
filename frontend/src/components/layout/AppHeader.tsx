/**
 * AppHeader Component
 * Application header with logo, title, theme toggle, and keyboard shortcuts
 */
import { memo } from 'react'
import { Box, Flex, Heading, Text, Kbd } from '@chakra-ui/react'
import { useTheme } from '../../context/ThemeContext'
import { ActivityIcon, SidebarIcon } from '../ui/Icons'
import { ThemeToggle } from '../ui/ThemeToggle'
import { HelpButton } from '../tour'
import { LAYOUT } from '../../constants'

interface AppHeaderProps {
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

function AppHeaderComponent({ isSidebarCollapsed, onToggleSidebar }: AppHeaderProps) {
  const { colors } = useTheme()

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={10}
      borderRadius="xl"
      mx={2}
      mt={2}
      bg="transparent"
      backdropFilter="blur(20px) saturate(180%)"
      css={{ WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
    >
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2}
      >
        {/* Logo and Title */}
        <Flex align="center" gap={3}>
          {/* Sidebar toggle (visible when collapsed) */}
          {isSidebarCollapsed && (
            <Box
              as="button"
              onClick={onToggleSidebar}
              p={2}
              borderRadius="md"
              _hover={{ bg: colors.inputBg }}
              transition="background 0.2s"
              aria-label="Expand sidebar"
            >
              <SidebarIcon size={20} color={colors.textSecondary} />
            </Box>
          )}

          {/* Logo */}
          <Box
            w="32px"
            h="32px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <ActivityIcon size={24} color={colors.text} />
          </Box>

          {/* Title */}
          <Heading
            as="h1"
            fontSize="lg"
            fontWeight="600"
            color={colors.text}
          >
            Climate Data Explorer
          </Heading>
        </Flex>

        {/* Right side controls */}
        <Flex align="center" gap={2}>
          {/* Keyboard shortcuts hint (desktop only) */}
          <Flex
            align="center"
            gap={1}
            display={{ base: 'none', lg: 'flex' }}
            mr={2}
          >
            <Text fontSize="xs" color={colors.textMuted}>
              Press
            </Text>
            <Kbd fontSize="xs" bg={colors.inputBg} borderColor={colors.border}>
              ?
            </Kbd>
            <Text fontSize="xs" color={colors.textMuted}>
              for help
            </Text>
            <Text fontSize="xs" color={colors.textMuted} mx={1}>
              •
            </Text>
            <Kbd fontSize="xs" bg={colors.inputBg} borderColor={colors.border}>
              M
            </Kbd>
            <Text fontSize="xs" color={colors.textMuted}>
              mode
            </Text>
            <Text fontSize="xs" color={colors.textMuted} mx={1}>
              •
            </Text>
            <Kbd fontSize="xs" bg={colors.inputBg} borderColor={colors.border}>
              G
            </Kbd>
            <Text fontSize="xs" color={colors.textMuted}>
              Grok
            </Text>
          </Flex>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Help button */}
          <HelpButton />
        </Flex>
      </Flex>
    </Box>
  )
}

export const AppHeader = memo(AppHeaderComponent)
