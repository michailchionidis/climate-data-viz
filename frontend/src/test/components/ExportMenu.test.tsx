import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportMenu } from '../../features/visualization/components/ExportMenu'
import { renderWithProviders } from '../utils'
import type { MonthlyDataResponse, AnnualDataResponse } from '../../shared/types'

// Mock URL methods
const mockCreateObjectURL = vi.fn(() => 'blob:test')
const mockRevokeObjectURL = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  global.URL.createObjectURL = mockCreateObjectURL
  global.URL.revokeObjectURL = mockRevokeObjectURL
})

const mockMonthlyData: MonthlyDataResponse = {
  stations: [
    {
      station_id: '101234',
      station_name: 'Station 101234',
      data: [
        { year: 2019, month: 1, temperature: 5.5 },
        { year: 2019, month: 2, temperature: 7.2 },
      ],
    },
  ],
}

const mockAnnualData: AnnualDataResponse = {
  stations: [
    {
      station_id: '101234',
      station_name: 'Station 101234',
      data: [
        {
          year: 2019,
          mean: 12.5,
          std: 4.8,
          min_temp: 3.2,
          max_temp: 22.1,
          lower_bound: 7.7,
          upper_bound: 17.3,
        },
      ],
    },
  ],
}

describe('ExportMenu', () => {
  describe('rendering', () => {
    it('should render the export button', () => {
      renderWithProviders(
        <ExportMenu
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
        />
      )

      expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument()
    })

    it('should be disabled when no data', () => {
      renderWithProviders(
        <ExportMenu
          monthlyData={undefined}
          annualData={undefined}
          mode="annual"
        />
      )

      expect(screen.getByRole('button', { name: /Export/i })).toHaveAttribute('aria-disabled', 'true')
    })

    it('should be disabled when disabled prop is true', () => {
      renderWithProviders(
        <ExportMenu
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
          disabled
        />
      )

      expect(screen.getByRole('button', { name: /Export/i })).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('dropdown menu', () => {
    it('should open dropdown when clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <ExportMenu
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      expect(screen.getByText('CSV')).toBeInTheDocument()
      expect(screen.getByText('PNG')).toBeInTheDocument()
    })

    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <ExportMenu
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))
      expect(screen.getByText('CSV')).toBeInTheDocument()

      // Click outside
      fireEvent.mouseDown(document.body)

      expect(screen.queryByText('CSV')).not.toBeInTheDocument()
    })
  })

  describe('CSV export', () => {
    it('should open dropdown and show CSV option', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <ExportMenu
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))

      expect(screen.getByText('CSV')).toBeInTheDocument()
    })

    it('should export monthly data in CSV format', async () => {
      const user = userEvent.setup()

      const mockLink = {
        setAttribute: vi.fn(),
        click: vi.fn(),
        style: { visibility: '' },
      }
      const originalCreateElement = document.createElement.bind(document)
      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'a') return mockLink as unknown as HTMLAnchorElement
        return originalCreateElement(tag)
      })

      renderWithProviders(
        <ExportMenu
          monthlyData={mockMonthlyData}
          annualData={undefined}
          mode="monthly"
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))
      await user.click(screen.getByText('CSV'))

      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('climate_data_monthly'))
    })
  })

  describe('PNG export', () => {
    it('should attempt PNG export when PNG option is clicked', async () => {
      const user = userEvent.setup()
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      renderWithProviders(
        <ExportMenu
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
        />
      )

      await user.click(screen.getByRole('button', { name: /Export/i }))
      await user.click(screen.getByText('PNG'))

      // Since there's no actual chart, it should log an error
      expect(consoleError).toHaveBeenCalledWith('Chart element not found')

      consoleError.mockRestore()
    })
  })

  describe('with chartRef', () => {
    it('should accept chartRef prop', () => {
      const chartRef = { current: document.createElement('div') }

      renderWithProviders(
        <ExportMenu
          monthlyData={undefined}
          annualData={mockAnnualData}
          mode="annual"
          chartRef={chartRef}
        />
      )

      expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument()
    })
  })
})
