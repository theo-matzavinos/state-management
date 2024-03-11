import type { TodoListItemDto } from '@api/dto';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const todosListActions = createActionGroup({
  source: 'Todos List',
  events: {
    Reload: emptyProps(),
    Load: props<{ page: number; pageSize: number }>(),
    'Load Success': props<{
      page: number;
      pageSize: number;
      todos: TodoListItemDto[];
      count: number;
    }>(),
    'Load Error': props<{ page: number; pageSize: number; error: string }>(),
    Delete: props<{ todoId: number }>(),
  },
});
