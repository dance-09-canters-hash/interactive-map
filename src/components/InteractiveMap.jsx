import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import PropTypes from 'prop-types'

function InteractiveMap({ currentView }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const zoomRef = useRef(null)
  const activeRef = useRef(d3.select(null))
  const pathRef = useRef(d3.geoPath())
  const mapFeaturesRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth
    let height = container.clientHeight

    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", "100%")
      .attr("height", "100%")
      .style("max-width", "100%")
      .style("height", "auto")
      .on("click", (event) => {
        if (event.target.tagName !== 'path') resetToCurrentView()
      })

    const g = svg.append("g")

    const zoom = d3.zoom()
      .scaleExtent([1, 12])
      .on("zoom", (event) => {
        const { transform } = event
        g.attr("transform", transform)
        g.selectAll("path").attr("stroke-width", 0.5 / transform.k)
      })

    svg.call(zoom)
    zoomRef.current = { svg, zoom, g, width, height }
    svgRef.current = svg

    container.innerHTML = ''
    container.append(svg.node())

    function resetToCurrentView() {
      activeRef.current.classed("active", false)
      activeRef.current = d3.select(null)
      zoomToView(currentView)
    }

    function clicked(event, d) {
      event.stopPropagation()
      if (activeRef.current.node() === this) return resetToCurrentView()

      activeRef.current.classed("active", false)
      activeRef.current = d3.select(this).classed("active", true).raise()

      const [[x0, y0], [x1, y1]] = pathRef.current.bounds(d)

      const mapW = width / 2
      let offsetX = 0

      const isRightMap = activeRef.current.node().parentNode.classList.contains('map2')
      if (isRightMap) {
        offsetX = mapW
      }

      const targetX = x0 + (x1 - x0) / 2 + offsetX
      const targetY = y0 + (y1 - y0) / 2

      const scale = Math.min(8, 0.9 / Math.max((x1 - x0) / mapW, (y1 - y0) / height))

      const transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(scale)
        .translate(-targetX, -targetY)

      svg.transition().duration(750).call(zoom.transform, transform)
    }

    function zoomToView(view) {
      let transform
      if (view === 'both') {
        transform = d3.zoomIdentity
      } else if (mapFeaturesRef.current) {
        const [[x0, y0], [x1, y1]] = pathRef.current.bounds(mapFeaturesRef.current)
        const scale = 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)

        let targetX = (x0 + x1) / 2
        const targetY = (y0 + y1) / 2

        if (view === 'map2') {
          targetX += width / 2
        }

        transform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(scale)
          .translate(-targetX, -targetY)
      }

      if (transform) {
        svg.transition().duration(750).call(zoom.transform, transform)
      }
    }

    async function renderMaps() {
      g.selectAll("*").remove()
      try {
        const mapUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"
        const geoData = await d3.json(mapUrl)

        if (!isMounted) return

        const mapFeatures = topojson.feature(geoData, geoData.objects.states)
        mapFeaturesRef.current = mapFeatures
        const borders = topojson.mesh(geoData, geoData.objects.states, (a, b) => a !== b)

        const mapWidth = width / 2
        const mapHeight = height
        const projection = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], mapFeatures)
        pathRef.current.projection(projection)

        const g1 = g.append("g").attr("class", "regions map1")
        g1.selectAll("path")
          .data(mapFeatures.features)
          .join("path")
          .attr("d", pathRef.current)
          .on("click", clicked)
        g1.append("path")
          .attr("class", "region-borders")
          .attr("d", pathRef.current(borders))

        const g2 = g.append("g")
          .attr("class", "regions map2")
          .attr("transform", `translate(${mapWidth}, 0)`)
        g2.selectAll("path")
          .data(mapFeatures.features)
          .join("path")
          .attr("d", pathRef.current)
          .on("click", clicked)
        g2.append("path")
          .attr("class", "region-borders")
          .attr("d", pathRef.current(borders))

      } catch (error) {
        if (!isMounted) return
        console.error("Error loading maps:", error)
      }
    }

    renderMaps()

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      svg.attr("viewBox", [0, 0, width, height])
      zoomRef.current.width = width
      zoomRef.current.height = height
      renderMaps().then(() => zoomToView(currentView))
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [currentView])

  useEffect(() => {
    if (!zoomRef.current || !mapFeaturesRef.current) return

    const { svg, zoom, width, height } = zoomRef.current
    activeRef.current.classed("active", false)
    activeRef.current = d3.select(null)

    let transform
    if (currentView === 'both') {
      transform = d3.zoomIdentity
    } else {
      const [[x0, y0], [x1, y1]] = pathRef.current.bounds(mapFeaturesRef.current)
      const scale = 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)

      let targetX = (x0 + x1) / 2
      const targetY = (y0 + y1) / 2

      if (currentView === 'map2') {
        targetX += width / 2
      }

      transform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(scale)
        .translate(-targetX, -targetY)
    }

    if (transform) {
      svg.transition().duration(750).call(zoom.transform, transform)
    }
  }, [currentView])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}

InteractiveMap.propTypes = {
  currentView: PropTypes.string.isRequired,
}

export default InteractiveMap
