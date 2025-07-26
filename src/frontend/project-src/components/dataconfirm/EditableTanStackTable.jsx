import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

const EditableTanStackTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);

  const columnHelper = createColumnHelper();

  const columns = Object.keys(data[0]).map((key) =>
    columnHelper.accessor(key, {
      header: key.charAt(0).toUpperCase() + key.slice(1),
      cell: (info) => (
        <input
          className="border p-1 w-full"
          value={info.getValue() ?? ""}
          onChange={(e) => {
            const rowIndex = info.row.index;
            const newValue = e.target.value;

            setTableData((old) =>
              old.map((row, i) =>
                i === rowIndex ? { ...row, [key]: newValue } : row
              )
            );
          }}
        />
      ),
    })
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-3 py-2 text-left text-sm font-medium"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-3 py-1 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableTanStackTable;