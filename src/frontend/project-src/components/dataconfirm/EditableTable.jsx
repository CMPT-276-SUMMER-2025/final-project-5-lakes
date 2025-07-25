// src/components/dataconfirm/EditableTable.jsx
import { useState } from "react";
import { DataGrid } from "react-data-grid";
import "react-data-grid/lib/styles.css"; 

const columns = [
  { key: "month", name: "Month", editable: true },
  { key: "sales", name: "Sales Value", editable: true },
  { key: "orders", name: "Orders", editable: true },
  { key: "spending", name: "Spending", editable: true },
  { key: "satisfaction", name: "Satisfaction", editable: true },
  { key: "id", name: "ID", editable: false, hidden: true },
];

const defaultRows = [
  { id: 0, month: "January", sales: 4000, orders: 50, spending: 800, satisfaction: 3.7 },
  { id: 1, month: "February", sales: 4200, orders: 55, spending: 900, satisfaction: 3.9 },
  { id: 2, month: "March", sales: 5000, orders: 52, spending: 850, satisfaction: 3.8 },
  { id: 3, month: "April", sales: 5500, orders: 60, spending: 1000, satisfaction: 4.2 },
];

function EditableTable({ data, onDataChange }) {
  const [rows, setRows] = useState(data || defaultRows);

  const handleRowsChange = (updatedRows) => {
    setRows(updatedRows);
    if (onDataChange) onDataChange(updatedRows);
  };

  return (
    <div className="react-data-grid-container w-full">
      <DataGrid
        className="rdg-light"
        columns={columns}
        rows={rows}
        onRowsChange={handleRowsChange}
      />
    </div>
  );
}

export default EditableTable;