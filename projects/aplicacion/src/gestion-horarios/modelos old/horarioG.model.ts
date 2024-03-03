import { Asignatura } from './asignatura.model';
import { IActividadesSesion } from './actividadesSesion.model';
import { ParametrosHorario } from './parametrosHorario.model';
import { Sesion } from './sesion';
import { Plantilla } from './plantilla.model';
import { Subject } from 'rxjs';
import { parametrosGrafico } from './parametrosGrafico.model';
import { DiaSemana } from './diaSemana.model';
import { ActividadG, EstadoActividad } from './actividadG.model';
import { Actividad } from './actividad.model';
import * as d3 from 'd3';
import { ParsedEvent } from '@angular/compiler';


export class HorarioG {

  elementoRaiz: any;
  svg: any;
  eventos$ = new Subject<ActividadG>();

  static diasSemana: DiaSemana[] = [
    { codigo: 'L', denominacionCorta: 'LUN', denominacionLarga: 'Lunes' },
    { codigo: 'M', denominacionCorta: 'MAR', denominacionLarga: 'Martes' },
    { codigo: 'X', denominacionCorta: 'MIE', denominacionLarga: 'Miércoles' },
    { codigo: 'J', denominacionCorta: 'JUE', denominacionLarga: 'Jueves' },
    { codigo: 'V', denominacionCorta: 'VIE', denominacionLarga: 'Viernes' },
    { codigo: 'S', denominacionCorta: 'SAB', denominacionLarga: 'Sábado' },
    { codigo: 'D', denominacionCorta: 'DOM', denominacionLarga: 'Domingo' },
  ];

  plantilla: Plantilla;

  params: parametrosGrafico = {

    parametrosHorario: undefined,

    // Parámetros generales
    grafico: {
      anchoGrafico: undefined,
      altoGrafico: undefined,
      colorGrafico: 'white',
      margenGrafico: {
        margenInferiorGrafico:     3,
        margenDerechoGrafico:      3,
        margenSuperiorGrafico:     5,
        margenIzquierdoGrafico:    5,
      },
    },

    panelHorario: {
      altoPanelHorario:     undefined,
      colorPanelHorario:    '#ffffff',
      anchoPanelHorario:    undefined
    },

    panelDiaSemana: {
      colorPanelDiaSemana: '#111111',
    },

    panelSesiones: {

      margenLateral: 0,
      altoCabecera: 11,
      anchoSesion: undefined,
      colorCabecera:'#ffffff',
      colorCuerpo:'#eeeeee'

    },

    escalas: {
      escalaVertical: undefined,
      escalaHorizontal: undefined
    }

  }

  public static convertirCadenaHoraEnTiempo: any = d3.timeParse("%I:%M");
  public static convertirTiempoEnCadenaHora: any = d3.timeFormat("%I:%M")

  actividadesG: ActividadG[] = [];

  constructor(elementoRaiz: string) {
    this.elementoRaiz = elementoRaiz;
  }

  renderizarGrafico(parametrosHorario: ParametrosHorario, plantilla?: Plantilla) {
    window.addEventListener('resize', this.generarGrafico.bind(this,parametrosHorario, plantilla));
    this.generarGrafico(parametrosHorario, plantilla);
  }

  borrarActividades(idActividades: string[]) {

    this.actividadesG.filter(actG => idActividades.includes(actG.idActividad)).
    map(actG => actG.estado = EstadoActividad.ELIMINADA)
    this.actualizarPanelesActividades();

  }

  actualizarActividades(actividades: Actividad[]) {

    this.actividadesG = [];
    actividades.forEach(
      act => {
        const nuevaActividadG = new ActividadG(act);
        nuevaActividadG.estado = EstadoActividad.NUEVA
        this.actividadesG.push(nuevaActividadG);
      }
    );

    this.calcularFactorAnchoActividadesG(this.actividadesG.filter(actG => (actG.estado === EstadoActividad.NUEVA) || this.actividadesG.filter(actG => actG.estado === EstadoActividad.MODIFICADA)));

    this.actualizarPanelesActividades();


  }



  //----------------------------------------------------------------------------------------------------------
  // RENDERIZADO DEL HORARIO
  //----------------------------------------------------------------------------------------------------------
  generarGrafico(parametrosHorario: ParametrosHorario, plantillaActual?: Plantilla) {

    if (this.svg) d3.select('svg').remove();
    this.svg = d3.select(this.elementoRaiz).append('svg');

    this.inicializarParametros(parametrosHorario);
    this.configurarSvg();
    this.anyadirPanelHorario();
    this.anyadirPanelesDiasSemana();
    if (plantillaActual) {
      this.plantilla = plantillaActual;
      this.anyadirPlantilla(this.plantilla);
    }


  }

  private configurarSvg()
  {
    //-------------------------------------------------
    // Definición del SVG
    //-------------------------------------------------

    this.svg
      .attr('width', this.params.grafico.anchoGrafico)
      .attr('height', this.params.grafico.altoGrafico)




    //-------------------------------------------------
    // Definición del rectángulo
    //-------------------------------------------------
    this.svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('id', 'fondografico')
      .attr('fill', this.params.grafico.colorGrafico)
      .attr('rx', '10')
      .attr('ry', '10')

    this.anyadirDefs(this.svg);

  }

  private inicializarParametros(parametrosHorario: ParametrosHorario) {

    this.params.parametrosHorario = parametrosHorario;

    // Cálculo del rango en horas del horario
    const fechaFin: Date = HorarioG.convertirCadenaHoraEnTiempo(this.params.parametrosHorario.horaMaxima);
    const fechaInicio: Date = HorarioG.convertirCadenaHoraEnTiempo(this.params.parametrosHorario.horaMinima);
    // El resultado vienen en milisegundos y los convierto en horas.
    const rangoEnHoras = (fechaFin.getTime()-fechaInicio.getTime())/(3600000)

    this.params.grafico.anchoGrafico = parseFloat(d3.select(this.elementoRaiz).style('width'));
    this.params.grafico.altoGrafico = parseFloat(d3.select(this.elementoRaiz).style('height')) * Math.max(1, rangoEnHoras / 7);


    // Establecer dimensiones del panel que contiene las barras.
    this.params.panelHorario.anchoPanelHorario  = this.params.grafico.anchoGrafico * ((100-this.params.grafico.margenGrafico.margenIzquierdoGrafico - this.params.grafico.margenGrafico.margenDerechoGrafico)/100);
    this.params.panelHorario.altoPanelHorario   = this.params.grafico.altoGrafico * ((100-this.params.grafico.margenGrafico.margenSuperiorGrafico - this.params.grafico.margenGrafico.margenInferiorGrafico)/100);

    // Establecer escala horizontal: Serán bandas que identifiquen a los días de la semana
    this.params.escalas.escalaHorizontal = d3.scaleBand()
      .domain(this.obtenerDiasSemanaHorario().map(ds=> ds.denominacionLarga))
      .range([0, this.params.panelHorario.anchoPanelHorario])
      .paddingInner(0.0)
      .paddingOuter(0.0);

    // Establecer escala vertical:
    this.params.escalas.escalaVertical = d3.scaleTime()
      .domain([this.minimoIntervaloTemporal(), this.maximoIntervaloTemporal()])
      .range([0, this.params.panelHorario.altoPanelHorario])

    // Calcular el ancho de las sesiones.
    this.params.panelSesiones.anchoSesion = parseFloat(this.params.escalas.escalaHorizontal.bandwidth()) * (100-this.params.panelSesiones.margenLateral * 2)*0.01;

  }

  private anyadirPanelHorario() {

    //-------------------------------------------------
    // Definición del panel
    //-------------------------------------------------
    const coordenadaXPanel = this.params.grafico.anchoGrafico as number * (this.params.grafico.margenGrafico.margenIzquierdoGrafico / 100);
    const coordenadaYPanel = this.params.grafico.altoGrafico as number * (this.params.grafico.margenGrafico.margenSuperiorGrafico / 100);
    const panelHorario = this.svg.append('g')
      .attr('id', 'panelHorario')
      .attr('transform', `translate(${coordenadaXPanel},${coordenadaYPanel})`)

    //-------------------------------------------------
    // Rectángulo asociado
    //-------------------------------------------------
    panelHorario.append('rect')
      .attr('id', 'fondoPanelHorario')
      .attr('width', this.params.panelHorario.anchoPanelHorario)
      .attr('height', this.params.panelHorario.altoPanelHorario)
      .attr('fill', this.params.panelHorario.colorPanelHorario);

    //-------------------------------------------------
    // Adicón del eje X
    //-------------------------------------------------
    var ejeX = d3.axisTop(this.params.escalas.escalaHorizontal as d3.ScaleBand<string>);

    panelHorario.append('g')
      .attr('class', 'ejeX')
      .call(ejeX);

    //-------------------------------------------------
    // Adición del eje Y
    //-------------------------------------------------
    var ejeY = d3.axisLeft(this.params.escalas.escalaVertical);

    ejeY.ticks(d3.timeMinute.every(60))

    panelHorario.append('g')
      .attr('class', 'ejeY')
      .attr('stroke', '#aaa')

      .call(ejeY)
      .select('path')
      .attr('stroke','#fff')

    //-------------------------------------------------
    // Devolución
    //-------------------------------------------------
    return panelHorario;
  }
  private anyadirPanelesDiasSemana() {

    //-------------------------------------------------
    // Definición del panel
    //-------------------------------------------------
    const aux: any = d3.select('g#panelHorario').selectAll('g#panelDiaSemana').data(this.obtenerDiasSemanaHorario());
    const panelesDiasSemana = d3.select('g#panelHorario').selectAll('g#panelDiaSemana').data(this.obtenerDiasSemanaHorario()).enter().append('g');

    panelesDiasSemana.merge(aux)
      .attr('id', (d: DiaSemana) => d.codigo)
      .attr('class', 'panelDiaSemana')
      .attr('transform', (d: DiaSemana) => `translate(${this.params.escalas.escalaHorizontal ? this.params.escalas.escalaHorizontal(d.denominacionLarga) : 0},0)`);

    panelesDiasSemana.exit().remove();

    panelesDiasSemana
      .append('line')
      .attr('x1', this.params.escalas.escalaHorizontal?.bandwidth)
      .attr('y1', 0)
      .attr('x2', this.params.escalas.escalaHorizontal?.bandwidth)
      .attr('y2', this.params.panelHorario.altoPanelHorario as number)
      .attr('stroke-width', '0.1')
      .attr('stroke', 'black')
      .attr('stroke-dasharray','1')

    //-------------------------------------------------
    // Devolución
    //-------------------------------------------------
    return panelesDiasSemana;

  }
  public anyadirPlantilla(pl: Plantilla) {

    d3.selectAll('g.panelSesiones').remove();

    d3.selectAll('g.panelDiaSemana').nodes().forEach(
      (nodo: any) => {
        const sesionesACrear = pl.sesionesPlantilla
          .filter(sesion => sesion.diaSemana === nodo['id']);
        this.renderizarSesiones('g#' + nodo['id'], sesionesACrear)
      }
    );
  }
  private actualizarPanelesActividades() {

    this.svg.selectAll('g.panelSesionActividades').remove();

    d3.selectAll('g.panelDiaSemana').nodes().forEach(
       (nodo: any) => {
         const actividadesACrear = this.actividadesG.filter(actG => actG.sesion.diaSemana === nodo['id']);
         this.renderizarActividades('g#' + nodo['id'], actividadesACrear)
       }
     );

  }

  //----------------------------------------------------------------------------------------------------------
  // MANTENIMIENTO GRÁFICO DE ACTIVIDADES
  //----------------------------------------------------------------------------------------------------------
  renderizarSesiones(panelDiaSemana: string, sesiones: Sesion[]) {

    const anchoSesion = this.params.panelSesiones.anchoSesion ? this.params.panelSesiones.anchoSesion.toString() : '0';

    // Definición del panel
    const panelSesion = d3.select(panelDiaSemana).selectAll('g#sesion' + 'pp').data(sesiones).enter().append('g')
      .attr('transform', d => `translate(${ this.params.panelSesiones.margenLateral  },${this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.horaInicio))})`)
      .attr('class', 'panelSesion')
      .attr('id', d => 'ses' + d.idSesion);

    const panelCabeceraSesion = panelSesion.append('g')
      .attr('class', 'panelCabeceraSesion');

    // Definicion del rectángulo que representa a la cabecera de la sesión.
    panelCabeceraSesion.append('rect')
      .attr('class', 'fondoPanelSesionCabecera')
      .attr('id', d => 'fondoPanelSesionCabecera' + d.idSesion)
      .attr('height',this.params.panelSesiones.altoCabecera)
      .attr('width', anchoSesion)
      .attr('fill', this.params.panelSesiones.colorCabecera);

    panelCabeceraSesion.append('text')
      .attr('x', parseInt(anchoSesion) / 2)
      .text(d => d.horaInicio + ' - ' + d.horaFin)
      .attr('y', this.params.panelSesiones.altoCabecera / 2)
      .attr('font-size','.5em')
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', 'middle')

    const panelCuerpoSesion = panelSesion.append('g')
      .attr('class', 'panelCabeceraSesion')
      .attr('transform', d => `translate(0,${this.params.panelSesiones.altoCabecera})`);

    // Definición del fondo.
    panelCuerpoSesion.append('rect')
      .attr('class', 'fondoPanelSesion')
      .attr('id', d => 'fondoPanelSesion' + d.idSesion)
      .attr('height', (d: Sesion) => {
        const coordenadaHoraInicio = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.horaInicio));
        const coordenadaHoraFin = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.horaFin));
        return coordenadaHoraFin - coordenadaHoraInicio - this.params.panelSesiones.altoCabecera;
      })
      .attr('width', anchoSesion)
      .attr('fill', this.params.panelSesiones.colorCuerpo)
      // .attr('stroke', 'black')
      // .attr('stroke-width', '1');



  } // Fin renderizarActividades

  renderizarActividades(panelDiaSemana: string, actividadesG: ActividadG[]) {

    // Paso 0: Transformamos la colección de actividades agrupándolas por sesiones.
    const actividadesSesion: IActividadesSesion[] = this.obtenerActividadesSesiones(actividadesG);

    // Paso 1:  Crear los paneles que representarán a las actividades de una sesión
    const panelesSesionActividades = this.crearPanelesSesionActividades(panelDiaSemana, actividadesSesion);

    // Paso 2: Crear la cabecera de los paneles anteriores.
    const panelCabeceraSesionActividades = this.crearPanelCabeceraSesionConActividades(panelesSesionActividades);

    // Paso 3: Añadir los botones a la cabecera anterior.
    this.anyadirBotonesPanelCabeceraSesionesActividades(panelCabeceraSesionActividades);

    // Paso 4: añadir el panel que contendrá a todas las actividades de la sesion "cuerpo de la sesión actividad".
    this.crearPanelCuerpoSesionConActividades(panelesSesionActividades);

    this.añyadirPanelesActividades(actividadesSesion)

    // Paso 5: añadir los paneles que representarán a cada una de las actividades.

  } // Fin renderizarActividades

  crearPanelesSesionActividades(panelDiaSemana: string, actividadesSesion: IActividadesSesion[]) {
    const panelSesionActividades = d3.select(panelDiaSemana)
      .selectAll('g#act' + 'xx')
      .data(actividadesSesion)
      .enter()
      .append('g')
      .attr('transform', d => `translate(0,${this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.sesion.horaInicio))})`)
      .attr('class', 'panelSesionActividades')
      .attr('id', d => 'panelSesionActividades' + d.sesion.idSesion)
      .attr('data-actividades', d => d.actividades.map(act => act.idActividad).join(','))
      .attr('data-actividadVisible', d => d.actividades[0].idActividad)

    // panelSesionActividades.append('rect')
    //   .attr('height', d => {
    //     const coordenadaHoraInicio = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.sesion.horaInicio));
    //     const coordenadaHoraFin = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.sesion.horaFin));
    //     return coordenadaHoraFin - coordenadaHoraInicio;
    //   })
    //   .attr('width', d => this.params.escalas.escalaHorizontal.bandwidth())
    //   .attr('fill', 'red')
    //   .attr('opacity', '0.4')
    //   .attr('rx', 2)
    //   .attr('ry', 2);




    return panelSesionActividades;

  }
  crearPanelCabeceraSesionConActividades(panelSesionActividades: any) {
    const anchoSesion = this.params.panelSesiones.anchoSesion ? this.params.panelSesiones.anchoSesion.toString() : '0';
    const altoCabeceraSesion = this.params.panelSesiones.altoCabecera;

    //---------------------------------------------------------------------------------
    // Paso1: Añadimos el panel cabecera para la sesión que representa con sus actividades.
    // Su identificador será el texto 'panelCabeceraSesionConSusActividades' con el id de la
    // sesión.
    //---------------------------------------------------------------------------------
    const panelCabeceraSesionConActividades = panelSesionActividades.append('g')
      .attr('class', 'panelCabeceraSesionConSusActividades')
      .attr('id', (d: IActividadesSesion) => 'panelCabeceraSesionConSusActividades' + d.sesion.idSesion);

    //---------------------------------------------------------------------------------
    // Definicion del rectángulo que representa a la cabecera de la sesión.
    //---------------------------------------------------------------------------------
    panelCabeceraSesionConActividades.append('rect')
      .attr('class', 'rectPanelCabeceraSesionConSusActividades')
      .attr('height', altoCabeceraSesion)
      .attr('width', anchoSesion)
      .attr('fill', 'grey');

    // Se añade el texto de la cabecera: hora inicio-fin
    panelCabeceraSesionConActividades.append('text')
      .attr('x', parseInt(anchoSesion) / 2)
      .text((d: IActividadesSesion) => d.sesion.horaInicio + ' - ' + d.sesion.horaFin)
      .attr('y', altoCabeceraSesion / 2)
      .attr('font-size', '.8em')
      .attr('fill', 'white')
      .attr('dominant-baseline', 'central')
      .attr('text-anchor', 'middle');

     return panelCabeceraSesionConActividades;
  }
  anyadirBotonesPanelCabeceraSesionesActividades(pcca: any) {
    const anchoSesion = this.params.panelSesiones.anchoSesion ? this.params.panelSesiones.anchoSesion.toString() : '0';
    const altoCabeceraSesion = this.params.panelSesiones.altoCabecera;
    const desplazamientoHorizontal = parseFloat(anchoSesion) / 2 - 15;
    const desplHorizontal2 = desplazamientoHorizontal+10
    const desplVertical1 = altoCabeceraSesion / 18;
    const desplVertical2 = altoCabeceraSesion / 2;
    const desplVertical3 = altoCabeceraSesion * 17 / 18;

    const coordenadasTrianguloIzquierdo = [
      { 'x': parseFloat(anchoSesion) / 2 - desplazamientoHorizontal, 'y': desplVertical1 },
      { 'x': parseFloat(anchoSesion) / 2 - desplHorizontal2, 'y': desplVertical2 },
      { 'x': parseFloat(anchoSesion) / 2  -desplazamientoHorizontal, 'y': desplVertical3 },
    ];

    const coordenadasTrianguloDerecho = [
      { 'x': parseFloat(anchoSesion) / 2 + desplazamientoHorizontal, 'y': desplVertical1 },
      { 'x': parseFloat(anchoSesion) / 2 + desplHorizontal2, 'y': desplVertical2 },
      { 'x': parseFloat(anchoSesion) / 2 + desplazamientoHorizontal, 'y': desplVertical3 },
    ];


    // Obtener actividad


    pcca.append("polygon")
    .attr("points", coordenadasTrianguloIzquierdo.map(function (d: any) { return [d.x, d.y].join(","); }).join(" "))
      .attr("fill", "white")
      .attr('class', 'botonCabeceraSesionActividades botonIzquierdoCabeceraSesionActividades')
      .attr('id', (d: IActividadesSesion) => 'botonIzquierdoCabeceraSesionActividades'+d.sesion.idSesion)
    .on("click", this.actualizarActividadVisible.bind(this))
    .on("mouseout", (d: any) => d3.select('body').style("cursor", "default"))
      .on("mouseover", (d: any) => d3.select('body').style("cursor", "pointer"));


    pcca.append("polygon")
      .attr('points', coordenadasTrianguloDerecho.map(function (d: any) { return [d.x, d.y].join(","); }).join(" "))
      .attr('fill', "white")
      .attr('class', 'botonCabeceraSesionActividades botonDerechoCabeceraSesionActividades')
      .attr('id', (d: IActividadesSesion) => 'botonDerechoCabeceraSesionActividades'+d.sesion.idSesion)
      .on("click", this.actualizarActividadVisible.bind(this))
      .on("mouseout", (d: any) => d3.select('body').style("cursor", "default"))
      .on("mouseover", (d: any) => d3.select('body').style("cursor", "pointer") );

  }
  crearPanelCuerpoSesionConActividades(panelSesionActividades: any) {
    const anchoSesion = this.params.panelSesiones.anchoSesion ? this.params.panelSesiones.anchoSesion.toString() : '0';
    const altoCabeceraSesion = this.params.panelSesiones.altoCabecera;

    //---------------------------------------------------------------------------------
    // Paso1: Añadimos el panel cabecera para la sesión que representa con sus actividades.
    // Su identificador será el texto 'panelCabeceraSesionConSusActividades' con el id de la
    // sesión.
    //---------------------------------------------------------------------------------
    const panelCuerpoSesionConActividades = panelSesionActividades.append('g')
      .attr('class', 'panelCuerpoSesionActividades')
      .attr('id', (d: IActividadesSesion) => 'panelCuerpoSesionActividades' + d.sesion.idSesion)
      .attr('transform', `translate(0,${altoCabeceraSesion})`)

    //---------------------------------------------------------------------------------
    // Definicion del rectángulo que representa el cuerpo de la sesión.
    //---------------------------------------------------------------------------------
    panelCuerpoSesionConActividades.append('rect')
      .attr('height', (d:any) => {
        const coordenadaHoraInicio = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.sesion.horaInicio));
        const coordenadaHoraFin = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.sesion.horaFin));
        return coordenadaHoraFin - coordenadaHoraInicio-altoCabeceraSesion;
      })
      .attr('width', (d: any) => this.params.escalas.escalaHorizontal.bandwidth())
      .attr('fill', 'yellow')
      .attr('opacity', '0')
      .attr('rx', 2)
      .attr('ry', 2);


    panelCuerpoSesionConActividades.append('clipPath')
      .attr('id', (d: any) => 'rectanguloRecortador' + d.sesion.idSesion)
      .append('rect')
      .attr('height', (d: any) => {
      const coordenadaHoraInicio = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.sesion.horaInicio));
      const coordenadaHoraFin = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(d.sesion.horaFin));
      return coordenadaHoraFin - coordenadaHoraInicio-altoCabeceraSesion;
    })
      .attr('width', (d: any) => this.params.escalas.escalaHorizontal.bandwidth())


    panelCuerpoSesionConActividades
      .attr("clip-path", (d: any) => {
        return `url(#${'rectanguloRecortador' + d.sesion.idSesion})`
      })


     return panelCuerpoSesionConActividades;
  }
  añyadirPanelesActividades(actividadesSesiones: IActividadesSesion[]) {

    const anchoSesion = this.params.panelSesiones.anchoSesion ? this.params.panelSesiones.anchoSesion.toString() : '0';

    actividadesSesiones.forEach(as => {

      // Precalculamos el alto de los paneles
      const altoPanelActividadesEnActividadSesiones = this.altoPanel(as.sesion)-this.params.panelSesiones.altoCabecera;

      // Localizamos el panel relativo al cuerpo de la actividadesSesion
      // y le añadimos los paneles que representarán a cada una de sus actividades.
      const idPanel = '#panelCuerpoSesionActividades' + as.sesion.idSesion;
      const panelesActividades: any = d3.select(idPanel).selectAll('act' + 'xx').data(as.actividades).enter().append('g');


      panelesActividades
        .attr('class', (d: any, i: any, n: any) => {
          if (i == 0) return 'panelActividad visible'
          else return 'panelActividad'
        })
        .attr('id', (d: any) => 'panelActividad_' + d.idActividad)
        .attr('transform', (d: any, i: any, n: any) => `translate(${(i) * parseFloat(anchoSesion)},0)`)
        .attr('x', (d: any, i: any, n: any) => (i) * parseFloat(anchoSesion))
        .attr('y', 0)
        .attr('height', altoPanelActividadesEnActividadSesiones)
        .attr('width', anchoSesion);

        // A cada panel de una actividad además le añadimos las tres secciones
        as.actividades.forEach(
          actividad => {
            const panelActividad = d3.select('g#panelActividad_' + actividad.idActividad);
            this.crearSeccionPanelActividad(panelActividad,actividad,1,actividad.grupos?.map(grupo => grupo.codigo));
            this.crearSeccionPanelActividad(panelActividad,actividad,2, actividad.grupos?.map(grupo => grupo.codigo));
            this.crearSeccionPanelActividad(panelActividad,actividad,3, actividad.asignaturas?.map(asignatura => asignatura.codigo));
          }
        )

      // Añadimos el rectángulo
      panelesActividades.append('rect')
        .attr('class', 'rectActividad')
        .attr('width', anchoSesion)
        .attr('fill', 'white')
        .attr('height', altoPanelActividadesEnActividadSesiones)
        .attr('opacity', '0')
        .attr('stroke', 'white')
        .on("click", (d: any, i: any, e: any) => {

          const marcadaActividadActualComoSeleccionada = d3.select('g#panelActividad_' + i.idActividad).attr('class').split(' ').includes('actividadSeleccionada');
          d.ctrlKey ? null : this.desmarcarActividadesComoSeleccionadas();

          marcadaActividadActualComoSeleccionada ?
            d3.selectAll('g#panelActividad_' + i.idActividad).attr('class', 'panelActividad actividadSeleccionada') :
            d3.select('g#panelActividad_' + i.idActividad).attr('class', 'panelActividad');

          d3.select('g#panelActividad_' + i.idActividad).attr('class').split(' ').includes('actividadSeleccionada') ?
            this.desmarcarActividadesComoSeleccionadas([i.idActividad]) :
            this.marcarActividadesComoSeleccionadas([i.idActividad]);
        });


    }
    );

  }
  crearSeccionPanelActividad(panelActividad: any, actividad: ActividadG, numeroSeccion: number, listaCadenas: string[]) {
    const porcentajeAnchoZonaSeleccion = 10;

    const panelActividadBBox =
    {
      'x': panelActividad.attr('x'),
      'y': panelActividad.attr('y'),
      'height': panelActividad.attr('height'),
      'width': panelActividad.attr('width')
    }

    const panelSeccionBBox =
    {
      'x': (numeroSeccion-1) * (panelActividadBBox.width*(1-porcentajeAnchoZonaSeleccion/100) / 3)+panelActividadBBox.width*(porcentajeAnchoZonaSeleccion/100),
      'y': panelActividadBBox.y,
      'height': panelActividadBBox.height,
      'width': panelActividadBBox.width / 3
    }


    const panelSeccion = panelActividad.append('g')
      .attr('class', 'panelActividadSeccion' + numeroSeccion)
      .attr('id', 'panelActividadSeccion' + numeroSeccion + '_' + actividad.idActividad)
      .attr('transform', `translate(${(panelSeccionBBox.x)},0)`)
      .attr('height', panelSeccionBBox.height)
      .attr('width', panelSeccionBBox.width)


      panelSeccion.append('rect')
      .attr('height', panelSeccionBBox.height)
      .attr('width', panelSeccionBBox.width)
      .attr('fill', 'green');

      const panelTextoSeccion = panelSeccion.append('g')
      .attr('class', 'panelTextoSeccion' + numeroSeccion)
      .attr('id', 'panelTextoSeccion' + numeroSeccion + '_' + actividad.idActividad)


      const panelContenidolistaCadenas = this.AnyadirContenidoPanelSeccion(panelTextoSeccion, listaCadenas)


  }

  AnyadirContenidoPanelSeccion(panelTextoSeccion: any, listaCadenas: string[]) {

    const parentBBox = panelTextoSeccion.node().parentNode.getBBox();
    const anchoTexto = parentBBox.height / 30;
    const anchoSeparacionTexto = anchoTexto / 3;

    if (listaCadenas) {
      for (let index = 0; index < listaCadenas.length; index++) {
        const item = listaCadenas[index];
        panelTextoSeccion.append('text')
          .attr('x', parentBBox.width / 2)
          .text((d: any, i: any, n: any) => item)
          .attr('y', (index + 1) * (anchoTexto + anchoSeparacionTexto))
          .attr('font-size', anchoTexto + 'em')
          .attr('fill', 'black')
          .attr('dominant-baseline', 'Hanging')
          .attr('text-anchor', 'middle');

      }
    }



  }

  actualizarActividadVisible(d: any, i: IActividadesSesion, e: any) {

    var botonDerechoPulsado: boolean = d.srcElement.classList.contains('botonDerechoCabeceraSesionActividades') ? true : false;

    const anchoSesion = this.params.panelSesiones.anchoSesion ? this.params.panelSesiones.anchoSesion.toString() : '0';
    const panelSesionActividadesActual = d3.select('#panelSesionActividades' + i.sesion.idSesion);
    const idActividadesEnSesion: string[] = panelSesionActividadesActual.attr('data-actividades').split(',');
    const idActividadVisible = panelSesionActividadesActual.attr('data-actividadVisible')
    var posActual = idActividadesEnSesion.indexOf(idActividadVisible);
    if (botonDerechoPulsado && posActual < idActividadesEnSesion.length - 1) posActual++;
    if (!botonDerechoPulsado && posActual > 0) posActual--;

    const colorBotonDerecho = posActual === idActividadesEnSesion.length - 1 ? 'grey' : 'white';
    const colorBotonizquierdo = posActual === 0 ? 'grey' : 'white';

    panelSesionActividadesActual.select('.botonIzquierdoCabeceraSesionActividades').attr('fill', colorBotonizquierdo);
    panelSesionActividadesActual.select('.botonDerechoCabeceraSesionActividades').attr('fill', colorBotonDerecho);

    panelSesionActividadesActual.attr('data-actividadVisible', idActividadesEnSesion[posActual]);

    // Obtenemos todos los paneles de actividad contenidos en el cuerpo
    // de la entidad Actividades-sesion
    panelSesionActividadesActual
      .selectAll('.panelActividad')
      .attr('transform', function (d, i, n) {
        return `translate(${(i-(posActual))*parseFloat(anchoSesion)},0)`
      })

  }
  //----------------------------------------------------------------------------------------------------------
  // Utilidades
  //----------------------------------------------------------------------------------------------------------
  marcarActividadesComoSeleccionadas(identificadoresActividades: string[]) {
    identificadoresActividades.forEach(
      iact => {
        const x = d3.select('g#panelActividad_' + iact)

        const y: any = x.select('.rectActividad');

        x.append('rect')
          .attr('width', y.attr('width'))
          .attr('height', y.attr('height'))
          .attr('class', 'rectActividadSeleccionada').attr('fill', 'url(#x)')

      }
    )

  }
  desmarcarActividadesComoSeleccionadas(identificadoresActividades?: string[]) {

    if (!identificadoresActividades) {
      d3.selectAll('g.panelActividad').select('.rectActividadSeleccionada').remove()
    } else
    {
      this.actividadesG
        .filter(actG => identificadoresActividades.includes(actG.idActividad))
        .forEach(actG => d3.select('g#panelActividad' + actG.idActividad).select('.rectActividadSeleccionada').remove()
        )
    }
  }
  calcularFactorAnchoActividadesG(actsG: ActividadG[]) {

    // paso 3: Asignamos todas las materias

    // paso 1: Calcular factor de ancho en función del solapamiento
    actsG.forEach(
      actG => {
        const actividadesCubiertas = this.actividadesCubiertasPor(actG);
        if (actividadesCubiertas.length > 0 && actG) {
          actG.nivelAncho = d3.max(actividadesCubiertas.map(act => act.nivelAncho)) as number + 1;
        }
      });

  }
  public obtenerDiasSemanaHorario(): DiaSemana[] {

    return HorarioG.diasSemana.filter((ds: DiaSemana) => this.params.parametrosHorario?.diasSemanaHabiles.includes(ds.codigo) );

  }
  public obtenerActividadesDiaSemana(ds: string): ActividadG[] {

    return this.actividadesG.filter(act => act.sesion.diaSemana === ds);

  }
  public actividadesCubiertasPor(actividad: ActividadG): ActividadG[] {

    return this.actividadesG.filter(
      act =>
        act.idActividad != actividad.idActividad
        && act.sesion.diaSemana === actividad.sesion.diaSemana
        && HorarioG.convertirCadenaHoraEnTiempo(act.sesion.horaInicio) >= HorarioG.convertirCadenaHoraEnTiempo(actividad.sesion.horaInicio)
        && HorarioG.convertirCadenaHoraEnTiempo(act.sesion.horaFin) <= HorarioG.convertirCadenaHoraEnTiempo(actividad.sesion.horaFin)
    )

  }

  public minimoIntervaloTemporal(): Date {
    const horaMinima = HorarioG.convertirCadenaHoraEnTiempo(this.params.parametrosHorario?.horaMinima);
    return horaMinima.setMinutes(horaMinima.getMinutes());
  }

  public maximoIntervaloTemporal(): Date {
    const horaMaxima = HorarioG.convertirCadenaHoraEnTiempo(this.params.parametrosHorario?.horaMaxima);
    return horaMaxima.setMinutes(horaMaxima.getMinutes());
  }

  private compare(a: ActividadG, b: ActividadG): number {

    const codigosDiasSemana = HorarioG.diasSemana.map(ds => ds.codigo);

    if (codigosDiasSemana.indexOf(a.sesion.diaSemana) < codigosDiasSemana.indexOf(b.sesion.diaSemana))      return -1
    else if (codigosDiasSemana.indexOf(a.sesion.diaSemana) > codigosDiasSemana.indexOf(b.sesion.diaSemana)) return 1
    else {

      if (HorarioG.convertirCadenaHoraEnTiempo(a.sesion.horaInicio) < HorarioG.convertirCadenaHoraEnTiempo(b.sesion.horaInicio)) return -1
      else if (HorarioG.convertirCadenaHoraEnTiempo(a.sesion.horaInicio) > HorarioG.convertirCadenaHoraEnTiempo(b.sesion.horaInicio)) return 1
      else if (HorarioG.convertirCadenaHoraEnTiempo(a.sesion.horaInicio) == HorarioG.convertirCadenaHoraEnTiempo(b.sesion.horaInicio)) {

        if (HorarioG.convertirCadenaHoraEnTiempo(a.sesion.horaFin) < HorarioG.convertirCadenaHoraEnTiempo(b.sesion.horaFin)) return -1
        else if (HorarioG.convertirCadenaHoraEnTiempo(a.sesion.horaFin) > HorarioG.convertirCadenaHoraEnTiempo(b.sesion.horaFin)) return 1
        else if (HorarioG.convertirCadenaHoraEnTiempo(a.sesion.horaFin) == HorarioG.convertirCadenaHoraEnTiempo(b.sesion.horaFin)) {
          if (a.sesion.idSesion < b.sesion.idSesion) return -1
          else if (a.sesion.idSesion > b.sesion.idSesion) return 1
          else return 0;
        } else return 0;
      } else return 0;
    }
  } // Fin compare
  private obtenerHorasInicionHorasFin(): Date[] {
     return this.actividadesG.reduce(
       function (colecAnterior: Date[], actividadActual) {
         return colecAnterior.concat([HorarioG.convertirCadenaHoraEnTiempo(actividadActual.sesion.horaInicio), HorarioG.convertirCadenaHoraEnTiempo(actividadActual.sesion.horaFin)]);
      },
      []
      )
  }

  private anyadirDefs(element: any) {
    const defs = element.append('defs');


    const patronFondoPanelHorario = 	defs.append('pattern')
    .attr('id','smallGrid')
    .attr('width',1 )
    .attr('height',1)
      .attr('patternUnits', 'userSpaceOnUse')
      .append('rect')
      .attr('width',10)
      .attr('height', 10)

      var g = defs.append("pattern")
      .attr('id', 'x')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', '4')
        .attr('height', '4')


      .attr("x", 0).attr("y", 0)
      .append("g").style("fill", "white").style("stroke", "black").style("stroke-width", 0.5);
  g.append("path").attr("d", "M0,0 l25,25");
  g.append("path").attr("d", "M25,0 l-25,25");


  }
  private obtenerActividadesSesiones(actividadesG: ActividadG[]): IActividadesSesion[]{

      // Construimos una estructura para agrupar actividades por sesión.
      const actividadesSesion: IActividadesSesion[] = [];

      // tenemos todas las sesiones afectadas de forma única.
      const sesionesConActividad = [... new Set(actividadesG.map(actg => actg.sesion))];

      sesionesConActividad.forEach(ses => {
        const actividadesSesionActual: ActividadG[] = [];
        actividadesG.filter(actg => actg.sesion === ses).sort(this.compare).forEach(act => actividadesSesionActual.push(act))
        actividadesSesion.push({ sesion: ses, actividades: actividadesSesionActual })
      });

    return actividadesSesion;


  }

  private altoPanel(sesion: Sesion) {
    const coordenadaHoraInicio = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(sesion.horaInicio));
    const coordenadaHoraFin = this.params.escalas.escalaVertical(HorarioG.convertirCadenaHoraEnTiempo(sesion.horaFin));

    return coordenadaHoraFin - coordenadaHoraInicio;

  }


}
