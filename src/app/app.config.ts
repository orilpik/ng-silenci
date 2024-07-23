import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule, provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { LoginModule } from './login/login.module';
import { HomeModule } from './home/home.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: 'firebaseApp',
      useFactory: () => initializeApp(environment.firebaseConfig)
    },
    {
      provide: 'database',
      useFactory: (app: any) => getDatabase(app),
      deps: ['firebaseApp']
    },
    {
      provide: 'auth',
      useFactory: (app: any) => {
        const auth = getAuth(app);
        signInAnonymously(auth);
        return auth;
      },
      deps: ['firebaseApp']
    },
    importProvidersFrom(LoginModule),
    importProvidersFrom(HomeModule),
    importProvidersFrom(RouterModule)
  ]
};
