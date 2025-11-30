/**
 * React Query hooks for AI-powered insights
 *
 * These hooks follow the same patterns as useClimateData.ts
 * for consistency across the codebase.
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAIInsights,
  askGrok,
  type AIInsightsParams,
} from '../api/client'
import type { AIInsightsResponse, AIAskResponse } from '../types'

// Query key factory for cache management
export const aiQueryKeys = {
  insights: (params: AIInsightsParams) => ['aiInsights', params] as const,
  questions: () => ['aiQuestions'] as const,
}

/**
 * Hook to fetch AI-generated insights
 *
 * Unlike other data hooks, this is on-demand (not auto-fetch)
 * to avoid unnecessary API calls and costs.
 *
 * @param stations - Array of station IDs to analyze
 * @param yearFrom - Start year filter
 * @param yearTo - End year filter
 * @param enabled - Whether to fetch (default: false for on-demand)
 */
export function useAIInsights(
  stations: string[],
  yearFrom: number | null,
  yearTo: number | null,
  enabled: boolean = false
) {
  const params: AIInsightsParams = {
    stations,
    yearFrom,
    yearTo,
  }

  return useQuery<AIInsightsResponse, Error>({
    queryKey: aiQueryKeys.insights(params),
    queryFn: () => getAIInsights(params),
    enabled: enabled && stations.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes - insights don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    retry: 1, // Only retry once for AI calls
  })
}

/**
 * Hook for manually triggering AI insights generation
 *
 * Use this when you want to generate insights on button click
 * rather than automatically.
 */
export function useGenerateInsights() {
  const queryClient = useQueryClient()

  return useMutation<AIInsightsResponse, Error, AIInsightsParams>({
    mutationFn: (params: AIInsightsParams) => getAIInsights(params),
    onSuccess: (data, params) => {
      // Cache the result for future use
      queryClient.setQueryData(aiQueryKeys.insights(params), data)
    },
  })
}

/**
 * Hook for asking questions about the data
 *
 * Uses mutation pattern since each question is unique
 * and we want to track loading/error states per question.
 */
export function useAskGrok(params: AIInsightsParams) {
  return useMutation<AIAskResponse, Error, string>({
    mutationFn: (question: string) => askGrok(question, params),
    retry: 1,
  })
}

/**
 * Combined hook for AI features
 *
 * Provides a convenient interface for components that need
 * both insights and Q&A functionality.
 */
export function useAI(
  stations: string[],
  yearFrom: number | null,
  yearTo: number | null
) {
  const params: AIInsightsParams = {
    stations,
    yearFrom,
    yearTo,
  }

  const generateInsights = useGenerateInsights()
  const askQuestion = useAskGrok(params)

  return {
    // Insights
    insights: generateInsights.data?.insights ?? [],
    isGeneratingInsights: generateInsights.isPending,
    insightsError: generateInsights.error,
    generateInsights: () => generateInsights.mutate(params),

    // Q&A
    lastAnswer: askQuestion.data?.answer ?? null,
    isAskingQuestion: askQuestion.isPending,
    askError: askQuestion.error,
    askQuestion: (question: string) => askQuestion.mutate(question),

    // Combined state
    isLoading: generateInsights.isPending || askQuestion.isPending,
    hasInsights: (generateInsights.data?.insights?.length ?? 0) > 0,
  }
}
