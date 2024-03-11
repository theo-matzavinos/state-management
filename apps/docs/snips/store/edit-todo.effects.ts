import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, numberAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { apiTodosIdGet, apiTodosIdPut } from '@api/endpoints';
import { Store } from '@ngrx/store';
import { toastError, toastSuccess } from '@slg/toast';
import { routerSelectors } from '../router.selectors';
import { editTodoActions } from './edit-todo.actions';
import { deleteTodoActions } from './delete-todo.actions';

@Injectable()
export class EditTodoEffects {
  private actions = inject(Actions);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private store = inject(Store);

  todoIdChange = createEffect(() => {
    return this.store.select(routerSelectors.selectRouteParam('todoId')).pipe(
      filter((todoId): todoId is string => !!todoId),
      map((todoId) => editTodoActions.load({ todoId: parseInt(todoId, 10) })),
    );
  });

  load = createEffect(() => {
    return this.actions.pipe(
      ofType(editTodoActions.load),
      switchMap((action) =>
        apiTodosIdGet(this.httpClient, {
          id: action.todoId,
        }).pipe(
          map((todo) => editTodoActions.loadSuccess({ todo })),
          catchError((error: HttpErrorResponse) =>
            of(
              editTodoActions.loadError({
                error: error.message,
                todoId: action.todoId,
              }),
            ),
          ),
        ),
      ),
    );
  });

  update = createEffect(() => {
    return this.actions.pipe(
      ofType(editTodoActions.update),
      switchMap((action) =>
        apiTodosIdPut(
          this.httpClient,
          { id: action.todo.id },
          action.todo,
        ).pipe(
          map((todo) => editTodoActions.updateSuccess({ todo })),
          catchError((error: HttpErrorResponse) =>
            of(
              editTodoActions.updateError({
                error: error.message,
                todo: action.todo,
              }),
            ),
          ),
        ),
      ),
    );
  });

  updateSuccess = createEffect(
    () => {
      return this.actions.pipe(
        ofType(editTodoActions.updateSuccess),
        tap(() => {
          toastSuccess();
        }),
      );
    },
    { dispatch: false },
  );

  updateError = createEffect(
    () => {
      return this.actions.pipe(
        ofType(editTodoActions.updateError),
        tap(() => {
          toastError();
        }),
      );
    },
    { dispatch: false },
  );

  deleteSuccess = createEffect(
    () => {
      return this.actions.pipe(
        ofType(deleteTodoActions.deleteSuccess),
        concatLatestFrom(() =>
          this.store
            .select(routerSelectors.selectRouteParam('todoId'))
            .pipe(map(numberAttribute)),
        ),
        filter(([action, todoId]) => action.todoId === todoId),
        tap(() => {
          this.router.navigate(['/', 'todos']);
        }),
      );
    },
    { dispatch: false },
  );
}
