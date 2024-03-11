import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TodoDonenessDto, TodoDoneness } from './TodoDonenessDto';

const todoDonenessOptions: TodoDonenessDto[] = [
  {
    value: TodoDoneness.Pending,
    text: 'Soon',
  },
  {
    value: TodoDoneness.Done,
    text: 'DidIt',
  },
  {
    value: TodoDoneness.WontDo,
    text: 'Nah',
  },
];

@Controller('TodoDoneness')
@ApiTags('TodoDoneness')
export class TodoDonenessController {
  @Get()
  @ApiOkResponse({ type: [TodoDonenessDto] })
  @ApiOperation({ operationId: '' })
  get() {
    return todoDonenessOptions;
  }
}
