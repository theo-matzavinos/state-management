import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  viewChild,
} from '@angular/core';

import {
  HlmDialogComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/ui-dialog-helm';
import { BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { TodoForm } from 'todos';
import { DeleteButton, SaveButton, Toolbar } from '@slg/toolbar';
import { Suspense } from '@slg/suspense';
import { Backlink } from '@slg/layout';
import { DeleteDialog } from './delete-dialog';
import type { TodoDetailsDto } from '@api/dto';
import { Store } from '@ngrx/store';
import { todoDonenessFeature } from './todo-doneness.feature';
import { editTodoFeature } from './edit-todo.feature';
import { editTodoActions } from './edit-todo.actions';

@Component({
  selector: 'store-edit-todo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col p-6',
  },
  imports: [
    TodoForm,
    Toolbar,
    SaveButton,
    DeleteButton,
    Suspense,
    Backlink,
    HlmDialogComponent,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    DeleteDialog,
  ],
  template: `
    <div><a slg-backlink></a></div>
    <slg-suspense [status]="loadStatus()" [error]="loadError()">
      <menu slgToolbar>
        <button
          slg-save
          [disabled]="isUpdating()"
          [form]="todoForm().formId"
          (click)="save()"
        ></button>
        <button
          slg-delete
          [disabled]="isUpdating()"
          (click)="delete()"
        ></button>
      </menu>

      <todos-form
        class="border-border flex-grow rounded-b-md border border-t-0 p-4"
        [todo]="todo()"
        [donenessValues]="doneness()"
      />
    </slg-suspense>
  `,
})
export default class EditTodo {
  private store = inject(Store);

  todoForm = viewChild.required(TodoForm);
  todoId = input.required({ transform: numberAttribute });

  loadStatus = this.store.selectSignal(editTodoFeature.selectLoadStatus);
  loadError = this.store.selectSignal(editTodoFeature.selectLoadError);
  isUpdating = this.store.selectSignal(editTodoFeature.selectIsUpdating);
  todo = this.store.selectSignal(editTodoFeature.selectTodo);
  doneness = this.store.selectSignal(todoDonenessFeature.selectValues);

  save() {
    if (this.todoForm().form.invalid) {
      return;
    }

    this.store.dispatch(
      editTodoActions.update({
        todo: this.todoForm().form.value as TodoDetailsDto,
      }),
    );
  }

  delete() {
    this.store.dispatch(editTodoActions.delete({ todoId: this.todoId() }));
  }
}
