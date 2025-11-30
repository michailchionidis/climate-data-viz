/**
 * Interactive chart panel using Plotly.js
 * Premium visualization with smooth animations and rich tooltips
 */
import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { Box, Text, Flex } from '@chakra-ui/react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import Plot from 'react-plotly.js'
import type { Data, Layout } from 'plotly.js'
import { Card, CardHeader, CardBody } from './ui/Card'
import { LoadingState } from './ui/LoadingState'
import { ExportMenu } from './ExportMenu'
import { LineChartIcon, InfoIcon } from './ui/Icons'
import { STATION_COLORS, getChartTheme } from '../theme'
import { useTheme } from '../context/ThemeContext'
import type { MonthlyDataResponse, AnnualDataResponse, VisualizationMode } from '../types'

interface ChartPanelProps {
  monthlyData: MonthlyDataResponse | undefined
  annualData: AnnualDataResponse | undefined
  mode: VisualizationMode
  showSigmaBounds: boolean
  isLoading: boolean
  selectedStations: string[]
  fillHeight?: boolean
  /** Used to trigger chart resize when container changes */
  containerKey?: string | number
}

export const ChartPanel = memo(function ChartPanel({
  monthlyData,
  annualData,
  mode,
  showSigmaBounds,
  isLoading,
  selectedStations,
  fillHeight = false,
  containerKey,
}: ChartPanelProps) {
  const { colorMode, colors } = useTheme()
  const chartTheme = getChartTheme(colorMode)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [revision, setRevision] = useState(0)
  const [isResizing, setIsResizing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const prevContainerKey = useRef(containerKey)

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
    // Trigger resize after animation
    setTimeout(() => {
      setRevision((r) => r + 1)
      window.dispatchEvent(new Event('resize'))
    }, 350)
  }, [])

  // Trigger chart re-render when container changes (e.g., sidebar collapse)
  useEffect(() => {
    if (containerKey !== undefined && prevContainerKey.current !== containerKey) {
      prevContainerKey.current = containerKey
      // Show brief loading state to force chart re-render with correct dimensions
      setIsResizing(true)
      const timer = setTimeout(() => {
        setIsResizing(false)
        setRevision((r) => r + 1)
        window.dispatchEvent(new Event('resize'))
      }, 350) // Match sidebar transition duration
      return () => clearTimeout(timer)
    }
  }, [containerKey])

  const cardHeight = fillHeight ? '100%' : 'auto'
  const chartMinHeight = fillHeight ? '400px' : '450px'

  // Track window width for responsive legend positioning
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Empty state - minimal, matches final layout structure
  if (selectedStations.length === 0) {
    return (
      <Card h={cardHeight} display="flex" flexDirection="column">
        <CardHeader showBorder={false}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={2}>
              <Box color={colors.textMuted}>
                <FiChevronDown size={14} />
              </Box>
              <Text
                fontSize={fillHeight ? 'xs' : 'sm'}
                fontWeight="600"
                color={colors.textSecondary}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Annual Averages
              </Text>
              <Text
                fontSize="2xs"
                color={colors.textMuted}
                fontFamily="mono"
                letterSpacing="0.02em"
              >
                —
              </Text>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody p={0} flex={1} display="flex" alignItems="center" justifyContent="center">
          <Flex direction="column" align="center" textAlign="center" py={8}>
            <LineChartIcon size="lg" color={colors.textMuted} />
            <Text fontSize="13px" fontWeight="500" color={colors.textSecondary} mt={3}>
              Select stations to visualize
            </Text>
            <Text fontSize="12px" color={colors.textMuted} mt={1}>
              Choose weather stations from the sidebar
            </Text>
          </Flex>
        </CardBody>
      </Card>
    )
  }

  // Loading state (data loading or resizing)
  if (isLoading || isResizing) {
    return (
      <Card h={cardHeight} display="flex" flexDirection="column">
        <CardBody p={0} flex={1} display="flex">
          <LoadingState
            message={isResizing ? 'Adjusting layout...' : 'Loading temperature data...'}
            minHeight={chartMinHeight}
            size="lg"
          />
        </CardBody>
      </Card>
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
        line: {
          color,
          width: 1.5,
          shape: 'spline',
        },
        hovertemplate:
          `<b style="color:${color}">${station.station_name}</b><br>` +
          `<b>Date:</b> %{x}<br>` +
          `<b>Temperature:</b> %{y:.1f}°C` +
          `<extra></extra>`,
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
          fillcolor: `${color}15`,
          showlegend: false,
          hoverinfo: 'skip',
        })
      }

      // Main mean line
      const yStd = station.data.map((d) => d.std)

      traces.push({
        type: 'scatter',
        mode: 'lines',
        name: station.station_name,
        x,
        y: yMean,
        customdata: yStd, // Pass std values for tooltip
        line: {
          color,
          width: 2.5,
          shape: 'spline',
        },
        hovertemplate: showSigmaBounds
          ? `<b style="color:${color}">${station.station_name}</b><br>` +
            `<b>Year:</b> %{x}<br>` +
            `<b>Mean:</b> %{y:.1f}°C<br>` +
            `<b>σ:</b> %{customdata:.2f}°C` +
            `<extra></extra>`
          : `<b style="color:${color}">${station.station_name}</b><br>` +
            `<b>Year:</b> %{x}<br>` +
            `<b>Mean:</b> %{y:.1f}°C` +
            `<extra></extra>`,
      })
    })
  }

  const layout: Partial<Layout> = {
    ...chartTheme,
    margin: isMobile
      ? { l: 50, r: 15, t: 15, b: 40 }  // Compact margins for mobile
      : { l: 60, r: 40, t: 20, b: 60 },
    xaxis: {
      ...chartTheme.xaxis,
      title: {
        text: mode === 'monthly' ? 'Date' : 'Year',
        font: { size: 12, color: '#a1a1aa' },
      },
      tickangle: mode === 'monthly' ? -45 : 0,
      nticks: mode === 'monthly' ? 15 : undefined,
      rangeslider: { visible: false },
    },
    yaxis: {
      ...chartTheme.yaxis,
      title: {
        text: 'Temperature (°C)',
        font: { size: 12, color: '#a1a1aa' },
      },
    },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'left',
      x: 0,
      font: { size: isMobile ? 10 : 11, color: colors.textSecondary },
      bgcolor: 'transparent',
      itemsizing: 'constant',
    },
    hovermode: 'x unified',
    dragmode: 'pan',
    hoverlabel: {
      bgcolor: colors.chartHoverBg,
      bordercolor: colors.border,
      font: {
        family: 'Inter, system-ui, sans-serif',
        size: 12,
        color: colors.text,
      },
    },
    transition: {
      duration: 300,
      easing: 'cubic-in-out',
    },
  }

  const config = {
    displayModeBar: false, // Hide modebar for cleaner xAI aesthetic
    displaylogo: false,
    responsive: true,
    scrollZoom: true,
  }

  const dataPointCount = mode === 'monthly'
    ? monthlyData?.total_points.toLocaleString()
    : `${annualData?.total_years} years`

  return (
    <Card h={isExpanded ? cardHeight : 'auto'} display="flex" flexDirection="column">
      <CardHeader
        py={fillHeight ? 2 : 3}
        flexShrink={0}
        cursor="pointer"
        onClick={toggleExpanded}
        _hover={{ bg: `${colors.accentCyan}05` }}
        transition="background 0.2s"
      >
        <Flex justify="space-between" align="center">
          <Flex align="center" gap={2}>
            {/* Expand/Collapse icon */}
            <Box color={colors.textMuted}>
              {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
            </Box>
            <Text
              fontSize={fillHeight ? 'xs' : 'sm'}
              fontWeight="600"
              color={colors.textSecondary}
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {mode === 'monthly' ? 'Monthly Temperature Data' : 'Annual Averages'}
            </Text>
            {/* Data count - inline with title */}
            <Text
              fontSize="2xs"
              color={colors.textMuted}
              fontFamily="mono"
              letterSpacing="0.02em"
            >
              {dataPointCount}
            </Text>
            {showSigmaBounds && mode === 'annual' && (
              <Text
                fontSize="2xs"
                color={colors.textMuted}
                fontFamily="mono"
                letterSpacing="0.02em"
              >
                ±1σ
              </Text>
            )}
          </Flex>
          <Flex align="center" gap={2} onClick={(e) => e.stopPropagation()}>
            {/* Export menu */}
            <ExportMenu
              monthlyData={monthlyData}
              annualData={annualData}
              mode={mode}
              chartRef={chartContainerRef}
            />
          </Flex>
        </Flex>
      </CardHeader>

      {isExpanded && (
        <>
          <Box ref={chartContainerRef} flex={1} minH={chartMinHeight} p={1}>
            <Plot
              data={traces}
              layout={{ ...layout, datarevision: revision }}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler
              revision={revision}
            />
          </Box>

          {/* Chart footer with tips - compact */}
          <Box
            px={3}
            py={1.5}
            borderTopWidth="1px"
            borderColor={colors.border}
            bg={colors.inputBg}
            flexShrink={0}
          >
            <Flex justify="space-between" align="center">
              <Flex align="center" gap={1.5}>
                <InfoIcon size="xs" color={colors.textMuted} />
                <Text fontSize="2xs" color={colors.textMuted}>
                  Drag to pan • Scroll to zoom • Double-click to reset
                </Text>
              </Flex>
              {selectedStations.length > 1 && (
                <Text fontSize="2xs" color={colors.textMuted}>
                  Click legend to toggle
                </Text>
              )}
            </Flex>
          </Box>
        </>
      )}
    </Card>
  )
})
