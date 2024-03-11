import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { apiTodosPost } from '@api/endpoints';
import { toastError, toastSuccess } from '@slg/toast';
import { newTodoActions } from './new-todo.actions';

@Injectable()
export class NewTodoEffects {
  private actions = inject(Actions);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private url = this.router.getCurrentNavigation()!.extractedUrl;

  create = createEffect(() => {
    return this.actions.pipe(
      ofType(newTodoActions.create),
      switchMap((action) =>
        apiTodosPost(this.httpClient, action.todo).pipe(
          map((todo) => newTodoActions.createSuccess({ todo })),
          catchError((error: HttpErrorResponse) =>
            of(
              newTodoActions.createError({
                error: error.message,
                todo: action.todo,
              }),
            ),
          ),
        ),
      ),
    );
  });

  createSuccess = createEffect(() => {
    return this.actions.pipe(
      ofType(newTodoActions.createSuccess),
      filter(() =>
        this.router.isActive(this.url, {
          fragment: 'ignored',
          matrixParams: 'ignored',
          paths: 'exact',
          queryParams: 'ignored',
        }),
      ),
      map((action) => newTodoActions.editAfterCreation({ todo: action.todo })),
      tap((action) => {
        toastSuccess();
        this.router.navigate(['/', 'todos', action.todo.id]);
      }),
    );
  });

  createError = createEffect(
    () => {
      return this.actions.pipe(
        ofType(newTodoActions.createError),
        tap(() => {
          toastError();
        }),
      );
    },
    { dispatch: false },
  );
}
