import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { HlmDialogComponent } from '@spartan-ng/ui-dialog-helm';
import type { CreateMutationResult } from '@tanstack/angular-query-experimental';
import type { TodoListItemDto } from '@api/dto';
import { DeleteDialog as SharedDeleteDialog } from '@slg/delete-dialog';

@Component({
  selector: 'query-delete-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedDeleteDialog],
  template: `
    <slg-delete-dialog
      [isPending]="mutation().isPending()"
      (delete)="delete()"
    />
  `,
})
export class DeleteDialog {
  todo = input.required<TodoListItemDto>();
  mutation =
    input.required<
      CreateMutationResult<void, Error, TodoListItemDto, unknown>
    >();

  protected dialog = inject(HlmDialogComponent);

  protected delete() {
    this.mutation().mutate(this.todo(), {
      onSuccess: () => {
        this.dialog.close(undefined);
      },
    });
  }
}
