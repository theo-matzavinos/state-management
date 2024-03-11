import type {
  Signal} from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  viewChild,
} from '@angular/core';

import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';

import {
  HlmDialogComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/ui-dialog-helm';
import { BrnDialogContentDirective } from '@spartan-ng/ui-dialog-brain';
import { Router } from '@angular/router';
import { TodoForm } from 'todos';
import { DeleteButton, SaveButton, Toolbar } from '@slg/toolbar';
import { Suspense } from '@slg/suspense';
import { Backlink } from '@slg/layout';
import { DeleteDialog } from './delete-dialog';
import type { TodoDetailsDto, TodoListItemDto } from '@api/dto';
import {
  apiTodosIdDeletePromise,
  apiTodosIdGetPromise,
  apiTodosIdPutPromise,
} from '@api/endpoints';
import { HttpClient } from '@angular/common/http';
import { toastDefaultError, toastDefaultSuccess } from '@slg/toast';
import { injectTodoDonenessQuery } from './todo-doneness-query';

@Component({
  selector: 'query-edit-todo',
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
    <slg-suspense [status]="query.status()" [error]="query.error()">
      <menu slgToolbar>
        <button
          slg-save
          [disabled]="updateMutation.isPending()"
          [form]="todoForm().formId"
          (click)="save()"
        ></button>
        <hlm-dialog>
          <button slg-delete [disabled]="updateMutation.isPending()"></button>
          <hlm-dialog-content *brnDialogContent>
            <query-delete-dialog [todo]="todo()!" [mutation]="deleteMutation" />
          </hlm-dialog-content>
        </hlm-dialog>
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
  todoId = input.required({ transform: numberAttribute });
  todoForm = viewChild.required(TodoForm);
  query = injectTodoQuery(this.todoId);
  todo = () => this.query.data();
  updateMutation = injectUpdateMutation();
  deleteMutation = injectDeleteMutation();
  donenessQuery = injectTodoDonenessQuery();
  doneness = () => this.donenessQuery.data() ?? [];

  save() {
    if (this.todoForm().form.invalid) {
      return;
    }

    this.updateMutation.mutate(this.todoForm().form.value as TodoDetailsDto);
  }
}

function injectTodoQuery(todoId: Signal<number>) {
  const httpClient = inject(HttpClient);

  return injectQuery(() => ({
    queryKey: ['todos', todoId()] as const,
    queryFn: ({ queryKey }) =>
      apiTodosIdGetPromise(httpClient, { id: queryKey[1] }),
    enabled: !isNaN(todoId()),
  }));
}

function injectUpdateMutation() {
  const httpClient = inject(HttpClient);
  const queryClient = injectQueryClient();

  return injectMutation(() => ({
    mutationFn: (todo: TodoDetailsDto) =>
      apiTodosIdPutPromise(httpClient, { id: todo.id }, todo),
    onSuccess: (todo) => {
      toastDefaultSuccess();
      queryClient.setQueryData(['todos', todo.id], todo);
    },
    onError: () => {
      toastDefaultError();
    },
  }));
}

function injectDeleteMutation() {
  const router = inject(Router);
  const httpClient = inject(HttpClient);
  const queryClient = injectQueryClient();

  return injectMutation(() => ({
    mutationFn: (todo: TodoListItemDto) =>
      apiTodosIdDeletePromise(httpClient, { id: todo.id }),
    onSuccess: (_, todo) => {
      toastDefaultSuccess();
      queryClient.removeQueries({ queryKey: ['todos', todo.id] });
      router.navigate(['/', 'todos']);
    },
    onError: () => {
      toastDefaultError();
    },
  }));
}
