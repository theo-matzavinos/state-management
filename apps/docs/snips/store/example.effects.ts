import { Actions, createEffect, ofType } from '@ngrx/effects';
import { timer, switchMap, map, catchError, of } from 'rxjs';

@Injectable()
export class SomeEffects {
  private actions = inject(Actions);

  loadSomething = createEffect(() => {
    return this.actions.pipe(
      ofType(exampleActions.loadSomething),
      switchMap((action) =>
        this.someApiService.load().pipe(
          map((result) => exampleActions.loadSomethingSuccess({ result })),
          catchError((error) =>
            of(exampleActions.loadSomethingError({ error })),
          ),
        ),
      ),
    );
  });

  annoyUser = createEffect(() => {
    return timer(5000).pipe(
      map((count) => exampleActions.annoyUser({ count })),
    );
  });

  log = createEffect(
    () => {
      return this.actions.pipe(
        ofType(
          exampleActions.loadSomething,
          exampleActions.loadSomethingSuccess,
          exampleActions.loadSomethingError,
        ),
        tap((action) => {
          console.log(action.error);
        }),
      );
    },
    {
      dispatch: false,
    },
  );
}
