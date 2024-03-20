"use client"

import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ExcelDownloadButton from "./excelButton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetForms } from "@/data/getForms"
import { Formularios } from "@/lib/types"
import { DialogForm } from "../modals/dialog"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"


const formatDateForURL = (date: DateRange | undefined): string | undefined => {
  if (!date) return undefined;
  return `${date.from?.toISOString()}/${date.to?.toISOString()}`;
};

interface DataTableProps<TValue> {
  columns: ColumnDef<Formularios, TValue>[]
  user: string
  users: any
  filter: string | undefined
  ubi: string | undefined
}

export function FormTable<TValue>({
  columns,
  user,
  users,
  filter,
  ubi
}: DataTableProps<TValue>) {
  const { formData, error } = useGetForms(ubi, filter)
  const table = useReactTable({
    data: formData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  })

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const formattedDate = formatDateForURL(date);
    if (formattedDate) {
      params.set('date', formattedDate);
    } else {
      params.delete('date');
    }
    replace(`${pathname}?${params.toString()}`);
  }, [date]);

  const handleSearch = (e: string) => {
    const params = new URLSearchParams(searchParams)
    if (e) {
      params.set('search', e)
    } else {
      params.delete('search')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const handleFilterType = (e: any) => {
    const params = new URLSearchParams(searchParams)
    if (e) {
      params.set('filter', e)
    } else {
      params.delete('filter')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const opciones = [
    { value: 'RD', label: 'RD' },
    { value: 'RA', label: 'RA' },
    { value: 'DP', label: 'DP' },
    { value: 'BANDEJAS', label: 'Bandejas' },
    { value: 'INSTALACIONES', label: 'Instalaciones' },
    { value: 'ACTIVACIONES', label: 'Activaciones' },
    { value: 'SOPLADO', label: 'Soplado' },
    { value: 'FUSIONES', label: 'Fusiones' },
    { value: 'AVERIAS', label: 'Averías' },
    { value: 'OTROS', label: 'Otros' },
  ];

  const handleButtonClick = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('filter')
    params.delete('search')
    params.delete('date')
    replace(`${pathname}?${params.toString()}`)
  };

  if (error) return <h1>{JSON.stringify(error)}</h1>

  return (
    <div className="rounded-md border">
      <div className="mb-4 flex flex-row m-2">
        <div className={cn("grid gap-2 mt-2")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}

              />
            </PopoverContent>
          </Popover>
        </div>
        <Input
          type="text"
          placeholder="Ubicacion..."
          defaultValue={searchParams.get('search')?.toString()}
          className="px-4 py-2 rounded-md border w-full m-2"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Select onValueChange={(e) => handleFilterType(e)} defaultValue="">
          <SelectTrigger className="w-[180px] m-2">
            <SelectValue placeholder="TipoTrabajo" />
          </SelectTrigger>
          <SelectContent>
            {opciones.map((opcion) => (
              <SelectItem key={opcion.value} value={opcion.value}
              >{opcion.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant='destructive' onClick={handleButtonClick} className="m-2">x</Button>
        <ExcelDownloadButton forms={formData} />
        <div className="mt-2">
          <DialogForm user={user} users={users}>Enviar</DialogForm>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
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
  )
}


