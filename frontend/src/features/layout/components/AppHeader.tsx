/**
 * AppHeader Component
 * Main application header with logo, filters toggle, keyboard shortcuts, and theme toggle
 */
import { memo } from 'react'
import { Box, Container, Text, Flex } from '@chakra-ui/react'
import { ActivityIcon, SidebarIcon, ThemeToggle } from '@/shared/components/ui'
import { HelpButton } from '@/features/onboarding'
import { useTheme } from '@/context/ThemeContext'

interface AppHeaderProps {
  isLoaded: boolean
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
  selectedStationsCount: number
  totalStationsCount: number
}

const KEYBOARD_SHORTCUTS = [
  { key: 'M', label: 'Mode' },
  { key: 'S', label: '±σ' },
  { key: 'G', label: 'Grok' },
  { key: 'R', label: 'Reset' },
]

export const AppHeader = memo(function AppHeader({
  isLoaded,
  isSidebarCollapsed,
  onToggleSidebar,
  selectedStationsCount,
  totalStationsCount,
}: AppHeaderProps) {
  const { colors, colorMode } = useTheme()
  const cyanAccent = colors.accentCyanText

  return (
    <Box
      as="header"
      role="banner"
      bg={`${colors.bg}e6`}
      backdropFilter="blur(20px) saturate(180%)"
      css={{ WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}
      flexShrink={0}
      zIndex={100}
      position={{ base: 'sticky', lg: 'relative' }}
      top={0}
      opacity={isLoaded ? 1 : 0}
      transform={isLoaded ? 'translateY(0)' : 'translateY(-10px)'}
      transition="all 0.5s ease-out"
      mx={{ base: 3, md: 4 }}
      borderRadius="xl"
    >
      <Container maxW="1800px" py={2} px={{ base: 3, md: 4 }} mx="auto">
        <Flex justify="space-between" align="center">
          {/* Logo and Title */}
          <Flex align="center" gap={3}>
            <ActivityIcon size="lg" color={colors.text} />
            <Box>
              <Text
                as="h1"
                fontSize={{ base: 'sm', md: 'md' }}
                fontWeight="700"
                color={colors.text}
                letterSpacing="-0.02em"
                fontFamily="'Outfit', sans-serif"
                lineHeight="1.2"
                m={0}
              >
                Climate Data Explorer
              </Text>
              <Text
                fontSize="2xs"
                color={colors.textMuted}
                letterSpacing="0.02em"
                display={{ base: 'none', md: 'block' }}
              >
                Historical temperature data from weather stations worldwide
              </Text>
            </Box>
          </Flex>

          {/* Right side controls */}
          <Flex align="center" gap={2}>
            {/* Sidebar toggle - desktop only */}
            <Box
              id="sidebar-toggle"
              as="button"
              display={{ base: 'none', lg: 'flex' }}
              alignItems="center"
              gap={1.5}
              px={2}
              py={1}
              bg={isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.50' : 'rgba(6, 182, 212, 0.15)') : colors.card}
              borderRadius="md"
              borderWidth="1px"
              borderColor={isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.200' : 'rgba(6, 182, 212, 0.3)') : colors.border}
              cursor="pointer"
              onClick={onToggleSidebar}
              _hover={{
                bg: isSidebarCollapsed ? (colorMode === 'light' ? 'cyan.100' : 'rgba(6, 182, 212, 0.25)') : colors.buttonHover,
                borderColor: isSidebarCollapsed ? colors.borderActive : colors.borderHover,
              }}
              transition="all 0.15s"
              title={isSidebarCollapsed ? 'Show filters' : 'Hide filters'}
            >
              <SidebarIcon
                size="sm"
                color={isSidebarCollapsed ? (colorMode === 'light' ? '#0891b2' : '#06b6d4') : colors.textMuted}
              />
              <Text fontSize="2xs" color={isSidebarCollapsed ? cyanAccent : colors.textMuted} fontWeight="500">
                {isSidebarCollapsed ? `Filters (${selectedStationsCount}/${totalStationsCount})` : 'Filters'}
              </Text>
            </Box>

            {/* Keyboard shortcuts hint - desktop only */}
            <Flex gap={1.5} display={{ base: 'none', lg: 'flex' }}>
              {KEYBOARD_SHORTCUTS.map(({ key, label }) => (
                <Box
                  key={key}
                  px={1.5}
                  py={0.5}
                  bg={colors.card}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={colors.border}
                >
                  <Text fontSize="2xs" color={colors.textMuted}>
                    <Text as="span" color={colors.textSecondary} fontFamily="mono">
                      {key}
                    </Text>{' '}
                    {label}
                  </Text>
                </Box>
              ))}
            </Flex>

            <HelpButton size="sm" />
            <Box id="theme-toggle">
              <ThemeToggle size="sm" />
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
})
