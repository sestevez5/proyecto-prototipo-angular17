import { Component } from '@angular/core';
import { SelectorEntidadComponent } from '../selector-entidad/selector-entidad.component';
import { SelectorTipoEntidadComponent } from '../selector-tipo-entidad/selector-tipo-entidad.component';
import { VisorEntidadComponent } from '../visor-entidad/visor-entidad.component';
import { VisorHorarioComponent } from '../visor-horario/visor-horario.component';

@Component({
  selector: 'app-gestion-horario',
  standalone: true,
  imports: [SelectorEntidadComponent, SelectorTipoEntidadComponent, VisorEntidadComponent,VisorHorarioComponent],
  templateUrl: './gestion-horario.component.html',
  styleUrl: './gestion-horario.component.css'
})
export class GestionHorarioComponent {

}
