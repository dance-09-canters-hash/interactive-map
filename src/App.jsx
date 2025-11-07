import MapContainer from './components/MapContainer'

function App() {
  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center h-screen p-4 md:p-8">
      <div className="w-full max-w-5xl text-center mb-4">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Zoom to Bounding Box</h1>
        <p className="text-gray-600 mt-1">Select a view, then click a state to zoom in.</p>
      </div>
      <MapContainer />
    </div>
  )
}

export default App
