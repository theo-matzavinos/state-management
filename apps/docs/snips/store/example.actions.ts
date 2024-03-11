import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const examplePageActions = createActionGroup({
  source: 'Example Page',
  events: {
    Opened: emptyProps(),
    'Pagination Changed': props<{ page: number; pageSize: number }>(),
  },
});
