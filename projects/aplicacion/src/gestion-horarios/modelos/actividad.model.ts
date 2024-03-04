import { ITipoActividad } from './tipoActividad.model';
import { IAlumno } from './alumno.model';
import { IDependencia } from './dependencia.model';
import { IPeriodoVigencia } from './peridoVigencia.model';
import { IGrupo } from './grupo.model';
import { IAsignatura } from './asignatura.model';
import { IDocente } from './docente.model';
import { ISesion } from './sesion.model';

// export class Actividad {
//   public tipoActividad: ITipoActividad;
//   public idActividad: string;
//   public sesion: ISesion;
//   detalleActividad: string;
//   docentes: IDocente[];
//   asignaturas: IAsignatura[];
//   grupos: IGrupo[];
//   dependencia: IDependencia | undefined;
//   periodoVigencia: IPeriodoVigencia;
//   alumnos: IAlumno[]  // Lazy load

//   public actualizarActividad(actividad: Actividad): void {
//     this.tipoActividad = actividad.tipoActividad;
//     this.detalleActividad = actividad.detalleActividad;
//     this.sesion = actividad.sesion;
//     this.docentes = actividad.docentes;
//     this.dependencia = actividad.dependencia;
//     this.grupos = actividad.grupos;
//     this.asignaturas = actividad.asignaturas;
//     this.periodoVigencia = actividad.periodoVigencia;
//   }
//}


//   public tipoActividad: ITipoActividad;
//   public idActividad: string;
//   public sesion: ISesion;
//   detalleActividad: string;
//   docentes: IDocente[];
//   asignaturas: IAsignatura[];
//   grupos: IGrupo[];
//   dependencia: IDependencia | undefined;
//   periodoVigencia: IPeriodoVigencia;
//   alumnos: IAlumno[]  // Lazy load
export interface IActividad {
  idActividad: string;
  tipoActividad: ITipoActividad;
  detalleActividad: string;
  grupos: IGrupo[];
  docentes: IDocente[];
  asignaturas: IAsignatura[];
  dependencia: IDependencia;
  idPeriodoVigencia: IPeriodoVigencia;
  sesion: ISesion;
}
