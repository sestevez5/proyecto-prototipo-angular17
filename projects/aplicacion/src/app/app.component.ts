import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GestionHorarioComponent } from '../gestion-horarios/componentes/gestion-horario/gestion-horario.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GestionHorarioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'aplicacion';
}
