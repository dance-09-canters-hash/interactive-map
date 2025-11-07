import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import InteractiveMap from './InteractiveMap'

vi.mock('d3', () => ({
  create: vi.fn(() => ({
    attr: vi.fn().mockReturnThis(),
    style: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    append: vi.fn(() => ({
      attr: vi.fn().mockReturnThis(),
      selectAll: vi.fn().mockReturnThis(),
    })),
    call: vi.fn().mockReturnThis(),
    transition: vi.fn().mockReturnThis(),
    node: vi.fn(() => document.createElement('svg')),
  })),
  select: vi.fn(() => ({
    classed: vi.fn().mockReturnThis(),
    node: vi.fn(),
  })),
  geoPath: vi.fn(() => ({
    projection: vi.fn().mockReturnThis(),
    bounds: vi.fn(() => [[0, 0], [100, 100]]),
  })),
  geoAlbersUsa: vi.fn(() => ({
    fitSize: vi.fn().mockReturnThis(),
  })),
  zoom: vi.fn(() => ({
    scaleExtent: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
  })),
  zoomIdentity: {
    translate: vi.fn().mockReturnThis(),
    scale: vi.fn().mockReturnThis(),
  },
  json: vi.fn(() => Promise.resolve({
    objects: { states: {} }
  })),
}))

vi.mock('topojson-client', () => ({
  feature: vi.fn(() => ({ features: [] })),
  mesh: vi.fn(() => ({})),
}))

describe('InteractiveMap', () => {
  it('renders without crashing', () => {
    const { container } = render(<InteractiveMap currentView="both" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('accepts currentView prop', () => {
    const { rerender } = render(<InteractiveMap currentView="both" />)
    expect(() => rerender(<InteractiveMap currentView="map1" />)).not.toThrow()
    expect(() => rerender(<InteractiveMap currentView="map2" />)).not.toThrow()
  })
})
