'use server'

import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "./db";
import { ZodError } from "zod";

export const addForm = async (formData: FormData): Promise<void> => {
  try {
    // Convertir formData a un objeto
    const formObject = Object.fromEntries(formData);

    console.log(formObject)
    // Crear una nueva instancia de la clase Form (si existe)
    // Realizar la solicitud POST con Axios

  } catch (error) {
    // Manejar errores, por ejemplo, lanzar una excepción o realizar algún registro
    console.error("Error al agregar formulario:", error);
    throw new Error("Error al agregar formulario");
  }
  revalidatePath("/Formularios")
  redirect("/Formularios")

  // This line will be reached after the try-catch block
};

export const deleteForm = async (formData: string) => {
  try {
    await db.client.collection('Formulario').delete(formData)
  } catch (error) {
    console.error('Error al eliminar Formulario', error)
    throw new Error("Error Al Eliminar Fomulario")
  }
  revalidatePath('/formularios')
  redirect('/formularios')
}

export const EditForm = async (formData: FormData) => {
  const formId = formData.get('id')?.toString() || ''
  const Ubicacion = formData.get('Ubicacion') || ''
  const TipoTrabajo = formData.get('TipoTrabajo') || ''
  const TrabajoRealizado = formData.get('TrabajoRealizado') || ''
  const Observacion = formData.get('Observacion') || ''
  const data = { Ubicacion: Ubicacion, TipoTrabajo: TipoTrabajo, TrabajoRealizado: TrabajoRealizado, Observacion: Observacion }
  try {
    await db.client.collection('Formulario').update(formId, data)
  } catch (e) {
    console.error('Error al Editer Formulario')
    throw new Error("Error al editar Fomulario")
  }
  revalidatePath('/formularios')
  redirect('/formularios')
}
export const EditUbi = async (ubiId: any, Descripcion: string) => {
  const { descripcion, id } = ubiId
  const data = { Descripcion: descripcion }
  try {
    await db.client.collection('Ubicacion').update(id, data)
  } catch (error) {
    console.error('Error al Editer Ubicacion')
    throw new Error("Error al editar Ubicacion")
  }
  revalidatePath("/ubicaciones")
  redirect("/ubicaciones")
}
export const createfile = async (fileInfo: any) => {

  try {
    await db.client.collection('Archivos').create(fileInfo);
    revalidatePath('/archivos')
  } catch (error) {
    console.error('error al crear el archivo', error);
    throw error; // propaga el error para manejarlo en el componente si es necesario
  }
};
export const deleteFile = async (fileId: string) => {
  try {
    await db.client.collection('Archivos').delete(fileId)
    revalidatePath('/Archivos')

  } catch (error) {
    console.error('error al eliminar archivo', error)
    throw error

  }
}

export type State =
  | {
    status: "success";
    message: string;
  }
  | {
    status: "error";
    message: string;
    errors?: Array<{
      path: string;
      message: string;
    }>;
  }
  | null;

