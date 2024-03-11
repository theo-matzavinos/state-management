import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';

bootstrapApplication(App, {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    provideStore({ router: routerReducer }),
    provideEffects(),
    provideRouterStore(),
    isDevMode() ? provideStoreDevtools({ maxAge: 25 }) : [],
  ],
}).catch((err) => console.error(err));
