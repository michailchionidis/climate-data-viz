/**
 * Type definitions for Climate Data Visualization API
 */

// Station types
export interface Station {
  id: string
  name: string
}

// Monthly data types
export interface MonthlyDataPoint {
  year: number
  month: number
  temperature: number | null
}

export interface StationMonthlyData {
  station_id: string
  station_name: string
  data: MonthlyDataPoint[]
}

export interface MonthlyDataResponse {
  stations: StationMonthlyData[]
  total_points: number
}

// Annual data types
export interface AnnualDataPoint {
  year: number
  mean: number
  std: number
  min_temp: number
  max_temp: number
  upper_bound: number
  lower_bound: number
}

export interface StationAnnualData {
  station_id: string
  station_name: string
  data: AnnualDataPoint[]
}

export interface AnnualDataResponse {
  stations: StationAnnualData[]
  total_years: number
}

// Analytics types
export interface StationAnalytics {
  station_id: string
  station_name: string
  min_temp: number
  max_temp: number
  mean_temp: number
  std_temp: number
  coldest_year: number
  coldest_year_temp: number
  hottest_year: number
  hottest_year_temp: number
  data_coverage: number
}

export interface AnalyticsResponse {
  stations: StationAnalytics[]
  year_range: [number, number]
  total_stations: number
}

// UI State types
export type VisualizationMode = 'monthly' | 'annual'

export interface DataFilters {
  stations: string[]
  yearFrom: number | null
  yearTo: number | null
  mode: VisualizationMode
  showSigmaBounds: boolean
}

export interface ZoomState {
  centerYear: number | null
  windowSize: number // Years on each side
}

// Chart data types for Plotly
export interface PlotlyTrace {
  x: (string | number)[]
  y: number[]
  name: string
  type: 'scatter'
  mode: 'lines' | 'lines+markers'
  line?: {
    color?: string
    width?: number
    dash?: string
  }
  fill?: 'none' | 'toself' | 'tonexty'
  fillcolor?: string
  hovertemplate?: string
}

