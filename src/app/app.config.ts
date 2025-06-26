import { ApplicationConfig, provideZoneChangeDetection, isDevMode, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { ContactDataService } from './main-pages/contact-data.service';

const firebaseConfig = {
  projectId: "join-1f201",
  appId: "1:423152425379:web:e6bb2be18bf7c3a3e3e216",
  storageBucket: "join-1f201.firebasestorage.app",
  apiKey: "AIzaSyAfeP9cN-a0hSo3PxQaPwJHhSE99i40xsQ",
  authDomain: "join-1f201.firebaseapp.com",
  messagingSenderId: "423152425379"
};

// Initialize Firebase services after Angular is fully bootstrapped
function initializeFirebaseServices(contactService: ContactDataService) {
  return () => {
    return new Promise<void>((resolve) => {
      // Use a microtask to ensure we're in the next tick
      setTimeout(() => {
        contactService.initializeFirestore();
        resolve();
      }, 0);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => {
      const app = initializeApp(firebaseConfig);
      return app;
    }), 
    provideAuth(() => {
      const auth = getAuth();
      return auth;
    }), 
    provideFirestore(() => {
      const firestore = getFirestore();
      return firestore;
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFirebaseServices,
      deps: [ContactDataService],
      multi: true
    }
  ]
};
