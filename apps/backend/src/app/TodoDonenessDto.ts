import { ApiProperty } from '@nestjs/swagger';

/** TODO Doneness enum */
export enum TodoDoneness {
  Pending = 0,
  Done = 1,
  WontDo = 2,
}

export class TodoDonenessDto {
  @ApiProperty({ enum: TodoDoneness, enumName: 'TodoDoneness' })
  value: TodoDoneness;
  @ApiProperty()
  text: string;
}
