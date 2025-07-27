import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const DataTable = ({ columns, data, filterColumn }) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const handleSort = (columnId) => {
    const isAsc = sorting.length > 0 && sorting[0].id === columnId && sorting[0].desc === false;
    setSorting([{ id: columnId, desc: !isAsc }]);
  };

  const sortedData = React.useMemo(() => {
    if (sorting.length === 0) return data;
    const sortKey = sorting[0].id;
    const sortOrder = sorting[0].desc ? -1 : 1;
    return [...data].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return -1 * sortOrder;
      if (a[sortKey] > b[sortKey]) return 1 * sortOrder;
      return 0;
    });
  }, [data, sorting]);

  const filteredData = React.useMemo(() => {
    if (columnFilters.length === 0) return sortedData;
    return sortedData.filter(row => {
      return columnFilters.every(filter => {
        const rowValue = row[filter.id];
        return String(rowValue).toLowerCase().includes(String(filter.value).toLowerCase());
      });
    });
  }, [sortedData, columnFilters]);

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter by ${filterColumn}...`}
          value={columnFilters.find(f => f.id === filterColumn)?.value || ''}
          onChange={(event) => {
            const newFilters = columnFilters.filter(f => f.id !== filterColumn);
            if (event.target.value) {
              newFilters.push({ id: filterColumn, value: event.target.value });
            }
            setColumnFilters(newFilters);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns
              .filter((column) => column.header)
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.accessorKey}
                    className="capitalize"
                    checked={!columnVisibility[column.accessorKey]}
                    onCheckedChange={(value) =>
                      setColumnVisibility((prev) => ({
                        ...prev,
                        [column.accessorKey]: !value,
                      }))
                    }
                  >
                    {column.header}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                if (columnVisibility[column.accessorKey]) return null;
                return (
                  <TableHead key={column.accessorKey}>
                    {column.header && (
                      <Button
                        variant="ghost"
                        onClick={() => column.accessorKey && handleSort(column.accessorKey)}
                      >
                        {column.header}
                        {sorting[0]?.id === column.accessorKey && (sorting[0]?.desc ? ' ↓' : ' ↑')}
                      </Button>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => {
                    if (columnVisibility[column.accessorKey]) return null;
                    return (
                      <TableCell key={column.accessorKey}>
                        {column.cell ? column.cell({ row }) : row[column.accessorKey]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;