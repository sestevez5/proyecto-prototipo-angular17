import { ISesion } from './sesion.model';
export interface IPlantilla {
  idPlantilla: string;
  plantillaPorDefecto: boolean;
  denominacion: string;
  sesionesPlantilla: ISesion[];
}
