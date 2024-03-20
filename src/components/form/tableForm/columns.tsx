'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { deleteForm } from "@/lib/actions"
import { Formularios } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import React, { useEffect, useState } from "react"
import { DialogForm } from "../modals/dialogEdit"

export const columns: ColumnDef<Formularios>[] = [
  {
    accessorKey: 'Fecha',
    header: 'Fecha',
    cell: ({ row }) => {
      const Fecha = row.original.Fecha

      return <span>{Fecha.toString().slice(4, 16)}</span>
    }
  },
  {
    accessorKey: 'NombreUsuario',
    header: 'Grupo',
  },
  {
    accessorKey: 'TipoTrabajo',
    header: 'TipoTrabajo'
  },
  {
    accessorKey: 'TrabajoRealizado',
    header: 'TrabajoRealizado'
  },
  {
    accessorKey: 'Ubicacion',
    header: 'Ubicacion'
  },
  {
    accessorKey: 'Observacion',
    header: 'Observacion'
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000; // 3 días en milisegundos
      const currentTime = new Date().getTime();
      const createdTime = new Date(payment.created).getTime();
      const isEditable = currentTime - createdTime < threeDaysInMillis;
      const handleDeleteClick = () => {
        deleteForm(payment.id);
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DialogForm id={payment.id}>Editar</DialogForm>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form onSubmit={handleDeleteClick}>
                <button type="submit">Eliminar</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }]
