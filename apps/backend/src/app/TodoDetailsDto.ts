import { ApiProperty } from '@nestjs/swagger';
import { TodoDoneness } from './TodoDonenessDto';

export class TodoDetailsDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: TodoDoneness, enumName: 'TodoDoneness' })
  doneness: TodoDoneness;

  @ApiProperty()
  description?: string;
}
