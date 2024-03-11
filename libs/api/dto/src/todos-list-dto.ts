import type { TodoListItemDto } from './todo-list-item-dto';

export type TodosListDto = {
  count: number;
  todos: TodoListItemDto[];
};
