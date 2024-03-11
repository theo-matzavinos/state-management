import { createActionGroup, props } from '@ngrx/store';

export const deleteTodoActions = createActionGroup({
  source: 'Delete Todo',
  events: {
    Delete: props<{ todoId: number }>(),
    'Delete Success': props<{ todoId: number }>(),
    'Delete Error': props<{ todoId: number; error: string }>(),
  },
});
