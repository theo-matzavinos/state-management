import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucidePencil, lucideRedo } from '@ng-icons/lucide';
import { NewLink, ReloadButton, Toolbar } from '@slg/toolbar';
import { DeleteTodoButton, Todo } from 'todos';
import { Suspense } from '@slg/suspense';
import { RouterLink } from '@angular/router';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
} from '@spartan-ng/ui-dialog-helm';
import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import { DeleteDialog } from './delete-dialog';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { injectListQueryParams } from './list-query-params';
import { Pagination } from '@slg/pagination';
import { apiTodosGetPromise, apiTodosIdDeletePromise } from '@api/endpoints';
import { HttpClient } from '@angular/common/http';
import type { TodoListItemDto } from '@api/dto';
import { toastDefaultError, toastDefaultSuccess } from '@slg/toast';
import { injectTodoDonenessQuery } from './todo-doneness-query';

@Component({
  selector: 'query-todos-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col flex-grow p-6',
  },
  providers: [provideIcons({ retry: lucideRedo, edit: lucidePencil })],
  imports: [
    Toolbar,
    NewLink,
    ReloadButton,
    Suspense,
    RouterLink,
    HlmIconComponent,
    HlmDialogComponent,
    DeleteTodoButton,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    DeleteDialog,
    Todo,
    HlmButtonDirective,
    Pagination,
    BrnDialogTriggerDirective,
  ],
  template: `
    <menu slgToolbar>
      <a slg-new></a>
      <button
        slg-reload
        [disabled]="query.isFetching()"
        (click)="query.refetch()"
      ></button>
    </menu>

    <slg-suspense
      class="border-border flex-grow rounded-b-md border border-t-0"
      [status]="query.status()"
    >
      @if (!todos().length) {
        <div class="p-4">Nothing to see here.</div>
      } @else {
        <ul class="flex-grow p-4">
          @for (todo of todos(); track todo.id) {
            <li class="flex items-center gap-6">
              <div class="flex gap-1">
                <a [routerLink]="[todo.id]" hlmBtn variant="ghost" size="icon">
                  <hlm-icon name="edit" size="sm" />
                </a>
                <hlm-dialog>
                  <button todos-delete brnDialogTrigger></button>
                  <hlm-dialog-content *brnDialogContent>
                    <query-delete-dialog
                      [todo]="todo"
                      [mutation]="deleteMutation"
                    />
                  </hlm-dialog-content>
                </hlm-dialog>
              </div>
              <todos-todo [todo]="todo" [donenessValues]="donenessValues()" />
            </li>
          }
        </ul>
        <slg-pagination
          class="border-border border-t p-4"
          [page]="listQueryParams.page()"
          [pageSize]="listQueryParams.pageSize()"
          [count]="count()"
        />
      }
    </slg-suspense>
  `,
})
export default class TodosList {
  query = injectTodosQuery();
  todos = () => this.query.data()?.todos ?? [];
  count = () => this.query.data()?.count ?? 0;
  deleteMutation = injectDeleteMutation();
  listQueryParams = injectListQueryParams();
  donenessQuery = injectTodoDonenessQuery();
  donenessValues = () => this.donenessQuery.data() ?? [];
}

function injectTodosQuery() {
  const params = injectListQueryParams().params;
  const httpClient = inject(HttpClient);

  return injectQuery(() => ({
    queryKey: ['todos', 'list', params()] as const,
    queryFn: ({ queryKey }) => apiTodosGetPromise(httpClient, queryKey[2]),
  }));
}

function injectDeleteMutation() {
  const httpClient = inject(HttpClient);
  const queryClient = injectQueryClient();

  return injectMutation(() => ({
    mutationFn: (todo: TodoListItemDto) =>
      apiTodosIdDeletePromise(httpClient, { id: todo.id }),
    onSuccess: (_, todo) => {
      toastDefaultSuccess();
      queryClient.invalidateQueries({ queryKey: ['todos', 'list'] });
      queryClient.removeQueries({ queryKey: ['todos', todo.id] });
    },
    onError: () => {
      toastDefaultError();
    },
  }));
}
