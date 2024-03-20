import PocketBase from "pocketbase";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
export const pb = new PocketBase('https://pym-database.pockethost.io');
export const LOCAL_URL = 'https://pym-database.pockethost.io/api/collections'
export const GETUSER_API = 'users/records'
export const WEEK_API = 'Formularios_Semanal/records'
export const FORM_API = 'Formulario/records'
export const UBIS_API = 'Ubicacion/records'
export const FILE_API = 'Archivos/records'
export const CARP_API = 'Carpetas/records'
export const ROL_API = 'Roles/records'
export const USER_API = 'users/auth-with-password'

export class DatabaseClient {
  client: PocketBase;

  constructor() {
    this.client = new PocketBase('https://pym-database.pockethost.io');
  }

  async authenticate(email: string, password: string) {
    try {
      const result = await this.client.collection("users").authWithPassword(email, password);
      console.log('authenticate result:', result);
      if (!result?.token) {
        throw new Error("Invalid email or password");
      }
      return result;
    } catch (err) {
      console.error(err);
      throw new Error("Invalid email or password");
    }
  }

  async register(email: string, password: string) {
    try {
      const result = await this.client.collection("users").create({
        email,
        password,
        passwordConfirm: password,
      });

      return result;
    } catch (err) {

    }
  }

  async isAuthenticated(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get('pb_auth');
    if (!cookie) {
      return false;
    }

    this.client.authStore.loadFromCookie(cookie?.value || '');
    return this.client.authStore.isValid || false
  }

  async getUser(cookieStore: ReadonlyRequestCookies) {
    const cookie = cookieStore.get('pb_auth');
    if (!cookie) {
      return null;
    }

    this.client.authStore.loadFromCookie(cookie?.value || '');
    return this.client.authStore.model;
  }
}


export const db = new DatabaseClient();

export default db;



