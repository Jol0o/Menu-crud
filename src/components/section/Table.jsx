import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTable, useRowSelect } from "react-table";
import { Input } from "../ui/input";
import AddItem from "../crud/AddItem";
import { Button } from "../ui/button";
import {
  ChevronDownIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import EditItem from "../crud/EditItem";

const TableData = ({ filterData, setFilter, originalData }) => {
  const data = React.useMemo(() => filterData, [filterData]);

  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }) => (
          <div>
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Options",
        accessor: "options",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Cost",
        accessor: "cost",
      },
      {
        Header: "Stock",
        accessor: "stock",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    allColumns,
    selectedFlatRows,
    ...table
  } = useTable({ columns, data }, useRowSelect);

  useEffect(() => {
    console.log(
      "Selected rows:",
      selectedFlatRows.map((row) => row.original)
    );
  }, [selectedFlatRows]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        if (selectedFlatRows.length > 0) {
          await Promise.all(
            selectedFlatRows.map(async (row) => {
              const id = row.original.id;
              await deleteDoc(doc(db, "menu", id));
            })
          );
        } else if (id) {
          await deleteDoc(doc(db, "menu", id));
        }
        toast(`Successful deleting an item!`);
      } catch (e) {
        console.error(e);
        toast(`Failed to delete! ${e.message}`);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Filter Menu Name..."
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-sm"
          />
          {filterData.length !== originalData.length && (
            <Button
              onClick={() => setFilter("")}
              size="sm"
              variant="ghost"
              className="gap-1 h-7 text-red-500"
            >
              {" "}
              Reset
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {selectedFlatRows.length > 0 && (
            <Button
              onClick={handleDelete}
              size="sm"
              variant="outline"
              className="gap-1 h-7"
            >
              {" "}
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          )}
          <AddItem />
        </div>
      </div>
      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              onClick={() => {
                setFilter("appetizers");
              }}
            >
              Appetizers
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setFilter("main_courses");
              }}
            >
              Main courses
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setFilter("desserts");
              }}
            >
              Desserts
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setFilter("beverages");
              }}
            >
              Beverages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                {...column.getToggleHiddenProps()}
                onClick={() => column.toggleHidden()}
              >
                {column.Header}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table {...getTableProps()}>
        <TableHeader>
          {headerGroups.map((headerGroup, index) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((header) => (
                <TableHead key={index} {...header.getHeaderProps()}>
                  {header.render("Header")}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {rows.length > 0 ? (
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, index) => {
                    // Check if the cell is the options cell
                    if (cell.column.id === "options") {
                      // Join the array into a string with commas
                      return (
                        <TableCell
                          className="capitalize"
                          {...cell.getCellProps()}
                          key={index}
                        >
                          {cell.value.join(", ")}
                        </TableCell>
                      );
                    } else {
                      return (
                        <>
                          <TableCell
                            className="capitalize"
                            {...cell.getCellProps()}
                            key={index}
                          >
                            {cell.render("Cell")}
                          </TableCell>
                        </>
                      );
                    }
                  })}
                  <TableCell className="p-0 max-w-[30px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <EditItem data={row.original} />
                        <DropdownMenuItem
                          onClick={() => handleDelete(row.original.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell className="text-center" colSpan={columns.length}>
                No data
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </>
  );
};

export default TableData;
