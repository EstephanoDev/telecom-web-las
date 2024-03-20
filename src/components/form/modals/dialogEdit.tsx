'use client'

import { Button } from "@/components/ui/button"
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { fetchForm, fetchUsers } from "@/lib/data"
import { formEditSchemaClient, formSchemaClient } from "@/lib/validations"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormControl } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import CustomSelect from 'react-select'
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { editForm } from "./createform"
import { toast } from "sonner"

export function DialogForm({ children, id }: { children: React.ReactNode, id: string }) {
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [ubicacionCompleta, setUbicacionCompleta] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  let [open, setOpen] = useState(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ['form'],
    queryFn: async () => {
      const data = await fetchForm(id)
      return data
    }
  });

  const [ubicacion1, setUbicacion1] = useState(data?.Ubicacion?.split('-')[0]);
  const [ubicacion2, setUbicacion2] = useState(data?.Ubicacion?.split('-')[1]);
  const [ubicacion3, setUbicacion3] = useState(data?.Ubicacion?.split('-')[2])
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await fetchUsers()
      return data
    }
  })
  useEffect(() => {
    if (users) {
      if (searchQuery.length >= 3) {
        const filtered: any = users.filter(
          (user: any) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredOptions(
          filtered.map((user: any) => ({
            value: user.id,
            label: user.name,
          }))
        );
      }
    }
  }, [searchQuery, users]);


  const handleSelectChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions);
  };
  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
  };


  const form = useForm<z.infer<typeof formEditSchemaClient>>({
    resolver: zodResolver(formEditSchemaClient),
  });

  async function onSubmit(values: z.infer<typeof formEditSchemaClient>) {
    const ubicacion = `${ubicacion1}-${ubicacion2}-${ubicacion3}`;
    setUbicacionCompleta(ubicacion);
    const grupo = selectedUsers.map((user: any) => user.value);
    if (data) {
      const formId = data.id
      toast.promise(() => editForm(values, ubicacion, grupo, formId), {
        error: 'Error al editar Formulario',
        success: 'Formulario Editado'
      })
    }

    setOpen(false);
  }

  if (isLoading) { return <h1>Loading...</h1> }
  if (error) { return <h1>Error</h1> }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{children}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[825px] mx-auto px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="mb-8 text-center">Editar Formulario</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="Fecha"
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-gray-500"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : "Selecciona una fecha"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="Grupo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomSelect
                          className="mb-4 text-black w-full"
                          isMulti
                          placeholder={data?.NombreUsuario}
                          name="Grupo"
                          options={filteredOptions}
                          value={selectedUsers}
                          onChange={handleSelectChange}
                          onInputChange={handleInputChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="TipoTrabajo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                          <SelectTrigger>
                            <SelectValue placeholder={data?.TipoTrabajo} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='RD'>RD</SelectItem>
                            <SelectItem value='RA'>RA</SelectItem>
                            <SelectItem value='DP'>DP</SelectItem>
                            <SelectItem value='BANDEJAS'>BANDEJAS</SelectItem>
                            <SelectItem value='INSTALACIONES'>INSTALACIONES</SelectItem>
                            <SelectItem value='ACTIVACIONES'>ACTIVACIONES</SelectItem>
                            <SelectItem value='BACKBONE(SOPLADO)'>BACKBONE(FUSIONES)</SelectItem>
                            <SelectItem value='BACKBONE(FUSIONES)'>BACKBONE(FUSIONES)</SelectItem>
                            <SelectItem value='AVERIAS'>AVERIAS</SelectItem>
                            <SelectItem value='OTROS'>OTROS</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="TrabajoRealizado"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          defaultValue={data?.TrabajoRealizado}
                          type="number"
                          min={0}
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="Ubicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            className="col-span-1"
                            defaultValue={data?.Ubicacion?.split('-')[0]}
                            onChange={(e) => {
                              setUbicacion1(e.target.value)
                            }}
                          />
                          <Input
                            className="col-span-1"
                            defaultValue={data?.Ubicacion?.split('-')[1]}
                            onChange={(e) => { setUbicacion2(e.target.value) }}
                          />
                          <Input
                            className="col-span-1"
                            defaultValue={data?.Ubicacion?.split('-')[2]}
                            onChange={(e) => {
                              setUbicacion3(e.target.value)
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="Observacion"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        defaultValue={data?.Observacion}
                        className="w-full mt-4"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-8">
              <Button type="submit" className="w-full">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
