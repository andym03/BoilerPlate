import { useState } from 'react'
import { Canvas } from '@/canvas/Canvas'
import { useCanvasStore } from '@/store/useCanvasStore'
import { Toolbar, type Tool } from '@/components/Toolbar'
import { useCanvasInteraction } from '@/hooks/useCanvasInteraction'
import { ShapeModal } from '@/components/ShapeModal'
import { LayerPanel } from '@/components/LayerPanel'
import { exportToSVG, downloadSVG } from '@/export/svgExporter'
import { exportToPNG, downloadPNG } from '@/export/pngExporter'
import type { Shape } from '@/shapes/types'
import './App.css'

const CANVAS_SIZE = { width: 1920, height: 1080 }

function App() {
  const store = useCanvasStore(CANVAS_SIZE)
  const [activeTool, setActiveTool] = useState<Tool>('select')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { handleCanvasClick, handleMouseDown, handleMouseMove, handleMouseUp, handleDoubleClick } = useCanvasInteraction({
    activeTool,
    shapes: store.shapes,
    layers: store.getLayersOrdered(),
    selectedShapeId: store.selectedShapeId,
    onShapeCreate: (shape: Shape) => {
      store.addShape(shape)
    },
    onShapeSelect: (shapeId: string | null) => {
      store.selectShape(shapeId)
    },
    onShapeUpdate: (shapeId: string, updates: Partial<Shape>) => {
      store.updateShape(shapeId, updates)
    },
    onShapeEdit: (shapeId: string | null) => {
      if (shapeId !== null) {
        setIsModalOpen(true)
      }
    },
    onBringToFront: (shapeId: string) => {
      store.bringToFront(shapeId)
    },
  })

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleExportSVG = () => {
    const svgContent = exportToSVG(store.shapes, store.getLayersOrdered(), store.canvasSize)
    downloadSVG(svgContent, 'canvas')
  }

  const handleExportPNG = async () => {
    try {
      const dataUrl = await exportToPNG(store.shapes, store.getLayersOrdered(), store.canvasSize)
      downloadPNG(dataUrl, 'canvas')
    } catch (error) {
      console.error('Failed to export PNG:', error)
    }
  }

  return (
    <div className="App">
      <Toolbar 
        activeTool={activeTool} 
        onToolChange={setActiveTool}
        onExportSVG={handleExportSVG}
        onExportPNG={handleExportPNG}
      />
      <div className="App__main">
        <Canvas
          shapes={store.shapes}
          layers={store.getLayersOrdered()}
          canvasSize={store.canvasSize}
          selectedShapeId={store.selectedShapeId}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
        />
        <LayerPanel
          layers={store.getLayersOrdered()}
          selectedShapeId={store.selectedShapeId}
          onSelectShape={(shapeId) => store.selectShape(shapeId)}
          onRenameLayer={(layerId, newName) => store.updateLayerName(layerId, newName)}
          onReorderLayer={(layerId, newOrder) => store.reorderLayer(layerId, newOrder)}
        />
      </div>
      <ShapeModal
        shapeId={store.selectedShapeId}
        shapes={store.shapes}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={(shapeId, updates) => {
          store.updateShape(shapeId, updates)
        }}
      />
    </div>
  )
}

export default App

