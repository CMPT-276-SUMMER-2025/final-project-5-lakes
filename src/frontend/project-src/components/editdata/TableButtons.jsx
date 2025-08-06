import { Plus, Trash } from "lucide-react";

// TableButtons: Renders a set of buttons for modifying the table structure
// Includes options to insert/remove rows and columns relative to the selected cell
function TableButtons({
  selectedCell,             // currently selected cell { row, col }
  insertRowAbove,           // function to insert a row above the selected one
  insertRowBelow,           // function to insert a row below the selected one
  insertColumnLeft,         // function to insert a column to the left of the selected one
  insertColumnRight,        // function to insert a column to the right of the selected one
  removeSelectedRow,        // function to remove the currently selected row
  removeSelectedColumn,     // function to remove the currently selected column
  setHoveredAction          // function to visually highlight affected row/col when hovering delete buttons
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4 mr-4 ml-4">
      
      {/* Insert Row Above */}
      <button
        type="button"
        onMouseDown={() => {
          if (selectedCell) insertRowAbove(selectedCell.row);
        }}
        disabled={!selectedCell}
        className="btn-icon"
      >
        <Plus size={10} className="mr-1" />
        Row Above
      </button>

      {/* Insert Row Below */}
      <button
        type="button"
        onMouseDown={() => {
          if (selectedCell) insertRowBelow(selectedCell.row);
        }}
        disabled={!selectedCell}
        className="btn-icon"
      >
        <Plus size={10} className="mr-1" />
        Row Below
      </button>

      {/* Insert Column Left */}
      <button
        type="button"
        onMouseDown={() => {
          if (selectedCell) insertColumnLeft(selectedCell.col);
        }}
        disabled={!selectedCell}
        className="btn-icon"
      >
        <Plus size={10} className="mr-1" />
        Col Left
      </button>

      {/* Insert Column Right */}
      <button
        type="button"
        onMouseDown={() => {
          if (selectedCell) insertColumnRight(selectedCell.col);
        }}
        disabled={!selectedCell}
        className="btn-icon"
      >
        <Plus size={10} className="mr-1" />
        Col Right
      </button>

      {/* Remove Row — highlights row red on hover */}
      <button
        type="button"
        onMouseEnter={() => setHoveredAction("removeRow")}
        onMouseLeave={() => setHoveredAction(null)}
        onMouseDown={() => {
          if (selectedCell) removeSelectedRow(selectedCell.row);
        }}
        disabled={!selectedCell}
        className="btn-icon"
      >
        <Trash size={10} className="mr-1" />
        Row
      </button>

      {/* Remove Column — highlights column red on hover */}
      <button
        type="button"
        onMouseEnter={() => setHoveredAction("removeCol")}
        onMouseLeave={() => setHoveredAction(null)}
        onMouseDown={() => {
          if (selectedCell) removeSelectedColumn(selectedCell.col);
        }}
        disabled={!selectedCell}
        className="btn-icon"
      >
        <Trash size={10} className="mr-1" />
        Col
      </button>
    </div>
  );
}

export default TableButtons;