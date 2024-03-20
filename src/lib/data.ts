import { Formularios, GetFormResponse, GetRolResponse, UserData, WeekForms } from "./types";
import db, { GETUSER_API, LOCAL_URL, UBIS_API, WEEK_API, FORM_API, FILE_API } from "./db"
import axios from 'axios'

export async function fetchForms(ubi: string | undefined, filter: string | undefined): Promise<Formularios[]> {
  let ubiFilter = '';
  if (ubi) {
    ubiFilter = `Ubicacion ?~ '${ubi}'`;
  }

  let finalFilter = '';
  if (filter) {
    finalFilter = `TipoTrabajo ?~ '${filter}'`;
  }

  if (ubiFilter && finalFilter) {
    finalFilter = `(${ubiFilter}) AND (${finalFilter})`;
  } else if (ubiFilter || finalFilter) {
    finalFilter = ubiFilter || finalFilter;
  }

  const forms = await db.client.collection('Formulario').getList(1, 20, {
    sort: '-created',
    filter: finalFilter
  });
  const newForms = getGroupByIds(forms.items as Formularios[])
  return newForms
}

export async function fetchUsers(): Promise<UserData[]> {
  db.client.autoCancellation(false)
  const result = await db.client.collection('users').getFullList()
  return result as UserData[];
}


async function getRolById(userId: string): Promise<GetRolResponse> {
  const rol: GetRolResponse = await db.client.collection('users').getList(1, 2, {
    filter: `id = '${userId}'`
  });
  return rol;  // Return the entire object, not just rol.items
}
export async function getRol() {
  const rol = await db.client.collection('roles').getFullList()
  return rol;  // Return the entire object, not just rol.items
}
export async function getData() {
  const users = await axios.get(`${LOCAL_URL}/${GETUSER_API}`)
  return users.data.items
}
export async function getAllForms(): Promise<Formularios[]> {
  const forms = await axios.get(`${LOCAL_URL}/${FORM_API}`)
  return forms.data.items
}


export async function getFormsById(userId: string, search?: string): Promise<Formularios[]> {
  db.client.autoCancellation(false)
  const forms: any = await db.client.collection('Formulario').getList(1, 50, {
    filter: `Trabajador = '${userId}'`
  });
  const newForms = getGroupByIds(forms.items)
  return newForms
}
export async function getWeekForms(): Promise<WeekForms[]> {
  const forms = await axios.get(`${LOCAL_URL}/${WEEK_API}`)
  return forms.data.items
}

export async function getDataforWeekChart() {
  const records = await db.client.collection('Formularios_Semanal').getList(1, 50, {
    filter: 'TipoTrabajo = "ACTIVACIONES"'
  })
  return records.items
}

export const fetchUbis = async () => {
  try {
    const records = await axios.get(`${LOCAL_URL}/${UBIS_API}`)
    return records.data.items
  } catch (error) {
    console.error('Error al fetch Ubicacion:', error)

  }
}

export async function getForms(search: string, filter: string): Promise<Formularios[]> {
  try {
    db.client.autoCancellation(false)
    const forms: GetFormResponse = await db.client.collection('Formulario').getList(1, 20, {
      filter: `Ubicacion ?~ '${search}' && TipoTrabajo ?~ '${filter}'`
    })
    const newForms = getGroupByIds(forms.items)
    return newForms

  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be caught by the calling code FF
  }
}
async function getGroupByIds(forms: Formularios[]) {
  // Extracting Grupo values from the resultList.items
  const grupoIds: any = forms.flatMap(item => item.Grupo);

  // Fetching user names based on Grupo ids
  const userNames = await fetchUserNames(grupoIds);

  const resultadoFinal = forms.map(item => ({
    ...item,
    TrabajoRealizadoValues: item.TipoTrabajo === 'BANDEJAS' || 'DP' || 'INSTALACIONES' ? `${item.TrabajoRealizado} und` : `${item.TrabajoRealizado} m`,
    NombreUsuario: item.Grupo?.map(groupId => userNames[groupId]).join(' - ') || 'No'
  }));

  return resultadoFinal;
}
const fetchUserNames = async (grupoIds: string[]) => {
  const filterExpression = grupoIds.map(id => `id = "${id}"`).join(' || ');

  try {
    const resultList = await db.client.collection('users').getList(1, 50, {
      filter: `(${filterExpression})`
    });

    // Create a mapping of user id to user name
    const userNames: Record<string, string> = {};
    resultList.items.forEach(user => {
      userNames[user.id] = user.name;
    });

    return userNames;
  } catch (error) {
    console.error('Error fetching user names:', error);
    return {};
  }
};
export const fetchForm = async (id: string) => {
  const records = await db.client.collection('Formulario').getOne(id)
  const userNames = await fetchUserNames(records.Grupo)
  const resultadoFinal = {
    ...records,
    NombreUsuario: records.Grupo?.map((groupId: any) => userNames[groupId]).join(' - ') || 'No'
  }
  return resultadoFinal as Formularios
}
export const getFiles = async () => {
  const records = await axios.get(`${LOCAL_URL}/${FILE_API}`)
  return records.data
}
