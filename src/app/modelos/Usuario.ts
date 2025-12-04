import { Direccion } from './Direccion';
import { Nivel } from './Nivel';

export class Usuario {
  email?: string;
  nombre?: string;
  apellidos?: string;
  fechaNacimiento?: string;
  telefono?: string;
  direccion?: Direccion;
  foto?: string;
  nivel?: Nivel;
  id?: number;
}
