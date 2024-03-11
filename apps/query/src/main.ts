import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app/app.routes';
import {
  QueryClient,
  provideAngularQuery,
} from '@tanstack/angular-query-experimental';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(),
    provideAngularQuery(new QueryClient()),
  ],
}).catch((err) => console.error(err));
