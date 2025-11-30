/**
 * Tour Tooltip Component
 * Displays step content with spotlight effect on target element
 */
import { useEffect, useState, useRef } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { useTour, TourStep } from './TourContext'
import { useTheme } from '../../context/ThemeContext'

interface TargetRect {
  top: number
  left: number
  width: number
  height: number
  bottom: number
  right: number
}

function getTargetRect(target: string): TargetRect | null {
  // Try ID first, then CSS selector
  let element = document.getElementById(target)
  if (!element) {
    element = document.querySelector(target)
  }
  if (!element) return null

  // Use getBoundingClientRect for viewport-relative coordinates
  // This works correctly with position: fixed overlays
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right,
  }
}

function getTooltipPosition(
  targetRect: TargetRect | null,
  placement: TourStep['placement'] = 'bottom',
  tooltipWidth: number = 360,
  tooltipHeight: number = 200
): { top: number; left: number } {
  // Center placement (for welcome-like steps)
  if (!targetRect || placement === 'center') {
    return {
      top: window.innerHeight / 2 - tooltipHeight / 2,
      left: window.innerWidth / 2 - tooltipWidth / 2,
    }
  }

  const padding = 16
  const arrowOffset = 12

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

export function TourTooltip() {
  const { isOpen, currentStep, steps, nextStep, prevStep, endTour } = useTour()
  const { colors } = useTheme()
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  const step = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  // Update target rect and tooltip position
  useEffect(() => {
    if (!isOpen || !step) return

    const updatePosition = () => {
      const rect = getTargetRect(step.target)
      setTargetRect(rect)

      const tooltipHeight = tooltipRef.current?.offsetHeight || 200
      const pos = getTooltipPosition(rect, step.placement, 360, tooltipHeight)
      setTooltipPos(pos)

      // Scroll target into view if needed
      if (rect && step.spotlight !== false) {
        const element = document.getElementById(step.target) || document.querySelector(step.target)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    updatePosition()

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

      {/* Spotlight border glow */}
      {targetRect && step.spotlight !== false && (
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
        left={`${tooltipPos.left}px`}
        width="360px"
        maxW="calc(100vw - 32px)"
        bg={colors.cardSolid}
        borderRadius="16px"
        border="1px solid"
        borderColor={colors.border}
        boxShadow={`0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px ${colors.accentCyanGlow}`}
        zIndex={10000}
        overflow="hidden"
        transition="top 0.3s ease, left 0.3s ease"
        role="dialog"
        aria-modal="true"
        aria-label={`Tour step ${currentStep + 1} of ${steps.length}: ${step.title}`}
      >
        {/* Progress bar */}
        <Box h="3px" bg={colors.bg}>
          <Box
            h="100%"
            w={`${progress}%`}
            bg={`linear-gradient(90deg, ${colors.accentCyan}, ${colors.accentPurple})`}
            transition="width 0.3s ease"
          />
        </Box>

        {/* Content */}
        <Box p="5">
          {/* Header */}
          <Flex justify="space-between" align="center" mb="3">
            <Text
              fontSize="lg"
              fontWeight="700"
              color={colors.text}
              fontFamily="heading"
            >
              {step.title}
            </Text>
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

          {/* Footer */}
          <Flex justify="space-between" align="center">
            {/* Step indicator */}
            <Text fontSize="xs" color={colors.textMuted}>
              {currentStep + 1} of {steps.length}
            </Text>

            {/* Navigation */}
            <Flex gap="2">
              {!isFirstStep && (
                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  gap="1"
                  px="3"
                  py="1.5"
                  borderRadius="md"
                  fontSize="sm"
                  color={colors.textSecondary}
                  cursor="pointer"
                  onClick={prevStep}
                  _hover={{ color: colors.text, bg: colors.buttonHover }}
                  transition="all 0.15s"
                >
                  <FiChevronLeft size={14} />
                  Back
                </Box>
              )}
              <Box
                as="button"
                display="flex"
                alignItems="center"
                gap="1"
                px="4"
                py="1.5"
                borderRadius="md"
                fontSize="sm"
                fontWeight="600"
                bg={colors.accentCyan}
                color="white"
                cursor="pointer"
                onClick={nextStep}
                _hover={{ opacity: 0.9, transform: 'translateY(-1px)' }}
                transition="all 0.15s"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <FiChevronRight size={14} />}
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </>
  )
}
