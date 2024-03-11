import type {
  Signal} from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { DeleteDialog as SharedDeleteDialog } from '@slg/delete-dialog';
import {
  BrnDialogRef,
  injectBrnDialogContext,
} from '@spartan-ng/ui-dialog-brain';

@Component({
  selector: 'store-delete-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedDeleteDialog],
  template: `
    <slg-delete-dialog
      [isPending]="dialogContext.isPending()"
      (delete)="dialogRef.close(true)"
    />
  `,
})
export class DeleteDialog {
  protected dialogContext = injectBrnDialogContext<{
    isPending: Signal<boolean>;
  }>();
  protected dialogRef = inject(BrnDialogRef);
}
