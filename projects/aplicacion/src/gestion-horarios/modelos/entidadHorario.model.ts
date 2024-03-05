import { Asignatura } from '../modelos old/asignatura.model';
import { Docente } from '../modelos old/docente.model';
import { Dependencia } from '../modelos old/dependencia.model';
import { Grupo } from '../modelos old/grupo.model';
// import { Usuario } from './../../moduloAuth/models/usuario.model';
import { EnumTipoEntidadHorario } from "../modelos old/tipoEntidadHorario.model";
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class EntidadHorario {
  id: string;
  descripcion: string;
  detalle: string;
  imagen: string;
  tipoEntidad: EnumTipoEntidadHorario;

  constructor(entidad: Docente | Grupo | Dependencia ) {


    this.tipoEntidad = this.tipoEntidadHorario(entidad);

    switch (this.tipoEntidad) {
      case EnumTipoEntidadHorario.DOCENTE:
        const docente: Docente = entidad as Docente;
        this.descripcion = docente.apellido1 + ' ' + docente.apellido2 + ', ' + docente.nombre;
        this.detalle = 'Alias: ' + docente.alias;
        this.imagen = docente.foto;
        this.id = docente.idDocente;
        break;

      case EnumTipoEntidadHorario.GRUPO:
        const grupo: Grupo = entidad as Grupo;
        this.descripcion = grupo.denominacionLarga;
        this.detalle = 'Código: ' + grupo.codigo
        this.id = grupo.idGrupo
        break;

      case EnumTipoEntidadHorario.DEPENDENCIA:
        const dependencia: Dependencia = entidad as Dependencia;
        this.descripcion = dependencia.denominacionLarga;
        this.detalle = 'Código: ' +  dependencia.codigo;
        this.id = dependencia.idDependencia
        break;


    }

  };


  private tipoEntidadHorario(x: any): EnumTipoEntidadHorario
  {

    if (x && x.idDocente && typeof (x.idDocente) == 'string') return EnumTipoEntidadHorario.DOCENTE;
    if (x && x.idGrupo && typeof(x.idGrupo) == 'string') return EnumTipoEntidadHorario.GRUPO;
    if (x && x.idDependencia && typeof (x.idDependencia)) return EnumTipoEntidadHorario.DEPENDENCIA;
    else return EnumTipoEntidadHorario.DOCENTE;


  }



}
