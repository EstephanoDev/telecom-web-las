import {  UserData } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<UserData>[] = [
    {
      accessorKey: 'name',
      header: "Nombre",
    },
    {
      accessorKey: 'roles',
  header: 'Roles'
},
{
  accessorKey: 'verified',
  header: 'Statues'
}

  ]

