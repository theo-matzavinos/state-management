import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodoDonenessController } from './todo-doneness.controller';

@Module({
  imports: [],
  controllers: [TodosController, TodoDonenessController],
})
export class AppModule {}
