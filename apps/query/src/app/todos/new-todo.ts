import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { SaveButton, Toolbar } from '@slg/toolbar';
import { TodoForm } from 'todos';
import {
  injectMutation,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { Router } from '@angular/router';
import { Backlink } from '@slg/layout';
import type { TodoDetailsDto } from '@api/dto';
import { apiTodosPostPromise } from '@api/endpoints';
import { HttpClient } from '@angular/common/http';
import { toastDefaultError, toastDefaultSuccess } from '@slg/toast';
import { injectTodoDonenessQuery } from './todo-doneness-query';

@Component({
  selector: 'query-new-todo',
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
        [disabled]="createMutation.isPending()"
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
  todoForm = viewChild.required(TodoForm);
  createMutation = injectCreateMutation();
  donenessQuery = injectTodoDonenessQuery();
  doneness = () => this.donenessQuery.data() ?? [];

  save() {
    if (this.todoForm().form.invalid) {
      return;
    }

    this.createMutation.mutate(this.todoForm().form.value as TodoDetailsDto);
  }
}

function injectCreateMutation() {
  const router = inject(Router);
  const httpClient = inject(HttpClient);
  const queryClient = injectQueryClient();

  return injectMutation(() => ({
    mutationFn: (todo: TodoDetailsDto) => apiTodosPostPromise(httpClient, todo),
    onSuccess: (todo) => {
      toastDefaultSuccess();
      queryClient.setQueryData(['todos', todo.id], todo);
      router.navigate(['/', 'todos', todo.id]);
    },
    onError: () => {
      toastDefaultError();
    },
  }));
}
