import type { CanActivateFn, Routes } from '@angular/router';
import { Router } from '@angular/router';
import { inject, numberAttribute } from '@angular/core';
import { Store, provideState } from '@ngrx/store';
import { todosListFeature } from './todos-list.feature';
import { todoDonenessFeature } from './todo-doneness.feature';
import { provideEffects } from '@ngrx/effects';
import { TodosListEffects } from './todos-list.effects';
import { newTodoFeature } from './new-todo.feature';
import { NewTodoEffects } from './new-todo.effects';
import { editTodoFeature } from './edit-todo.feature';
import { EditTodoEffects } from './edit-todo.effects';
import { TodoDonenessEffects } from './todo-doneness.effects';
import { DeleteTodoEffects } from './delete-todo.effects';

const listPageGuard: CanActivateFn = (route) => {
  const page = numberAttribute(route.queryParamMap.get('page'));
  const pageSize = numberAttribute(route.queryParamMap.get('pageSize'));

  if (isNaN(page) || isNaN(pageSize)) {
    return inject(Router).createUrlTree(['/', 'todos'], {
      queryParams: inject(Store).selectSignal(
        todosListFeature.selectQueryParams,
      )(),
    });
  }

  return true;
};

export default <Routes>[
  {
    path: '',
    providers: [
      provideState(todoDonenessFeature),
      provideEffects(TodoDonenessEffects, DeleteTodoEffects),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        providers: [
          provideState(todosListFeature),
          provideEffects(TodosListEffects),
        ],
        canActivate: [listPageGuard],
        loadComponent: () => import('./todos-list'),
      },
      {
        path: 'new',
        providers: [
          provideState(newTodoFeature),
          provideEffects(NewTodoEffects),
        ],
        loadComponent: () => import('./new-todo'),
      },
      {
        path: ':todoId',
        providers: [
          provideState(editTodoFeature),
          provideEffects(EditTodoEffects),
        ],
        loadComponent: () => import('./edit-todo'),
      },
    ],
  },
];
