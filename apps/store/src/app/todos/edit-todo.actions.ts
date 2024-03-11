import type { TodoDetailsDto } from '@api/dto';
import { createActionGroup, props } from '@ngrx/store';

export const editTodoActions = createActionGroup({
  source: 'Edit Todo',
  events: {
    Load: props<{ todoId: number }>(),
    'Load Success': props<{ todo: TodoDetailsDto }>(),
    'Load Error': props<{ todoId: number; error: string }>(),
    Update: props<{ todo: TodoDetailsDto }>(),
    'Update Success': props<{ todo: TodoDetailsDto }>(),
    'Update Error': props<{ todo: TodoDetailsDto; error: string }>(),
    Delete: props<{ todoId: number }>(),
  },
});
