import type { TodoDonenessDto } from '@api/dto';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const todoDonenessActions = createActionGroup({
  source: 'Todo Doneness',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{
      values: TodoDonenessDto[];
    }>(),
    'Load Error': props<{
      error: string;
    }>(),
  },
});
