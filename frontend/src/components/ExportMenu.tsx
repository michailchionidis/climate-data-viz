/**
 * Export menu component for downloading chart data and images
 * Supports CSV and PNG export formats
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { Box, Text, Button, Flex } from '@chakra-ui/react'
import { DownloadIcon, ImageIcon, FileSpreadsheetIcon, ChevronDownIcon } from './ui/Icons'
import { useTheme } from '../context/ThemeContext'
import type { MonthlyDataResponse, AnnualDataResponse, VisualizationMode } from '../types'

interface ExportMenuProps {
  monthlyData: MonthlyDataResponse | undefined
  annualData: AnnualDataResponse | undefined
  mode: VisualizationMode
  disabled?: boolean
  chartRef?: React.RefObject<HTMLDivElement>
}

export function ExportMenu({
  monthlyData,
  annualData,
  mode,
  disabled = false,
  chartRef,
}: ExportMenuProps) {
  const { colors, colorMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const exportToCSV = useCallback(() => {
    setIsExporting(true)
    setIsOpen(false)

    try {
      const rows: string[][] = []
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `climate_data_${mode}_${timestamp}.csv`

      if (mode === 'monthly' && monthlyData) {
        // Header row
        rows.push(['Station ID', 'Station Name', 'Year', 'Month', 'Temperature (°C)'])

        // Data rows
        monthlyData.stations.forEach((station) => {
          station.data.forEach((point) => {
            rows.push([
              station.station_id,
              station.station_name,
              String(point.year),
              String(point.month),
              point.temperature !== null ? String(point.temperature) : ''
            ])
          })
        })
      } else if (mode === 'annual' && annualData) {
        // Header row
        rows.push([
          'Station ID',
          'Station Name',
          'Year',
          'Mean (°C)',
          'Std Dev',
          'Min (°C)',
          'Max (°C)',
          'Lower Bound (Mean-σ)',
          'Upper Bound (Mean+σ)'
        ])

        // Data rows
        annualData.stations.forEach((station) => {
          station.data.forEach((point) => {
            rows.push([
              station.station_id,
              station.station_name,
              String(point.year),
              point.mean.toFixed(2),
              point.std.toFixed(2),
              point.min_temp.toFixed(2),
              point.max_temp.toFixed(2),
              point.lower_bound.toFixed(2),
              point.upper_bound.toFixed(2)
            ])
          })
        })
      }

      // Convert to CSV with proper escaping
      const csvContent = rows.map(row =>
        row.map(cell => {
          // Escape cells that contain commas, quotes, or newlines
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`
          }
          return cell
        }).join(',')
      ).join('\n')

      // Add BOM for Excel UTF-8 compatibility
      const BOM = '\uFEFF'
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('CSV Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [mode, monthlyData, annualData])

  const exportToPNG = useCallback(async () => {
    setIsExporting(true)
    setIsOpen(false)

    try {
      // Find the Plotly chart element - it has the Plotly methods attached
      const plotElement = chartRef?.current?.querySelector('.js-plotly-plot')

      if (plotElement) {
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `climate_chart_${mode}_${timestamp}`

        // Access Plotly from the plot element's _fullLayout which has reference to Plotly
        // Or trigger the camera button click programmatically
        const cameraButton = chartRef?.current?.querySelector('[data-title="Download plot as a png"]') as HTMLElement | null

        if (cameraButton) {
          // Simply click the existing camera button
          cameraButton.click()
        } else {
          // Fallback: Use html2canvas approach or SVG export
          const svgElement = plotElement.querySelector('svg.main-svg')
          if (svgElement) {
            const svgData = new XMLSerializer().serializeToString(svgElement)
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
            const url = URL.createObjectURL(svgBlob)

            // Create an image from SVG
            const img = new Image()
            img.onload = () => {
              const canvas = document.createElement('canvas')
              canvas.width = 1920
              canvas.height = 1080
              const ctx = canvas.getContext('2d')
              if (ctx) {
                ctx.fillStyle = '#0a0a0f'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                  if (blob) {
                    const link = document.createElement('a')
                    link.href = URL.createObjectURL(blob)
                    link.download = `${filename}.png`
                    link.click()
                    URL.revokeObjectURL(link.href)
                  }
                }, 'image/png')
              }
              URL.revokeObjectURL(url)
            }
            img.src = url
          } else {
            console.error('No SVG element found in chart')
          }
        }
      } else {
        console.error('Chart element not found')
      }
    } catch (error) {
      console.error('PNG Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [mode, chartRef])

  const hasData = mode === 'monthly' ? !!monthlyData : !!annualData

  return (
    <Box position="relative" ref={menuRef}>
      <Button
        size="sm"
        bg={colors.buttonBg}
        color={colors.textSecondary}
        borderWidth="1px"
        borderColor={colors.border}
        borderRadius="8px"
        _hover={{
          bg: colors.buttonHover,
          borderColor: colors.borderHover,
        }}
        _active={{
          bg: colors.buttonHover,
        }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || !hasData || isExporting}
        display="flex"
        gap={1.5}
        px={3}
      >
        <DownloadIcon size="sm" />
        <Text fontSize="xs">
          {isExporting ? 'Exporting...' : 'Export'}
        </Text>
        <ChevronDownIcon size="xs" />
      </Button>

      {/* Dropdown menu */}
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          right={0}
          mt={1}
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderWidth="1px"
          borderColor={colors.border}
          borderRadius="8px"
          boxShadow="lg"
          zIndex={100}
          minW="160px"
          overflow="hidden"
        >
          <Flex
            as="button"
            w="full"
            align="center"
            gap={2}
            px={3}
            py={2}
            bg="transparent"
            color={colors.text}
            fontSize="sm"
            cursor="pointer"
            _hover={{ bg: colors.buttonHover }}
            onClick={exportToCSV}
          >
            <FileSpreadsheetIcon size="sm" />
            <Text>Export CSV</Text>
          </Flex>
          <Flex
            as="button"
            w="full"
            align="center"
            gap={2}
            px={3}
            py={2}
            bg="transparent"
            color={colors.text}
            fontSize="sm"
            cursor="pointer"
            _hover={{ bg: colors.buttonHover }}
            onClick={exportToPNG}
          >
            <ImageIcon size="sm" />
            <Text>Export PNG</Text>
          </Flex>
        </Box>
      )}
    </Box>
  )
}
