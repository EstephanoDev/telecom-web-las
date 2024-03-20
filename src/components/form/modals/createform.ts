'use server'

import db from "@/lib/db";
import { Formularios } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
export const createForm = async (values: any, userId: string, grupo: string[], ubicacion: string) => {
  try {
    // Convertir TrabajoRealizado a número si es posible
    const trabajoRealizado = parseInt(values.TrabajoRealizado);
    if (isNaN(trabajoRealizado)) {
      throw new Error("TrabajoRealizado debe ser un número");
    }

    // Formatear la fecha en el formato requerido
    const fecha = new Date(values.Fecha);
    const formattedFecha = fecha.toISOString().slice(0, 19).replace('T', ' ');

    // Agregar userId a values y fecha formateada
    const formValues = {
      ...values,
      Trabajador: userId,
      Fecha: formattedFecha,
      TrabajoRealizado: trabajoRealizado,
      Grupo: grupo,
      Ubicacion: ubicacion
    };

    let result;

    if (values.TipoTrabajo == 'BOTH') {
      const formValuesInstalaciones = {
        ...formValues,
        TipoTrabajo: 'INSTALACIONES'
      };

      const formValuesActivaciones = {
        ...formValues,
        TipoTrabajo: 'ACTIVACIONES'
      };
      console.log(formValuesActivaciones)

      await db.client.collection('Formulario').create(formValuesInstalaciones),
        await db.client.collection('Formulario').create(formValuesActivaciones)
    } else {
      // Enviar el formulario una vez para cualquier otro TipoTrabajo
      result = await db.client.collection('Formulario').create(formValues);
    }

    // Si llega aquí, el formulario se ha enviado correctamente

  } catch (error) {
    // Manejar errores, por ejemplo, lanzar una excepción o realizar algún registro
    console.error("Error al agregar formulario:", error);
    throw new Error("Error al agregar formulario");
  }

  revalidatePath("/formularios");

  // Esta línea se alcanzará después del bloque try-catch
};

export const editForm = async (values: any, ubicacion: string, grupo: string[] | undefined, formId: string) => {
  const data = {
    ...values,
    Ubicacion: ubicacion,
    Grupo: grupo
  }
  try {
    console.log(data)
    const record = await db.client.collection('Formulario').update(formId, data);
    console.log(record)
  } catch (error) {
    console.log(error)
    throw error
  }
  revalidatePath('/formularios')
}
