import type { TodoDoneness } from './todo-doneness';

export type TodoDetailsDto = {
  description: string;
  doneness: TodoDoneness;
  id: number;
  title: string;
};
