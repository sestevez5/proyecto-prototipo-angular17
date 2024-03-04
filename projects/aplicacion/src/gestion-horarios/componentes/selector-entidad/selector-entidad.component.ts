import { HorarioService } from './../../servicios/horario.service';
import { Component, OnInit, inject } from '@angular/core';
import { UiSelectorListaSimpleModelo1Component } from 'libreria';


@Component({
  selector: 'app-selector-entidad',
  standalone: true,
  imports: [UiSelectorListaSimpleModelo1Component],
  templateUrl: './selector-entidad.component.html',
  styleUrl: './selector-entidad.component.css'
})
export class SelectorEntidadComponent implements OnInit{



  x: HorarioService = inject(HorarioService)

  items = [ {
    id:'sjkdhas',
    textoPrincipal: "Esto es la primera prueba",
    textoSecundario: "Esto es la primera prueba",
    imagen: "por ahora complicado"
  },
  {
    id:'dsfdf',
    textoPrincipal: "Esto es la segunda prueba",
    textoSecundario: "Esto es la segunda",
    imagen: "por ahora complicado"
  }
]

  ngOnInit(): void {
    // this.x.obtenerTodosLosGrupos().subscribe(x => console.log(x))
    // this.x.obtenerTodosLosDocentes().subscribe(x => console.log(x))
    // this.x.obtenerTodosLosAlumnos().subscribe(x => console.log(x))
    //this.x.obtenerTodasLasDependencias().subscribe(x => console.log(x))
    //this.x.obtenerTodasLasAsignaturas().subscribe(x => console.log(x))

    // this.x.obtenerTodosLosPeriodosDeVigencia().subscribe(x => console.log(x))
    // this.x.obtenerTodasLasActividades().subscribe(x => console.log(x))
    this.x.obtenerTodasLasPlantillas().subscribe(x => console.log(x))

    this.x.obtenerTodosLosTiposDeActividad().subscribe(x => console.log(x))

   
  }


}
