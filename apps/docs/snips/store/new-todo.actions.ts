import type { TodoDetailsDto } from '@api/dto';
import { createActionGroup, props } from '@ngrx/store';

export const newTodoActions = createActionGroup({
  source: 'New Todo',
  events: {
    Create: props<{ todo: TodoDetailsDto }>(),
    'Create Success': props<{ todo: TodoDetailsDto }>(),
    'Create Error': props<{ todo: TodoDetailsDto; error: string }>(),
    'Edit After Creation': props<{ todo: TodoDetailsDto }>(),
  },
});
