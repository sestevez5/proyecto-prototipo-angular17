import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { environment } from '../environments/environment';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { getFirestore, provideFirestore} from '@angular/fire/firestore'

export const appConfig: ApplicationConfig = {
  providers: [
    
    provideRouter(routes),

    importProvidersFrom(
      [
        provideFirebaseApp(() => initializeApp({
        apiKey: "AIzaSyCXM0CDradV8RNiJH5Oy9fmp_IeYP5tB-8",
        authDomain: "gestionbiblioteca-b928e.firebaseapp.com",
        databaseURL: "https://gestionbiblioteca-b928e.firebaseio.com",
        projectId: "gestionbiblioteca-b928e",
        storageBucket: "gestionbiblioteca-b928e.appspot.com",
        messagingSenderId: "284856647537",
        appId: "1:284856647537:web:a46ddfc1f6c0b0c9ec80d0",
        measurementId: "G-ZFSMHQGPHV"
        })),

        provideFirestore(()=>getFirestore())
    ]
    ) 
  
  ]
};
