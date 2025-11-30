/**
 * Tour Tooltip Component
 * Displays step content with spotlight effect on target element
 * xAI-level minimal design
 */
import { useEffect, useState, useRef } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { FiX } from 'react-icons/fi'
import { useTour, TourStep } from './TourContext'
import { useTheme } from '@/context/ThemeContext'
import { PillButton } from '@/shared/components/ui'

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
  bottom: number
  right: number
}

function getTargetRect(target: string): TargetRect | null {
  const elements = document.querySelectorAll(`#${target}, ${target}`)

  for (const element of elements) {
    const rect = element.getBoundingClientRect()
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
  tooltipWidth: number = 320,
  tooltipHeight: number = 180,
  isMobile: boolean = false
): { top: number; left: number } {
  if (isMobile || !targetRect || placement === 'center') {
    const actualWidth = isMobile ? Math.min(tooltipWidth, window.innerWidth - 32) : tooltipWidth
    return {
      top: Math.max(80, window.innerHeight / 2 - tooltipHeight / 2),
      left: window.innerWidth / 2 - actualWidth / 2,
    }
  }

  const padding = 16
  const arrowOffset = 16

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

  const maxLeft = window.innerWidth - tooltipWidth - padding
  const maxTop = window.innerHeight - tooltipHeight - padding

  left = Math.max(padding, Math.min(left, maxLeft))
  top = Math.max(padding, Math.min(top, maxTop))

  return { top, left }
}

// Step dot component - minimal monochrome
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
  colors: { text: string; textMuted: string; border: string }
}) {
  return (
    <Box
      as="button"
      w="6px"
      h="6px"
      borderRadius="full"
      bg={isActive ? colors.text : isCompleted ? colors.textMuted : colors.border}
      cursor="pointer"
      transition="all 0.2s ease"
      onClick={onClick}
      aria-label={`Go to step ${index + 1}`}
      _hover={{
        transform: 'scale(1.4)',
        bg: colors.text,
      }}
    />
  )
}

export function TourTooltip() {
  const { isOpen, currentStep, steps, nextStep, prevStep, endTour, goToStep } = useTour()
  const { colors, colorMode } = useTheme()
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  useEffect(() => {
    if (!isOpen || !step) return

    const updatePosition = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      const rect = mobile ? null : getTargetRect(step.target)
      setTargetRect(rect)

      const tooltipHeight = tooltipRef.current?.offsetHeight || 180
      const pos = getTooltipPosition(rect, step.placement, 320, tooltipHeight, mobile)
      setTooltipPos(pos)
    }

    updatePosition()

    const mobile = window.innerWidth < 768
    if (!mobile && step.spotlight !== false) {
      const elements = document.querySelectorAll(`#${step.target}, ${step.target}`)
      for (const el of elements) {
        const elRect = el.getBoundingClientRect()
        if (elRect.width > 0 && elRect.height > 0) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          setTimeout(updatePosition, 350)
          break
        }
      }
    }

    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [isOpen, step, currentStep])

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
        bg="rgba(0, 0, 0, 0.8)"
        style={{
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

      {/* Spotlight border - minimal, no glow */}
      {!isMobile && targetRect && step.spotlight !== false && (
        <Box
          position="fixed"
          top={`${targetRect.top - 8}px`}
          left={`${targetRect.left - 8}px`}
          width={`${targetRect.width + 16}px`}
          height={`${targetRect.height + 16}px`}
          borderRadius="12px"
          border="1px solid"
          borderColor={colorMode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}
          zIndex={9999}
          pointerEvents="none"
          transition="all 0.3s ease"
        />
      )}

      {/* Click blocker */}
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
        width={isMobile ? 'calc(100vw - 32px)' : '320px'}
        maxW="calc(100vw - 32px)"
        bg={colors.cardSolid}
        borderRadius="12px"
        border="1px solid"
        borderColor={colors.border}
        boxShadow="0 20px 50px rgba(0, 0, 0, 0.4)"
        zIndex={10000}
        overflow="hidden"
        transition="top 0.3s ease, left 0.3s ease"
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${currentStep + 1} of ${steps.length}`}
      >
        {/* Content */}
        <Box p="4">
          {/* Header */}
          <Flex justify="space-between" align="center" mb="3">
            <Text
              fontSize="sm"
              fontWeight="600"
              color={colors.text}
              letterSpacing="-0.01em"
            >
              {step.title}
            </Text>
            <Box
              as="button"
              p="1"
              borderRadius="4px"
              color={colors.textMuted}
              cursor="pointer"
              onClick={() => endTour(false)}
              _hover={{ color: colors.text }}
              aria-label="Close tour"
            >
              <FiX size={16} />
            </Box>
          </Flex>

          {/* Body */}
          <Box
            fontSize="sm"
            color={colors.textMuted}
            lineHeight="1.6"
            mb="4"
          >
            {step.content}
          </Box>

          {/* Mobile hint */}
          {isMobile && (
            <Box
              bg={colorMode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
              borderRadius="6px"
              p="2"
              mb="3"
            >
              <Text fontSize="2xs" color={colors.textMuted} textAlign="center">
                View on desktop for interactive highlights
              </Text>
            </Box>
          )}

          {/* Footer */}
          <Flex justify="space-between" align="center">
            {/* Step dots */}
            <Flex gap="1.5" align="center">
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
                <Text
                  as="button"
                  fontSize="xs"
                  color={colors.textMuted}
                  cursor="pointer"
                  onClick={prevStep}
                  _hover={{ color: colors.text }}
                  bg="transparent"
                  border="none"
                  px="2"
                  letterSpacing="0.02em"
                >
                  Back
                </Text>
              )}
              <PillButton
                onClick={nextStep}
                variant="primary"
                size="xs"
              >
                {isLastStep ? 'Done' : 'Next'}
              </PillButton>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
