import { ApiProperty } from '@nestjs/swagger';
import { TodoDoneness } from './TodoDonenessDto';

// Hello?
export class TodoListItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: TodoDoneness, enumName: 'TodoDoneness' })
  doneness: TodoDoneness;
}

export class TodosListDto {
  @ApiProperty({ type: [TodoListItemDto] })
  todos: TodoListItemDto[];

  @ApiProperty()
  count: number;
}
