import { Sesion } from './sesion';
export interface Plantilla {
  idPlantilla: string;
  plantillaPorDefecto: boolean;
  denominacion: string;
  sesionesPlantilla: Sesion[];
}
