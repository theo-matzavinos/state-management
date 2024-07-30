import { inject, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { createInjectable } from 'ngxtension/create-injectable';

export const ListQueryParams = createInjectable(
  () => {
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
  },
  { providedIn: 'scoped' },
);
