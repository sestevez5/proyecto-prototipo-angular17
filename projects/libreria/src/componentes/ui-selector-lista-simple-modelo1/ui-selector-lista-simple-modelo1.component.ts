import { Component, Input } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'ngx-ce-ui-selector-lista-simple-modelo1',
  standalone: true,
  imports: [ListboxModule, ButtonModule],
  templateUrl: './ui-selector-lista-simple-modelo1.component.html',
  styleUrl: './ui-selector-lista-simple-modelo1.component.css'
})
export class UiSelectorListaSimpleModelo1Component {

  @Input({required: true}) entidades!: IEntidad[];

}

interface IEntidad {
  idEntidad: string;
  textoPrincipal: string;
  textoSecundario: string;
  imagen: string;
}
