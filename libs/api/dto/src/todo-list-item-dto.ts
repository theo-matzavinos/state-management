import type { TodoDoneness } from './todo-doneness';

export type TodoListItemDto = {
  doneness: TodoDoneness;
  id: number;
  title: string;
};
