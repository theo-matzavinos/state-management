import { Injectable, inject, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, createEffect, ofType, concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, filter, switchMap, catchError, of } from 'rxjs';
import { todosListFeature } from './todos-list.feature';
import { HttpClient } from '@angular/common/http';
import { apiTodosGet } from '@api/endpoints';
import { todosListActions } from './todos-list.actions';

@Injectable()
export class TodosListEffects {
  private actions = inject(Actions);
  private store = inject(Store);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private urlTree = this.router.getCurrentNavigation()!.extractedUrl;
  private httpClient = inject(HttpClient);

  reload = createEffect(() => {
    return this.actions.pipe(
      ofType(todosListActions.reload),
      concatLatestFrom(() =>
        this.store.select(todosListFeature.selectQueryParams),
      ),
      map(([_, params]) => todosListActions.load(params)),
    );
  });

  queryParamsChanged = createEffect(() => {
    return this.activatedRoute.queryParamMap.pipe(
      filter(() =>
        this.router.isActive(this.urlTree, {
          fragment: 'ignored',
          matrixParams: 'ignored',
          paths: 'exact',
          queryParams: 'ignored',
        }),
      ),
      map((params) => {
        const page = numberAttribute(params.get('page'), 0);
        const pageSize = numberAttribute(params.get('pageSize'), 10);

        return todosListActions.load({ page, pageSize });
      }),
    );
  });

  load = createEffect(() => {
    return this.actions.pipe(
      ofType(todosListActions.load),
      switchMap((action) =>
        apiTodosGet(this.httpClient, {
          page: action.page,
          pageSize: action.pageSize,
        }).pipe(
          map(({ count, todos }) =>
            todosListActions.loadSuccess({
              count,
              todos,
              page: action.page,
              pageSize: action.pageSize,
            }),
          ),
          catchError((error) =>
            of(
              todosListActions.loadError({
                error,
                page: action.page,
                pageSize: action.pageSize,
              }),
            ),
          ),
        ),
      ),
    );
  });
}
