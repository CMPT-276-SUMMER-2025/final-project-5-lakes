import { Undo, Redo } from "lucide-react";

function UndoRedoButtons({ undo, redo, undoDisabled, redoDisabled }) {
  return (
    <div className="flex justify-center gap-2 mb-4">
      <button
        type="button"
        onClick={undo}
        className="p-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={undoDisabled}
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={redo}
        className="p-1.5 rounded-md bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={redoDisabled}
      >
        <Redo size={18} />
      </button>
    </div>
  );
}

export default UndoRedoButtons;