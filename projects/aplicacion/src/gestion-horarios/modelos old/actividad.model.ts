import { TipoActividad } from './tipoActividad.model';
import { IActividad } from './IActividad.model';
import { Alumno } from './alumno.model';
import { Dependencia } from './dependencia.model';
import { PeriodoVigencia } from './peridoVigencia';
import { Grupo } from './grupo.model';
import { Asignatura } from './asignatura.model';
import { Docente } from './docente.model';
import { Sesion } from './sesion';

export class Actividad {
  public tipoActividad: TipoActividad;
  public idActividad: string;
  public sesion: Sesion;
  detalleActividad: string;
  docentes: Docente[];
  asignaturas: Asignatura[];
  grupos: Grupo[];
  dependencia: Dependencia | undefined;
  periodoVigencia: PeriodoVigencia;
  alumnos: Alumno[]  // Lazy load

  public actualizarActividad(actividad: Actividad): void {
    this.tipoActividad = actividad.tipoActividad;
    this.detalleActividad = actividad.detalleActividad;
    this.sesion = actividad.sesion;
    this.docentes = actividad.docentes;
    this.dependencia = actividad.dependencia;
    this.grupos = actividad.grupos;
    this.asignaturas = actividad.asignaturas;
    this.periodoVigencia = actividad.periodoVigencia;
  }

  public obtenerIActividad(): IActividad {

    return {
      idActividad: this.idActividad,
      idSesion: this.sesion.idSesion,
      detalleActividad: this.detalleActividad,
      grupos: this.grupos.map(grupo => grupo.idGrupo),
      docentes: this.docentes.map(docente => docente.idDocente),
      asignaturas: this.asignaturas.map(asignatura => asignatura.idAsignatura),
      dependencia: this.dependencia.idDependencia,
      idPeriodoVigencia: this.periodoVigencia.idPeriodoVigencia,
      idTipoActividad: this.tipoActividad.idTipoActividad
    }
  }
}



