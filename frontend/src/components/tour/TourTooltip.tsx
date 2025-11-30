/**
 * Tour Tooltip Component
 * Displays step content with spotlight effect on target element
 */
import { useEffect, useState, useRef } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { useTour, TourStep } from './TourContext'
import { useTheme } from '../../context/ThemeContext'
import { PillButton } from '../ui/PillButton'

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
  bottom: number
  right: number
}

function getTargetRect(target: string): TargetRect | null {
  // Find all elements with this ID (there might be duplicates for mobile/desktop)
  // and return the first one that's visible
  const elements = document.querySelectorAll(`#${target}, ${target}`)

  for (const element of elements) {
    const rect = element.getBoundingClientRect()
    // Check if element is visible (has width and height)
    if (rect.width > 0 && rect.height > 0) {
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
      }
    }
  }

  return null
}

function getTooltipPosition(
  targetRect: TargetRect | null,
  placement: TourStep['placement'] = 'bottom',
  tooltipWidth: number = 360,
  tooltipHeight: number = 200,
  isMobile: boolean = false
): { top: number; left: number } {
  // On mobile, always center the tooltip
  // Also center if no target found or center placement
  if (isMobile || !targetRect || placement === 'center') {
    const actualWidth = isMobile ? Math.min(tooltipWidth, window.innerWidth - 32) : tooltipWidth
    return {
      top: Math.max(80, window.innerHeight / 2 - tooltipHeight / 2),
      left: window.innerWidth / 2 - actualWidth / 2,
    }
  }

  const padding = 16
  const arrowOffset = 20 // Increased for arrow space

  let top = 0
  let left = 0

  switch (placement) {
    case 'top':
      top = targetRect.top - tooltipHeight - arrowOffset
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
      break
    case 'bottom':
      top = targetRect.top + targetRect.height + arrowOffset
      left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
      break
    case 'left':
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
      left = targetRect.left - tooltipWidth - arrowOffset
      break
    case 'right':
      top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
      left = targetRect.right + arrowOffset
      break
  }

  // Keep tooltip within viewport
  const maxLeft = window.innerWidth - tooltipWidth - padding
  const maxTop = window.innerHeight - tooltipHeight - padding

  left = Math.max(padding, Math.min(left, maxLeft))
  top = Math.max(padding, Math.min(top, maxTop))

  return { top, left }
}

// Get arrow position based on placement
function getArrowStyles(
  placement: TourStep['placement'],
  colors: { accentCyan: string; cardSolid: string; border: string }
): React.CSSProperties {
  const arrowSize = 10
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  }

  switch (placement) {
    case 'top':
      return {
        ...base,
        bottom: -arrowSize,
        left: '50%',
        transform: 'translateX(-50%)',
        borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
        borderColor: `${colors.border} transparent transparent transparent`,
      }
    case 'bottom':
      return {
        ...base,
        top: -arrowSize,
        left: '50%',
        transform: 'translateX(-50%)',
        borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
        borderColor: `transparent transparent ${colors.border} transparent`,
      }
    case 'left':
      return {
        ...base,
        right: -arrowSize,
        top: '50%',
        transform: 'translateY(-50%)',
        borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
        borderColor: `transparent transparent transparent ${colors.border}`,
      }
    case 'right':
      return {
        ...base,
        left: -arrowSize,
        top: '50%',
        transform: 'translateY(-50%)',
        borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
        borderColor: `transparent ${colors.border} transparent transparent`,
      }
    default:
      return { display: 'none' }
  }
}

// Step dot component
function StepDot({
  index,
  isActive,
  isCompleted,
  onClick,
  colors,
}: {
  index: number
  isActive: boolean
  isCompleted: boolean
  onClick: () => void
  colors: { accentCyan: string; textMuted: string; border: string }
}) {
  return (
    <Box
      as="button"
      w="8px"
      h="8px"
      borderRadius="full"
      bg={isActive ? colors.accentCyan : isCompleted ? 'rgba(6, 182, 212, 0.4)' : colors.border}
      cursor="pointer"
      transition="all 0.2s ease"
      onClick={onClick}
      aria-label={`Go to step ${index + 1}`}
      _hover={{
        transform: 'scale(1.3)',
        bg: isActive ? colors.accentCyan : 'rgba(6, 182, 212, 0.6)',
      }}
    />
  )
}

export function TourTooltip() {
  const { isOpen, currentStep, steps, nextStep, prevStep, endTour, goToStep } = useTour()
  const { colors } = useTheme()
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  // Update target rect and tooltip position
  useEffect(() => {
    if (!isOpen || !step) return

    const updatePosition = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      const rect = mobile ? null : getTargetRect(step.target)
      setTargetRect(rect)

      const tooltipHeight = tooltipRef.current?.offsetHeight || 200
      const pos = getTooltipPosition(rect, step.placement, 360, tooltipHeight, mobile)
      setTooltipPos(pos)
    }

    // Initial update
    updatePosition()

    // Scroll target into view if needed (only on desktop)
    // Do this after initial position update, then update again after scroll
    const mobile = window.innerWidth < 768
    if (!mobile && step.spotlight !== false) {
      const elements = document.querySelectorAll(`#${step.target}, ${step.target}`)
      for (const el of elements) {
        const elRect = el.getBoundingClientRect()
        if (elRect.width > 0 && elRect.height > 0) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Update position again after scroll animation
          setTimeout(updatePosition, 350)
          break
        }
      }
    }

    // Update on resize
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [isOpen, step, currentStep])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          endTour(false)
          break
        case 'ArrowRight':
        case 'Enter':
          nextStep()
          break
        case 'ArrowLeft':
          prevStep()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, nextStep, prevStep, endTour])

  if (!isOpen || !step) return null

  const showArrow = !isMobile && targetRect && step.spotlight !== false

  return (
    <>
      {/* Overlay with spotlight cutout */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={9998}
        pointerEvents="none"
        bg="rgba(0, 0, 0, 0.75)"
        style={{
          // Create spotlight cutout using clip-path
          clipPath: targetRect && step.spotlight !== false
            ? `polygon(
                0% 0%,
                0% 100%,
                ${targetRect.left - 8}px 100%,
                ${targetRect.left - 8}px ${targetRect.top - 8}px,
                ${targetRect.right + 8}px ${targetRect.top - 8}px,
                ${targetRect.right + 8}px ${targetRect.bottom + 8}px,
                ${targetRect.left - 8}px ${targetRect.bottom + 8}px,
                ${targetRect.left - 8}px 100%,
                100% 100%,
                100% 0%
              )`
            : undefined,
        }}
      />

      {/* Spotlight border glow - only on desktop */}
      {!isMobile && targetRect && step.spotlight !== false && (
        <Box
          position="fixed"
          top={`${targetRect.top - 8}px`}
          left={`${targetRect.left - 8}px`}
          width={`${targetRect.width + 16}px`}
          height={`${targetRect.height + 16}px`}
          borderRadius="12px"
          border="2px solid"
          borderColor={colors.accentCyan}
          boxShadow={`0 0 20px ${colors.accentCyan}, 0 0 40px rgba(6, 182, 212, 0.3)`}
          zIndex={9999}
          pointerEvents="none"
          transition="all 0.3s ease"
        />
      )}

      {/* Click blocker (allows clicking on spotlight area) */}
      <Box
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        zIndex={9997}
        onClick={() => endTour(false)}
      />

      {/* Tooltip */}
      <Box
        ref={tooltipRef}
        position="fixed"
        top={`${tooltipPos.top}px`}
        left={isMobile ? '16px' : `${tooltipPos.left}px`}
        width={isMobile ? 'calc(100vw - 32px)' : '360px'}
        maxW="calc(100vw - 32px)"
        bg={colors.cardSolid}
        borderRadius="16px"
        border="1px solid"
        borderColor={colors.border}
        boxShadow={`0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px ${colors.accentCyanGlow}`}
        zIndex={10000}
        overflow="visible"
        transition="top 0.3s ease, left 0.3s ease"
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${currentStep + 1} of ${steps.length}`}
      >
        {/* Arrow pointer */}
        {showArrow && (
          <Box style={getArrowStyles(step.placement, colors)} />
        )}

        {/* Content wrapper with overflow hidden for rounded corners */}
        <Box overflow="hidden" borderRadius="16px">
          {/* Content */}
          <Box p="5">
            {/* Header */}
            <Flex justify="space-between" align="center" mb="3">
              <Box
                fontSize="lg"
                fontWeight="700"
                color={colors.text}
                fontFamily="heading"
              >
                {step.title}
              </Box>
              <Box
                as="button"
                p="1"
                borderRadius="md"
                color={colors.textMuted}
                cursor="pointer"
                onClick={() => endTour(false)}
                _hover={{ color: colors.text, bg: colors.buttonHover }}
                aria-label="Close tour"
              >
                <FiX size={18} />
              </Box>
            </Flex>

            {/* Body */}
            <Box
              fontSize="sm"
              color={colors.textSecondary}
              lineHeight="1.7"
              mb="4"
            >
              {step.content}
            </Box>

            {/* Mobile hint */}
            {isMobile && (
              <Box
                bg="rgba(6, 182, 212, 0.1)"
                border="1px solid"
                borderColor="rgba(6, 182, 212, 0.2)"
                borderRadius="8px"
                p="2"
                mb="3"
              >
                <Text fontSize="xs" color={colors.textMuted} textAlign="center">
                  For the best experience with interactive highlights, view this tour on a desktop device.
                </Text>
              </Box>
            )}

            {/* Footer */}
            <Flex justify="space-between" align="center">
              {/* Step dots */}
              <Flex gap="2" align="center">
                {steps.map((_, index) => (
                  <StepDot
                    key={index}
                    index={index}
                    isActive={index === currentStep}
                    isCompleted={index < currentStep}
                    onClick={() => goToStep(index)}
                    colors={colors}
                  />
                ))}
              </Flex>

              {/* Navigation */}
              <Flex gap="2">
                {!isFirstStep && (
                  <PillButton
                    onClick={prevStep}
                    icon={<FiChevronLeft size={14} />}
                    iconPosition="left"
                  >
                    Back
                  </PillButton>
                )}
                <PillButton
                  onClick={nextStep}
                  variant="primary"
                  icon={!isLastStep ? <FiChevronRight size={14} /> : undefined}
                  iconPosition="right"
                >
                  {isLastStep ? 'Finish' : 'Next'}
                </PillButton>
              </Flex>
            </Flex>
          </Box>
        </Box>
      </Box>
    </>
  )
}
