import type {
  FactoryProvider} from '@angular/core';
import {
  InjectionToken,
  inject,
  numberAttribute,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

const LIST_QUERY_PARAMS = new InjectionToken<
  ReturnType<typeof listQueryParamsFactory>
>('[List] Query Params');

export function injectListQueryParams() {
  return inject(LIST_QUERY_PARAMS);
}

export function provideListQueryParams(): FactoryProvider {
  return { provide: LIST_QUERY_PARAMS, useFactory: listQueryParamsFactory };
}

function listQueryParamsFactory() {
  const activatedRoute = inject(ActivatedRoute);
  const router = inject(Router);
  const urlTree = router.getCurrentNavigation()!.extractedUrl;
  const params = toSignal(
    activatedRoute.queryParamMap
      .pipe(
        filter(() =>
          router.isActive(urlTree, {
            fragment: 'ignored',
            matrixParams: 'ignored',
            paths: 'exact',
            queryParams: 'ignored',
          }),
        ),
      )
      .pipe(
        map((params) => ({
          page: numberAttribute(params.get('page'), 0),
          pageSize: numberAttribute(params.get('pageSize'), 10),
        })),
      ),
    { initialValue: { page: 0, pageSize: 10 } },
  );

  return {
    params,
    page: () => params().page,
    pageSize: () => params().pageSize,
  };
}
