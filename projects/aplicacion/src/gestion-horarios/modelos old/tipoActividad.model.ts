export interface TipoActividad {
  idTipoActividad: string;
  codigo: string;
  denominacionLarga: string;
  obligaDocentes: boolean;
  permiteDocentes: boolean
  obligaAsignaturas: boolean;
  permiteAsignaturas: boolean;
  obligaGrupos: boolean;
  permiteGrupos: boolean;
  obligaDetalle: boolean;
  permiteDetalle: boolean;
  esLectiva: boolean;
  tipoPredeterminado: boolean

}
