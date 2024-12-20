import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Eraser, Undo2, Redo2, Trash2, Pencil } from 'lucide-react'
import type { ToolbarProps } from "../types/canvas"

export function Toolbar({
  currentColor,
  setCurrentColor,
  brushSize,
  setBrushSize,
  isEraser,
  setIsEraser,
  onClear,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolbarProps) {
  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ]

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-lg p-2 sm:p-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
      <div className="flex gap-1 sm:gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
              currentColor === color && !isEraser ? "ring-2 ring-black" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => {
              setCurrentColor(color)
              setIsEraser(false)
            }}
          />
        ))}
      </div>
      <div className="hidden sm:block w-px h-8 bg-gray-200" />
      <div className="flex items-center gap-2">
        <Button
          variant={isEraser ? "default" : "outline"}
          size="icon"
          onClick={() => setIsEraser(true)}
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <Button
          variant={!isEraser ? "default" : "outline"}
          size="icon"
          onClick={() => setIsEraser(false)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
      <div className="hidden sm:block w-px h-8 bg-gray-200" />
      <div className="flex items-center gap-2">
        <span className="text-sm hidden sm:inline">Size:</span>
        <Slider
          value={[brushSize]}
          onValueChange={(value) => setBrushSize(value[0])}
          min={1}
          max={20}
          step={1}
          className="w-24 sm:w-32"
        />
      </div>
      <div className="hidden sm:block w-px h-8 bg-gray-200" />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClear}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

