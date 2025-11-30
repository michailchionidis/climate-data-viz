/**
 * AppFooter Component
 * Application footer with signature
 */
import { memo } from 'react'
import { Box, Flex, Text, Link } from '@chakra-ui/react'
import { useTheme } from '../../context/ThemeContext'

function AppFooterComponent() {
  const { colors } = useTheme()

  return (
    <Box
      as="footer"
      role="contentinfo"
      py={1}
    >
      <Flex
        align="center"
        justify="center"
        gap={1}
      >
        <Text
          fontSize="xs"
          color={colors.textMuted}
          letterSpacing="0.02em"
        >
          Crafted by
        </Text>
        <Link
          href="https://mikechionidis.com"
          target="_blank"
          rel="noopener noreferrer"
          fontSize="xs"
          fontWeight="500"
          color={colors.textSecondary}
          letterSpacing="0.02em"
          _hover={{
            color: colors.text,
            textDecoration: 'none',
          }}
          transition="color 0.2s"
        >
          Mike Chionidis
        </Link>
      </Flex>
    </Box>
  )
}

export const AppFooter = memo(AppFooterComponent)
