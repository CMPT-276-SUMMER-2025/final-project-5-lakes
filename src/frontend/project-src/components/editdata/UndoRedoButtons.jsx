// Import undo/redo icons
import { Undo, Redo } from "lucide-react";

// UndoRedoButtons: Renders undo and redo buttons with optional disabled states
function UndoRedoButtons({ undo, redo, undoDisabled, redoDisabled }) {
  return (
    // Container with horizontal spacing between buttons
    <div className="flex justify-center gap-2 mb-4">
      
      {/* Undo Button */}
      <button
        type="button"
        onClick={undo} // Calls the undo function passed in as prop
        disabled={undoDisabled} // Disables if there's nothing to undo
        className="p-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Undo size={18} />
      </button>

      {/* Redo Button */}
      <button
        type="button"
        onClick={redo} // Calls the redo function passed in as prop
        disabled={redoDisabled} // Disables if there's nothing to redo
        className="p-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Redo size={18} />
      </button>
    </div>
  );
}

export default UndoRedoButtons;