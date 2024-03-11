import { Injectable, inject, signal } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, map, mergeMap, of, switchMap, tap } from 'rxjs';
import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { apiTodosIdDelete } from '@api/endpoints';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';
import { DeleteDialog } from './delete-dialog';
import { toastError, toastSuccess } from '@slg/toast';
import { todosListActions } from './todos-list.actions';
import { editTodoActions } from './edit-todo.actions';
import { deleteTodoActions } from './delete-todo.actions';

@Injectable()
export class DeleteTodoEffects {
  private actions = inject(Actions);
  private httpClient = inject(HttpClient);
  private dialogService = inject(HlmDialogService);

  deleteCorfirmation = createEffect(() => {
    return this.actions.pipe(
      ofType(todosListActions.delete, editTodoActions.delete),
      switchMap((action) => {
        const isPending = signal(false);
        const dialogRef = this.dialogService.open(DeleteDialog, {
          context: { isPending: isPending.asReadonly() },
        });

        return dialogRef.closed$.pipe(
          filter((confirmed) => confirmed),
          map(() => deleteTodoActions.delete({ todoId: action.todoId })),
        );
      }),
    );
  });

  delete = createEffect(() => {
    return this.actions.pipe(
      ofType(deleteTodoActions.delete),
      mergeMap((action) =>
        apiTodosIdDelete(this.httpClient, { id: action.todoId }).pipe(
          map(() => deleteTodoActions.deleteSuccess({ todoId: action.todoId })),
          catchError((error: HttpErrorResponse) =>
            of(
              deleteTodoActions.deleteError({
                error: error.message,
                todoId: action.todoId,
              }),
            ),
          ),
        ),
      ),
    );
  });

  deleteSuccess = createEffect(
    () => {
      return this.actions.pipe(
        ofType(deleteTodoActions.deleteSuccess),
        tap(() => {
          toastSuccess();
        }),
      );
    },
    { dispatch: false },
  );

  deleteError = createEffect(
    () => {
      return this.actions.pipe(
        ofType(deleteTodoActions.deleteError),
        tap(() => {
          toastError();
        }),
      );
    },
    { dispatch: false },
  );
}
