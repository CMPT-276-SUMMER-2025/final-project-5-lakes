import { Plus, Trash } from "lucide-react";

// TableButtons: Renders a set of buttons for modifying the table structure
// Includes options to insert/remove rows and columns relative to the selected cell
function TableButtons({
  selectedCell,           
  insertRowAbove,         
  insertRowBelow,         
  insertColumnLeft,      
  insertColumnRight,     
  removeSelectedRow,     
  removeSelectedColumn,  
  setHoveredAction       
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