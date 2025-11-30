/**
 * Tour Context - State management for the onboarding tour
 * Handles tour visibility, current step, and localStorage persistence
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'climate-explorer-tour-completed'
const STORAGE_VERSION = '1' // Increment to force re-show tour after major updates

export interface TourStep {
  id: string
  target: string // CSS selector or element ID
  title: string | React.ReactNode
  content: string | React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  spotlight?: boolean
  desktopOnly?: boolean // Hide this step on mobile devices
}

interface TourContextType {
  isOpen: boolean
  currentStep: number
  steps: TourStep[]
  startTour: () => void
  endTour: (completed?: boolean) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  skipTour: () => void
  showWelcome: boolean
  setShowWelcome: (show: boolean) => void
  hasCompletedTour: boolean
  resetTour: () => void
}

const TourContext = createContext<TourContextType | null>(null)

export function useTour() {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

// Check URL parameters for tour control
function checkUrlParams(): 'show' | 'hide' | 'reset' | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const tourParam = params.get('tour')
  if (tourParam === 'true') return 'show'
  if (tourParam === 'false') return 'hide'
  if (tourParam === 'reset') return 'reset'
  return null
}

// Check if tour has been completed
function getStoredCompletion(): boolean {
  if (typeof window === 'undefined') return false
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return false
  try {
    const data = JSON.parse(stored)
    return data.version === STORAGE_VERSION && data.completed === true
  } catch {
    return false
  }
}

// Save completion status
function setStoredCompletion(completed: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    version: STORAGE_VERSION,
    completed,
    timestamp: Date.now()
  }))
}

// Clear completion status
function clearStoredCompletion(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

interface TourProviderProps {
  children: React.ReactNode
  steps: TourStep[]
}

export function TourProvider({ children, steps }: TourProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [hasCompletedTour, setHasCompletedTour] = useState(true) // Default true to prevent flash
  const [isMobile, setIsMobile] = useState(false)

  // Filter steps based on device type
  const filteredSteps = isMobile
    ? steps.filter(step => !step.desktopOnly)
    : steps

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize on mount
  useEffect(() => {
    const urlParam = checkUrlParams()

    // Handle URL parameter reset
    if (urlParam === 'reset') {
      clearStoredCompletion()
      setHasCompletedTour(false)
      setShowWelcome(true)
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
      return
    }

    // Handle URL parameter override
    if (urlParam === 'show') {
      setHasCompletedTour(false)
      setShowWelcome(true)
      return
    }

    if (urlParam === 'hide') {
      setHasCompletedTour(true)
      setShowWelcome(false)
      return
    }

    // Check localStorage
    const completed = getStoredCompletion()
    setHasCompletedTour(completed)

    // Show welcome modal for first-time visitors
    if (!completed) {
      // Small delay to let the app render first
      const timer = setTimeout(() => {
        setShowWelcome(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const startTour = useCallback(() => {
    setShowWelcome(false)
    setCurrentStep(0)
    setIsOpen(true)
  }, [])

  const endTour = useCallback((completed = true) => {
    setIsOpen(false)
    setCurrentStep(0)
    if (completed) {
      setStoredCompletion(true)
      setHasCompletedTour(true)
    }
  }, [])

  const skipTour = useCallback(() => {
    setShowWelcome(false)
    setStoredCompletion(true)
    setHasCompletedTour(true)
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      endTour(true)
    }
  }, [currentStep, filteredSteps.length, endTour])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < filteredSteps.length) {
      setCurrentStep(step)
    }
  }, [filteredSteps.length])

  const resetTour = useCallback(() => {
    clearStoredCompletion()
    setHasCompletedTour(false)
    setIsOpen(false)
    setCurrentStep(0)
    setShowWelcome(true)
  }, [])

  return (
    <TourContext.Provider
      value={{
        isOpen,
        currentStep,
        steps: filteredSteps,
        startTour,
        endTour,
        nextStep,
        prevStep,
        goToStep,
        skipTour,
        showWelcome,
        setShowWelcome,
        hasCompletedTour,
        resetTour,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}
