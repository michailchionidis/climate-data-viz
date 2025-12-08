/**
 * Tests for station color utilities
 * Ensures stable color assignment based on station ID
 */
import { describe, it, expect } from 'vitest'
import { getStationColor, STATION_COLORS } from '../../theme'

describe('getStationColor', () => {
  describe('color consistency', () => {
    it('should return the same color for the same station ID', () => {
      const stationId = '101234'
      const color1 = getStationColor(stationId)
      const color2 = getStationColor(stationId)

      expect(color1).toBe(color2)
    })

    it('should return consistent colors across multiple calls', () => {
      const stationIds = ['101234', '105678', '109999', 'ABC123']
      const colors1 = stationIds.map(getStationColor)
      const colors2 = stationIds.map(getStationColor)

      expect(colors1).toEqual(colors2)
    })

    it('should maintain color consistency regardless of call order', () => {
      // Get colors in one order
      const colorA = getStationColor('station-A')
      const colorB = getStationColor('station-B')
      const colorC = getStationColor('station-C')

      // Get colors in different order
      const colorC2 = getStationColor('station-C')
      const colorA2 = getStationColor('station-A')
      const colorB2 = getStationColor('station-B')

      expect(colorA).toBe(colorA2)
      expect(colorB).toBe(colorB2)
      expect(colorC).toBe(colorC2)
    })
  })

  describe('color validity', () => {
    it('should return a color from STATION_COLORS palette', () => {
      const testIds = ['101234', '105678', 'ABC', 'test-station', '999']

      testIds.forEach((id) => {
        const color = getStationColor(id)
        expect(STATION_COLORS).toContain(color)
      })
    })

    it('should return valid hex color format', () => {
      const hexColorRegex = /^#[0-9a-f]{6}$/i
      const testIds = ['101234', '105678', 'ABC', 'test-station']

      testIds.forEach((id) => {
        const color = getStationColor(id)
        expect(color).toMatch(hexColorRegex)
      })
    })
  })

  describe('different stations get potentially different colors', () => {
    it('should differentiate between different station IDs', () => {
      // While hash collisions are possible, different IDs should generally get different colors
      const ids = ['101234', '105678', '109999', '112345', '115678']
      const colors = ids.map(getStationColor)
      const uniqueColors = new Set(colors)

      // We expect at least 2 different colors among 5 different stations
      // (allowing for some hash collisions)
      expect(uniqueColors.size).toBeGreaterThan(1)
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const color = getStationColor('')
      expect(STATION_COLORS).toContain(color)
    })

    it('should handle numeric station IDs', () => {
      const color = getStationColor('12345')
      expect(STATION_COLORS).toContain(color)
    })

    it('should handle station IDs with special characters', () => {
      const color = getStationColor('station-123_test')
      expect(STATION_COLORS).toContain(color)
    })

    it('should handle very long station IDs', () => {
      const longId = 'a'.repeat(1000)
      const color = getStationColor(longId)
      expect(STATION_COLORS).toContain(color)
    })
  })

  describe('real-world station ID patterns', () => {
    it('should handle typical weather station ID formats', () => {
      const realWorldIds = [
        '101234', // Numeric ID
        'WXYZ1234', // Alphanumeric
        'DE_BW_001', // Country/region code
        'station-munich-01', // Slug format
      ]

      realWorldIds.forEach((id) => {
        const color = getStationColor(id)
        expect(STATION_COLORS).toContain(color)
      })
    })
  })
})

describe('STATION_COLORS', () => {
  it('should have at least 5 colors for variety', () => {
    expect(STATION_COLORS.length).toBeGreaterThanOrEqual(5)
  })

  it('should contain only valid hex colors', () => {
    const hexColorRegex = /^#[0-9a-f]{6}$/i

    STATION_COLORS.forEach((color) => {
      expect(color).toMatch(hexColorRegex)
    })
  })

  it('should have unique colors', () => {
    const uniqueColors = new Set(STATION_COLORS)
    expect(uniqueColors.size).toBe(STATION_COLORS.length)
  })
})
