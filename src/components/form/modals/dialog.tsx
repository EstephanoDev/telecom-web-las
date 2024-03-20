'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DatePickerDemo } from "./datePicker"
import { createForm } from './createform'
import { Textarea } from "@/components/ui/textarea"
import { SelectDemo } from "./selectType"
import { useForm } from "react-hook-form"
import { formSchemaClient } from "@/lib/validations"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import CustomSelect from 'react-select'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



export function DialogForm({ children, user, users: initialUsers }: { children: React.ReactNode, user: string, users: any }) {
  let [open, setOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ubicacion1, setUbicacion1] = useState('');
  const [ubicacion2, setUbicacion2] = useState('');
  const [ubicacion3, setUbicacion3] = useState('');
  const [ubicacionCompleta, setUbicacionCompleta] = useState('');
  const [users, setUsers] = useState(initialUsers); // Estado para almacenar los usuarios

  const formRef = useRef<any>(null);
  useEffect(() => {
    // Filtrar opciones solo cuando la longitud de la búsqueda es al menos 3
    if (searchQuery.length >= 3) {
      const filtered = users.filter(
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
  }, [searchQuery, users]);

  async function fetchUsers() {
    // Realiza el fetch solo si la lista de usuarios está vacía
    if (users.length === 0) {
      try {
        // Realiza el fetch para obtener la lista de usuarios
        const response = await fetchUsers();
        const data = response;
        // Actualiza el estado con la lista de usuarios recuperada
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []); // Solo se ejecuta una vez al montar el componente


  const handleSelectChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions);
  };
  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
  };


  const form = useForm<z.infer<typeof formSchemaClient>>({
    resolver: zodResolver(formSchemaClient),
  })


  async function onSubmit(values: z.infer<typeof formSchemaClient>) {
    const ubicacion = `${ubicacion1}-${ubicacion2}-${ubicacion3}`
    setUbicacionCompleta(ubicacion);
    const grupo = selectedUsers.map((user: any) => user.value);
    const userId = user;
    toast.promise(() => createForm(values, userId, grupo, ubicacion), {
      error: 'Error al crear Formulario',
      success: 'Formulario Enviado'
    });
    setOpen(false);

  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{children}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[825px] mx-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="Trabajador"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input hidden name="Trabajador" value='trabajador' />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogHeader>
              <DialogTitle className="mb-8">Formulario</DialogTitle>
            </DialogHeader>
            <DialogDescription className="mb-4">
              Envia tu Formulario
            </DialogDescription>
            <div className="grid gap-4 mb-8 ">
              <div className="items-center justify-center">
                <FormField
                  control={form.control}
                  name="Fecha"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" items-center gap-4">
                <FormField
                  control={form.control}
                  name="Grupo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grupo</FormLabel>
                      <FormControl>
                        <CustomSelect
                          className="mb-4 text-black"
                          isMulti
                          name="Grupo"
                          options={filteredOptions}
                          value={selectedUsers}
                          onChange={handleSelectChange} // Handle Select change
                          onInputChange={handleInputChange} // Handle input change
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="TipoTrabajo"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="TipoTrabajo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='RD'>RD</SelectItem>
                          <SelectItem value='RA'>RA</SelectItem>
                          <SelectItem value='DP'>DP</SelectItem>
                          <SelectItem value='BANDEJAS'>BANDEJAS</SelectItem>
                          <SelectItem value='INSTALACIONES'>INSTALACIONES</SelectItem>
                          <SelectItem value='ACTIVACIONES'>ACTIVACIONES</SelectItem>
                          <SelectItem value='BOTH'>INSTALACIONES Y ACTIVACIONES</SelectItem>
                          <SelectItem value='BACKBONE(SOPLADO)'>BACKBONE(FUSIONES)</SelectItem>
                          <SelectItem value='BACKBONE(FUSIONES)'>BACKBONE(FUSIONES)</SelectItem>
                          <SelectItem value='AVERIAS'>AVERIAS</SelectItem>
                          <SelectItem value='OTROS'>OTROS</SelectItem>
                        </SelectContent>
                      </Select>
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
                          placeholder="TrabajoRealizado"
                          type="number"
                          min={0}
                          className="ml-20 "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="items-center">
                <div className="flex mb-4">
                  <FormField
                    control={form.control}
                    name="Ubicacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex mb-4">
                            <Input
                              className="flex-1 mr-2"
                              placeholder="xxx"
                              onChange={(e) => {
                                setUbicacion1(e.target.value)
                              }}
                            />
                            <Input
                              className="flex-1 mr-2"
                              placeholder="xxx"
                              onChange={(e) => { setUbicacion2(e.target.value) }
                              }
                            />
                            <Input
                              className="flex-1"
                              placeholder="xxxxx"
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
              </div>
              <div className="items-center  w-full">
                <FormField
                  control={form.control}
                  name="Observacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Escribe tu Observacion aqui!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
