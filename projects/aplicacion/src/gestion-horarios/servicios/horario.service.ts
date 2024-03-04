import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
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



@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  afs: Firestore = inject(Firestore);

  docentes$: BehaviorSubject<IDocente[]>;
  dependencias$: BehaviorSubject<IDependencia[]>;
  grupos$: BehaviorSubject<IGrupo[]>;
  asignaturas$: BehaviorSubject<IAsignatura[]>;
  plantillas$: BehaviorSubject<IPlantilla[]>;
  periodosVigencia$: BehaviorSubject<IPeriodoVigencia[]>;
  tiposActividad$: BehaviorSubject<ITipoActividad[]>;
  combinacionEntidades$: BehaviorSubject<{
    dependencias: IDependencia[],
    grupos: IGrupo[],
    asignaturas: IAsignatura[],
    docentes: IDocente[],
    plantillas: IPlantilla[],
    periodosVigencia: IPeriodoVigencia[],
    tiposActividad: ITipoActividad[]
  }>;

  

  constructor() {

    // Creación y carga del observable "docentes$"
    this.docentes$ = new BehaviorSubject<IDocente[]>([]);
    this.obtenerTodosLosDocentes().subscribe(docentes => this.docentes$.next(docentes));

    // Creación y carga del observable "dependencias$"
    this.dependencias$ = new BehaviorSubject<IDependencia[]>([]);
    this.obtenerTodasLasDependencias().subscribe(dependencias => this.dependencias$.next(dependencias));

    // Creación y carga del observable "dependencias$"
    this.grupos$ = new BehaviorSubject<IGrupo[]>([]);
    this.obtenerTodosLosGrupos().subscribe(grupos => this.grupos$.next(grupos));


    // this.asignaturas$ = new BehaviorSubject<Asignatura[]>([]);
    // this.docentes$ = new BehaviorSubject<Docente[]>([]);
    // this.plantillas$ = new BehaviorSubject<Plantilla[]>([]);
    // this.periodosVigencia$ = new BehaviorSubject<PeriodoVigencia[]>([]);
    // this.tiposActividad$ = new BehaviorSubject<TipoActividad[]>([]);

    this.obtenerTodosLosDocentes()
      .subscribe(docentes => this.docentes$.next(docentes));

    // this.obtenerTodasLasAsignaturas()
    //   .subscribe(asignaturas => this.asignaturas$.next(asignaturas));



    // this.obtenerTodosLosPeriodosDeVigencia()
    //   .subscribe(periodosVigencia => this.periodosVigencia$.next(periodosVigencia));



  

   }




   obtenerTodosLosGrupos():BehaviorSubject<IGrupo[]>
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

   obtenerTodosLosDocentes():Observable<IDocente[]>
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
      ) // Fin pipe
   }

   obtenerTodosLosAlumnos():BehaviorSubject<IAlumno[]>
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
      return alumnos$
  }

  obtenerTodasLasDependencias():Observable<IDependencia[]>
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
     ) // Fin pipe
  }

  obtenerTodasLasAsignaturas():Observable<IAsignatura[]>
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
     ) // Fin pipe
  }

  obtenerTodosLosPeriodosDeVigencia():Observable<IPeriodoVigencia[]>
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
     ) // Fin pipe
  }

  obtenerTodasLasPlantillas():Observable<IPlantilla[]>
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
     ) // Fin pipe
  }

  obtenerTodosLosTiposDeActividad():Observable<ITipoActividad[]>
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
     ) // Fin pipe
  }
  
  obtenerTodasLasActividades(): Observable<any[]>
  {

    // const docentes$: BehaviorSubject<IDocente[]> = this.obtenerTodosLosDocentes();


    
    const datosRef = collection(this.afs,'actividades');
    return collectionData(datosRef, { idField: 'idActividad'})
    .pipe(
        map(
          coleccion => coleccion.map(
          documento => {
              
              
              return {
                idActividad: documento["idActividad"],
                
         
              }
            }
          ) // Fin coleccion.map
        ) // Fin map
      ) // Fin pipe


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
