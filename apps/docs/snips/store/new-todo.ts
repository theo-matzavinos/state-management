import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { SaveButton, Toolbar } from '@slg/toolbar';
import { TodoForm } from 'todos';
import { Backlink } from '@slg/layout';
import type { TodoDetailsDto } from '@api/dto';
import { Store } from '@ngrx/store';
import { todoDonenessFeature } from './todo-doneness.feature';
import { newTodoFeature } from './new-todo.feature';
import { newTodoActions } from './new-todo.actions';

@Component({
  selector: 'store-new-todo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col p-6',
  },
  imports: [TodoForm, Toolbar, SaveButton, Backlink],
  template: `
    <div><a slg-backlink></a></div>

    <menu slgToolbar>
      <button
        slg-save
        [disabled]="isCreating()"
        [form]="todoForm().formId"
        (click)="save()"
      ></button>
    </menu>

    <todos-form
      class="border-border flex-grow rounded-b-md border border-t-0 p-4"
      [donenessValues]="doneness()"
    />
  `,
})
export default class NewTodo {
  private store = inject(Store);

  todoForm = viewChild.required(TodoForm);
  isCreating = this.store.selectSignal(newTodoFeature.selectIsCreating);
  doneness = this.store.selectSignal(todoDonenessFeature.selectValues);

  save() {
    if (this.todoForm().form.invalid) {
      return;
    }

    this.store.dispatch(
      newTodoActions.create({
        todo: this.todoForm().form.value as TodoDetailsDto,
      }),
    );
  }
}
