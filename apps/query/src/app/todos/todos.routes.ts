import type { CanActivateFn, Routes } from '@angular/router';
import { Router } from '@angular/router';
import {
  injectListQueryParams,
  provideListQueryParams,
} from './list-query-params';
import { inject, numberAttribute } from '@angular/core';

const listPageGuard: CanActivateFn = (route) => {
  const page = numberAttribute(route.queryParamMap.get('page'));
  const pageSize = numberAttribute(route.queryParamMap.get('pageSize'));

  if (isNaN(page) || isNaN(pageSize)) {
    return inject(Router).createUrlTree(['/', 'todos'], {
      queryParams: injectListQueryParams().params(),
    });
  }

  return true;
};

export default <Routes>[
  {
    path: '',
    pathMatch: 'full',
    providers: [provideListQueryParams()],
    canActivate: [listPageGuard],
    loadComponent: () => import('./todos-list'),
  },
  {
    path: 'new',
    loadComponent: () => import('./new-todo'),
  },
  {
    path: ':todoId',
    loadComponent: () => import('./edit-todo'),
  },
];
