/**
 * AppFooter Component
 * Application footer with tech stack and signature
 */
import { memo } from 'react'
import { Box, Container, Text, Flex, Link } from '@chakra-ui/react'
import { useTheme } from '@/context/ThemeContext'

const TECH_STACK = ['FastAPI', 'React', 'Plotly.js']

interface AppFooterProps {
  isLoaded: boolean
}

export const AppFooter = memo(function AppFooter({ isLoaded }: AppFooterProps) {
  const { colors } = useTheme()

  return (
    <Box
      as="footer"
      role="contentinfo"
      py={1.5}
      flexShrink={0}
      opacity={isLoaded ? 1 : 0}
      transition="opacity 0.5s ease-out 0.4s"
      display={{ base: 'none', md: 'block' }}
    >
      <Container maxW="1800px" px={4} mx="auto">
        <Flex justify="space-between" align="center">
          {/* Tech stack */}
          <Flex align="center" gap={1.5}>
            <Text fontSize="2xs" color={colors.textMuted}>
              Built with
            </Text>
            <Flex gap={1}>
              {TECH_STACK.map((tech) => (
                <Box key={tech} px={1.5} py={0.5} bg={colors.buttonBg} borderRadius="md">
                  <Text fontSize="2xs" color={colors.textMuted}>
                    {tech}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Flex>

          {/* Signature */}
          <Link
            href="https://mikechionidis.com"
            target="_blank"
            rel="noopener noreferrer"
            display="flex"
            alignItems="center"
            gap={1}
            px={2}
            py={0.5}
            borderRadius="md"
            color={colors.textMuted}
            _hover={{
              color: colors.accentCyan,
              bg: `${colors.accentCyan}08`,
              textDecoration: 'none',
            }}
            transition="all 0.2s"
          >
            <Text fontSize="2xs" letterSpacing="0.02em">
              Crafted by
            </Text>
            <Text fontSize="2xs" fontWeight="500" color={colors.text} letterSpacing="-0.01em">
              Mike Chionidis
            </Text>
          </Link>

          {/* Data info */}
          <Text fontSize="2xs" color={colors.textMuted} fontFamily="mono">
            Data: 1859–2019 • 10 Stations
          </Text>
        </Flex>
      </Container>
    </Box>
  )
})
