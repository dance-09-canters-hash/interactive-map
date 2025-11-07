import { useEffect, useRef, useState } from 'react'
import InteractiveMap from './InteractiveMap'

function MapContainer() {
  const [currentView, setCurrentView] = useState('both')

  return (
    <>
      <div className="w-full max-w-5xl flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setCurrentView('map1')}
          className={`view-btn px-4 py-2 bg-white rounded-md font-semibold text-gray-700 shadow-sm border border-gray-300 ${
            currentView === 'map1' ? 'active' : ''
          }`}
        >
          USA Map 1
        </button>
        <button
          onClick={() => setCurrentView('map2')}
          className={`view-btn px-4 py-2 bg-white rounded-md font-semibold text-gray-700 shadow-sm border border-gray-300 ${
            currentView === 'map2' ? 'active' : ''
          }`}
        >
          USA Map 2
        </button>
        <button
          onClick={() => setCurrentView('both')}
          className={`view-btn px-4 py-2 bg-white rounded-md font-semibold text-gray-700 shadow-sm border border-gray-300 ${
            currentView === 'both' ? 'active' : ''
          }`}
        >
          Both Maps
        </button>
      </div>

      <div
        id="map-container"
        className="w-full max-w-5xl h-[65vh] rounded-lg shadow-lg border border-gray-200"
      >
        <InteractiveMap currentView={currentView} />
      </div>
    </>
  )
}

export default MapContainer
