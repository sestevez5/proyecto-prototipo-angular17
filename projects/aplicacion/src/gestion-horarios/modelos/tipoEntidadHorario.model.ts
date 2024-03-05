export enum EnumTipoEntidadHorario {
  DOCENTE = 'docentes',
  GRUPO = 'grupos',
  DEPENDENCIA = 'dependencias'
};


export class TipoEntidadHorario {
  tipoEntidadHorario: EnumTipoEntidadHorario;
  color: string;

  constructor(tipoEntidadHorario: EnumTipoEntidadHorario) {
    switch (tipoEntidadHorario) {
      case EnumTipoEntidadHorario.DOCENTE:
        this.tipoEntidadHorario = EnumTipoEntidadHorario.DOCENTE;
        this.color= '#FF6961';

        break;

        case EnumTipoEntidadHorario.DEPENDENCIA:
          this.tipoEntidadHorario = EnumTipoEntidadHorario.DEPENDENCIA;
          this.color= '#77DD77';

        break;

        case EnumTipoEntidadHorario.GRUPO:
          this.tipoEntidadHorario = EnumTipoEntidadHorario.GRUPO;
          this.color= '#84B6F4';

          break;

      default:
        break;
    }
  }
}



