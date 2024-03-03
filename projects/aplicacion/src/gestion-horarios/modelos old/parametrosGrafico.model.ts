import { ParametrosHorario } from './parametrosHorario.model';

export interface parametrosGrafico {

  // Parámetros del gráfico, en general.
  parametrosHorario: ParametrosHorario | undefined;

  grafico: {
    colorGrafico: string;
    margenGrafico: {
      margenIzquierdoGrafico:  number;
      margenDerechoGrafico:    number;
      margenSuperiorGrafico:   number;
      margenInferiorGrafico:   number;
    };
    anchoGrafico:  number | undefined;
    altoGrafico:   number | undefined;
  }

  panelHorario: {
    anchoPanelHorario:  number | undefined;
    altoPanelHorario:   number | undefined;
    colorPanelHorario:  string;
  }

  panelDiaSemana: {
    //colorPanelDiaSemana: string;
  }

  panelSesiones: {
    margenLateral: number; // porcentaje
    anchoSesion: number | undefined;
    altoCabecera: number;
    colorCabecera: string;
    colorCuerpo: string;

  }

  escalas: {
    escalaVertical: any;
    escalaHorizontal: any;
  }

  actividades: {
    tamanyoTexto: string;
    porcentajeZonaSeleccionActividad: number | undefined;
    colores: string[]
  }


}
