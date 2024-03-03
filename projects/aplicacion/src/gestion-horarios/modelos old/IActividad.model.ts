export interface IActividad {
  idActividad: string;
  idSesion: string;
  detalleActividad: string;
  grupos: string[];
  docentes: string[];
  asignaturas: string[];
  dependencia: string;
  idPeriodoVigencia: string;
  idTipoActividad: string;
}
