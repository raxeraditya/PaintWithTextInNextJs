'use client'

import { forwardRef, useImperativeHandle, useEffect, useRef, useState, useCallback } from 'react'
import type { Point, DrawLine } from '../types/canvas'

interface DrawingCanvasProps {
  currentColor: string
  brushSize: number
  isEraser: boolean
  onStateChange: (canUndo: boolean, canRedo: boolean) => void
}

export const DrawingCanvas = forwardRef<{ clear: () => void; undo: () => void; redo: () => void; save: () => void }, DrawingCanvasProps>(
  ({ currentColor, brushSize, isEraser, onStateChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [currentLine, setCurrentLine] = useState<Point[]>([])
    const [lines, setLines] = useState<DrawLine[]>([])
    const [undoStack, setUndoStack] = useState<DrawLine[][]>([])
    const [redoStack, setRedoStack] = useState<DrawLine[][]>([])

    const updateState = useCallback(() => {
      onStateChange(undoStack.length > 0, redoStack.length > 0)
    }, [undoStack.length, redoStack.length, onStateChange])

    useEffect(() => {
      updateState()
    }, [updateState])

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const resizeCanvas = () => {
        const parent = canvas.parentElement
        if (!parent) return

        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
        redrawCanvas()
      }

      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)

      return () => window.removeEventListener('resize', resizeCanvas)
    }, [])

    const redrawCanvas = useCallback(() => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      lines.forEach((line) => {
        ctx.beginPath()
        ctx.strokeStyle = line.type === 'erase' ? '#ffffff' : line.color
        ctx.lineWidth = line.width
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        if (line.type === 'erase') {
          ctx.globalCompositeOperation = 'destination-out'
        } else {
          ctx.globalCompositeOperation = 'source-over'
        }

        line.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      })

      ctx.globalCompositeOperation = 'source-over'
    }, [lines])

    useEffect(() => {
      redrawCanvas()
    }, [redrawCanvas])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
      const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

      setIsDrawing(true)
      setCurrentLine([{ x, y }])
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
      const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

      setCurrentLine((prev) => [...prev, { x, y }])

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.beginPath()
      ctx.strokeStyle = isEraser ? '#ffffff' : currentColor
      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (isEraser) {
        ctx.globalCompositeOperation = 'destination-out'
      } else {
        ctx.globalCompositeOperation = 'source-over'
      }

      if (currentLine.length > 0) {
        const prevPoint = currentLine[currentLine.length - 1]
        ctx.moveTo(prevPoint.x, prevPoint.y)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }

    const stopDrawing = useCallback(() => {
      if (!isDrawing) return

      setIsDrawing(false)
      if (currentLine.length > 0) {
        const newLine: DrawLine = {
          points: currentLine,
          color: currentColor,
          width: brushSize,
          type: isEraser ? 'erase' : 'draw',
        }
        setLines((prev) => {
          const newLines = [...prev, newLine]
          setUndoStack((prevStack) => [...prevStack, prev])
          setRedoStack([])
          return newLines
        })
      }
      setCurrentLine([])
    }, [isDrawing, currentLine, currentColor, brushSize, isEraser])

    const clear = useCallback(() => {
      setUndoStack((prev) => [...prev, lines])
      setLines([])
      setRedoStack([])
      redrawCanvas()
    }, [lines, redrawCanvas])

    const undo = useCallback(() => {
      if (undoStack.length === 0) return

      const previousLines = undoStack[undoStack.length - 1]
      setUndoStack((prev) => prev.slice(0, -1))
      setRedoStack((prev) => [...prev, lines])
      setLines(previousLines)
    }, [lines, undoStack])

    const redo = useCallback(() => {
      if (redoStack.length === 0) return

      const nextLines = redoStack[redoStack.length - 1]
      setRedoStack((prev) => prev.slice(0, -1))
      setUndoStack((prev) => [...prev, lines])
      setLines(nextLines)
    }, [lines, redoStack])

    const save = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'drawing.png'
      link.click()
    }, [])

    useImperativeHandle(ref, () => ({
      clear,
      undo,
      redo,
      save
    }))

    return (
      <canvas
        ref={canvasRef}
        className="w-full h-[calc(100vh-16rem)] touch-none bg-white rounded-lg shadow-sm"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    )
  }
)

DrawingCanvas.displayName = 'DrawingCanvas'

