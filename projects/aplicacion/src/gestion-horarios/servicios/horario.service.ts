import { IActividadesSesion } from './../modelos old/actividadesSesion.model';
import { Dependencia } from './../modelos old/dependencia.model';
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { BehaviorSubject, Observable, Subject, combineLatest, map } from 'rxjs';
import { IGrupo } from '../modelos/grupo.model';
import { IDocente } from '../modelos/docente.model';
import { getDocs } from 'firebase/firestore';
import { IAlumno } from '../modelos/alumno.model';
import { IDependencia } from '../modelos/dependencia.model';
import { IAsignatura } from '../modelos/asignatura.model';
import { IPeriodoVigencia } from '../modelos/peridoVigencia.model';
import { IActividad } from '../modelos old/IActividad.model';
import { IPlantilla } from '../modelos/plantilla.model';
import { ITipoActividad } from '../modelos/tipoActividad.model';
import { TipoEntidadHorario } from '../modelos old/tipoEntidadHorario.model';



@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  afs: Firestore = inject(Firestore);

  private docentes$: BehaviorSubject<IDocente[]>;
  private dependencias$: BehaviorSubject<IDependencia[]>;
  private grupos$: BehaviorSubject<IGrupo[]>;
  private asignaturas$: BehaviorSubject<IAsignatura[]>;
  private plantillas$: BehaviorSubject<IPlantilla[]>;
  private periodosVigencia$: BehaviorSubject<IPeriodoVigencia[]>;
  private tiposActividad$: BehaviorSubject<ITipoActividad[]>;
  private actividades$: BehaviorSubject<IActividad[]>;
  private combinacionEntidades$: Subject<ICombinacionEntidades>;



  

  constructor() {

     this.obtenerDatosBD();

   }

   obtenerTodosLosDocentes() {
    return this.docentes$
   }



  private obtenerDatosBD(){
    
    // Creación y carga del observable "docentes$"
    this.docentes$ = new BehaviorSubject<IDocente[]>([]);
    this.obtenerDocentesBD().subscribe(docentes => this.docentes$.next(docentes));

    // Creación y carga del observable "dependencias$"
    this.dependencias$ = new BehaviorSubject<IDependencia[]>([]);
    this.obtenerDependenciasBD().subscribe(dependencias => this.dependencias$.next(dependencias));

    // Creación y carga del observable "dependencias$"
    this.grupos$ = new BehaviorSubject<IGrupo[]>([]);
    this.obtenerGruposBD().subscribe(grupos => this.grupos$.next(grupos));

    // Creación y carga del observable "asignaturas$"
    this.asignaturas$ = new BehaviorSubject<IAsignatura[]>([]);
    this.obtenerAsignaturasBD().subscribe(asignatura => this.asignaturas$.next(asignatura));

    // Creación y carga del observable "plantillas$"
    this.plantillas$ = new BehaviorSubject<IPlantilla[]>([]);
    this.obtenerPlantillasBD().subscribe(plantilla => this.plantillas$.next(plantilla));

     // Creación y carga del observable "periodosVigencia$"
     this.periodosVigencia$ = new BehaviorSubject<IPeriodoVigencia[]>([]);
     this.obtenerPeriodosDeVigenciaBD().subscribe(periodoVigencia => this.periodosVigencia$.next(periodoVigencia));
  

    // Creación y carga del observable "tipoActividad$"
    this.tiposActividad$ = new BehaviorSubject<ITipoActividad[]>([]);
    this.obtenerTiposActividadBD().subscribe(tipoActividad => this.tiposActividad$.next(tipoActividad));

    // Creación y carga del observable "tipoActividad$"
    this.actividades$ = new BehaviorSubject<IActividad[]>([]);
    this.obtenerTiposActividadBD().subscribe(tipoActividad => this.actividades$.next([]));
    

    this.combinacionEntidades$ = new Subject<ICombinacionEntidades>;
      
    

    // // Creación y carga del observable "actividad$"
 

    combineLatest(
      [
        this.docentes$,
        this.dependencias$,
        this.grupos$,
        this.asignaturas$,
        this.plantillas$,
        this.periodosVigencia$,
        this.tiposActividad$,
        this.actividades$
      ])
      .pipe(
        map(combinacion => {
          return {
            docentes: combinacion[0] as IDocente[],
            dependencias: combinacion[1] as IDependencia[],
            grupos: combinacion[2] as IGrupo[],
            asignaturas: combinacion[3] as IAsignatura[],          
            plantillas: combinacion[4] as IPlantilla[],
            periodosVigencia: combinacion[5] as IPeriodoVigencia[],
            tiposActividad: combinacion[6] as ITipoActividad[],
            actividades: combinacion[7] as IActividad[]
          }
        })
      ).subscribe(combinacion => { this.combinacionEntidades$.next(combinacion)});



  }

  private  obtenerGruposBD():BehaviorSubject<IGrupo[]>
  {
  
  const datosRef = collection(this.afs,'grupos');
  return collectionData(datosRef, { idField: 'idGrupo'})
  .pipe(
      map(
        coleccion => coleccion.map(
        documento => {
            return {
              idGrupo: documento["idGrupo"],
              codigo: documento["codigo"],
              denominacionLarga: documento["denominacionLarga"]
            }
          }
        ) // Fin coleccion.map
      ) // Fin map
    ) as BehaviorSubject<IGrupo[]> // Fin pipe
  }

  private  obtenerDocentesBD():BehaviorSubject<IDocente[]>
  {
  
  const datosRef = collection(this.afs,'usuarios');
  return collectionData(datosRef, { idField: 'uid'})
  .pipe(
      map(
        coleccion => coleccion.map(
        documento => {
            
            const alias = this.obtenerAlias(documento["nombre"], documento["primerApellido"], documento["segundoApellido"])
            return {
              idDocente: documento["uid"],
              nombre: documento["nombre"],
              apellido1: documento["primerApellido"],
              apellido2: documento["segundoApellido"],
              foto: documento["foto"],
              alias: alias,
            }
          }
        ) // Fin coleccion.map
      ) // Fin map
    ) as BehaviorSubject<IDocente[]> // Fin pipe
  }

  private  obtenerAlumnosBD():BehaviorSubject<IAlumno[]>
  {
  const alumnos: IAlumno[]=[];
  const alumnos$ = new BehaviorSubject<IAlumno[]>([])
  const datosRef = collection(this.afs,'alumnos');

  getDocs(datosRef).then(
    coleccion => coleccion.docs.forEach(
      datosAlumno => {
        const alumno: any = {
          idAlumno: datosAlumno.id,
          idGrupo: datosAlumno.get('idGrupo'),
          email: datosAlumno.get('email'),
          foto: datosAlumno.get('foto'),
          apellido1: datosAlumno.get('apellido1'),
          apellido2: datosAlumno.get('apellido2'),
          nombre: datosAlumno.get('nombre'),
        };

        alumnos.push(alumno);
        alumnos$.next(alumno);
        })
    )
    return alumnos$ as BehaviorSubject<IAlumno[]>
  }

  private obtenerDependenciasBD():BehaviorSubject<IDependencia[]>
  {
  
   const datosRef = collection(this.afs,'dependencias');
   return collectionData(datosRef, { idField: 'idDependencia'})
   .pipe(
       map(
         coleccion => coleccion.map(
         documento => {
             return {
               idDependencia: documento["idDependencia"],
               codigo: documento["codigo"],
               denominacionLarga: documento["denominacionLarga"]
             }
           }
         ) // Fin coleccion.map
       ) // Fin map
     ) as BehaviorSubject<IDependencia[]> // Fin pipe
  }

  private obtenerAsignaturasBD():BehaviorSubject<IAsignatura[]>
  {
  
   const datosRef = collection(this.afs,'asignaturas');
   return collectionData(datosRef, { idField: 'idAsignatura'})
   .pipe(
       map(
         coleccion => coleccion.map(
         documento => {
             return {
               idAsignatura: documento["idAsignatura"],
               codigo: documento["codigo"],
               denominacionLarga: documento["denominacionLarga"]
             }
           }
         ) // Fin coleccion.map
       ) // Fin map
     ) as BehaviorSubject<IAsignatura[]>// Fin pipe
  }

  private obtenerPeriodosDeVigenciaBD():BehaviorSubject<IPeriodoVigencia[]>
  {
  
   const datosRef = collection(this.afs,'periodosVigencia');
   return collectionData(datosRef, { idField: 'idPeriodoVigencia'})
   .pipe(
       map(
         coleccion => coleccion.map(
         documento => {
             return {
               idPeriodoVigencia: documento["idPeriodoVigencia"],
               computo: documento["computo"],
               fechaInicio: documento["fechaInicio"],
               fechaFin: documento["fechaFin"],
               denominacion: documento["denominacion"]
             }
           }
         ) // Fin coleccion.map
       ) // Fin map
     ) as BehaviorSubject<IPeriodoVigencia[]>// Fin pipe
  }

  private obtenerPlantillasBD():BehaviorSubject<IPlantilla[]>
  {
  
   const datosRef = collection(this.afs,'plantillas');
   return collectionData(datosRef, { idField: 'idPlantilla'})
   .pipe(
       map(
         coleccion => coleccion.map(
         documento => {
             return {
               idPlantilla: documento["idPlantilla"],
               denominacion: documento["denominacion"],
               plantillaPorDefecto: documento["plantillaPorDefecto"],
               sesionesPlantilla: documento["sesionesPlantilla"]
             }
           }
         ) // Fin coleccion.map
       ) // Fin map
     ) as BehaviorSubject<IPlantilla[]>// Fin pipe
  }

  private obtenerTiposActividadBD():Observable<ITipoActividad[]>
  {
  
   const datosRef = collection(this.afs,'tiposActividad');
   return collectionData(datosRef, { idField: 'idTipoActividad'})
   .pipe(
       map(
         coleccion => coleccion.map(
         documento => {
             return {
               idTipoActividad: documento["idTipoActividad"],
               codigo: documento["codigo"],
               denominacionLarga: documento["denominacionLarga"],
               esLectiva: documento["esLectiva"],
               tipoPredeterminado: documento["tipoPredeterminado"]
             }
           }
         ) // Fin coleccion.map
       ) // Fin map
     ) as BehaviorSubject<ITipoActividad[]>// Fin pipe
  }
  
 obtenerActividadesBD():Observable<any[]>
  {
  
   const datosRef = collection(this.afs,'actividades');
   return collectionData(datosRef, { idField: 'idActividad'})
   .pipe(
       map(
         coleccion => coleccion.map(
         documento => {
             return {
               idActividad: documento["idActividad"],
               idAsignaturas: documento["asignaturas"],
               idDependencia: documento["dependencia"],
               detalleActividad: documento["detalleActividad"],
               idDocentes: documento["docentes"],
               idGrupos: documento["grupos"],
               idPeriodoVigencia: documento["idPeriodoVigencia"],
               idSesion:  documento["idSesion"],
               idTipoActividad: documento["idTipoActividad"]

             }
           }
         ) // Fin coleccion.map
       ) // Fin map
     ) as BehaviorSubject<any[]>// Fin pipe
  
  }


      

    


private obtenerAlias(cadena1:string, cadena2: string, cadena3:string)
{
  const cadenas: string[] = [cadena1.toLowerCase(),cadena2.toLowerCase(),cadena3.toLowerCase()]
  var alias:string =""

  alias = alias+(cadenas[0].length>1?cadenas[0].slice(0,1):cadenas[0]);
  alias = alias+(cadenas[1].length>1?cadenas[1].slice(0,3):cadenas[0]);
  alias = alias+(cadenas[2].length>1?cadenas[2].slice(0,3):cadenas[0]);

  return alias;
}


}

interface ICombinacionEntidades {
  docentes: IDocente[];
  dependencias: IDependencia[];
  grupos: IGrupo[];
  asignaturas: IAsignatura[];
  plantillas: IPlantilla[];
  periodosVigencia: IPeriodoVigencia[];
  tiposActividad: ITipoActividad[];
  actividades: IActividad[];
}


