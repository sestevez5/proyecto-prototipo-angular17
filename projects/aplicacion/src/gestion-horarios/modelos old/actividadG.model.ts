import { Sesion } from './sesion';
import { Actividad } from './actividad.model';
export class ActividadG extends Actividad{

  nivelAncho: number;
  color: string;
  public estado: EstadoActividad;

  constructor(actividad: Actividad) {
    super();
    this.idActividad = actividad.idActividad;
    this.detalleActividad = actividad.detalleActividad;
    this.sesion = actividad.sesion;
    this.docentes = actividad.docentes;
    this.dependencia = actividad.dependencia;
    this.grupos = actividad.grupos;
    this.asignaturas = actividad.asignaturas;
    this.periodoVigencia = actividad.periodoVigencia;
    this.nivelAncho = 0;
    this.color = '';
    this.tipoActividad = actividad.tipoActividad;

  }



}

export enum EstadoActividad {
  NUEVA = 0,
  MODIFICADA = 1,
  ELIMINADA = 2,
  SINCAMBIOS = 3
}

