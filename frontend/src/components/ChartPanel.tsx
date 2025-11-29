/**
 * Interactive chart panel using Plotly.js
 */
import { Box, Text, Flex, Spinner } from '@chakra-ui/react'
import Plot from 'react-plotly.js'
import type { Data, Layout } from 'plotly.js'
import type { MonthlyDataResponse, AnnualDataResponse, VisualizationMode } from '../types'

// Color palette for different stations
const STATION_COLORS = [
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ef4444', // red
  '#ec4899', // pink
  '#3b82f6', // blue
  '#84cc16', // lime
  '#f97316', // orange
  '#14b8a6', // teal
]

interface ChartPanelProps {
  monthlyData: MonthlyDataResponse | undefined
  annualData: AnnualDataResponse | undefined
  mode: VisualizationMode
  showSigmaBounds: boolean
  isLoading: boolean
  selectedStations: string[]
}

export function ChartPanel({
  monthlyData,
  annualData,
  mode,
  showSigmaBounds,
  isLoading,
  selectedStations,
}: ChartPanelProps) {
  if (selectedStations.length === 0) {
    return (
      <Box
        h="500px"
        bg="whiteAlpha.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text fontSize="5xl" mb={4}>📈</Text>
        <Text color="gray.400" fontSize="lg">
          Select stations to visualize temperature data
        </Text>
        <Text color="gray.500" fontSize="sm" mt={2}>
          Choose one or more weather stations from the panel on the left
        </Text>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box
        h="500px"
        bg="whiteAlpha.50"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Spinner size="xl" color="cyan.400" />
        <Text color="gray.400" fontSize="sm" mt={4}>
          Loading temperature data...
        </Text>
      </Box>
    )
  }

  // Build chart traces based on mode
  const traces: Data[] = []

  if (mode === 'monthly' && monthlyData) {
    monthlyData.stations.forEach((station, idx) => {
      const color = STATION_COLORS[idx % STATION_COLORS.length]

      // Convert to x-axis labels (year-month)
      const x = station.data.map((d) => `${d.year}-${String(d.month).padStart(2, '0')}`)
      const y = station.data.map((d) => d.temperature ?? NaN)

      traces.push({
        type: 'scatter',
        mode: 'lines',
        name: station.station_name,
        x,
        y,
        line: { color, width: 1.5 },
        hovertemplate: `<b>${station.station_name}</b><br>%{x}<br>Temperature: %{y:.1f}°C<extra></extra>`,
      })
    })
  } else if (mode === 'annual' && annualData) {
    annualData.stations.forEach((station, idx) => {
      const color = STATION_COLORS[idx % STATION_COLORS.length]

      const x = station.data.map((d) => d.year)
      const yMean = station.data.map((d) => d.mean)
      const yUpper = station.data.map((d) => d.upper_bound)
      const yLower = station.data.map((d) => d.lower_bound)

      // If showing sigma bounds, add the shaded region
      if (showSigmaBounds) {
        // Upper bound (invisible line for fill)
        traces.push({
          type: 'scatter',
          mode: 'lines',
          name: `${station.station_name} +1σ`,
          x,
          y: yUpper,
          line: { width: 0 },
          showlegend: false,
          hoverinfo: 'skip',
        })

        // Lower bound with fill to previous trace
        traces.push({
          type: 'scatter',
          mode: 'lines',
          name: `${station.station_name} ±1σ`,
          x,
          y: yLower,
          line: { width: 0 },
          fill: 'tonexty',
          fillcolor: `${color}20`,
          showlegend: true,
          hoverinfo: 'skip',
        })
      }

      // Main mean line
      traces.push({
        type: 'scatter',
        mode: 'lines',
        name: station.station_name,
        x,
        y: yMean,
        line: { color, width: 2 },
        hovertemplate: `<b>${station.station_name}</b><br>Year: %{x}<br>Mean: %{y:.1f}°C<extra></extra>`,
      })
    })
  }

  const layout: Partial<Layout> = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    font: {
      family: 'Outfit, system-ui, sans-serif',
      color: '#a1a1aa',
    },
    margin: { l: 60, r: 30, t: 30, b: 60 },
    xaxis: {
      title: { text: mode === 'monthly' ? 'Date' : 'Year' },
      gridcolor: 'rgba(255,255,255,0.05)',
      linecolor: 'rgba(255,255,255,0.1)',
      tickfont: { size: 11 },
      tickangle: mode === 'monthly' ? -45 : 0,
      nticks: mode === 'monthly' ? 20 : undefined,
    },
    yaxis: {
      title: { text: 'Temperature (°C)' },
      gridcolor: 'rgba(255,255,255,0.05)',
      linecolor: 'rgba(255,255,255,0.1)',
      tickfont: { size: 11 },
      zeroline: true,
      zerolinecolor: 'rgba(255,255,255,0.2)',
    },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1,
      font: { size: 11 },
      bgcolor: 'transparent',
    },
    hovermode: 'x unified',
    dragmode: 'zoom',
  }

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'] as any,
    responsive: true,
  }

  return (
    <Box
      bg="whiteAlpha.50"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
      overflow="hidden"
    >
      <Flex
        justify="space-between"
        align="center"
        px={4}
        py={3}
        borderBottomWidth="1px"
        borderColor="whiteAlpha.100"
      >
        <Text fontSize="sm" fontWeight="600" color="gray.300" textTransform="uppercase" letterSpacing="wide">
          {mode === 'monthly' ? 'Monthly Temperature Data' : 'Annual Averages'}
          {showSigmaBounds && mode === 'annual' && ' (with ±1σ)'}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {mode === 'monthly'
            ? `${monthlyData?.total_points.toLocaleString()} data points`
            : `${annualData?.total_years} years`
          }
        </Text>
      </Flex>

      <Box h="450px" p={2}>
        <Plot
          data={traces}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </Box>
    </Box>
  )
}
