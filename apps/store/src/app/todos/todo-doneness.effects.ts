import { Injectable, inject } from '@angular/core';
import type { OnInitEffects } from '@ngrx/effects';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import type { Action } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { apiTodoDonenessGet } from '@api/endpoints';
import { toastError } from '@slg/toast';
import { todoDonenessFeature } from './todo-doneness.feature';
import { RequestStatus } from '@slg/suspense';
import { todoDonenessActions } from './todo-doneness.actions';

@Injectable()
export class TodoDonenessEffects implements OnInitEffects {
  private actions = inject(Actions);
  private store = inject(Store);
  private httpClient = inject(HttpClient);

  load = createEffect(() => {
    return this.actions.pipe(
      ofType(todoDonenessActions.load),
      concatLatestFrom(() =>
        this.store.select(todoDonenessFeature.selectStatus),
      ),
      filter(([_, status]) => status !== RequestStatus.Success),
      switchMap(() =>
        apiTodoDonenessGet(this.httpClient).pipe(
          map((values) => todoDonenessActions.loadSuccess({ values })),
          catchError((error: HttpErrorResponse) =>
            of(todoDonenessActions.loadError({ error: error.message })),
          ),
        ),
      ),
    );
  });

  loadError = createEffect(
    () => {
      return this.actions.pipe(
        ofType(todoDonenessActions.loadError),
        tap(() => {
          toastError();
        }),
      );
    },
    { dispatch: false },
  );

  ngrxOnInitEffects(): Action {
    return todoDonenessActions.load();
  }
}
