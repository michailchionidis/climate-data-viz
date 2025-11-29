/**
 * Export button component for downloading chart data as CSV
 */
import { useState, useCallback } from 'react'
import { Text, Button } from '@chakra-ui/react'
import { DownloadIcon } from './ui/Icons'
import { useTheme } from '../context/ThemeContext'
import type { MonthlyDataResponse, AnnualDataResponse, VisualizationMode } from '../types'

interface ExportButtonProps {
  monthlyData: MonthlyDataResponse | undefined
  annualData: AnnualDataResponse | undefined
  mode: VisualizationMode
  disabled?: boolean
}

export function ExportButton({
  monthlyData,
  annualData,
  mode,
  disabled = false,
}: ExportButtonProps) {
  const { colors } = useTheme()
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = useCallback(() => {
    setIsExporting(true)

    try {
      let csvContent = ''
      const filename = `climate_data_${mode}_${new Date().toISOString().split('T')[0]}.csv`

      if (mode === 'monthly' && monthlyData) {
        // Monthly data CSV
        csvContent = 'Station ID,Station Name,Year,Month,Temperature (°C)\n'

        monthlyData.stations.forEach((station) => {
          station.data.forEach((point) => {
            csvContent += `${station.station_id},"${station.station_name}",${point.year},${point.month},${point.temperature ?? ''}\n`
          })
        })
      } else if (mode === 'annual' && annualData) {
        // Annual data CSV
        csvContent =
          'Station ID,Station Name,Year,Mean (°C),Std Dev,Min (°C),Max (°C),Lower Bound (°C),Upper Bound (°C)\n'

        annualData.stations.forEach((station) => {
          station.data.forEach((point) => {
            csvContent += `${station.station_id},"${station.station_name}",${point.year},${point.mean.toFixed(2)},${point.std.toFixed(2)},${point.min_temp.toFixed(2)},${point.max_temp.toFixed(2)},${point.lower_bound.toFixed(2)},${point.upper_bound.toFixed(2)}\n`
          })
        })
      }

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
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
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }, [mode, monthlyData, annualData])

  const hasData = mode === 'monthly' ? !!monthlyData : !!annualData

  return (
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
      onClick={exportToCSV}
      disabled={disabled || !hasData || isExporting}
      display="flex"
      gap={2}
      px={3}
    >
      <DownloadIcon size="sm" />
      <Text fontSize="xs">
        {isExporting ? 'Exporting...' : 'Export CSV'}
      </Text>
    </Button>
  )
}
