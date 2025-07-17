import {
  ApplicationConfig,
  provideZoneChangeDetection,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

registerLocaleData(localeEn);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'en-US' },
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'join-1f201',
        appId: '1:423152425379:web:e6bb2be18bf7c3a3e3e216',
        storageBucket: 'join-1f201.firebasestorage.app',
        apiKey: 'AIzaSyAfeP9cN-a0hSo3PxQaPwJHhSE99i40xsQ',
        authDomain: 'join-1f201.firebaseapp.com',
        messagingSenderId: '423152425379',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
