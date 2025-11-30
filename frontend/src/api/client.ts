/**
 * API client for Climate Data Visualization backend
 */
import axios, { AxiosError } from 'axios'
import type {
  Station,
  MonthlyDataResponse,
  AnnualDataResponse,
  AnalyticsResponse,
  AIInsightsResponse,
  AIAskResponse,
} from '../types'

// API base URL - uses Vite proxy in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Error handling
export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail: string }>) => {
    const status = error.response?.status ?? 500
    const detail = error.response?.data?.detail ?? 'An unexpected error occurred'
    throw new ApiError(status, detail)
  }
)

// API Methods
export async function getStations(): Promise<Station[]> {
  const response = await apiClient.get<Station[]>('/stations')
  return response.data
}

export interface DataQueryParams {
  stations: string[]
  yearFrom?: number | null
  yearTo?: number | null
}

export async function getMonthlyData(
  params: DataQueryParams
): Promise<MonthlyDataResponse> {
  const queryParams = new URLSearchParams({
    stations: params.stations.join(','),
  })

  if (params.yearFrom) {
    queryParams.set('year_from', params.yearFrom.toString())
  }
  if (params.yearTo) {
    queryParams.set('year_to', params.yearTo.toString())
  }

  const response = await apiClient.get<MonthlyDataResponse>(
    `/data/monthly?${queryParams.toString()}`
  )
  return response.data
}

export async function getAnnualData(
  params: DataQueryParams
): Promise<AnnualDataResponse> {
  const queryParams = new URLSearchParams({
    stations: params.stations.join(','),
  })

  if (params.yearFrom) {
    queryParams.set('year_from', params.yearFrom.toString())
  }
  if (params.yearTo) {
    queryParams.set('year_to', params.yearTo.toString())
  }

  const response = await apiClient.get<AnnualDataResponse>(
    `/data/annual?${queryParams.toString()}`
  )
  return response.data
}

export async function getAnalytics(
  params: DataQueryParams
): Promise<AnalyticsResponse> {
  const queryParams = new URLSearchParams({
    stations: params.stations.join(','),
  })

  if (params.yearFrom) {
    queryParams.set('year_from', params.yearFrom.toString())
  }
  if (params.yearTo) {
    queryParams.set('year_to', params.yearTo.toString())
  }

  const response = await apiClient.get<AnalyticsResponse>(
    `/analytics?${queryParams.toString()}`
  )
  return response.data
}

export async function healthCheck(): Promise<{ status: string }> {
  const response = await apiClient.get<{ status: string }>('/health')
  return response.data
}

// AI API Methods

export interface AIInsightsParams {
  stations: string[]
  yearFrom?: number | null
  yearTo?: number | null
}

export async function getAIInsights(
  params: AIInsightsParams
): Promise<AIInsightsResponse> {
  const response = await apiClient.post<AIInsightsResponse>('/ai/insights', {
    station_ids: params.stations,
    year_from: params.yearFrom,
    year_to: params.yearTo,
  })
  return response.data
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function askGrok(
  question: string,
  params: AIInsightsParams,
  conversationHistory?: ChatMessage[]
): Promise<AIAskResponse> {
  const response = await apiClient.post<AIAskResponse>('/ai/ask', {
    question,
    station_ids: params.stations,
    year_from: params.yearFrom,
    year_to: params.yearTo,
    conversation_history: conversationHistory || [],
  })
  return response.data
}
