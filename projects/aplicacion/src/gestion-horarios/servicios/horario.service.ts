import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore'
import { Observable, map } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class HorarioService {


  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;

  constructor() {

    this.demo();

   }

   demo() {
    const x = collection(this.firestore, 'grupos');
    this.items$ = collectionData(x);
    
   

    this.items$.pipe(
      // map(x => x.map(y=>y.idGrupo))
    ).subscribe(console.log);





   }
}
