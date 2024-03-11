import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { lucidePencil, lucideRedo } from '@ng-icons/lucide';
import { NewLink, ReloadButton, Toolbar } from '@slg/toolbar';
import { DeleteTodoButton, Todo } from 'todos';
import { Suspense } from '@slg/suspense';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { Pagination } from '@slg/pagination';
import type { TodoListItemDto } from '@api/dto';
import { Store } from '@ngrx/store';
import { todosListFeature } from './todos-list.feature';
import { todoDonenessFeature } from './todo-doneness.feature';
import { todosListActions } from './todos-list.actions';

@Component({
  selector: 'store-todos-list',
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
    DeleteTodoButton,
    Todo,
    HlmButtonDirective,
    Pagination,
  ],
  template: `
    <menu slgToolbar>
      <a slg-new></a>
      <button slg-reload [disabled]="isFetching()" (click)="reload()"></button>
    </menu>

    <slg-suspense
      class="border-border flex-grow rounded-b-md border border-t-0"
      [status]="status()"
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
                <button todos-delete (click)="delete(todo)"></button>
              </div>
              <todos-todo [todo]="todo" [donenessValues]="donenessValues()" />
            </li>
          }
        </ul>
        <slg-pagination
          class="border-border border-t p-4"
          [page]="queryParams().page"
          [pageSize]="queryParams().pageSize"
          [count]="count()"
        />
      }
    </slg-suspense>
  `,
})
export default class TodosList {
  private store = inject(Store);

  isFetching = this.store.selectSignal(todosListFeature.selectIsFetching);
  todos = this.store.selectSignal(todosListFeature.selectTodos);
  status = this.store.selectSignal(todosListFeature.selectStatus);
  donenessValues = this.store.selectSignal(todoDonenessFeature.selectValues);
  queryParams = this.store.selectSignal(todosListFeature.selectQueryParams);
  count = this.store.selectSignal(todosListFeature.selectCount);

  reload() {
    this.store.dispatch(todosListActions.reload());
  }

  delete(todo: TodoListItemDto) {
    this.store.dispatch(todosListActions.delete({ todoId: todo.id }));
  }
}
