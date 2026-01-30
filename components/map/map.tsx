'use client'

import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { PlotMarker } from '@/lib/types'

interface MapProps {
  plots: PlotMarker[]
  onPlotClick?: (plot: PlotMarker) => void
  selectedPlotId?: string | null
  center?: [number, number]
  zoom?: number
}

export function Map({ plots, onPlotClick, selectedPlotId, center = [-82.5515, 35.5951], zoom = 10 }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (!mapboxToken || mapboxToken === 'your_mapbox_access_token') {
      return
    }

    mapboxgl.accessToken = mapboxToken

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: center,
      zoom: zoom,
      pitch: 45,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

    map.current.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [center, zoom])

  // Update markers when plots change
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    // Remove existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add new markers
    plots.forEach(plot => {
      const el = document.createElement('div')
      el.className = 'plot-marker'
      el.style.width = '40px'
      el.style.height = '40px'
      el.style.cursor = 'pointer'

      // Status-based colors
      const color = plot.status === 'ACTIVE'
        ? '#16a34a' // green-600
        : plot.status === 'RENTED'
        ? '#2563eb' // blue-600
        : '#6b7280' // gray-500

      el.innerHTML = `
        <div style="
          background-color: ${color};
          width: 100%;
          height: 100%;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          ${selectedPlotId === plot.id ? 'transform: rotate(-45deg) scale(1.2);' : ''}
        ">
          <span style="
            transform: rotate(45deg);
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">
            ${plot.acreage}
          </span>
        </div>
      `

      el.addEventListener('click', () => {
        if (onPlotClick) {
          onPlotClick(plot)
        }
      })

      // Create popup content safely to prevent XSS
      const popupContainer = document.createElement('div')
      popupContainer.style.padding = '8px'

      const titleEl = document.createElement('h3')
      titleEl.style.fontWeight = 'bold'
      titleEl.style.marginBottom = '4px'
      titleEl.textContent = plot.title // Safe - uses textContent instead of innerHTML

      const detailsEl = document.createElement('p')
      detailsEl.style.color = '#666'
      detailsEl.style.fontSize = '14px'
      detailsEl.textContent = `${plot.acreage} acres • $${plot.pricePerMonth}/mo`

      popupContainer.appendChild(titleEl)
      popupContainer.appendChild(detailsEl)

      const marker = new mapboxgl.Marker(el)
        .setLngLat([plot.longitude, plot.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setDOMContent(popupContainer)
        )
        .addTo(map.current!)

      markers.current.push(marker)
    })
  }, [plots, mapLoaded, selectedPlotId, onPlotClick])

  // Fly to selected plot
  useEffect(() => {
    if (!map.current || !selectedPlotId || !mapLoaded) return

    const selectedPlot = plots.find(p => p.id === selectedPlotId)
    if (selectedPlot) {
      map.current.flyTo({
        center: [selectedPlot.longitude, selectedPlot.latitude],
        zoom: 14,
        essential: true,
        duration: 1500,
      })
    }
  }, [selectedPlotId, plots, mapLoaded])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-lg" />

      {(!process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN === 'your_mapbox_access_token') && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600 mb-4">
              Configure your Mapbox token in <code className="bg-gray-200 px-2 py-1 rounded">.env.local</code> to enable the interactive map.
            </p>
            <p className="text-sm text-gray-500">
              Get a free token at <a href="https://mapbox.com" target="_blank" className="text-green-600 hover:underline">mapbox.com</a>
            </p>
          </div>
        </div>
      )}

      {/* Legend - hidden on mobile */}
      <div className="hidden sm:block absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Plot Status</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Rented</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Inactive</span>
          </div>
        </div>
      </div>
    </div>
  )
}
