/**
 * Theme toggle button for switching between dark and light modes
 */
import { Box, Flex } from '@chakra-ui/react'
import { useTheme } from '../../context/ThemeContext'
import { SunIcon, MoonIcon } from './Icons'

interface ThemeToggleProps {
  size?: 'sm' | 'md'
}

export function ThemeToggle({ size = 'md' }: ThemeToggleProps) {
  const { colorMode, toggleColorMode, colors } = useTheme()
  const isDark = colorMode === 'dark'

  const dimensions = size === 'sm' ? { w: '52px', h: '26px', thumb: '20px' } : { w: '60px', h: '30px', thumb: '24px' }

  return (
    <Flex
      as="button"
      onClick={toggleColorMode}
      align="center"
      justify="space-between"
      w={dimensions.w}
      h={dimensions.h}
      px={1}
      borderRadius="full"
      bg={isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
      borderWidth="1px"
      borderColor={colors.border}
      cursor="pointer"
      position="relative"
      transition="all 0.2s ease"
      _hover={{
        bg: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
        borderColor: colors.borderHover,
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDark}
    >
      {/* Sun icon */}
      <Box
        opacity={isDark ? 0.4 : 1}
        transition="opacity 0.2s"
        color={isDark ? colors.textMuted : '#f59e0b'}
        zIndex={1}
      >
        <SunIcon size="sm" />
      </Box>

      {/* Moon icon */}
      <Box
        opacity={isDark ? 1 : 0.4}
        transition="opacity 0.2s"
        color={isDark ? '#8b5cf6' : colors.textMuted}
        zIndex={1}
      >
        <MoonIcon size="sm" />
      </Box>

      {/* Sliding thumb */}
      <Box
        position="absolute"
        w={dimensions.thumb}
        h={dimensions.thumb}
        borderRadius="full"
        bg={isDark ? '#8b5cf6' : '#f59e0b'}
        left={isDark ? `calc(100% - ${dimensions.thumb} - 2px)` : '2px'}
        transition="all 0.2s ease"
        boxShadow={isDark ? '0 0 8px rgba(139, 92, 246, 0.5)' : '0 0 8px rgba(245, 158, 11, 0.5)'}
      />
    </Flex>
  )
}
