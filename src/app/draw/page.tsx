'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { DrawingCanvas } from '@/components/drawing-canvas'
import { Toolbar } from '@/components/toolbar'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Download, StickyNote } from 'lucide-react'

export default function DrawPage() {
  const [currentColor, setCurrentColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [isEraser, setIsEraser] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const canvasRef = useRef<{ clear: () => void; undo: () => void; redo: () => void; save: () => void } | null>(null)

  const handleStateChange = useCallback((canUndo: boolean, canRedo: boolean) => {
    setCanUndo(canUndo)
    setCanRedo(canRedo)
  }, [])

  const handleSave = () => {
    canvasRef.current?.save()
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-purple-800">Drawing Board</h1>
        <p className="text-xl text-gray-600">Let your creativity flow</p>
      </motion.div>

      <Toolbar
        currentColor={currentColor}
        setCurrentColor={setCurrentColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        isEraser={isEraser}
        setIsEraser={setIsEraser}
        onClear={() => canvasRef.current?.clear()}
        onUndo={() => canvasRef.current?.undo()}
        onRedo={() => canvasRef.current?.redo()}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-4"
      >
        <DrawingCanvas
          ref={canvasRef}
          currentColor={currentColor}
          brushSize={brushSize}
          isEraser={isEraser}
          onStateChange={handleStateChange}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="fixed bottom-4 right-4 flex gap-2"
      >
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Link href="/notes">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <StickyNote className="w-4 h-4 mr-2" />
            Notepad
          </Button>
        </Link>
      </motion.div>
    </main>
  )
}

