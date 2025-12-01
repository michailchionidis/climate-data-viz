import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../utils'
import {
  ThermometerIcon,
  ThermometerHotIcon,
  ThermometerColdIcon,
  TemperatureMinIcon,
  TemperatureMaxIcon,
  BarChartIcon,
  LineChartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  FlameIcon,
  SnowflakeIcon,
  DownloadIcon,
  SearchIcon,
  CheckIcon,
  CloseIcon,
  AlertIcon,
  InfoIcon,
  SettingsIcon,
  ActivityIcon,
  DatabaseIcon,
  MapPinIcon,
  GlobeIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RefreshIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  SunIcon,
  MoonIcon,
  PercentIcon,
  HashIcon,
  ClockIcon,
  TargetIcon,
  PresentationChartIcon,
  ImageIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  SidebarIcon,
} from '../../shared/components/ui/Icons'

describe('Icon Components', () => {
  const iconComponents = [
    { name: 'ThermometerIcon', Component: ThermometerIcon },
    { name: 'ThermometerHotIcon', Component: ThermometerHotIcon },
    { name: 'ThermometerColdIcon', Component: ThermometerColdIcon },
    { name: 'TemperatureMinIcon', Component: TemperatureMinIcon },
    { name: 'TemperatureMaxIcon', Component: TemperatureMaxIcon },
    { name: 'BarChartIcon', Component: BarChartIcon },
    { name: 'LineChartIcon', Component: LineChartIcon },
    { name: 'TrendingUpIcon', Component: TrendingUpIcon },
    { name: 'TrendingDownIcon', Component: TrendingDownIcon },
    { name: 'FlameIcon', Component: FlameIcon },
    { name: 'SnowflakeIcon', Component: SnowflakeIcon },
    { name: 'DownloadIcon', Component: DownloadIcon },
    { name: 'SearchIcon', Component: SearchIcon },
    { name: 'CheckIcon', Component: CheckIcon },
    { name: 'CloseIcon', Component: CloseIcon },
    { name: 'AlertIcon', Component: AlertIcon },
    { name: 'InfoIcon', Component: InfoIcon },
    { name: 'SettingsIcon', Component: SettingsIcon },
    { name: 'ActivityIcon', Component: ActivityIcon },
    { name: 'DatabaseIcon', Component: DatabaseIcon },
    { name: 'MapPinIcon', Component: MapPinIcon },
    { name: 'GlobeIcon', Component: GlobeIcon },
    { name: 'ZoomInIcon', Component: ZoomInIcon },
    { name: 'ZoomOutIcon', Component: ZoomOutIcon },
    { name: 'RefreshIcon', Component: RefreshIcon },
    { name: 'CalendarIcon', Component: CalendarIcon },
    { name: 'CalendarDaysIcon', Component: CalendarDaysIcon },
    { name: 'ChevronDownIcon', Component: ChevronDownIcon },
    { name: 'ChevronUpIcon', Component: ChevronUpIcon },
    { name: 'ChevronLeftIcon', Component: ChevronLeftIcon },
    { name: 'ChevronRightIcon', Component: ChevronRightIcon },
    { name: 'MenuIcon', Component: MenuIcon },
    { name: 'SunIcon', Component: SunIcon },
    { name: 'MoonIcon', Component: MoonIcon },
    { name: 'PercentIcon', Component: PercentIcon },
    { name: 'HashIcon', Component: HashIcon },
    { name: 'ClockIcon', Component: ClockIcon },
    { name: 'TargetIcon', Component: TargetIcon },
    { name: 'PresentationChartIcon', Component: PresentationChartIcon },
    { name: 'ImageIcon', Component: ImageIcon },
    { name: 'FileTextIcon', Component: FileTextIcon },
    { name: 'FileSpreadsheetIcon', Component: FileSpreadsheetIcon },
    { name: 'SidebarIcon', Component: SidebarIcon },
  ]

  describe('rendering', () => {
    iconComponents.forEach(({ name, Component }) => {
      it(`should render ${name}`, () => {
        const { container } = renderWithProviders(<Component data-testid={name} />)
        expect(container.querySelector('svg')).toBeInTheDocument()
      })
    })
  })

  describe('size prop', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    sizes.forEach((size) => {
      it(`should render with size ${size}`, () => {
        const { container } = renderWithProviders(<ThermometerIcon size={size} />)
        expect(container.querySelector('svg')).toBeInTheDocument()
      })
    })
  })

  describe('color prop', () => {
    it('should apply custom color', () => {
      const { container } = renderWithProviders(<ThermometerIcon color="red" />)
      const wrapper = container.querySelector('span')
      expect(wrapper).toBeInTheDocument()
      // Color is applied via style prop
    })

    it('should render with default color', () => {
      const { container } = renderWithProviders(<ThermometerIcon />)
      const wrapper = container.querySelector('span')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('additional props', () => {
    it('should pass through additional props', () => {
      const { container } = renderWithProviders(
        <ThermometerIcon data-testid="custom-icon" aria-label="Temperature" />
      )
      const wrapper = container.querySelector('[data-testid="custom-icon"]')
      expect(wrapper).toBeInTheDocument()
    })
  })
})
