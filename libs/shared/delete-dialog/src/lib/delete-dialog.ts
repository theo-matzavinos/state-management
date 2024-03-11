import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { lucideLoader, lucideTrash } from '@ng-icons/lucide';
import {
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
} from '@spartan-ng/ui-dialog-helm';
import { HlmIconComponent, provideIcons } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { BrnDialogRef } from '@spartan-ng/ui-dialog-brain';

@Component({
  selector: 'slg-delete-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ delete: lucideTrash, spinner: lucideLoader })],
  imports: [
    HlmDialogHeaderComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmIconComponent,
    NgClass,
    HlmButtonDirective,
  ],
  template: `
    <hlm-dialog-header>
      <h3 hlmDialogTitle>Confirm deletion</h3>
      <p hlmDialogDescription>Nuke this item out of existence?</p>
    </hlm-dialog-header>

    <hlm-dialog-footer>
      <button
        type="button"
        variant="secondary"
        hlmBtn
        [disabled]="isPending()"
        (click)="dialogRef.close(undefined)"
      >
        Nope
      </button>
      <button
        class="gap-1"
        type="button"
        hlmBtn
        [disabled]="isPending()"
        (click)="delete.emit()"
      >
        <hlm-icon
          [ngClass]="{ 'animate-spin': isPending() }"
          [name]="isPending() ? 'spinner' : 'delete'"
          size="sm"
        />
        Obliterate
      </button>
    </hlm-dialog-footer>
  `,
})
export class DeleteDialog {
  isPending = input.required<boolean>();

  delete = output<void>();

  protected dialogRef = inject(BrnDialogRef);
}
