import type { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home'),
  },
  {
    path: 'todos',
    loadChildren: () => import('./todos/todos.routes'),
  },
];
