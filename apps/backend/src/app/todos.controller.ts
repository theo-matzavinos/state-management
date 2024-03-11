import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { db } from './db/db';
import { asc, count, eq } from 'drizzle-orm';
import { todos } from './db/schema';
import { TodosListDto } from './TodosListDto';
import { TodoDetailsDto } from './TodoDetailsDto';

@Controller('Todos')
@ApiTags('Todos')
export class TodosController {
  @Get()
  @ApiOkResponse({ type: TodosListDto })
  @ApiOperation({ operationId: '' })
  async search(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return {
      todos: await db
        .select({
          id: todos.id,
          title: todos.title,
          doneness: todos.doneness,
        })
        .from(todos)
        .orderBy(asc(todos.id))
        .offset(page * pageSize)
        .limit(pageSize),
      count: (await db.select({ count: count() }).from(todos))[0].count,
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: TodoDetailsDto })
  @ApiOperation({ operationId: '' })
  async find(@Param('id', ParseIntPipe) id: number) {
    const [todo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);

    if (!todo) {
      throw new NotFoundException();
    }

    return todo;
  }

  @Post()
  @ApiOkResponse({ type: TodoDetailsDto })
  @ApiOperation({ operationId: '' })
  async create(@Body() { id, ...todo }: TodoDetailsDto) {
    const [result] = await db.insert(todos).values(todo).returning();

    return result;
  }

  @Put(':id')
  @ApiOkResponse({ type: TodoDetailsDto })
  @ApiOperation({ operationId: '' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() todo: TodoDetailsDto,
  ) {
    try {
      const [result] = await db
        .update(todos)
        .set(todo)
        .where(eq(todos.id, id))
        .returning();

      return result;
    } catch {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @ApiNoContentResponse()
  @ApiOperation({ operationId: '' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await db.delete(todos).where(eq(todos.id, id));

      return;
    } catch {
      throw new NotFoundException();
    }
  }
}
