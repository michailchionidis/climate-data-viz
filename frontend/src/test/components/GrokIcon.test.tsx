import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { GrokIcon } from '../../shared/components/ui/GrokIcon'

describe('GrokIcon', () => {
  describe('rendering', () => {
    it('should render the SVG icon', () => {
      const { container } = render(<GrokIcon />)

      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should have correct viewBox', () => {
      const { container } = render(<GrokIcon />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 1 48 46')
    })
  })

  describe('size prop', () => {
    it('should use default size of 24', () => {
      const { container } = render(<GrokIcon />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '24')
      expect(svg).toHaveAttribute('height', '24')
    })

    it('should accept custom number size', () => {
      const { container } = render(<GrokIcon size={48} />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '48')
      expect(svg).toHaveAttribute('height', '48')
    })

    it('should accept custom string size', () => {
      const { container } = render(<GrokIcon size="32px" />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('width', '32px')
      expect(svg).toHaveAttribute('height', '32px')
    })
  })

  describe('color prop', () => {
    it('should use currentColor by default', () => {
      const { container } = render(<GrokIcon />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('fill', 'currentColor')
    })

    it('should accept custom color', () => {
      const { container } = render(<GrokIcon color="white" />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('fill', 'white')
    })

    it('should accept hex color', () => {
      const { container } = render(<GrokIcon color="#06b6d4" />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveAttribute('fill', '#06b6d4')
    })
  })

  describe('className prop', () => {
    it('should apply custom className', () => {
      const { container } = render(<GrokIcon className="custom-class" />)

      const svg = container.querySelector('svg')
      expect(svg).toHaveClass('custom-class')
    })
  })

  describe('path element', () => {
    it('should contain the Grok logo path', () => {
      const { container } = render(<GrokIcon />)

      const path = container.querySelector('path')
      expect(path).toBeInTheDocument()
      expect(path).toHaveAttribute('d')
    })
  })
})
