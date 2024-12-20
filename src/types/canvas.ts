export interface Point {
  x: number;
  y: number;
}

export interface DrawLine {
  points: Point[];
  color: string;
  width: number;
  type: "draw" | "erase";
}

export interface ToolbarProps {
  currentColor: string;
  setCurrentColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  isEraser: boolean;
  setIsEraser: (isEraser: boolean) => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
