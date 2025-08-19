import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';


import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient } from '@angular/common/http';

registerLocaleData(localeIt);

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideHttpClient(),
  provideRouter(routes), { provide: LOCALE_ID, useValue: 'it-IT' },
  provideFirebaseApp(() => initializeApp({ projectId: "journey-plans", appId: "1:512576610746:web:2f8c46f5ba1817ce4bfd83", storageBucket: "journey-plans.firebasestorage.app", apiKey: "AIzaSyC81RVIZBAlWl5eEoLtcBEyycoP8bFygBM", authDomain: "journey-plans.firebaseapp.com", messagingSenderId: "512576610746", measurementId: "G-97ML9CX6PE" })),
  provideAuth(() => getAuth()),
  provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService,
  provideFirestore(() => getFirestore()),
  provideFunctions(() => getFunctions()),
  provideMessaging(() => getMessaging()),
  provideStorage(() => getStorage()),
  provideTranslateService({
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient],
    },
  })]
};
