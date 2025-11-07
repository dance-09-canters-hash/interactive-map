import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MapContainer from './MapContainer'

vi.mock('./InteractiveMap', () => ({
  default: ({ currentView }) => <div data-testid="interactive-map">{currentView}</div>
}))

describe('MapContainer', () => {
  it('renders all view buttons', () => {
    render(<MapContainer />)
    expect(screen.getByText('USA Map 1')).toBeInTheDocument()
    expect(screen.getByText('USA Map 2')).toBeInTheDocument()
    expect(screen.getByText('Both Maps')).toBeInTheDocument()
  })

  it('defaults to both maps view', () => {
    render(<MapContainer />)
    const bothButton = screen.getByText('Both Maps')
    expect(bothButton).toHaveClass('active')
  })

  it('switches to map1 view when button clicked', () => {
    render(<MapContainer />)
    const map1Button = screen.getByText('USA Map 1')
    fireEvent.click(map1Button)

    expect(map1Button).toHaveClass('active')
    expect(screen.getByTestId('interactive-map')).toHaveTextContent('map1')
  })

  it('switches to map2 view when button clicked', () => {
    render(<MapContainer />)
    const map2Button = screen.getByText('USA Map 2')
    fireEvent.click(map2Button)

    expect(map2Button).toHaveClass('active')
    expect(screen.getByTestId('interactive-map')).toHaveTextContent('map2')
  })

  it('renders the map container', () => {
    render(<MapContainer />)
    const container = screen.getByTestId('interactive-map')
    expect(container).toBeInTheDocument()
  })
})
