/**
 * Error Boundary component for graceful error handling
 */
import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Box, Text, Flex, Button } from '@chakra-ui/react'
import { Card, CardBody } from './ui/Card'
import { AlertIcon } from './ui/Icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card variant="accent" accentColor="orange">
          <CardBody>
            <Flex direction="column" align="center" textAlign="center" py={6}>
              <Box mb={3}>
                <AlertIcon size="xl" color="#f59e0b" />
              </Box>
              <Text fontSize="lg" fontWeight="600" color="orange.300" mb={2}>
                Something went wrong
              </Text>
              <Text fontSize="sm" color="gray.400" mb={4} maxW="400px">
                An unexpected error occurred. Please try refreshing the page or
                contact support if the problem persists.
              </Text>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box
                  mt={2}
                  p={3}
                  bg="rgba(0, 0, 0, 0.3)"
                  borderRadius="8px"
                  maxW="100%"
                  overflow="auto"
                >
                  <Text fontSize="xs" color="red.300" fontFamily="mono">
                    {this.state.error.message}
                  </Text>
                </Box>
              )}
              <Button
                mt={4}
                size="sm"
                bg="rgba(245, 158, 11, 0.2)"
                color="orange.300"
                borderWidth="1px"
                borderColor="rgba(245, 158, 11, 0.4)"
                _hover={{
                  bg: 'rgba(245, 158, 11, 0.3)',
                }}
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </Flex>
          </CardBody>
        </Card>
      )
    }

    return this.props.children
  }
}

// Functional error display component for API errors
interface ErrorDisplayProps {
  error: Error | string
  title?: string
  onRetry?: () => void
}

export function ErrorDisplay({
  error,
  title = 'Error loading data',
  onRetry,
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <Card variant="accent" accentColor="orange">
      <CardBody>
        <Flex direction="column" align="center" textAlign="center" py={4}>
          <Box mb={2}>
            <AlertIcon size="lg" color="#f59e0b" />
          </Box>
          <Text fontSize="md" fontWeight="600" color="orange.300" mb={1}>
            {title}
          </Text>
          <Text fontSize="sm" color="gray.400" mb={3}>
            {errorMessage}
          </Text>
          {onRetry && (
            <Button
              size="sm"
              bg="rgba(245, 158, 11, 0.2)"
              color="orange.300"
              borderWidth="1px"
              borderColor="rgba(245, 158, 11, 0.4)"
              _hover={{
                bg: 'rgba(245, 158, 11, 0.3)',
              }}
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </Flex>
      </CardBody>
    </Card>
  )
}
