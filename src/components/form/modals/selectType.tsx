import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="TipoTrabajo" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='RD'>RD</SelectItem>
          <SelectItem value='RA'>RA</SelectItem>
          <SelectItem value='DP'>DP</SelectItem>
          <SelectItem value='BANDEJAS'>BANDEJAS</SelectItem>
          <SelectItem value='INSTALACIONES'>INSTALACIONES</SelectItem>
          <SelectItem value='ACTIVACIONES'>ACTIVACIONES</SelectItem>
          <SelectItem value='BOTH'>INSTALACIONES Y ACTIVACIONES</SelectItem>
          <SelectItem value='SOPLADO'>SOPLADO</SelectItem>
          <SelectItem value='FUSIONES'>FUSIONES</SelectItem>
          <SelectItem value='AVERIAS'>AVERIAS</SelectItem>
          <SelectItem value='OTROS'>OTROS</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

