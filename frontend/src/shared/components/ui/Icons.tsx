/**
 * Professional icon components using react-icons
 * Using Lucide icons for clean, modern look
 */
import { Box, type BoxProps } from '@chakra-ui/react'
import {
  LuThermometer,
  LuThermometerSun,
  LuThermometerSnowflake,
  LuChartBar,
  LuTrendingUp,
  LuTrendingDown,
  LuCalendar,
  LuCalendarDays,
  LuFlame,
  LuSnowflake,
  LuDownload,
  LuSearch,
  LuCheck,
  LuX,
  LuTriangleAlert,
  LuInfo,
  LuSettings,
  LuActivity,
  LuDatabase,
  LuMapPin,
  LuGlobe,
  LuZoomIn,
  LuZoomOut,
  LuRefreshCw,
  LuChevronDown,
  LuChevronUp,
  LuChevronLeft,
  LuChevronRight,
  LuMenu,
  LuSun,
  LuMoon,
  LuPercent,
  LuHash,
  LuClock,
  LuTarget,
  LuImage,
  LuFileText,
  LuFileSpreadsheet,
  LuPanelLeftClose,
} from 'react-icons/lu'
import {
  HiOutlinePresentationChartLine,
} from 'react-icons/hi'
import { TbTemperaturePlus, TbTemperatureMinus, TbChartLine } from 'react-icons/tb'

// Icon wrapper component for consistent sizing and styling
interface IconWrapperProps extends BoxProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

const sizeMap = {
  xs: '12px',
  sm: '14px',
  md: '18px',
  lg: '22px',
  xl: '28px',
}

function IconWrapper({ size = 'md', color, children, ...props }: IconWrapperProps & { children: React.ReactNode }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      color={color}
      css={{ '& svg': { width: sizeMap[size], height: sizeMap[size] } }}
      {...props}
    >
      {children}
    </Box>
  )
}

// Export individual icon components
export function ThermometerIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuThermometer />
    </IconWrapper>
  )
}

export function ThermometerHotIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuThermometerSun />
    </IconWrapper>
  )
}

export function ThermometerColdIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuThermometerSnowflake />
    </IconWrapper>
  )
}

export function TemperatureMinIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <TbTemperatureMinus />
    </IconWrapper>
  )
}

export function TemperatureMaxIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <TbTemperaturePlus />
    </IconWrapper>
  )
}

export function BarChartIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuChartBar />
    </IconWrapper>
  )
}

export function LineChartIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <TbChartLine />
    </IconWrapper>
  )
}

export function TrendingUpIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuTrendingUp />
    </IconWrapper>
  )
}

export function TrendingDownIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuTrendingDown />
    </IconWrapper>
  )
}

export function FlameIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuFlame />
    </IconWrapper>
  )
}

export function SnowflakeIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuSnowflake />
    </IconWrapper>
  )
}

export function DownloadIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuDownload />
    </IconWrapper>
  )
}

export function SearchIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuSearch />
    </IconWrapper>
  )
}

export function CheckIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuCheck />
    </IconWrapper>
  )
}

export function CloseIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuX />
    </IconWrapper>
  )
}

export function AlertIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuTriangleAlert />
    </IconWrapper>
  )
}

export function InfoIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuInfo />
    </IconWrapper>
  )
}

export function SettingsIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuSettings />
    </IconWrapper>
  )
}

export function ActivityIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuActivity />
    </IconWrapper>
  )
}

export function DatabaseIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuDatabase />
    </IconWrapper>
  )
}

export function MapPinIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuMapPin />
    </IconWrapper>
  )
}

export function GlobeIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuGlobe />
    </IconWrapper>
  )
}

export function ZoomInIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuZoomIn />
    </IconWrapper>
  )
}

export function ZoomOutIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuZoomOut />
    </IconWrapper>
  )
}

export function RefreshIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuRefreshCw />
    </IconWrapper>
  )
}

export function CalendarIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuCalendar />
    </IconWrapper>
  )
}

export function CalendarDaysIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuCalendarDays />
    </IconWrapper>
  )
}

export function ChevronDownIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuChevronDown />
    </IconWrapper>
  )
}

export function ChevronUpIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuChevronUp />
    </IconWrapper>
  )
}

export function ChevronLeftIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuChevronLeft />
    </IconWrapper>
  )
}

export function ChevronRightIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuChevronRight />
    </IconWrapper>
  )
}

export function MenuIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuMenu />
    </IconWrapper>
  )
}

export function SunIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuSun />
    </IconWrapper>
  )
}

export function MoonIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuMoon />
    </IconWrapper>
  )
}

export function PercentIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuPercent />
    </IconWrapper>
  )
}

export function HashIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuHash />
    </IconWrapper>
  )
}

export function ClockIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuClock />
    </IconWrapper>
  )
}

export function TargetIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuTarget />
    </IconWrapper>
  )
}

export function PresentationChartIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <HiOutlinePresentationChartLine />
    </IconWrapper>
  )
}

export function ImageIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuImage />
    </IconWrapper>
  )
}

export function FileTextIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuFileText />
    </IconWrapper>
  )
}

export function FileSpreadsheetIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuFileSpreadsheet />
    </IconWrapper>
  )
}

export function SidebarIcon({ size = 'md', color = 'currentColor', ...props }: IconWrapperProps) {
  return (
    <IconWrapper size={size} color={color} {...props}>
      <LuPanelLeftClose />
    </IconWrapper>
  )
}
